import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    email,
    name,
    password,
    username,
  }: CreateUserDTO): Promise<User> {
    const userByEmailExists = await this.usersRepository.findByEmail(email);

    if (userByEmailExists) {
      throw new AppError("User with email already exists!");
    }

    const userByUsernameExists = await this.usersRepository.findByUsername(
      username
    );

    if (userByUsernameExists) {
      throw new AppError("User with usarname already exists!");
    }

    const userSaved = await this.usersRepository.create({
      email,
      name,
      password,
      username,
    });

    return userSaved;
  }
}

export { CreateUserUseCase };
