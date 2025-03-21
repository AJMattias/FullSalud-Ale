import { Base } from '../../common/bases/base.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { Location, Practitioner } from '.';

//Esta entidad antes se denomiba SpecialistSecretary
@Entity('practitioner_secretary')
export class PractitionerSecretary extends Base {
  @OneToOne(() => Practitioner, {
    orphanedRowAction: 'delete',
    cascade: true,
    eager: true
  })
  @JoinColumn({
    name: 'practitioner_id'
  })
  practitioner: Practitioner;

  @OneToOne(() => Location, (office) => office.secretary, {
    eager: true
  })
  @JoinColumn({
    name: 'office_id'
  })
  office: Location;
}