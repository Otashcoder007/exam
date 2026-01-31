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
let Difficulty = class Difficulty extends BaseModel {
    name;
    books;
    courses;
};
__decorate([
    Column({ length: 64, unique: true }),
    __metadata("design:type", String)
], Difficulty.prototype, "name", void 0);
__decorate([
    OneToMany(() => Book, (book) => book.difficulty),
    __metadata("design:type", Object)
], Difficulty.prototype, "books", void 0);
__decorate([
    OneToMany(() => Course, (course) => course.difficulty),
    __metadata("design:type", Object)
], Difficulty.prototype, "courses", void 0);
Difficulty = __decorate([
    Entity({ name: "difficulties" })
], Difficulty);
export { Difficulty };
