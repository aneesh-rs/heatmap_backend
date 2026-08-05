import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface SentiloConfig {
  baseUrl: string;
  identityKey: string;
}

export interface SentiloSensorData {
  sensor: string;
  observations: Array<{
    value: string | number;
    timestamp: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

@Injectable()
export class SentiloService {
  private readonly logger = new Logger(SentiloService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Fetch sensor data from Sentilo REST API
   * @param sensorId - ID of the sensor to fetch data from
   * @param config - Optional Sentilo config (uses env vars if not provided)
   * @returns Sensor data from Sentilo API
   */
  async fetchSensorData(
    sensorId: string,
    config?: SentiloConfig,
  ): Promise<SentiloSensorData> {
    const sentiloConfig = config || this.getDefaultConfig();

    try {
      const url = `${sentiloConfig.baseUrl}/data/${sensorId}`;

      this.logger.log(`Fetching data from Sentilo API: ${url}`);

      const response = await firstValueFrom(
        this.httpService.get<SentiloSensorData>(url, {
          headers: {
            IDENTITY_KEY: sentiloConfig.identityKey,
            'Content-Type': 'application/json',
          },
        }),
      );

      console.log('Sentilo response: ', response);

      this.logger.log(`Successfully fetched data for sensor: ${sensorId}`);

      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching data from Sentilo API: ${error.message}`,
        error.stack,
      );

      if (error.response) {
        throw new BadRequestException(
          `Sentilo API error: ${error.response.status} - ${error.response.statusText}`,
        );
      }

      throw new BadRequestException(
        `Failed to fetch data from Sentilo API: ${error.message}`,
      );
    }
  }

  /**
   * Fetch data from multiple sensors
   * @param sensorIds - Array of sensor IDs
   * @param config - Optional Sentilo config
   * @returns Array of sensor data
   */
  async fetchMultipleSensors(
    sensorIds: string[],
    config?: SentiloConfig,
  ): Promise<SentiloSensorData[]> {
    const promises = sensorIds.map((sensorId) =>
      this.fetchSensorData(sensorId, config),
    );

    try {
      return await Promise.all(promises);
    } catch (error) {
      this.logger.error(
        `Error fetching multiple sensors: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to fetch data from multiple sensors: ${error.message}`,
      );
    }
  }

  /**
   * Get default Sentilo configuration from environment variables
   */
  private getDefaultConfig(): SentiloConfig {
    const baseUrl = this.configService.get<string>('SENTILO_BASE_URL');
    const identityKey = this.configService.get<string>('SENTILO_IDENTITY_KEY');

    if (!baseUrl || !identityKey) {
      throw new BadRequestException(
        'Sentilo configuration missing. Please provide SENTILO_BASE_URL and SENTILO_IDENTITY_KEY environment variables.',
      );
    }

    return {
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      identityKey,
    };
  }
}
