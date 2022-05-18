import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';
import { RegistrationDto as CreateUserDto } from './dto/registration.dto';
import { userPublicFields } from './users.prisma';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  public create(createUserDto: CreateUserDto): Promise<any> {
    return this.prisma.user.create({
      data: { ...createUserDto, activationLink: randomUUID() },
    });
  }

  public findAll(): Promise<any[]> {
    return this.prisma.user.findMany({
      select: userPublicFields,
    });
  }

  public findById(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { Favourites: true },
    });
  }

  public findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public findByIdAndRefreshToken(id: number, refreshToken: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        RefreshTokens: {
          where: {
            token: refreshToken,
          },
        },
      },
    });
  }

  public async update(id: number, updateDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateDto });
  }

  public async verify(id: number) {
    return this.prisma.user.update({ where: { id }, data: { verified: true } });
  }

  public async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
