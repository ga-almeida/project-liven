import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../shared/infra/http/app";
import createConnection from "../../../../shared/infra/typeorm/index";

let connection: Connection;

let user_test;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user_test = {
      email: "jhondoe@test.com.br",
      name: "Jhon Doe",
      password: "1234",
      username: "jhondoe",
    };

    await request(app).post("/users").send(user_test);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user", async () => {
    const response = await request(app).post("/sessions").send({
      email: user_test.email,
      password: user_test.password,
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate user does not exists", async () => {
    const response = await request(app).post("/sessions").send({
      email: "email_invalid",
      password: user_test.password,
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate user password invalid", async () => {
    const response = await request(app).post("/sessions").send({
      email: user_test.email,
      password: "password_invalid",
    });

    expect(response.status).toBe(401);
  });
});
