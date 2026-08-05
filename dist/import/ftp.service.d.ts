import { ConfigService } from '@nestjs/config';
export interface FtpConnectionConfig {
    host: string;
    port?: number;
    username: string;
    password: string;
    protocol?: 'ftp' | 'sftp';
}
export declare class FtpService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    downloadFile(filePath: string, config?: FtpConnectionConfig): Promise<Buffer>;
    private getDefaultConfig;
}
