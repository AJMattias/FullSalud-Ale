import { Base } from '../../common/bases/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Day } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '.';

// Esta entidad anteriormente se denominaba AttentionHourPatient
@Entity('patient_appointment')
export class PatientAppointment extends Base {
  @Column({
    type: 'time',
    name: 'opening_hour',
    nullable: true
  })
  openingHour: string;

  @Column({
    type: 'time',
    name: 'close_hour',
    nullable: true
  })
  closeHour: string;

  @Column({
    type: 'enum',
    enum: Day
  })
  @ApiProperty({
    examples: [
      Day.SUNDAY,
      Day.MONDAY,
      Day.TUESDAY,
      Day.WEDNESDAY,
      Day.THURSDAY,
      Day.FRIDAY,
      Day.SATURDAY
    ]
  })
  day: Day;

  @ManyToOne(() => Appointment, (turn) => turn.patientAppointment)
  @JoinColumn({ name: 'turn_id' })
  turn: Appointment;
}
