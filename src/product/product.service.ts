import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  findByCategoryId(categoryId: number) {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  delete(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
