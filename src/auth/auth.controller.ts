import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async register(@Body() body: { email: string; password: string }) {
    console.log(body);

    return this.authService.registration(body.email, body.password);
  }
}
