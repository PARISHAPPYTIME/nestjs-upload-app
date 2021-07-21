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
import { FileService } from './file.service';
import { FileEntity } from './file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('list')
  findAll(): Promise<FileEntity[]> {
    return this.fileService.findAll();
  }

  @Get('remove')
  deleteItem(@Query('id') id: string) {
    return this.fileService.deleteItem(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('append')
  @UseInterceptors(FileInterceptor('file')) // file 对应 HTML 表单的 name 属性
  async append(@UploadedFile() file: Express.Multer.File, @Body() body) {
    try {
      const writeImage = createWriteStream(
        join(__dirname, '../../../upload/resource', `${file.originalname}`),
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
