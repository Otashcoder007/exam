import {Column, Entity, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {Book} from "./book.entity.js";
import {Course} from "./course.entity.js";

@Entity({name: "authors"})
export class Author extends BaseModel {
    @Column({length: 32})
    firstName!: string;

    @Column({length: 32})
    lastName!: string;

    @Column({length: 32, nullable: true})
    middleName?: string;

    @OneToMany(() => Book, (book) => book.author)
    books?: Relation<Book[]>;

    @OneToMany(() => Course, (course) => course.author)
    courses?: Relation<Course[]>;
}
