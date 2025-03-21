import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../../common/bases/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Locality } from '.';

@Entity('address')
export class Address extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    length: 150
  })
  @ApiProperty({ example: 'San Martín' })
  street: string;

  @Column({
    type: 'int',
    nullable: true
  })
  @ApiProperty({ example: 1023 })
  num: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  @ApiProperty({ example: '3' })
  floor: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'zip_code'
  })
  @ApiProperty({ example: '5507' })
  zipCode: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 150
  })
  @ApiProperty({ example: 'Depto 5' })
  observation: string;

  @ManyToOne(() => Locality, {
    eager: true
  })
  @JoinColumn({ name: 'locality_id' })
  locality: Locality;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_public'
  })
  isPublic: boolean;

  @Column({
    type: 'varchar',
    nullable: true
  })
  latitude: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  longitude: string;
}
