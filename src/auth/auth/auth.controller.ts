import { Controller, Get, Post, Body, Query, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { baseResultType } from '../../type/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/registered')
  @HttpCode(200)
  async registered(@Body() body: Record<string, any>) {
    return await this.authService.registered(body);
  }
}
