import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class UserLogin {
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    login!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    password!: string;
}