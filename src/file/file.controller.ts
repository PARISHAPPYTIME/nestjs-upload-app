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
import { InsertResult } from 'typeorm';
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
  append(): Promise<InsertResult> {
    return this.fileService.append();
  }
}
