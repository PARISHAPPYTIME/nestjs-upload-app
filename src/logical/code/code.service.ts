import { Injectable } from '@nestjs/common';
import { FileEntity } from '../file/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findFileByType(fileType: string): Promise<FileEntity[]> {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .where('file.file_type = :fileType', {
        fileType: fileType,
      })
      .orderBy('file.created_at', 'DESC')
      .getMany();
    return res;
  }
}
