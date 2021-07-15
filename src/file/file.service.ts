import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<FileEntity[]> {
    return await this.fileRepository.query('select * from file');
  }

  async append(): Promise<InsertResult> {
    const file = await this.fileRepository
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values([
        {
          name: '21',
          path: '/123',
          userId: '123',
          fileType: 'image',
        },
      ])
      .execute();
    return file;
  }
}
