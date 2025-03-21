import { FullBaseDto } from '../../../common/dtos';
import {
  SerializerLocationDto,
  SerializerPractitionerDto,
  SerializerShortLocationDto,
  SerializerShortPractitionerDto,
} from '..';
import { Expose, Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';

export class SerializerPractitionerSecretaryDto extends FullBaseDto {
  @Expose()
  @Type(() => SerializerPractitionerDto)
  person: SerializerPractitionerDto;

  @Expose()
  @Type(() => SerializerLocationDto)
  office: SerializerLocationDto;
}

export class SerializerShortSpecialistSecretaryDto extends OmitType(
  FullBaseDto,
  ['createdAt', 'deletedAt'] as const
) {
  @Expose()
  @Type(() => SerializerShortPractitionerDto)
  person: SerializerShortPractitionerDto;

  @Expose()
  @Type(() => SerializerShortLocationDto)
  office: SerializerShortLocationDto;
}
