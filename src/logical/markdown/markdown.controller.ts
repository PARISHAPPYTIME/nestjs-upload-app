import { Controller, Get, Query } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { resolve, join } from 'path';

const rootPath = resolve('./markdown');

@Controller('md')
export class MarkdownController {
  constructor(private markdownService: MarkdownService) {}

  @Get()
  async findFile(@Query('searchPath') searchPath: string) {
    if (!searchPath)
      return {
        code: 200,
        message: '',
        data: [],
      };
    return await this.markdownService.getDirectoryInAFolder(
      join(rootPath, searchPath || ''),
      false,
    );
  }

  @Get('all')
  async findFileAll(@Query('searchPath') searchPath: string) {
    if (!searchPath)
      return {
        code: 200,
        message: '',
        data: [],
      };
    return await this.markdownService.getDirectoryInAFolder(
      join(rootPath, searchPath || ''),
      true,
    );
  }
}
