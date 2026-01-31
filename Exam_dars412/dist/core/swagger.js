import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const PORT = process.env.PORT;
export function setupSwagger(app) {
    const Options = swaggerJsdoc({
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Library API",
                version: "1.0.0",
            },
            servers: [{ url: `http://localhost:${PORT}` }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },
        },
        apis: [
            "./src/features/**/*.controller.ts",
            "./dist/features/**/*.controller.js"
        ],
    });
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(Options, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    }));
}
