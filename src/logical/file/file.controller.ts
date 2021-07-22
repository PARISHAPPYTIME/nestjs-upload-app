import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { FileService } from './file.service';
import { FileEntity } from './file.entity';
import { dirExists } from '../../utils/index';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  findAll(): Promise<FileEntity[]> {
    return this.fileService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('remove')
  deleteItem(@Query('id') id: string) {
    return this.fileService.deleteItem(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('append')
  @UseInterceptors(FileInterceptor('file')) // file 对应 HTML 表单的 name 属性
  async append(@UploadedFile() file: Express.Multer.File, @Body() body) {
    try {
      await dirExists(resolve('public/resource'));
      const writeImage = createWriteStream(
        resolve('public/resource', `${file.originalname}`),
      );
      writeImage.write(file.buffer);
      const fileRes = await this.fileService.append({
        name: body.name,
        path: `resource/${file.originalname}`,
        userId: 'body.username',
        fileType: 'image',
      });
      return {
        code: 200,
        message: '文件上传成功',
        data: {
          uuid: fileRes.generatedMaps[0].uuid,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        code: 201,
        message: '文件上传失败',
        data: {},
      };
    }
  }
}
