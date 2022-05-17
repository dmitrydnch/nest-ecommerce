import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({ default: 'some.user@mail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'Tom Holland', required: true })
  @IsString()
  fullname: string;

  @ApiProperty({ default: '06-01-1996', required: true })
  @IsString()
  birth: string;

  @ApiProperty({ default: '12345678', required: true })
  @IsString()
  @MinLength(8)
  password: string;
}
