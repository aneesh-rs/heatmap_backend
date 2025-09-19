// src/reports/dto/create-report.dto.ts
import {
  IsString,
  IsEnum,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({ description: 'Latitude coordinate' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude coordinate' })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Address description' })
  @IsString()
  address: string;
}

export class CreateReportDto {
  @ApiProperty({
    enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
    description: 'User feeling when making the report',
  })
  @IsEnum(['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'])
  feeling: string;

  @ApiProperty({
    enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
    description: 'Category of the report',
  })
  @IsEnum(['rubbish', 'vandalism', 'hazard', 'traffic', 'others'])
  category: string;

  @ApiProperty({ description: 'Detailed report description' })
  @IsString()
  reportText: string;

  @ApiProperty({ description: 'Reporter first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Reporter last name' })
  @IsString()
  lastName: string;

  @ApiProperty({
    type: LocationDto,
    description: 'Location where the report was made',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
