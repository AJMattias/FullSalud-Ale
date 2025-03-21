import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Prescription, Medication, ClinicalIndicationDetail } from '.';

//Esta entidad anteriormente se denominaba Indication
@Entity('clinical_indication')
export class ClinicalIndication extends Base {
  @Column({
    type: 'time',
    default: null,
    nullable: true
  })
  start: string;

  @ManyToOne(() => Prescription, (prescription) => prescription.indications, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription?: Prescription;

  // @ManyToOne(() => Medicine, {
  //   eager: true
  // })
  // @JoinColumn({ name: 'medicine_id' })
  // medicine: Medicine;

  @OneToMany(
    () => ClinicalIndicationDetail,
    (indicationDetail) => indicationDetail.indication,
    {
      eager: true,
      cascade: true
    }
  )
  indicationsDetails: ClinicalIndicationDetail[];
}
