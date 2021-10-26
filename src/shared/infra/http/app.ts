import "reflect-metadata";
import "express-async-errors";
import express, { NextFunction, Response, Request } from "express";

import { AppError } from "../../errors/AppError";
import createConnection from "../typeorm";

import "../../container";

import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());
app.use(router);

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
