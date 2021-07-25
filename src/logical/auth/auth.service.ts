import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { encryptPassword } from '../../utils/cryptogram';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('JWT验证 - Step 2: 校验用户信息');
    const user = await this.usersService.findOne(username);
    if (user) {
      const hashedPassword = user.password;
      const salt = user.password_salt;
      // 通过密码盐，加密传参，再与数据库里的比较，判断是否相等
      const hashPassword = encryptPassword(password, salt);
      if (hashedPassword === hashPassword) {
        return [1, user]; // 密码正确
      } else {
        return [2, null]; // 密码错误
      }
    }
    return [3, null]; // 查无此人
  }

  // JWT验证 - Step 3: 处理 jwt 签证
  async certificate(user: any) {
    const payload = {
      username: user.username,
      userId: user.userId,
      realName: user.realName,
      role: user.role,
    };
    console.log('payload', payload);
    console.log('JWT验证 - Step 3: 处理 jwt 签证');
    try {
      const token = this.jwtService.sign(payload);
      return {
        code: 200,
        data: {
          token,
        },
        message: `登录成功`,
      };
    } catch (error) {
      return {
        code: 600,
        message: `账号或密码错误`,
      };
    }
  }
}
