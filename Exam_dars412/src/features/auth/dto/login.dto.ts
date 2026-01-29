import {IsNotEmpty, IsString, Length} from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 32)
    login!: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
    password!: string;
}
