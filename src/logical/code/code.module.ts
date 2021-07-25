import { Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../file/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [CodeService],
  controllers: [CodeController],
})
export class CodeModule {}
