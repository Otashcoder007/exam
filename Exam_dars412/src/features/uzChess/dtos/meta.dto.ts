import { IsNotEmpty, IsString } from "class-validator";

export class MetaDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}
