import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { FullBaseDto, ShortBaseDto } from '../../../common/dtos';
import {
  SerializerUserDto,
  SerializerShortInstitutionDto,
  SerializerShortAddressDto,
  SerializerAppointmentSlotDto
} from '..';

export class SerializerBranchDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: '30701234567' })
  cuit: string;

  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;

  @Expose()
  @ApiProperty({ example: '123456789' })
  phone: string;

  @Expose()
  @Type(() => SerializerUserDto)
  user: SerializerUserDto;

  @Expose()
  @Type(() => SerializerShortInstitutionDto)
  institution: SerializerShortInstitutionDto;

  @Expose()
  @Type(() => SerializerShortAddressDto)
  address: SerializerShortAddressDto;

  @Expose()
  @Type(() => SerializerAppointmentSlotDto)
  attentionHours: SerializerAppointmentSlotDto[];
}

export class SerializerShortBranchDto extends ShortBaseDto {
  @Expose()
  @ApiProperty({ example: 'Centro Médico' })
  businessName: string;
}
