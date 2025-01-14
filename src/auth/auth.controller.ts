import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OriginService } from '../origin/origin.service';
import { Cookies } from 'src/decorators/cookie';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly originService: OriginService
  ) {}

  @Get('update-token')
  async updateAccessToken(@Cookies('refresh_token') refreshToken: string) {
    const newAccessToken = this.authService.updateAccessToken(refreshToken);

    return {
      access_token: newAccessToken,
    };
  }

  @Post('registration')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      client_id: string;
      redirect_url: string;
    }
  ) {
    const origin = await this.originService.getOriginById(body.client_id);

    if (!origin || origin.origin !== body.redirect_url) {
      throw new HttpException('Invalid origin', HttpStatus.FORBIDDEN);
    }

    const user = await this.authService.registration(body.email, body.password);
    return this.authService.createAuthCode(user.id, origin.id);
  }
}
