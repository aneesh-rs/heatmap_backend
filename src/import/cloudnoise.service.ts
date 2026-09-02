import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as coap from 'coap';
import { CloudNoiseQueryDto } from './dto/cloudnoise-query.dto';

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: string;
      coordinates: unknown;
    };
    properties: Record<string, unknown>;
  }>;
}

@Injectable()
export class CloudNoiseService {
  private readonly logger = new Logger(CloudNoiseService.name);

  constructor(private readonly http: HttpService) {}

  async fetchGeoJson(query: CloudNoiseQueryDto): Promise<GeoJsonFeatureCollection> {
    const httpUrl = process.env.CLOUDNOISE_HTTP_URL?.trim();

    if (httpUrl) {
      return this.fetchViaHttp(httpUrl, query);
    }

    if (process.env.COAP_ENABLED !== 'true') {
      throw new ServiceUnavailableException(
        'CloudNoise is not configured for this environment. Set CLOUDNOISE_HTTP_URL on Vercel, or COAP_ENABLED=true for local CoAP testing.',
      );
    }

    return this.fetchViaCoap(query);
  }

  private buildPayload(query: CloudNoiseQueryDto) {
    return query.indicator
      ? { indicator: query.indicator }
      : { start: query.start, end: query.end };
  }

  private validateGeoJson(parsed: GeoJsonFeatureCollection) {
    if (parsed?.type !== 'FeatureCollection' || !Array.isArray(parsed.features)) {
      throw new BadGatewayException(
        'CloudNoise response is not a GeoJSON FeatureCollection',
      );
    }
    return parsed;
  }

  private async fetchViaHttp(
    baseUrl: string,
    query: CloudNoiseQueryDto,
  ): Promise<GeoJsonFeatureCollection> {
    const payload = this.buildPayload(query);
    const method = (process.env.CLOUDNOISE_HTTP_METHOD || 'POST').toUpperCase();
    const timeoutMs = Number(process.env.CLOUDNOISE_HTTP_TIMEOUT_MS || 15000);

    this.logger.log(
      `HTTP ${method} ${baseUrl} payload=${JSON.stringify(payload)}`,
    );

    try {
      const response = await firstValueFrom(
        this.http.request({
          url: baseUrl,
          method,
          data: method === 'GET' ? undefined : payload,
          params: method === 'GET' ? payload : undefined,
          timeout: timeoutMs,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(process.env.CLOUDNOISE_HTTP_API_KEY
              ? {
                  Authorization: `Bearer ${process.env.CLOUDNOISE_HTTP_API_KEY}`,
                }
              : {}),
          },
        }),
      );

      const body = response.data?.geojson ?? response.data;
      return this.validateGeoJson(body as GeoJsonFeatureCollection);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error).message ||
        'HTTP bridge request failed';

      throw new ServiceUnavailableException(
        `CloudNoise HTTP bridge failed: ${message}`,
      );
    }
  }

  private fetchViaCoap(query: CloudNoiseQueryDto): Promise<GeoJsonFeatureCollection> {
    const host = process.env.COAP_HOST || '10.7.20.90';
    const port = Number(process.env.COAP_PORT || 5683);
    const pathname = process.env.COAP_PATH || '/LPWGNS';
    const timeoutMs = Number(process.env.COAP_TIMEOUT_MS || 15000);
    const payload = this.buildPayload(query);

    this.logger.log(
      `CoAP GET ${host}:${port}${pathname} payload=${JSON.stringify(payload)}`,
    );

    return new Promise((resolve, reject) => {
      let settled = false;
      let timer: NodeJS.Timeout;

      const finish = (fn: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        fn();
      };

      const req = coap.request({
        host,
        port,
        pathname,
        method: 'GET',
      });

      timer = setTimeout(() => {
        req.destroy();
        finish(() =>
          reject(
            new ServiceUnavailableException(
              `CoAP request timed out after ${timeoutMs}ms`,
            ),
          ),
        );
      }, timeoutMs);

      req.setOption('Content-Format', 'application/json');
      req.write(Buffer.from(JSON.stringify(payload)));

      req.on('response', (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          finish(() => {
            const raw = Buffer.concat(chunks).toString('utf-8');

            if (res.code && !String(res.code).startsWith('2.')) {
              reject(
                new BadGatewayException(
                  `CoAP server returned ${res.code}: ${raw || 'empty response'}`,
                ),
              );
              return;
            }

            try {
              resolve(this.validateGeoJson(JSON.parse(raw)));
            } catch (error) {
              reject(
                new BadGatewayException(
                  `Failed to parse CoAP response as JSON: ${(error as Error).message}`,
                ),
              );
            }
          });
        });
      });

      req.on('error', (error: Error) => {
        finish(() => {
          this.logger.error(`CoAP request failed: ${error.message}`, error.stack);
          reject(
            new ServiceUnavailableException(
              `CoAP request failed: ${error.message}. Ensure VPN/network access to ${host}:${port}.`,
            ),
          );
        });
      });

      req.end();
    });
  }
}
