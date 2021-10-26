import "../typeorm/index";
import express, { NextFunction, Response, Request } from "express";
// import swaggerUi from "swagger-ui-express";

import { AppError } from "../../../errors/AppError";

// import "@shared/container";

// import swaggerFile from "../../../swagger.json";
// import { router } from "./routes";

const app = express();

app.use(express.json());

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
