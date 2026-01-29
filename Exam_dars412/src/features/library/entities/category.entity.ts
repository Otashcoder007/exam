import {Column, Entity, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {Book} from "./book/book.entity.js";
import {Course} from "./course/course.entity.js";

@Entity({name: "categories"})
export class Category extends BaseModel {
    @Column({length: 64, unique: true})
    name!: string;

    @OneToMany(() => Book, (book) => book.category)
    books?: Relation<Book[]>;

    @OneToMany(() => Course, (course) => course.category)
    courses?: Relation<Course[]>;
}
