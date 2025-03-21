import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Entity, Column } from 'typeorm';

//Esta entidad antes se denominaba Practice
@Entity('procedure')
export class Procedure extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 100
  })
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}
