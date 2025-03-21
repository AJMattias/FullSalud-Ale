import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ClinicalIndication, Patient, Practitioner } from '.';

@Entity('prescription')
export class Prescription extends Base {
  @Column({
    type: 'date'
  })
  date: string;

  @ManyToOne(() => Patient, {
    eager: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Practitioner, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'practitioner_id' })
  practitioner: Practitioner;

  @Column({
    type: 'varchar',
    nullable: true
  })
  observations: string;

  @OneToMany(() => ClinicalIndication, (indication) => indication.prescription, {
    eager: true,
    cascade: true
  })
  indications?: ClinicalIndication[];
}
