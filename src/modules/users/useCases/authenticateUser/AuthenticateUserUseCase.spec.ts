import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../infra/typeorm/entities/User";
import { FakeHashProvider } from "../../providers/HashProvider/fakes/FakeHashProvider";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let fakeHashProvider: FakeHashProvider;
let user: User;

describe("Authenticate User", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider
    );
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory,
      fakeHashProvider
    );

    user = await createUserUseCase.execute({
      username: "jhondoe",
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
    });
  });

  it("should be able authenticate user", async () => {
    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able authenticate user with email invalid", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email-invalid",
        password: "1234",
      });
    }).rejects.toEqual(new AppError("Incorrect email or password", 401));
  });

  it("should not be able authenticate user with password invalid", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "password-invalid",
      });
    }).rejects.toEqual(new AppError("Incorrect email or password", 401));
  });
});
