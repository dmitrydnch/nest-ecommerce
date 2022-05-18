import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { products: true },
    });
  }

  findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
