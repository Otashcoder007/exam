import {IsNotEmpty, IsString, Length} from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 32)
    login!: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
    password!: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 32)
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 32)
    lastName!: string;
}
