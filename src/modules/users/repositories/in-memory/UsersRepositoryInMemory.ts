import { v4 as uuidv4 } from "uuid";

import { CreateUserDTO } from "../../dtos/CreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async findByUsername(username: string): Promise<User> {
    return this.users.find((user) => user.username === username);
  }

  async create({
    email,
    name,
    password,
    username,
  }: CreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, {
      id: uuidv4(),
      email,
      name,
      password,
      username,
    });

    this.users.push(newUser);

    return newUser;
  }
}

export { UsersRepositoryInMemory };
