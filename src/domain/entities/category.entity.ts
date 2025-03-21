import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

//Esta entidad antes se denominaba Tag
@Entity('category')
export class Category extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  name: string;
}
