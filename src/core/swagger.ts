import {Express} from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express"
import {apiReference} from "@scalar/express-api-reference";

const PORT = process.env.PORT

export function setupSwagger(app: Express) {
    const options: swaggerJsdoc.Options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "UzChess API",
                version: "1.0.0",
                description: "Books & Courses backend API"
            },
            servers: [
                {
                    url: `http://localhost:${PORT}`,
                    description: "Local server"
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
            }
        },

        apis: [
            "./src/features/**/*.controller.ts",
            "./dist/features/**/*.controller.js"
        ]
    };

    const swaggerSpec = swaggerJsdoc(options);

    // Swagger UI
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    // Scalar API Reference
    app.use("/api-docs", apiReference({url: "/openapi.json"}));

    // Serve OpenAPI spec
    app.get("/openapi.json", (req, res) => {
        res.json(swaggerSpec);
    });
}
