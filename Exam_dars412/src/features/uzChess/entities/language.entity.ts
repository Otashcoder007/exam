import {Column, Entity, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {Book} from "./book/book.entity.js";
import {Course} from "./course/course.entity.js";

@Entity({name: "languages"})
export class Language extends BaseModel {
    @Column({length: 64, unique: true})
    lang!: string;

    @Column({length: 5})
    langCode!: string;

    @OneToMany(() => Book, (book) => book.language)
    books?: Relation<Book[]>;

    @OneToMany(() => Course, (course) => course.language)
    courses?: Relation<Course[]>;
}
