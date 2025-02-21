import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ZodIssueCode } from "zod";

import db from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/db/seeds/users";
import env from "@/env";
import createApp from "@/lib/create-app";

import router from "./accounts.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}
const client = testClient(createApp().route("/", router));

describe("account route", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
    await db.insert(users).values({
      id: 1,
      username: "test",
      password: await hashPassword("test_test"),
    });
  });
  afterAll(async () => {
    await db.delete(users);
  });
  it("login login with wrong username", async () => {
    const response = await client.login.$post({
      json: { username: "wrong", password: "test_test" },
    });
    const json = await response.json();
    expect(response.status).toBe(HttpStatusCodes.NOT_FOUND);
    expect(json).toMatchObject({
      message: HttpStatusPhrases.NOT_FOUND,
    });
  });
  it("login login with wrong password", async () => {
    const response = await client.login.$post({

      json: { username: "test", password: "wrong_Wrong" },
    });
    const json = await response.json();
    expect(response.status).toBe(HttpStatusCodes.UNAUTHORIZED);
    expect(json).toMatchObject({
      message: HttpStatusPhrases.UNAUTHORIZED,
    });
  });

  it("should return a token", async () => {
    const response = await client.login.$post({
      json: { username: "test", password: "test_test" },
    });
    const json = await response.json();
    expect(response.status).toBe(HttpStatusCodes.OK);
    expect(json).toMatchObject({
      token: expect.any(String),
    });
  });

  it("should return  a validation error when the the username is empty", async () => {
    const response = await client.login.$post({
      json: { username: "", password: "test_test" },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    if (response.status === HttpStatusCodes.UNPROCESSABLE_ENTITY) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("username");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it("should return  a validation error when the the password is less than 8 characters", async () => {
    const response = await client.login.$post({
      json: { username: "test", password: "test" },
    });
    expect(response.status).toBe(HttpStatusCodes.UNPROCESSABLE_ENTITY);
    if (response.status === HttpStatusCodes.UNPROCESSABLE_ENTITY) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("password");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });
});
