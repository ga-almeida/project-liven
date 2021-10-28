import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, name, password, username }: CreateUserDTO = request.body;
    const { id } = request.params;

    const createUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await createUserUseCase.execute({
      email,
      name,
      password,
      username,
      id,
    });

    return response.status(200).json(user);
  }
}

export { UpdateUserController };
