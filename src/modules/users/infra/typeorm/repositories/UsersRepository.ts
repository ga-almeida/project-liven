import { getRepository, Repository } from "typeorm";

import { CreateUserDTO } from "../../../dtos/CreateUserDTO";
import { UpdateUserDTO } from "../../../dtos/UpdateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return this.repository.findOne({
      where: {
        username,
      },
    });
  }

  async create({
    email,
    name,
    password,
    username,
  }: CreateUserDTO): Promise<User> {
    const userCreated = this.repository.create({
      email,
      name,
      password,
      username,
    });

    const userSave = await this.repository.save(userCreated);

    return userSave;
  }

  findById(id: string): Promise<User> {
    return this.repository.findOne(id);
  }

  async update({
    email,
    id,
    name,
    password,
    username,
  }: UpdateUserDTO): Promise<User> {
    const updateUser = await this.repository.save({
      email,
      id,
      name,
      password,
      username,
    });

    return updateUser;
  }
}

export { UsersRepository };
