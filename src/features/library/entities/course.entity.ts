import {Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {Author} from "./author.entity.js";
import {Category} from "./category.entity.js";
import {Difficulty} from "./difficulty.entity.js";
import {Language} from "./language.entity.js";
import {CourseReview} from "./course-review.entity.js";

@Entity({name: "courses"})
export class Course extends BaseModel {
    @Column({length: 256})
    title!: string;

    @Column({type: "text", nullable: true})
    description?: string;

    @Column({nullable: true})
    cover?: string;

    @Column()
    authorId!: number;

    @ManyToOne(() => Author, (author) => author.courses, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "authorId"})
    author?: Relation<Author>;

    @Column()
    categoryId!: number;

    @ManyToOne(() => Category, (category) => category.courses, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "categoryId"})
    category?: Relation<Category>;

    @Column()
    difficultyId!: number;

    @ManyToOne(() => Difficulty, (difficulty) => difficulty.courses, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "difficultyId"})
    difficulty?: Relation<Difficulty>;

    @Column()
    languageId!: number;

    @ManyToOne(() => Language, (language) => language.courses, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "languageId"})
    language?: Relation<Language>;

    @OneToMany(() => CourseReview, (review) => review.course)
    reviews?: Relation<CourseReview[]>;
}
