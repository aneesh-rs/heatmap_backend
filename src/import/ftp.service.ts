import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Client from 'ssh2-sftp-client';

export interface FtpConnectionConfig {
  host: string;
  port?: number;
  username: string;
  password: string;
  protocol?: 'ftp' | 'sftp';
}

@Injectable()
export class FtpService {
  private readonly logger = new Logger(FtpService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Download a file from FTP/SFTP server as a buffer
   * @param filePath - Path to the file on the server
   * @param config - Optional connection config (uses env vars if not provided)
   * @returns Buffer containing the file data
   */
  async downloadFile(
    filePath: string,
    config?: FtpConnectionConfig,
  ): Promise<Buffer> {
    const connectionConfig = config || this.getDefaultConfig();
    const client = new Client();

    try {
      // Connect to the server
      await client.connect({
        host: connectionConfig.host,
        port: connectionConfig.port || (connectionConfig.protocol === 'ftp' ? 21 : 22),
        username: connectionConfig.username,
        password: connectionConfig.password,
        ...(connectionConfig.protocol === 'sftp' && {
          readyTimeout: 20000,
        }),
      });

      this.logger.log(
        `Connected to ${connectionConfig.protocol || 'SFTP'} server at ${connectionConfig.host}`,
      );

      // Check if file exists
      const fileExists = await client.exists(filePath);
      if (!fileExists) {
        throw new BadRequestException(
          `File not found on server: ${filePath}`,
        );
      }

      // Download file as buffer
      const buffer = await client.get(filePath);

      this.logger.log(`Successfully downloaded file: ${filePath}`);

      // Ensure we return a Buffer
      if (Buffer.isBuffer(buffer)) {
        return buffer;
      } else if (typeof buffer === 'string') {
        return Buffer.from(buffer);
      } else {
        // If it's a stream, we need to handle it differently
        throw new BadRequestException('File download returned unexpected type');
      }
    } catch (error) {
      this.logger.error(`Error downloading file from FTP/SFTP: ${error.message}`, error.stack);
      throw new BadRequestException(
        `Failed to download file: ${error.message}`,
      );
    } finally {
      // Ensure connection is closed
      if (client) {
        try {
          await client.end();
        } catch (error) {
          this.logger.warn(`Error closing FTP/SFTP connection: ${error.message}`);
        }
      }
    }
  }

  /**
   * Get default FTP/SFTP configuration from environment variables
   */
  private getDefaultConfig(): FtpConnectionConfig {
    const host = this.configService.get<string>('FTP_HOST');
    const username = this.configService.get<string>('FTP_USERNAME');
    const password = this.configService.get<string>('FTP_PASSWORD');
    const port = this.configService.get<number>('FTP_PORT');
    const protocol = this.configService.get<'ftp' | 'sftp'>('FTP_PROTOCOL', 'sftp');

    if (!host || !username || !password) {
      throw new BadRequestException(
        'FTP configuration missing. Please provide FTP_HOST, FTP_USERNAME, and FTP_PASSWORD environment variables.',
      );
    }

    return {
      host,
      port: port || (protocol === 'ftp' ? 21 : 22),
      username,
      password,
      protocol,
    };
  }
}

