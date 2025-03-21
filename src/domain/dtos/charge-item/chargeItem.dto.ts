import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ShortBaseDto } from '../../../common/dtos';

export class CreateChargeItemDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Type(() => Number)
  @ApiProperty({ example: '8000' })
  price: number;

  //recibe el id del especialista
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  practitioner: ShortBaseDto;

  //recibe el id de la practica
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ShortBaseDto)
  practice: ShortBaseDto;
}

//no permite actualizar practice ni specialist, solo el price
export class UpdateChargeItemDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Type(() => Number)
  price: number;
}
