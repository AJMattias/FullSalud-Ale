import {
  Base,
} from '../../common/bases/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  Diagnostic,
  Practitioner,
  Patient,
  PatientAppointment
} from '.';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../enums/appointment-status.enum';

// Esta entidad anteriormente se denominaba Turn
@Entity('appointment')
export class Appointment extends Base {
  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'varchar' })
  hour: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({
    example: 'dolor de pecho opresivo que se irradia hacia el brazo izquierdo, dificultad para respirar y sudoración excesiva'
  })
  observation?: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    nullable: false,
    default: AppointmentStatus.PENDING
  })
  @ApiProperty({
    examples: [
      AppointmentStatus.APPROVED,
      AppointmentStatus.CANCELLED,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.NO_SHOW,
      AppointmentStatus.PENDING,
      AppointmentStatus.UNDER_REVIEW
    ],
    default: AppointmentStatus.PENDING
  })
  status: AppointmentStatus;

  @ManyToOne(() => Patient, (patient) => patient, {
    eager: false,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;
  
  @ManyToMany(() => Practitioner, (practitioner) => practitioner, {
    eager: false,
  })
  @JoinTable({
    name: 'appointment_practitioners',
    joinColumn: {
      name: 'appointment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'practitioner_id',
      referencedColumnName: 'id',
    },
  })
  practitioners: Practitioner[];

  practitionerId: string[];

  @OneToMany(
    () => PatientAppointment,
    (attentionHour) => attentionHour.turn,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE'
    }
  )
  patientAppointment: PatientAppointment[];

}

