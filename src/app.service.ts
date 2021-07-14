import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getFileStatus(): Record<string, any> {
    return {
      data: {},
      msg: '文件上传成功',
      code: 200,
    };
  }
}
