import {Column, Entity, JoinColumn, ManyToOne, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../../core/base-entity.js";
import {Author} from "../author.entity.js";
import {Category} from "../category.entity.js";
import {Difficulty} from "../difficulty.entity.js";
import {Language} from "../language.entity.js";
import {BookReview} from "./book-review.entity.js";

@Entity({name: "books"})
export class Book extends BaseModel {
    @Column({length: 256})
    title!: string;

    @Column({type: "text", nullable: true})
    description?: string;

    @Column({nullable: true})
    cover?: string;

    @Column({nullable: true})
    file?: string;

    @Column({nullable: true})
    fileMimeType?: string;

    @Column({type: "int", nullable: true})
    fileSize?: number;

    @ManyToOne(() => Author, (author) => author.books, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "authorId"})
    author?: Relation<Author>;

    @Column()
    authorId!: number;

    @Column({default: 1})
    categoryId!: number;

    @ManyToOne(() => Category, (category) => category.books, {eager: true,})
    @JoinColumn({name: "categoryId"})
    category?: Relation<Category>;

    @Column()
    difficultyId!: number;

    @ManyToOne(() => Difficulty, (difficulty) => difficulty.books, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "difficultyId"})
    difficulty?: Relation<Difficulty>;

    @Column()
    languageId!: number;

    @ManyToOne(() => Language, (language) => language.books, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "languageId"})
    language?: Relation<Language>;

    @OneToMany(() => BookReview, (review) => review.book)
    reviews?: Relation<BookReview[]>;
}
