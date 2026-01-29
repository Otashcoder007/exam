import {Column, Entity, JoinColumn, ManyToOne, Relation, Unique} from "typeorm";
import {BaseModel} from "../../../../core/base-entity.js";
import {User} from "../../../auth/entity/user.entity.js";
import {Course} from "./course.entity.js";

@Entity({name: "courseReviews"})
@Unique(["userId", "courseId"])
export class CourseReview extends BaseModel {
    @Column()
    userId!: number;

    @ManyToOne(() => User, (user) => user.courseReviews, {
        eager: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: "userId"})
    user?: Relation<User>;

    @ManyToOne(() => Course, (course) => course.reviews, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "courseId" })
    course?: Relation<Course>;

    @Column()
    courseId!: number;

    @Column()
    rating!: number;

    @Column({length: 1024, nullable: true})
    comment?: string;
}
