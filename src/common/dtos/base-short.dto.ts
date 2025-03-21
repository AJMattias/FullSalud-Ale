import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty,IsUUID } from 'class-validator';

export class ShortBaseDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '50436717-8608-4bff-bf41-373f14a8b888' })
  id: string;
}
