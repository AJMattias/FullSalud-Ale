import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from './department.entity';

@Entity('locality')
export class Locality extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Maipú' })
  name: string;

  @ManyToOne(() => Department, {
    eager: true
  })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
