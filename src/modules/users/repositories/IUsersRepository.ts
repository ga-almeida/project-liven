import { CreateUserDTO } from "../dtos/CreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  create(data: CreateUserDTO): Promise<User>;
}

export { IUsersRepository };
