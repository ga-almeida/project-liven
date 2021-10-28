import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../infra/typeorm/entities/User";
import { FakeHashProvider } from "../../providers/HashProvider/fakes/FakeHashProvider";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

let updateUserUseCase: UpdateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let fakeHashProvider: FakeHashProvider;
let user: User;

describe("Update User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeHashProvider = new FakeHashProvider();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider
    );
    updateUserUseCase = new UpdateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider
    );
    user = new User();

    Object.assign(user, {
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });
  });

  it("should be able to update an user", async () => {
    const newUser = await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    const updateUser = await updateUserUseCase.execute({
      id: newUser.id,
      email: user.email,
      name: "userNewNameTest",
      password: user.password,
      username: user.username,
    });

    expect(newUser.id).toBe(updateUser.id);
    expect(updateUser.name).toBe("userNewNameTest");
  });

  it("should not be able to update a user when email already exists", async () => {
    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    const updateUser = await createUserUseCase.execute({
      email: "email2@test.com.br",
      name: "name2",
      password: "password2",
      username: "username2",
    });

    await expect(
      updateUserUseCase.execute({
        id: updateUser.id,
        email: user.email,
        name: "User Test Email Already Exists",
        password: "userTesPasswordEmailAlreadyExists",
        username: "userTestUsernameEmailAlreadyExists",
      })
    ).rejects.toEqual(new AppError("User with email already exists!"));
  });

  it("should not be able to update a user when username already exists", async () => {
    await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
    });

    const updateUser = await createUserUseCase.execute({
      email: "email2@test.com.br",
      name: "name2",
      password: "password2",
      username: "username2",
    });

    await expect(
      updateUserUseCase.execute({
        id: updateUser.id,
        email: "user@testUsername.com.br",
        name: "User Test Username Already Exists",
        password: "userTesPasswordUsernameAlreadyExists",
        username: "userTestUsername",
      })
    ).rejects.toEqual(new AppError("User with usarname already exists!"));
  });
});
