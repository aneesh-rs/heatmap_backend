import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryReportsDto {
  @ApiProperty({ required: false, enum: ['Pending', 'New', 'Closed'] })
  @IsOptional()
  @IsEnum(['Pending', 'New', 'Closed'])
  status?: string;

  @ApiProperty({
    required: false,
    enum: ['rubbish', 'vandalism', 'hazard', 'traffic', 'others'],
  })
  @IsOptional()
  @IsEnum(['rubbish', 'vandalism', 'hazard', 'traffic', 'others'])
  category?: string;

  @ApiProperty({
    required: false,
    enum: ['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'],
  })
  @IsOptional()
  @IsEnum(['happy', 'neutral', 'confused', 'sad', 'angry', 'surprised'])
  feeling?: string;

  @ApiProperty({
    required: false,
    description: 'Start date for filtering (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    required: false,
    description: 'End date for filtering (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, description: 'Search in report text' })
  @IsOptional()
  @IsString()
  search?: string;
}
