import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '50436717-8608-4bff-bf41-373f14a8b888' })
  id: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'varchar',
  })
  @ApiProperty({ example: null })
  deletedAt!: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'varchar',
  })
  createdAt!: string;
}
