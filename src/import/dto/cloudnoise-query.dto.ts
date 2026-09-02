import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsOptional,
  IsString,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'cloudNoiseQuery', async: false })
class CloudNoiseQueryConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as CloudNoiseQueryDto;
    const hasIndicator = Boolean(obj.indicator);
    const hasRange = Boolean(obj.start && obj.end);
    return hasIndicator !== hasRange;
  }

  defaultMessage() {
    return 'Provide either indicator or both start and end';
  }
}

export class CloudNoiseQueryDto {
  @ApiPropertyOptional({ enum: ['ld', 'le', 'ln', 'lden'] })
  @IsOptional()
  @IsIn(['ld', 'le', 'ln', 'lden'])
  indicator?: 'ld' | 'le' | 'ln' | 'lden';

  @ApiPropertyOptional({ example: '2000-01-01 00:00:00' })
  @IsOptional()
  @IsString()
  start?: string;

  @ApiPropertyOptional({ example: '2000-01-01 01:00:00' })
  @IsOptional()
  @IsString()
  end?: string;

  @Validate(CloudNoiseQueryConstraint)
  private readonly _queryShape?: never;
}
