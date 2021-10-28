import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm";

let connection: Connection;
let userId: string;

describe("Update User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    userId = uuidv4();
    const name = "User Test";
    const email = "user@test.com.br";
    const password = "userTesPassword";
    const username = "userTestUsername";

    const sql = `INSERT INTO USERS(id, name, email, password, username) 
                values ('${userId}', '${name}', '${email}', '${password}', '${username}')`;

    await connection.query(sql);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to update a user", async () => {
    const responseUpdate = await request(app).put(`/users/${userId}`).send({
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

    const responseUpdate = await request(app).put(`/users/${userId}`).send({
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

    const responseUpdate = await request(app).put(`/users/${userId}`).send({
      email: "user@testUsernameAlreadyExists.com.br",
      name: "User Test 2",
      password: "userTesPassword2",
      username: "userTestUsername2",
    });

    expect(responseUpdate.status).toBe(400);
  });
});
