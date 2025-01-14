import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OriginService } from '../origin/origin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly originService: OriginService
  ) {}

  @Post('registration')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      origin_id: string;
      redirect_url: string;
    }
  ) {
    const origin = await this.originService.getOriginById(body.origin_id);

    if (origin.origin !== body.redirect_url) {
      throw new HttpException('Invalid origin', HttpStatus.FORBIDDEN);
    }

    const user = await this.authService.registration(body.email, body.password);
    return this.authService.createAuthCode(user.id, origin.id);
  }
}
