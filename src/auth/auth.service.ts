import { OriginService } from './../origin/origin.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly originService: OriginService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateAccessToken(userId: number) {
    return this.jwtService.sign({ user_id: userId });
  }

  async getAccessTokenData(token: string): Promise<{ userId: number }> {
    try {
      const decoded = this.jwtService.verify(token);
      return { userId: decoded.user_id };
    } catch (e: any) {
      throw new UnauthorizedException(e.message || 'Access token is invalid or expired');
    }
  }

  async generateRefreshToken(userId: number) {
    const token = this.jwtService.sign(
      { user_id: userId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '30d',
      }
    );

    this.prisma.refresh_token.create({
      data: {
        token: token,
        /** 30 days */
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return token;
  }

  async updateAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const savedToken = this.prisma.refresh_token.findUnique({
        where: {
          token: refreshToken,
        },
      });

      if (!savedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(decoded.user_id);

      return accessToken;
    } catch (e: any) {
      throw new UnauthorizedException(e.message || 'Refresh token is invalid or expired');
    }
  }

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
