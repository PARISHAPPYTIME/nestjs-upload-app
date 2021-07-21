import {
  Column,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'auth' })
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    name: 'username',
    comment: '账户名称/手机号码',
    default: '',
  })
  username: string;

  @Column({ type: 'varchar', name: 'password', comment: '密码', default: '' })
  password: string;

  @Column({ type: 'varchar', name: 'email', comment: '邮箱', default: '' })
  email: string;

  @Column({ type: 'varchar', name: 'avatar', comment: '头像', default: '' })
  avatar: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'deleted_at',
    select: false,
    comment: '软删除时间',
  })
  deletedAt: Date;
}
