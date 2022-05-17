import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ default: 'Will Smith', required: true })
  @IsString()
  @IsOptional()
  fullname: string;

  @ApiProperty({ default: '09-25-1968', required: true })
  @IsString()
  @IsOptional()
  birth: string;

  @ApiProperty({ default: '87654321', required: true })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;
}
