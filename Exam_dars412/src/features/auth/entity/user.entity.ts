import {Column, Entity, OneToMany, Relation} from "typeorm";
import {BaseModel} from "../../../core/base-entity.js";
import {BookReview} from "../../uzChess/entities/book/book-review.entity.js";
import {CourseReview} from "../../uzChess/entities/course/course-review.entity.js";
import {Roles} from "../../../core/constants/roles.js";

@Entity({name: "users"})
export class User extends BaseModel {
    @Column({length: 32})
    firstName!: string;

    @Column({length: 32})
    lastName!: string;

    @Column({length: 32, unique: true})
    login!: string;

    @Column({length: 256})
    password!: string;

    @Column({nullable: true})
    avatar?: string;

    @OneToMany(() => BookReview, (r) => r.user)
    bookReviews?: Relation<BookReview[]>;

    @OneToMany(() => CourseReview, (r) => r.user)
    courseReviews?: Relation<CourseReview[]>;

    @Column({ type: "enum", enum: Roles, default: Roles.User })
    role!: Roles;
}
