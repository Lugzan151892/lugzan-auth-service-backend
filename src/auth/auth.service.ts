import { OriginService } from './../origin/origin.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly originService: OriginService
  ) {}

  async registration(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async createAuthCode(userId: number, originId: string) {
    return this.prisma.auth_code.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        origin: {
          connect: {
            id: originId,
          },
        },
      },
      select: {
        id: true,
        auth_code: true,
      },
    });
  }
}
