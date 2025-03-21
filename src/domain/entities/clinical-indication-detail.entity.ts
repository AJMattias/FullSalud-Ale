import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ClinicalIndication } from '.';

//Esta entidad anteriormente se denominaba IndicationDetail
@Entity('clinical_indication_detail')
export class ClinicalIndicationDetail extends Base {
  @Column({
    type: 'int',
    nullable: false
  })
  order: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
  dose: string;

  @Column({
    type: 'int',
    nullable: false
  })
  period: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'time_lapse'
  })
  timeLapse: number;

  @ManyToOne(() => ClinicalIndication, (indication) => indication.indicationsDetails, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'indication_id' })
  indication: ClinicalIndication;
}
