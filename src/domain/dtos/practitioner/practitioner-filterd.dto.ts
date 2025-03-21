import { Type } from "class-transformer";
import { 
    IsAlphanumeric, 
    IsBoolean, 
    IsEnum, 
    IsOptional, 
    IsString, 
    MaxLength } 
    from "class-validator";
import { TransformQueryBoolean } from "../../../common/util/custom-dto-properties-decorators/transform-boolean-decorator.util";
import { Gender } from "../../enums";

export class PractitionerFilteredDto{
    @IsOptional()
    // @IsNotEmpty()
    @MaxLength(50)
    license?: string;

    @IsBoolean()
    @TransformQueryBoolean('homeService')
    @IsOptional()
    homeService?: boolean;

    @IsOptional()
    // @IsNotEmpty()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    // @IsNotEmpty()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    // @IsNotEmpty()
    @IsAlphanumeric()
    dni?: string;

    @IsOptional()
    // @IsNotEmpty()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    // @IsNotEmpty()
    @IsString()
    @Type(() => String)
    birth?: string;

    @IsOptional()
    // @IsNotEmpty()
    // @IsUUID()
    degree?: string;

    @IsOptional()
    // @IsNotEmpty()
    // @IsUUID()
    speciality?: string;

    @IsOptional()
    // @IsUUID()
    // @IsNotEmpty()
    socialWorkEnrollmentId?: string;
}