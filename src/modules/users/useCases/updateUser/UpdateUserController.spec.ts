import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm";

let connection: Connection;

describe("Create User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new user with email already exists", async () => {
    await request(app).post("/users").send({
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });

    const response = await request(app).post("/users").send({
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsernameEmailAlreadyExists",
    });

    expect(response.status).toBe(400);
  });

  it("should not be able to create a new user with username already exists", async () => {
    await request(app).post("/users").send({
      email: "user@test.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });

    const response = await request(app).post("/users").send({
      email: "user@testUsernameAlreadyExists.com.br",
      name: "User Test",
      password: "userTesPassword",
      username: "userTestUsername",
    });

    expect(response.status).toBe(400);
  });
});
