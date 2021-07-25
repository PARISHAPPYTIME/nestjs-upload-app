import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
  UseGuards,
  Request,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { createWriteStream } from 'fs';
import { resolve, join } from 'path';
import { FileService } from './file.service';
import { dirExists } from '../../utils/index';
import { Response } from 'express';
// import {} from ''

@Controller('upload')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('list')
  async findAll() {
    const list = await this.fileService.findAll();
    return {
      code: 200,
      data: {
        data: list,
      },
    };
  }

  @Get('remove')
  deleteItem(@Query('id') id: string) {
    return this.fileService.deleteItem(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('append')
  @UseInterceptors(FileInterceptor('file')) // file 对应 HTML 表单的 name 属性
  async append(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Request() req,
  ) {
    try {
      const user = req.user;
      await dirExists(resolve('public/resource'));
      const writeImage = createWriteStream(
        resolve('public/resource', `${file.originalname}`),
      );
      writeImage.write(file.buffer);
      const fileRes = await this.fileService.append({
        name: body.name,
        filename: body.filename,
        path: `resource/${file.originalname}`,
        userId: user.userId,
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

  @Get('download/:file')
  getFile(@Res() res: Response, @Param() params) {
    // console.log(params, params.file);
    // console.log(resolve('./public/resource', params.file));
    // res.set({
    //   'Content-Type': 'application/octet-stream',
    //   'Content-Disposition': 'attachment;',
    // });
    res.download(resolve('./public/resource', params.file));
    return {
      code: 200,
      message: '下载成功',
      data: {},
    };
  }
}
