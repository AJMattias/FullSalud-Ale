import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePdfDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '87d46799-913b-4c11-a7cc-50d134178e2d' })
    medicationRequestId: string
}
