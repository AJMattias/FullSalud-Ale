import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  SerializerRelatedPersonDto,
  SerializerShortAddressDto,
  SerializerShortUserDto
} from '..';
import { FullBaseDto } from '../../../common/dtos';
import { IsOptional } from 'class-validator';
import { SerializerUserDto } from '../user/user-serializer.dto';

export class SerializerPatientDto extends SerializerUserDto {

  @Expose()
  @ApiProperty({ example: 'Patient' }) 
  resourceType: string = 'Patient';

  @Expose()
  @Type(() => SerializerShortAddressDto)
  addresses: SerializerShortAddressDto[];
}

export class SerializerShortPatientDto extends SerializerPatientDto {
  @Exclude()
  @Type(() => SerializerShortAddressDto)
  addresses: SerializerShortAddressDto[];
}
