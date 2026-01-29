import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import {Roles} from "../../../core/constants/roles.js";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    login!: string;

    @IsString()
    @MinLength(3)
    password!: string;

    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsOptional()
    @IsEnum(Roles)
    role?: Roles;
}
