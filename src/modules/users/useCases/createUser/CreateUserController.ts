import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const teste = container.resolve(CreateUserUseCase);

    const res = await teste.execute();

    return response.status(201).json(res);
  }
}

export { CreateUserController };
