import {Type} from "class-transformer";
import {IsInt, IsNotEmpty, IsOptional, IsString, Min} from "class-validator";

export class CourseDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    authorId!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    categoryId!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    difficultyId!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    languageId!: number;
}
