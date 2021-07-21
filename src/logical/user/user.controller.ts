import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  // JWT验证 - Step 1: 用户请求登录
  @Post('login')
  async login(@Body() loginParams: any) {
    console.log('JWT验证 - Step 1: 用户请求登录');
    const authResult = await this.authService.validateUser(
      loginParams.username,
      loginParams.password,
    );
    switch (authResult[0]) {
      case 1:
        return this.authService.certificate(authResult[1]);
      case 2:
        return {
          code: 600,
          msg: `账号或密码不正确`,
        };
      default:
        return {
          code: 600,
          msg: `查无此人`,
        };
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    return await this.usersService.registered(body);
  }
}