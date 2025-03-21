import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('medication')
export class Medication extends Base {
  @Column({
    type: 'varchar'
  })
  name: string;
  @Column({
    type: 'varchar',
    nullable: true
  })
  description: string;
}
