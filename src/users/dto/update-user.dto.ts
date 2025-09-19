import { IsString, IsOptional, IsEmail } from 'class-validator';
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photoURL?: string;
}
