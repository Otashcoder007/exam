import {Column, Entity, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {Book} from "./book/book.entity.js";
import {Course} from "./course/course.entity.js";

@Entity({name: "difficulties"})
export class Difficulty extends BaseModel {
    @Column({length: 64, unique: true})
    name!: string;

    @OneToMany(() => Book, (book) => book.difficulty)
    books?: Relation<Book[]>;

    @OneToMany(() => Course, (course) => course.difficulty)
    courses?: Relation<Course[]>;
}
