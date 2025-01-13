import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OriginService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrigin(origin: string) {
    return this.prismaService.allowed_origins.create({
      data: {
        origin: origin,
      },
      select: {
        id: true,
        origin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getOriginId(origin: string) {
    return this.prismaService.allowed_origins.findUnique({
      where: {
        origin: origin,
      },
      select: {
        id: true,
        origin: true,
      },
    });
  }
}
