import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  findById(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}

export { UsersRepository };
