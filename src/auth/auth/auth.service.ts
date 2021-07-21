import { Injectable } from '@nestjs/common';
import { AuthEntity } from './auth.entity';
import { baseResultType } from '../../type/index';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { makeSalt, encryptPassword } from '../../utils/cryptogram';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {}

  async registered(body): Promise<any> {
    const { username, password, repassword } = body;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }

    const user = await this.findOne(username);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码

    try {
      await this.authRepository
        .createQueryBuilder()
        .insert()
        .into(AuthEntity)
        .values([{ username, password: hashPwd }])
        .execute();
      return {
        code: 200,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service error: ${error}`,
      };
    }
  }

  async findOne(username: string): Promise<any | undefined> {
    const res = this.authRepository
      .createQueryBuilder('auth')
      .where('auth.username = :username', { username })
      .getOne();
    return res;
  }
}
