// src/reports/dto/update-report-status.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportStatusDto {
  @ApiProperty({
    enum: ['Pending', 'New', 'Closed'],
    description: 'New status for the report',
  })
  @IsEnum(['Pending', 'New', 'Closed'])
  reportStatus: string;
}
