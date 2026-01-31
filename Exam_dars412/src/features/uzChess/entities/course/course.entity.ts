import {Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../../core/base-entity.js";
import {Author} from "../author.entity.js";
import {Category} from "../category.entity.js";
import {Difficulty} from "../difficulty.entity.js";
import {Language} from "../language.entity.js";
import {CourseReview} from "./course-review.entity.js";

@Entity({name: "courses"})
export class Course extends BaseModel {
    @Column({length: 256})
    title!: string;

    @Column({type: "text", nullable: true})
    description?: string;

    @Column({nullable: true})
    cover?: string;

    @ManyToOne(() => Author, (author) => author.courses, {
        eager: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "authorId"})
    author?: Relation<Author>;

    @Column()
    authorId!: number;

    @Column({default: 1})
    categoryId!: number;

    @ManyToOne(() => Category, (category) => category.courses, {eager: true,})
    @JoinColumn({name: "categoryId"})
    category?: Relation<Category>;

    @Column()
    difficultyId!: number;

    @ManyToOne(() => Difficulty, (difficulty) => difficulty.courses, {
        eager: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "difficultyId"})
    difficulty?: Relation<Difficulty>;

    @Column()
    languageId!: number;

    @ManyToOne(() => Language, (language) => language.courses, {
        eager: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "languageId"})
    language?: Relation<Language>;

    @OneToMany(() => CourseReview, (review) => review.course)
    reviews?: Relation<CourseReview[]>;
}
