import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class FtpConnectionConfigDto {
  @ApiPropertyOptional({ description: 'FTP/SFTP server host' })
  @IsString()
  @IsOptional()
  host?: string;

  @ApiPropertyOptional({ description: 'FTP/SFTP server port', default: 22 })
  @IsOptional()
  port?: number;

  @ApiPropertyOptional({ description: 'FTP/SFTP username' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: 'FTP/SFTP password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Protocol type',
    enum: ['ftp', 'sftp'],
    default: 'sftp',
  })
  @IsString()
  @IsOptional()
  protocol?: 'ftp' | 'sftp';
}

class ParseOptionsDto {
  @ApiPropertyOptional({
    description: 'Field name for latitude',
    default: 'lat',
  })
  @IsString()
  @IsOptional()
  latField?: string;

  @ApiPropertyOptional({
    description: 'Field name for longitude',
    default: 'lng',
  })
  @IsString()
  @IsOptional()
  lngField?: string;

  @ApiPropertyOptional({
    description: 'Field name for noise value',
    default: 'noiseValue',
  })
  @IsString()
  @IsOptional()
  noiseValueField?: string;

  @ApiPropertyOptional({
    description: 'Field name for timestamp',
    default: 'timestamp',
  })
  @IsString()
  @IsOptional()
  timestampField?: string;
}

export class FtpImportDto {
  @ApiProperty({
    description: 'Path to the file on the FTP/SFTP server',
    example: '/data/noise-data.csv',
  })
  @IsString()
  filePath: string;

  @ApiPropertyOptional({
    description: 'File format',
    enum: ['csv', 'json'],
    default: 'csv',
  })
  @IsString()
  @IsOptional()
  format?: 'csv' | 'json';

  @ApiPropertyOptional({
    description: 'Optional FTP/SFTP connection configuration (uses env vars if not provided)',
    type: FtpConnectionConfigDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => FtpConnectionConfigDto)
  @IsOptional()
  connectionConfig?: FtpConnectionConfigDto;

  @ApiPropertyOptional({
    description: 'Optional field mapping configuration',
    type: ParseOptionsDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => ParseOptionsDto)
  @IsOptional()
  parseOptions?: ParseOptionsDto;
}

