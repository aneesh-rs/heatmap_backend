import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
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
export declare class SentiloService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    fetchSensorData(sensorId: string, config?: SentiloConfig): Promise<SentiloSensorData>;
    fetchMultipleSensors(sensorIds: string[], config?: SentiloConfig): Promise<SentiloSensorData[]>;
    private getDefaultConfig;
}
