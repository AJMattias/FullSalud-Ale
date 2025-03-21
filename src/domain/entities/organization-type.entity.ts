import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

//Esta entidad anteriormente se denominaba InstitutionType
@Entity('organization_type')
export class OrganizationType extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  type: string;
}
