import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";
import { ZodIssueCode } from "zod";

import type { InsertRecipe } from "@/db/validator";

import db from "@/db";
import { recipes, users } from "@/db/schema";
import { hashPassword } from "@/db/seeds/users";
import env from "@/env";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import createApp from "@/lib/create-app";

import router from "./recipes-index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/", router));

describe("recipes routes", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
    await db.insert(users).values({
      id: 1,
      username: "test",
      password: await hashPassword("test_test"),
    });
  });
  afterAll(async () => {
    await db.delete(recipes);
    await db.delete(users);
    await db.run("DELETE FROM sqlite_sequence WHERE name='recipes'");
  });
  it("post /recipes validates the body when creating", async () => {
    const response = await client.recipes.$post({
      // @ts-expect-error - this is a test
      json: {
        title: "recipeTestTitle",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("description");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  const recipeId = 1;

  const recipe: InsertRecipe = {
    title: "recipeTestTitle",
    description: "recipeTestDescription",
    createdBy: 1,

  };
  it("post /Recipes creates a recipe", async () => {
    const response = await client.recipes.$post({
      json: recipe,
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.title).toBe(recipe.title);
      expect(json.description).toBe(recipe.description);
      expect(json.createdBy).toBe(recipe.createdBy);
    }
  });

  it("get /Recipes lists all recipes", async () => {
    const response = await client.recipes.$get();
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toBeArray();
      expect(json.length).toBe(1);
    }
  });

  it("get /recipes/{id} validates the id param", async () => {
    const response = await client.recipes[":id"].$get({
      param: {
        // @ts-expect-error - this is a test
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /recipes/{id} returns 404 when task not found", async () => {
    const response = await client.recipes[":id"].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /recipes/{id} gets a single task", async () => {
    const response = await client.recipes[":id"].$get({
      param: {
        id: recipeId,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.title).toBe(recipe.title);
      expect(json.description).toBe(recipe.description);
      expect(json.createdBy).toBe(recipe.createdBy);
    }
  });

  it("patch /recipes/{id} validates the body when updating", async () => {
    const response = await client.recipes[":id"].$patch({
      param: {
        id: recipeId,
      },
      json: {
        title: "",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("title");
      expect(json.error.issues[0].code).toBe(ZodIssueCode.too_small);
    }
  });

  it("patch /recipes/{id} validates the id param", async () => {
    const response = await client.recipes[":id"].$patch({
      param: {
        // @ts-expect-error - this is a test
        id: "wat",
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("patch /recipes/{id} validates empty body", async () => {
    const response = await client.recipes[":id"].$patch({
      param: {
        id: recipeId,
      },
      json: {},
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].code).toBe(ZOD_ERROR_CODES.INVALID_UPDATES);
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.NO_UPDATES);
    }
  });

  it("patch /recipes/{id} updates a single property of a task", async () => {
    const response = await client.recipes[":id"].$patch({
      param: {
        id: recipeId,
      },
      json: {
        title: "newTitle",
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.title).toBe("newTitle");
    }
  });

  it("delete /recipes/{id} validates the id when deleting", async () => {
    const response = await client.recipes[":id"].$delete({
      param: {
        // @ts-expect-error - this is a test
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("delete /recipes/{id} can note removes a task for a non user", async () => {
    const response = await client.recipes[":id"].$delete({
      param: {
        id: recipeId,
      },
    });
    expect(response.status).toBe(HttpStatusCodes.FORBIDDEN);
    if (response.status === HttpStatusCodes.FORBIDDEN) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.FORBIDDEN);
    }
  });
});
