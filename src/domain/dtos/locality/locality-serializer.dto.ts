import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ShortBaseDto } from '../../../common/dtos';
import { SerializerDepartmentDto } from '..';

export class SerializerLocalityDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Villa nueva' })
  name: string;

  @Expose()
  @Type(() => SerializerDepartmentDto)
  department: SerializerDepartmentDto;
}

export class SerailizerShortLocalityDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Villa nueva' })
  name: string;
}
