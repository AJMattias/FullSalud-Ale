import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProcedureDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ example: 'Consulta médica' })
  name: string;
}

export class UpdateProcedureDto extends PartialType(CreateProcedureDto) {}
