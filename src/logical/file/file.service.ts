import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { FileEntity } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findAll(): Promise<FileEntity[]> {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .orderBy('file.created_at', 'DESC')
      .getMany();
    return res;
  }

  async deleteItem(id: string): Promise<DeleteResult> {
    const res = await this.fileRepository
      .createQueryBuilder()
      .delete()
      .from(FileEntity)
      .where('id = :id', { id: id })
      .execute();
    return res;
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
