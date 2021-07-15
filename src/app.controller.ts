import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // file 对应 HTML 表单的 name 属性
  UploadedFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log(body.name);
    const writeImage = createWriteStream(
      join(__dirname, '..', 'upload', `${file.originalname}`),
    );
    writeImage.write(file.buffer);
    return this.appService.getFileStatus();
  }
}
