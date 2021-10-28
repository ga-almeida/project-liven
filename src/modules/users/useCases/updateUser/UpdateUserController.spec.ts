import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm";

let connection: Connection;
let user: {
  name: string;
  email: string;
  password: string;
  username: string;
};

describe("Update User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user = {
      name: "User Test",
      email: "user@test.com.br",
      password: "userTesPassword",
      username: "userTestUsername",
    };

    await request(app).post("/users").send(user);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to update a user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const responseUpdate = await request(app)
      .put(`/users`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: "user@test.com.br",
        name: "User Test 2",
        password: "userTesPassword",
        username: "userTestUsername",
      });

    expect(responseUpdate.status).toBe(200);
  });

  it("should not be able to create a new user with email already exists", async () => {
    await request(app).post("/users").send({
      email: "user@test2.com.br",
      name: "User Test 2",
      password: "userTesPassword2",
      username: "userTestUsername2",
    });

    const responseToken = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const responseUpdate = await request(app)
      .put(`/users`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: "user@test2.com.br",
        name: "User Test 2",
        password: "userTesPassword2",
        username: "userTestUsernameEmailAlreadyExists2",
      });

    expect(responseUpdate.status).toBe(400);
  });

  it("should not be able to create a new user with username already exists", async () => {
    await request(app).post("/users").send({
      email: "user@test2.com.br",
      name: "User Test 2",
      password: "userTesPassword2",
      username: "userTestUsername2",
    });

    const responseToken = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    const { token } = responseToken.body;

    const responseUpdate = await request(app)
      .put(`/users`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        email: "user@testUsernameAlreadyExists.com.br",
        name: "User Test 2",
        password: "userTesPassword2",
        username: "userTestUsername2",
      });

    expect(responseUpdate.status).toBe(400);
  });
});
