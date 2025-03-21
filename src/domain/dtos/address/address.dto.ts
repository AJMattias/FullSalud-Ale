import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  ValidateNested,
  IsUUID,
  ValidateIf
} from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @ValidateIf((o) => !o.id)
  @ApiProperty({ example: 'San Martín' })
  street: string;

  @IsOptional()
  @IsInt()
  @ValidateIf((o) => !o.id)
  @Type(() => Number)
  @ApiProperty({ example: 1023 })
  num?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  @ApiProperty({ example: '3' })
  floor?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '5507' })
  @ValidateIf((o) => !o.id)
  zipCode: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '3' })
  @ValidateIf((o) => !o.id)
  latitude?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '3' })
  @ValidateIf((o) => !o.id)
  longitude?: string;

  @IsString()
  @MaxLength(150)
  @ApiProperty({ example: 'Depto 5' })
  @ValidateIf((o) => !o.id)
  @IsOptional()
  observation?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  @ValidateIf((o) => !o.id)
  locality: ShortBaseDto;
}

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ example: '66f8b020-d409-4ed5-8aad-197a125b1018' })
  id?: string;
}

export class CreateAddressWithIdDto extends CreateAddressDto {
  @IsOptional()
  @IsUUID()
  @ValidateIf(
    (o) =>
      !o.street &&
      !o.num &&
      !o.floor &&
      !o.zipCode &&
      !o.latitude &&
      !o.longitude &&
      !o.observation
  )
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id?: string;
}
