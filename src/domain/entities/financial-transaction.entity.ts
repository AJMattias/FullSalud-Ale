import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Organization } from '.';

//Esta entidad anteiormente se denominaba Commission
@Entity('commissions')
export class FinancialTransaction extends Base {
  @Column({
    type: 'decimal',
    nullable: false
  })
  percentage: number;

  @Column({
    type: 'int',
    name: 'minimun_patients'
  })
  minimunPatients: number;

  @ManyToMany(() => Organization, (institution) => institution.commissions, {
    eager: true
  })
  @JoinTable({
    name: 'commission_institutions',
    joinColumn: {
      name: 'comission_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'institution_id',
      referencedColumnName: 'id'
    }
  })
  institutions: Organization[];
}
