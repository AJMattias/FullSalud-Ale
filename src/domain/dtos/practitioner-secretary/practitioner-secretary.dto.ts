import { ShortBaseDto } from '../../../common/dtos';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePractitionerDto, UpdatePractitionerDto } from '../practitioner/practitioner.dto';

export class CreatePractitionerSecretaryDto {
  //recibe una nueva persona
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => CreatePractitionerDto)
  person: CreatePractitionerDto;

  //recibe un id de oficina ya creada
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  office: ShortBaseDto;
}

export class UpdatePractitionerSecretaryDto extends PartialType(
  OmitType(CreatePractitionerSecretaryDto, ['person'] as const)
) {
  //recibe opcionalmente una persona actualizada
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdatePractitionerDto)
  @ApiProperty({
    description:
      'Debe incluir el id de person para el correcto guardado de datos'
  })
  person?: UpdatePractitionerDto;
}
