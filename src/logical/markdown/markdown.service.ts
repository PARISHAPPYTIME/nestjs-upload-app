import { Injectable } from '@nestjs/common';
import { accessSync, readFileSync, statSync } from 'fs';
import { resolve, basename } from 'path';
import { getDirectoryList } from '../../utils/file';

@Injectable()
export class MarkdownService {
  getDirectoryInAFolder(path, recursion) {
    try {
      const statsObj = statSync(path);
      if (statsObj.isDirectory()) {
        return {
          code: 200,
          message: '',
          data: getDirectoryList(path, recursion),
        };
      } else {
        const data = this.getFile(path);
        return {
          code: 200,
          message: '',
          data: {
            title: basename(path),
            content: data,
          },
        };
      }
    } catch (err) {
      console.error('no access!', err);

      return {
        code: 201,
        message: '文件地址异常',
        data: {},
      };
    }
  }

  getFile(path) {
    const data = readFileSync(path);
    return data.toString();
  }
}
