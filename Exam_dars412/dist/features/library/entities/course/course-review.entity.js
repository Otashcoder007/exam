var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { BaseModel } from "../../../../core/base-entity.js";
import { User } from "../../../auth/entity/user.entity.js";
import { Course } from "./course.entity.js";
let CourseReview = class CourseReview extends BaseModel {
    userId;
    user;
    course;
    courseId;
    rating;
    comment;
};
__decorate([
    Column(),
    __metadata("design:type", Number)
], CourseReview.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.courseReviews, {
        eager: true,
        onDelete: "CASCADE"
    }),
    JoinColumn({ name: "userId" }),
    __metadata("design:type", Object)
], CourseReview.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Course, (course) => course.reviews, {
        onDelete: "CASCADE"
    }),
    JoinColumn({ name: "courseId" }),
    __metadata("design:type", Object)
], CourseReview.prototype, "course", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], CourseReview.prototype, "courseId", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], CourseReview.prototype, "rating", void 0);
__decorate([
    Column({ length: 1024, nullable: true }),
    __metadata("design:type", String)
], CourseReview.prototype, "comment", void 0);
CourseReview = __decorate([
    Entity({ name: "courseReviews" }),
    Unique(["userId", "courseId"])
], CourseReview);
export { CourseReview };
