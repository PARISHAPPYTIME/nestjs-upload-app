import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    // 加载连接数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // 数据库ip地址
      port: 3307, // 端口
      username: 'root', // 登录名
      password: 'xiaoyu123654', // 密码
      database: 'upload', // 数据库名称
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
      synchronize: true, // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost', // 数据库ip地址
    //   port: 3306, // 端口
    //   username: 'root', // 登录名
    //   password: '', // 密码
    //   database: 'upload', // 数据库名称
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'], // 扫描本项目中.entity.ts或者.entity.js的文件
    //   synchronize: true, // 定义数据库表结构与实体类字段同步(这里一旦数据库少了字段就会自动加入,根据需要来使用)
    // }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
