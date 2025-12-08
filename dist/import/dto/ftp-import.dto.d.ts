declare class FtpConnectionConfigDto {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    protocol?: 'ftp' | 'sftp';
}
declare class ParseOptionsDto {
    latField?: string;
    lngField?: string;
    noiseValueField?: string;
    timestampField?: string;
}
export declare class FtpImportDto {
    filePath: string;
    format?: 'csv' | 'json';
    connectionConfig?: FtpConnectionConfigDto;
    parseOptions?: ParseOptionsDto;
}
export {};
