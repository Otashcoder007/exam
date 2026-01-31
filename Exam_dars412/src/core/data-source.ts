import {DataSource} from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_URL,
    synchronize: true,
    logger: "formatted-console",
    logging: true,
    entities: ["dist/**/*.entity.js"],
});
