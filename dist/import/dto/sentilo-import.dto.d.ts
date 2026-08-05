declare class SentiloConfigDto {
    baseUrl?: string;
    identityKey?: string;
}
declare class ParseOptionsDto {
    latField?: string;
    lngField?: string;
    noiseValueField?: string;
    timestampField?: string;
}
export declare class SentiloImportDto {
    sensorId: string;
    sentiloConfig?: SentiloConfigDto;
    parseOptions?: ParseOptionsDto;
}
export {};
