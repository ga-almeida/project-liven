import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
}

export { IUsersRepository };
