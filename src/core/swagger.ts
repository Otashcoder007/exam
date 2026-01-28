import swaggerJsDoc, {Options} from "swagger-jsdoc";
import {Express} from "express";
import swaggerUI from "swagger-ui-express";

const PORT = process.env.PORT;
export function setupSwagger(app: Express) {
    const options: Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "NewLesson410",
                version: "v1.0.0",
                description: "API Documentation for NewLesson410"
            },
            servers: [
                {
                    url: `http://localhost:${PORT}`
                }
            ],
            components: {
                securitySchemes: {
                    Bearer: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                }
            },
        },
        apis: ['src/features/**/*.controller.ts']
    }

    const swaggerSpec = swaggerJsDoc(options);

    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}