import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('country')
export class Country extends Base {
  @Column({
    type: 'varchar',
    nullable: false
  })
  @ApiProperty({ example: 'Argentina' })
  name: string;
}
