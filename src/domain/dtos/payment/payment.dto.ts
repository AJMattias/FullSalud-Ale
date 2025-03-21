import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreatePaymentDto {
  @IsNotEmpty()
  @Type(() => Number)
  paymentTime: number;

  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  socialWork: ShortBaseDto;

  @IsNotEmpty()
  @Type(() => ShortBaseDto)
  speciality: ShortBaseDto;
}
export class UpdatePaymentDto extends PartialType(
  OmitType(CreatePaymentDto, ['socialWork', 'speciality'] as const)
) {}
