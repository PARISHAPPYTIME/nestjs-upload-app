import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { makeSalt, encryptPassword } from '../../utils/cryptogram';
import { l } from '../../utils/index';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registered(body): Promise<any> {
    const { username, password, repassword } = body;
    if (!username || !password || !repassword) {
      return {
        code: 400,
        message: '缺少需要的参数',
      };
    }
    if (password !== repassword) {
      return {
        code: 400,
        message: '抱歉，两次密码输入不一致',
      };
    }

    const user = await this.findOne(username);
    if (user) {
      return {
        code: 400,
        message: '昵称已经被使用了',
      };
    }
    l('有人尝试注册用户');

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码

    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([{ username, password: hashPwd, password_salt: salt }])
        .execute();
      l('账号注册成功');
      return {
        code: 200,
        message: '账号注册成功，欢迎来到我们的世界',
      };
    } catch (error) {
      return {
        code: 503,
        message: `Service error: ${error}`,
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
