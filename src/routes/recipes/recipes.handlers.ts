import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { recipes } from "@/db/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { CreateRecipeRoute, GetOneRecipeRoute, ListRoute, PatchRecipeRoute, RemoveRecipeRoute } from "./recipes.routes";

const list: AppRouteHandler<ListRoute> = async (c) => {
  const recipes = await db.query.recipes.findMany();
  return c.json(recipes);
};
const getOneRecipe: AppRouteHandler<GetOneRecipeRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const recipe = await db.query.recipes.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
  if (!recipe) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(recipe, HttpStatusCodes.OK);
};

const createRecipe: AppRouteHandler<CreateRecipeRoute> = async (c) => {
  const recipe = c.req.valid("json");
  const [createdRecipe] = await db.insert(recipes).values(recipe).returning();
  return c.json(createdRecipe, HttpStatusCodes.OK);
};

const patchRecipe: AppRouteHandler<PatchRecipeRoute> = async (c) => {
  const updates = c.req.valid("json");
  const { id } = c.req.valid("param");
  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
  const [updatedRecipe] = await db.update(recipes).set(updates).where(eq(recipes.id, id)).returning();
  if (!updatedRecipe) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(updatedRecipe, HttpStatusCodes.OK);
};
const removeRecipe: AppRouteHandler<RemoveRecipeRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const result = await db.delete(recipes).where(eq(recipes.id, id));
  if (result.rowsAffected === 0) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export { createRecipe, getOneRecipe, list, patchRecipe, removeRecipe };
