import {BaseModel} from "../../../core/base-model.js";
import {Column, Entity} from "typeorm";
import {Roles} from "../../../core/constants/roles.js";


@Entity("users")
export class User extends BaseModel {
    @Column({length: 64})
    fullName!: string;

    @Column({length: 64, unique: true})
    login!: string;

    @Column({length: 128})
    password!: string;

    @Column({length: 128, nullable: true})
    image?: string;

    @Column({type: "enum", enum: Roles, default: Roles.User})
    role!: Roles;
}