import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FtpService } from './ftp.service';
import { SentiloService } from './sentilo.service';
import { ImportService, NoiseDataPoint } from './import.service';
import { CloudNoiseService } from './cloudnoise.service';
import { FtpImportDto } from './dto/ftp-import.dto';
import { SentiloImportDto } from './dto/sentilo-import.dto';
import { CloudNoiseQueryDto } from './dto/cloudnoise-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('import')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
@Controller('import')
export class ImportController {
  constructor(
    private readonly ftpService: FtpService,
    private readonly sentiloService: SentiloService,
    private readonly importService: ImportService,
    private readonly cloudNoiseService: CloudNoiseService,
  ) {}

  @Post('ftp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import noise data from FTP/SFTP server',
    description:
      'Downloads a file from FTP/SFTP server, parses it (CSV or JSON), and returns mapped noise data points.',
  })
  @ApiBody({ type: FtpImportDto })
  @ApiResponse({
    status: 200,
    description: 'Data imported successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        dataPoints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' },
              noiseValue: { type: 'number' },
              timestamp: { type: 'string' },
            },
          },
        },
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or file format' })
  async importFromFtp(@Body() dto: FtpImportDto): Promise<{
    success: boolean;
    dataPoints: NoiseDataPoint[];
    count: number;
  }> {
    try {
      // Convert DTO to service config if provided
      const connectionConfig = dto.connectionConfig
        ? {
            host: dto.connectionConfig.host!,
            port: dto.connectionConfig.port,
            username: dto.connectionConfig.username!,
            password: dto.connectionConfig.password!,
            protocol: dto.connectionConfig.protocol,
          }
        : undefined;

      // Download file from FTP/SFTP
      const fileBuffer = await this.ftpService.downloadFile(
        dto.filePath,
        connectionConfig,
      );

      // Determine file format
      const format = dto.format || this.detectFileFormat(dto.filePath);

      // Parse the file
      let dataPoints: NoiseDataPoint[];
      if (format === 'json') {
        dataPoints = await this.importService.parseJson(
          fileBuffer,
          dto.parseOptions,
        );
      } else {
        dataPoints = await this.importService.parseCsv(
          fileBuffer,
          dto.parseOptions,
        );
      }

      return {
        success: true,
        dataPoints,
        count: dataPoints.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to import data from FTP: ${error.message}`,
      );
    }
  }

  @Post('cloudnoise')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fetch street noise GeoJSON via CoAP (CloudNoise)',
    description:
      'Proxies a CoAP GET with JSON payload to the LPWGNS server and returns GeoJSON.',
  })
  @ApiBody({ type: CloudNoiseQueryDto })
  @ApiResponse({
    status: 200,
    description: 'GeoJSON fetched successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        featureCount: { type: 'number' },
        geojson: { type: 'object' },
      },
    },
  })
  async importFromCloudNoise(@Body() dto: CloudNoiseQueryDto): Promise<{
    success: boolean;
    featureCount: number;
    geojson: unknown;
  }> {
    const geojson = await this.cloudNoiseService.fetchGeoJson(dto);
    return {
      success: true,
      featureCount: geojson.features.length,
      geojson,
    };
  }

  @Post('sentilo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import noise data from Sentilo REST API',
    description:
      'Fetches sensor data from Sentilo API and maps it to noise data format.',
  })
  @ApiBody({ type: SentiloImportDto })
  @ApiResponse({
    status: 200,
    description: 'Data imported successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        dataPoints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' },
              noiseValue: { type: 'number' },
              timestamp: { type: 'string' },
            },
          },
        },
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data or API error' })
  async importFromSentilo(@Body() dto: SentiloImportDto): Promise<{
    success: boolean;
    dataPoints: NoiseDataPoint[];
    count: number;
  }> {
    try {
      // Convert DTO to service config if provided
      const sentiloConfig = dto.sentiloConfig
        ? {
            baseUrl: dto.sentiloConfig.baseUrl!,
            identityKey: dto.sentiloConfig.identityKey!,
          }
        : undefined;

      // Fetch data from Sentilo API
      const sensorData = await this.sentiloService.fetchSensorData(
        dto.sensorId,
        sentiloConfig,
      );

      // Transform Sentilo data to noise data points
      const dataPoints = this.transformSentiloData(
        sensorData,
        dto.parseOptions,
      );

      return {
        success: true,
        dataPoints,
        count: dataPoints.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to import data from Sentilo: ${error.message}`,
      );
    }
  }

  /**
   * Detect file format from file path
   */
  private detectFileFormat(filePath: string): 'csv' | 'json' {
    const extension = filePath.toLowerCase().split('.').pop();
    if (extension === 'json') {
      return 'json';
    }
    return 'csv'; // Default to CSV
  }

  /**
   * Transform Sentilo sensor data to noise data points
   */
  private transformSentiloData(
    sensorData: any,
    parseOptions?: {
      latField?: string;
      lngField?: string;
      noiseValueField?: string;
      timestampField?: string;
    },
  ): NoiseDataPoint[] {
    const {
      latField = 'lat',
      lngField = 'lng',
      noiseValueField = 'noiseValue',
      timestampField = 'timestamp',
    } = parseOptions || {};

    const dataPoints: NoiseDataPoint[] = [];

    // Handle Sentilo observations structure
    if (sensorData.observations && Array.isArray(sensorData.observations)) {
      sensorData.observations.forEach((observation: any) => {
        try {
          // Extract location from sensor metadata or observation
          const lat =
            sensorData.location?.lat ||
            sensorData.lat ||
            observation.lat ||
            null;
          const lng =
            sensorData.location?.lng ||
            sensorData.lng ||
            observation.lng ||
            null;

          // Extract noise value from observation
          const noiseValue =
            observation.value !== undefined
              ? parseFloat(String(observation.value))
              : null;

          // Extract timestamp
          const timestamp =
            observation.timestamp ||
            observation.time ||
            sensorData.timestamp ||
            new Date().toISOString();

          if (lat !== null && lng !== null && noiseValue !== null) {
            dataPoints.push({
              lat,
              lng,
              noiseValue,
              timestamp,
            });
          }
        } catch (error) {
          // Skip invalid observations
          console.warn('Skipping invalid observation:', error);
        }
      });
    } else {
      // Handle single observation or different structure
      const lat = sensorData.location?.lat || sensorData.lat || null;
      const lng = sensorData.location?.lng || sensorData.lng || null;
      const noiseValue =
        sensorData.value !== undefined
          ? parseFloat(String(sensorData.value))
          : null;
      const timestamp =
        sensorData.timestamp || sensorData.time || new Date().toISOString();

      if (lat !== null && lng !== null && noiseValue !== null) {
        dataPoints.push({
          lat,
          lng,
          noiseValue,
          timestamp,
        });
      }
    }

    return dataPoints;
  }
}

