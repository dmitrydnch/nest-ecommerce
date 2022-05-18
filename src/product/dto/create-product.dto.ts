import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Silver ring' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'Price of product', example: 4999 })
  @IsNumber()
  price: number;
  @ApiProperty({
    description: 'ID of category',
    example: 1,
    required: true,
  })
  @IsNumber()
  categoryId: number;
}
