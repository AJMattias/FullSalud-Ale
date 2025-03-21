import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

//Esta entidad anteriormente se denominaba Relationship
@Entity('related_person')
export class RelatedPerson extends Base {
  @Column({
    type: 'varchar',
    unique: true
  })
  @ApiProperty({ example: 'Hijo' })
  relation: string;
}
