import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity } from 'typeorm';

//Esta entidad anteriormente se denominaba Degree
@Entity('professional_degree')
export class ProfessionalDegree extends Base {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  @ApiProperty({ example: 'Doctor' })
  degree: string;
}
