import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SentiloConfigDto {
  @ApiPropertyOptional({ description: 'Sentilo API base URL' })
  @IsString()
  @IsOptional()
  baseUrl?: string;

  @ApiPropertyOptional({ description: 'Sentilo IDENTITY_KEY' })
  @IsString()
  @IsOptional()
  identityKey?: string;
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

export class SentiloImportDto {
  @ApiProperty({
    description: 'Sensor ID to fetch data from',
    example: 'sensor-123',
  })
  @IsString()
  sensorId: string;

  @ApiPropertyOptional({
    description: 'Optional Sentilo configuration (uses env vars if not provided)',
    type: SentiloConfigDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => SentiloConfigDto)
  @IsOptional()
  sentiloConfig?: SentiloConfigDto;

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

