import {IsNotEmpty, IsString, Length} from "class-validator";

export class LangDto {
    @IsString()
    @IsNotEmpty()
    lang!: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 5) //symbols are counted too
    langCode!: string;
}
