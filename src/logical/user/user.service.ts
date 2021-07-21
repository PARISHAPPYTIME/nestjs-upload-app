import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { makeSalt, encryptPassword } from '../../utils/cryptogram';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registered(body): Promise<any> {
    console.log(body);
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
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([{ username, password: hashPwd, password_salt: salt }])
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
    const res = await this.userRepository
      .createQueryBuilder('auth')
      .where('auth.username = :username', { username })
      .getOne();
    return res;
  }
}
