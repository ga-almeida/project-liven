import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import authConfig from "../../../../config/auth";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserDTO } from "../../dtos/AuthenticateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IHashProvider } from "../../providers/HashProvider/IHashProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";

type AuthenticateUserResponseDTO = {
  token: string;
  user: Pick<User, "id" | "email" | "username">;
};

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserDTO): Promise<AuthenticateUserResponseDTO> {
    const userByEmailExists = await this.usersRepository.findByEmail(email);

    if (!userByEmailExists) {
      throw new AppError("Incorrect email or password!", 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      userByEmailExists.password
    );

    if (!passwordMatch) {
      throw new AppError("Incorrect email or password!", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ userByEmailExists }, secret, {
      subject: userByEmailExists.id,
      expiresIn,
    });

    return {
      user: {
        id: userByEmailExists.id,
        username: userByEmailExists.username,
        email: userByEmailExists.email,
      },
      token,
    };
  }
}

export { AuthenticateUserUseCase };
