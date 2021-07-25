import { Controller, Get, Param } from '@nestjs/common';
import { CodeService } from './code.service';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Get('/:fileType')
  async findFileByType(@Param('fileType') fileType) {
    const list = await this.codeService.findFileByType(fileType);
    return {
      code: 200,
      message: '',
      data: {
        data: list,
      },
    };
  }
}
