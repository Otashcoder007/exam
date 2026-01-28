import "dotenv/config";
import "reflect-metadata";
import {AppDataSource} from "./core/data-source.js";
import express from "express";
import {setupSwagger} from "./core/swagger.js";
import {user} from "./features/authentication/controllers/user.controller.js";


await AppDataSource.initialize();

const app = express();

app.use(express.json());
app.use(user);

setupSwagger(app);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is up and running... you can use it in http://localhost:${PORT}/docs/`));
