import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../infra/typeorm/entities/User";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let user: User;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    user = new User();

    Object.assign(user, {
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });
  });

  it("should be able to create a new user", async () => {
    const newUser = await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    expect(newUser).toHaveProperty("id");
  });

  it("should not be able to create a new user when email already exists", async () => {
    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    await expect(
      createUserUseCase.execute({
        email: user.email,
        name: "User Test Email Already Exists",
        password: "userTesPasswordEmailAlreadyExists",
        username: "userTestUsernameEmailAlreadyExists",
      })
    ).rejects.toEqual(new AppError("User with email already exists!"));
  });

  it("should not be able to create a new user when username already exists", async () => {
    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    await expect(
      createUserUseCase.execute({
        email: "user@testUsername.com.br",
        name: "User Test Username Already Exists",
        password: "userTesPasswordUsernameAlreadyExists",
        username: "userTestUsername",
      })
    ).rejects.toEqual(new AppError("User with usarname already exists!"));
  });
});
