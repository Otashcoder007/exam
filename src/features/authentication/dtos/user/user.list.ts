import {Expose} from "class-transformer";

@Expose()
export class UserList {
    id!: number;

    fullName!: string;

    login!: string;

    image?: string;
}