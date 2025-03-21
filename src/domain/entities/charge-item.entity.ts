import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Practitioner } from './practitioner.entity';
import { Procedure } from './procedure.entity';
import { ApiProperty } from '@nestjs/swagger';

//Esta entidad anteriormente se denominaba Price
@Entity('charge_item')
export class ChargeItem extends Base {
  @Column({
    type: 'float',
    nullable: false
  })
  @ApiProperty({ example: '8000' })
  price: number;

  @ManyToOne(() => Practitioner, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @ManyToOne(() => Procedure, {
    onDelete: 'CASCADE',
    cascade: true,
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  @JoinColumn({ name: 'practice_id' })
  practice: Procedure;
}
