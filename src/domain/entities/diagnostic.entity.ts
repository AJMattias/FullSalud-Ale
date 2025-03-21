import { Base } from '../../common/bases/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('diagnostic')
export class Diagnostic extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string;
}
