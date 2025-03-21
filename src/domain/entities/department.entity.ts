import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Province } from './province.entity';

@Entity('department')
export class Department extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Mendoza' })
  name: string;

  @ManyToOne(() => Province, {
    eager: true
  })
  @JoinColumn({ name: 'province_id' })
  province: Province;
}
