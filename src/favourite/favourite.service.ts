import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavouriteService {
  constructor(private readonly prisma: PrismaService) {}

  public add(userId: number, productId: number) {
    return this.prisma.favourites.create({
      data: { userId, productId },
      include: { product: true },
    });
  }

  public findAllByUserId(userId: number) {
    return this.prisma.favourites.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  public delete(userId: number, productId: number) {
    return this.prisma.favourites.deleteMany({
      where: { userId: userId, productId: productId },
    });
  }
}
