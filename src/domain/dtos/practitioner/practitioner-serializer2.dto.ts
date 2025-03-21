/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Gender } from '../../enums';
import { SerializerProfessionalDegreeDto } from '..';
import { SerializerShortPractitionerRoleDto } from '..';
import { SerializerShortSocialWorkDto } from '..';
import { ShortSerializerPractitionerAppointmentDto } from '..';
import { SerializerAppointmentDto } from '..';
import { SerializerAddressDto } from '..';

// Atributos comunes de FullBaseDto
class FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'd46f9fde-7c96-4337-8398-b186f2e828dd' })
  id: string;

  @Expose()
  @ApiProperty({ example: '2025-02-08 01:31:19.631225+00' })
  createdAt: string;

  @Expose()
  @ApiProperty({ example: null })
  deletedAt: string | null;
}

// Atributos comunes de SerializerUserDto
class SerializerUserDto {
  @Expose()
  @ApiProperty({ example: 'email@email.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'maria' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'specialist' })
  role: string;

  @Expose()
  @ApiProperty({ example: 'Maria' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Serralima' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'female' })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: 'DNI' })
  documentType: string;

  @Expose()
  @ApiProperty({ example: '39382009' })
  dni: string;

  @Expose()
  @ApiProperty({ example: '261 5478563' })
  phone: string;

  @Expose()
  @ApiProperty({ example: '25/48/8754' })
  birth: string;

  @Expose()
  @Type(() => SerializerAddressDto)
  addresses: SerializerAddressDto[];
}

// DTO combinado
export class SerializerPractitionerDto extends FullBaseDto {
  @Expose()
  @ApiProperty({ example: 'Practitioner' })
  resourceType?: string = 'Practitioner';

  @Expose()
  @ApiProperty({ example: '123456-M-BA' })
  license: string;

  @Expose()
  @ApiProperty({ example: 'false' })
  homeService: boolean;

  @Expose()
  @Type(() => SerializerProfessionalDegreeDto)
  degree: SerializerProfessionalDegreeDto;

  @Expose()
  @Type(() => SerializerShortPractitionerRoleDto)
  practitionerRole: SerializerShortPractitionerRoleDto[];

  // @Expose()
  // @Type(() => SerializerShortSocialWorkDto)
  // acceptedSocialWorks: SerializerShortSocialWorkDto[];

  @Expose()
  @Type(() => ShortSerializerPractitionerAppointmentDto)
  specialistAttentionHour: ShortSerializerPractitionerAppointmentDto[];

  @Expose()
  @Type(() => SerializerAppointmentDto)
  turns: SerializerAppointmentDto[];

  // Incluyendo los atributos de User
  @Expose()
  @ApiProperty({ example: 'Maria' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'Serralima' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'female' })
  gender: Gender;

  @Expose()
  @ApiProperty({ example: 'DNI' })
  documentType: string;

  @Expose()
  @ApiProperty({ example: '29382009' })
  dni: string;

  @Expose()
  @ApiProperty({ example: '261 5478563' })
  phone: string;

  @Expose()
  @ApiProperty({ example: 'email@email.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'maria' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'specialist' })
  role: string;

  @Expose()
  @ApiProperty({ example: '25/12/1995' })
  birth: string;

  @Expose()
  @Type(() => SerializerAddressDto)
  addresses: SerializerAddressDto;
}
