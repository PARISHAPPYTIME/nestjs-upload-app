import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileEntity } from '../entities/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('list')
  findAll(): Promise<FileEntity[]> {
    return this.fileService.findAll();
  }

  @Post('append')
  @UseInterceptors(FileInterceptor('file')) // file 对应 HTML 表单的 name 属性
  async append(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(body.name);
    try {
      const writeImage = createWriteStream(
        join(__dirname, '../../upload/resource', `${file.originalname}`),
      );
      writeImage.write(file.buffer);
      const fileRes = await this.fileService.append({
        name: body.name,
        path: `resource/${file.originalname}`,
        userId: '123',
        fileType: 'image',
      });
      return {
        code: 200,
        msg: 'success',
        data: {
          uuid: fileRes.generatedMaps[0].uuid,
        },
      };
    } catch (e) {
      return {
        code: 201,
        msg: 'fail',
        data: {},
      };
    }
  }
}
