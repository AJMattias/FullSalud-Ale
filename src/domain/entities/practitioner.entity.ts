import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  ProfessionalDegree,
  Location,
  PractitionerRole,
  SocialWork,
  PractitionerAppointment
} from '.';
import { User } from './user.entity';
import { PatientPractitionerFavorite } from './patient-practitioner-favorite.entity';
import { IsOptional } from 'class-validator';

@Entity('practitioner')
export class Practitioner extends User {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  license: string;

  @Column({
    type: 'float',
    default: 0.0,
  })
  rating: number = 0;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'home_service',
    default: false,
  })
  homeService: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'accepted_social_works',
    default: false,
  })
  acceptedSocialWorks: boolean;

  @ManyToOne(() => ProfessionalDegree, {
    eager: true,
  })
  @JoinColumn({ name: 'degree_id' })
  degree: ProfessionalDegree;

  @ManyToMany(() => PractitionerRole, (practitioner) => practitioner.practitioners, {
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'practitioners_specialities',
    joinColumn: {
      name: 'practitioner_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id',
    },
  })
  specialities: PractitionerRole[];

  @OneToMany(
    () => PractitionerAppointment,
    (specialistAttentionHour) => specialistAttentionHour.practitioner,
    {
      eager: true,
      cascade: true,
      nullable: true,
      orphanedRowAction: 'soft-delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  specialistAttentionHour: PractitionerAppointment[];

  @Column({
    type: 'time',
    nullable: true,
  })
  consultationTime: string;

  @OneToOne(() => PatientPractitionerFavorite, (favorite) => favorite.practitioner)
  favorite: PatientPractitionerFavorite;

  @Expose()
  @IsOptional()
  @ManyToOne(() => Location, (office) => office.practitioners, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'office_id' })
  office?: Location;

}
