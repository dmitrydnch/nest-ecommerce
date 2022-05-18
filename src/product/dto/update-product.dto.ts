import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Golden square ring',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({
    description: 'Price of product',
    example: 19999,
    required: false,
  })
  @IsNumber()
  price: number;
}
