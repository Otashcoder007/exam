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
import { Book } from "./book/book.entity.js";
import { Course } from "./course/course.entity.js";
let Author = class Author extends BaseModel {
    firstName;
    lastName;
    books;
    courses;
};
__decorate([
    Column({ length: 32 }),
    __metadata("design:type", String)
], Author.prototype, "firstName", void 0);
__decorate([
    Column({ length: 32 }),
    __metadata("design:type", String)
], Author.prototype, "lastName", void 0);
__decorate([
    OneToMany(() => Book, (book) => book.author),
    __metadata("design:type", Object)
], Author.prototype, "books", void 0);
__decorate([
    OneToMany(() => Course, (course) => course.author),
    __metadata("design:type", Object)
], Author.prototype, "courses", void 0);
Author = __decorate([
    Entity({ name: "authors" })
], Author);
export { Author };
