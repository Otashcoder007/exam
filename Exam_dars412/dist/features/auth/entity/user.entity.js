var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "../../../core/base-entity.js";
import { BookReview } from "../../library/entities/book/book-review.entity.js";
import { CourseReview } from "../../library/entities/course/course-review.entity.js";
import { Roles } from "../../../core/constants/roles.js";
let User = class User extends BaseModel {
    firstName;
    lastName;
    login;
    password;
    avatar;
    bookReviews;
    courseReviews;
    role;
};
__decorate([
    Column({ length: 32 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    Column({ length: 32 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    Column({ length: 32, unique: true }),
    __metadata("design:type", String)
], User.prototype, "login", void 0);
__decorate([
    Column({ length: 256 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    OneToMany(() => BookReview, (r) => r.user),
    __metadata("design:type", Object)
], User.prototype, "bookReviews", void 0);
__decorate([
    OneToMany(() => CourseReview, (r) => r.user),
    __metadata("design:type", Object)
], User.prototype, "courseReviews", void 0);
__decorate([
    Column({ type: "enum", enum: Roles, default: Roles.User }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
User = __decorate([
    Entity({ name: "users" })
], User);
export { User };
