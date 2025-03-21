import { Base } from '../../common/bases/base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Category, Practitioner } from '.';
import { ApiProperty } from '@nestjs/swagger';

@Entity('practitioner_role')
export class PractitionerRole extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'can_prescribe'
  })
  canPrescribe: boolean;

  @ManyToMany(() => Practitioner, (practitioner) => practitioner.specialities)
  practitioners: Practitioner[];

  @ManyToMany(() => Category, {
    eager: true,
    cascade: true,
    orphanedRowAction: 'soft-delete'
  })
  @JoinTable({
    name: 'specialities_tags',
    joinColumn: {
      name: 'speciality_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags: Category[];
}
