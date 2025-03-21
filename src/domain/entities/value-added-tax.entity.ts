import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Entity, Column } from 'typeorm';

//Esta entidad anteriormente se denominaba Iva
@Entity('value_added_tax')
export class ValueAddedTax extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @ApiProperty({ example: 'General' })
  type: string;
}
