import { Base } from '../../common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ValueAddedTax  } from './value-added-tax.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationType, FinancialTransaction, Branch } from '.';

//Esta entidad anteriormente se denominaba Institution
@Entity('organization')
export class Organization extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'business_name'
  })
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @ManyToOne(() => ValueAddedTax , {
    eager: true
  })
  @JoinColumn({ name: 'iva_id' })
  iva: ValueAddedTax ;

  @ManyToOne(() => OrganizationType, {
    eager: true
  })
  @JoinColumn({ name: 'institution_type_id' })
  institutionType: OrganizationType;

  @ManyToMany(() => FinancialTransaction, (commission) => commission.institutions)
  commissions: FinancialTransaction[];

  @OneToMany(() => Branch, (headquarters) => headquarters.institution, {
    cascade: ['soft-remove', 'recover'],
    orphanedRowAction: 'soft-delete',
    eager: true
  })
  headquarters: Branch[];
}
