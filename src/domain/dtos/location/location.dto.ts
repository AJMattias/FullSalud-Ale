import { CreateAddressDto, UpdateAddressDto, CreateAppointmentSlotDto } from '..';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
  ValidateIf,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Consultorio del Parque'
  })
  name: string;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    example: '2615623164'
  })
  phone?: string;

  //recibe una nueva dirección
  @ValidateNested()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ValidateNested({ each: true })
  @Type(() => CreateAppointmentSlotDto)
  @IsOptional()
  @ApiProperty({ type: [CreateAppointmentSlotDto] })
  attentionHour?: CreateAppointmentSlotDto[];
}

export class CreateLocationWithIdDto extends CreateAddressDto {
  @IsOptional()
  @IsUUID()
  @ValidateIf((dto) => !dto.name && !dto.phone && !dto.address)
  /*
    @IsUUID()
    @IsOptionalIf(dto => dto.name && dto.address)
    */
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id?: string;
}

export class UpdateOfficeDto extends PartialType(
  OmitType(CreateLocationDto, ['address'] as const)
) {
  //recibe opcionalmente una dirección actualizada
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateAddressDto)
  @ApiProperty({
    description:
      'Debe incluir el id de address para el correcto guardado de datos'
  })
  address?: UpdateAddressDto;
}
