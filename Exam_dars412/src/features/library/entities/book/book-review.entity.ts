import {Column, Entity, JoinColumn, ManyToOne, Relation, Unique} from "typeorm";
import {BaseModel} from "../../../../core/base-entity.js";
import {User} from "../../../auth/entity/user.entity.js";
import {Book} from "./book.entity.js";

@Entity({name: "bookReviews"})
@Unique(["userId", "bookId"])
export class BookReview extends BaseModel {
    @Column()
    userId!: number;

    @ManyToOne(() => User, (user) => user.bookReviews, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "userId"})
    user?: Relation<User>;

    @ManyToOne(() => Book, (book) => book.reviews, {
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "bookId"})
    book?: Relation<Book>;

    @Column()
    bookId!: number;

    @Column()
    rating!: number;

    @Column({length: 1024, nullable: true})
    comment?: string;
}
