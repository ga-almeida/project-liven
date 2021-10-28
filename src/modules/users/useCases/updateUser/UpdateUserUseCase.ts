import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { UpdateUserDTO } from "../../dtos/UpdateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    email,
    name,
    password,
    username,
    id,
  }: UpdateUserDTO): Promise<User> {
    const userByEmailExists = await this.usersRepository.findByEmail(email);

    if (userByEmailExists && userByEmailExists.id !== id) {
      throw new AppError("User with email already exists!");
    }

    const userByUsernameExists = await this.usersRepository.findByUsername(
      username
    );

    if (userByUsernameExists && userByUsernameExists.id !== id) {
      throw new AppError("User with usarname already exists!");
    }

    const userSaved = await this.usersRepository.update({
      email,
      name,
      password,
      username,
      id,
    });

    return userSaved;
  }
}

export { UpdateUserUseCase };
