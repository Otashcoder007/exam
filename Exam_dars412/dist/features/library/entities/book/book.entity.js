var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseModel } from "../../../../core/base-entity.js";
import { Author } from "../author.entity.js";
import { Category } from "../category.entity.js";
import { Difficulty } from "../difficulty.entity.js";
import { Language } from "../language.entity.js";
import { BookReview } from "./book-review.entity.js";
let Book = class Book extends BaseModel {
    title;
    description;
    cover;
    file;
    fileMimeType;
    fileSize;
    author;
    authorId;
    categoryId;
    category;
    difficultyId;
    difficulty;
    languageId;
    language;
    reviews;
};
__decorate([
    Column({ length: 256 }),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "description", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "cover", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "file", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "fileMimeType", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Book.prototype, "fileSize", void 0);
__decorate([
    ManyToOne(() => Author, (author) => author.books, {
        eager: true,
        onDelete: "SET NULL"
    }),
    JoinColumn({ name: "authorId" }),
    __metadata("design:type", Object)
], Book.prototype, "author", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Book.prototype, "authorId", void 0);
__decorate([
    Column({ default: 1 }),
    __metadata("design:type", Number)
], Book.prototype, "categoryId", void 0);
__decorate([
    ManyToOne(() => Category, (category) => category.books, { eager: true, }),
    JoinColumn({ name: "categoryId" }),
    __metadata("design:type", Object)
], Book.prototype, "category", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Book.prototype, "difficultyId", void 0);
__decorate([
    ManyToOne(() => Difficulty, (difficulty) => difficulty.books, {
        eager: true,
        onDelete: "SET NULL"
    }),
    JoinColumn({ name: "difficultyId" }),
    __metadata("design:type", Object)
], Book.prototype, "difficulty", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Book.prototype, "languageId", void 0);
__decorate([
    ManyToOne(() => Language, (language) => language.books, {
        eager: true,
        onDelete: "SET NULL"
    }),
    JoinColumn({ name: "languageId" }),
    __metadata("design:type", Object)
], Book.prototype, "language", void 0);
__decorate([
    OneToMany(() => BookReview, (review) => review.book),
    __metadata("design:type", Object)
], Book.prototype, "reviews", void 0);
Book = __decorate([
    Entity({ name: "books" })
], Book);
export { Book };
