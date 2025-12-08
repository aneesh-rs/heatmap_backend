export interface NoiseDataPoint {
    lat: number;
    lng: number;
    noiseValue: number;
    timestamp: Date | string;
}
export interface ParseOptions {
    latField?: string;
    lngField?: string;
    noiseValueField?: string;
    timestampField?: string;
    dateFormat?: string;
}
export declare class ImportService {
    private readonly logger;
    parseCsv(buffer: Buffer, options?: ParseOptions): Promise<NoiseDataPoint[]>;
    parseJson(buffer: Buffer, options?: ParseOptions): Promise<NoiseDataPoint[]>;
    private mapRowToNoiseData;
    private extractNumericValue;
    private extractTimestamp;
}
