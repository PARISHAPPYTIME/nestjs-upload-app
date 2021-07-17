import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertQueryBuilder, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FileEntity } from '../entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<FileEntity[]> {
    return await this.fileRepository.query(
      'select * from file order by created_at desc',
    );
  }

  async append(
    item:
      | QueryDeepPartialEntity<FileEntity>
      | QueryDeepPartialEntity<FileEntity>,
  ): Promise<InsertResult> {
    const file = await this.fileRepository
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values([item])
      .execute();
    return file;
  }
}
