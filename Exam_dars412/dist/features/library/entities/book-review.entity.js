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
import { BaseModel } from "../../../core/base-entity.js";
import { User } from "../../auth/entity/user.entity.js";
import { Book } from "./book.entity.js";
let BookReview = class BookReview extends BaseModel {
    userId;
    user;
    bookId;
    book;
    rating;
    comment;
};
__decorate([
    Column(),
    __metadata("design:type", Number)
], BookReview.prototype, "userId", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.bookReviews, {
        eager: true,
        onDelete: "CASCADE"
    }),
    JoinColumn({ name: "userId" }),
    __metadata("design:type", Object)
], BookReview.prototype, "user", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], BookReview.prototype, "bookId", void 0);
__decorate([
    ManyToOne(() => Book, (book) => book.reviews, {
        eager: true,
        onDelete: "CASCADE"
    }),
    JoinColumn({ name: "bookId" }),
    __metadata("design:type", Object)
], BookReview.prototype, "book", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], BookReview.prototype, "rating", void 0);
__decorate([
    Column({ length: 1024, nullable: true }),
    __metadata("design:type", String)
], BookReview.prototype, "comment", void 0);
BookReview = __decorate([
    Entity({ name: "bookReviews" }),
    Unique(["userId", "bookId"])
], BookReview);
export { BookReview };
