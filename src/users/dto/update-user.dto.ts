import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstSurname?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  secondSurname?: string;

  @ApiProperty({ enum: ['Admin', 'User'] })
  @IsEnum({ Admin: 'Admin', User: 'User' })
  @IsOptional()
  role?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photoURL?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  verificationToken?: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  resetPasswordToken?: string | null;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  resetPasswordExpires?: Date | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string | null;
}
