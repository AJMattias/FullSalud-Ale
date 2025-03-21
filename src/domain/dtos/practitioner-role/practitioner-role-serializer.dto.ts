import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import { SerializerShortCategoryDto } from '..';

export class SerializerPractitionerRoleDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;

  @Expose()
  @Type(() => SerializerShortCategoryDto)
  tags: SerializerShortCategoryDto[];
}

export class SerializerShortPractitionerRoleDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Medicina Clínica' })
  name: string;

  @ApiProperty({ example: true })
  canPrescribe: boolean;
}
