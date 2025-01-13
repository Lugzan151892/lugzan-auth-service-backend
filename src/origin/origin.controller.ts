import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Headers,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OriginService } from './origin.service';

@Controller('origin')
export class OriginController {
  constructor(
    private readonly originService: OriginService,
    private configService: ConfigService,
  ) {}

  private get originPassword() {
    return this.configService.get<string>('ORIGIN_PASSWORD');
  }

  @Post('create-origin')
  async createOrigin(@Body() body: { origin: string; password: string }) {
    const isPasswordCorrect = this.originPassword === body.password;

    if (!isPasswordCorrect) {
      throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN);
    }

    return this.originService.createOrigin(body.origin);
  }

  @Get('origin')
  async getOriginId(
    @Headers('origin') origin: string,
    @Headers('referer') referer: string,
  ) {
    if (!origin && !referer) {
      throw new HttpException('Origin not found', HttpStatus.FORBIDDEN);
    }

    return this.originService.getOriginId(origin || referer);
  }
}
