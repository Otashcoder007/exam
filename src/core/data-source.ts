import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    entities: ["./dist/**/*.entity.js"],
    synchronize: true,
});