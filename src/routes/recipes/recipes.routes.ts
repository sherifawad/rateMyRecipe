import type { MiddlewareHandler } from "hono";

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import type { AppBindings } from "@/lib/types";

import { insertRecipesSchema, patchRecipesSchema, selectRecipesSchema } from "@/db/validator";
import { forbiddenSchema, notFoundSchema } from "@/lib/constants";
import { requireRole } from "@/middlewares/authorization";

const tags = ["Recipes"];

const list = createRoute({
  method: "get",
  path: "/recipes",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRecipesSchema.array(), "List of recipes"),
  },

});

const getOneRecipe = createRoute({
  method: "get",
  path: "/recipes/{id}",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRecipesSchema, "The Requested recipe"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Recipe not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid Id error"),
  },
});

const createRecipe = createRoute({
  method: "post",
  path: "/recipes",
  tags,
  request: {
    body: jsonContentRequired(insertRecipesSchema, "The recipe to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRecipesSchema, "Created recipe"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertRecipesSchema), "Validation errors"),
  },
});

const patchRecipe = createRoute({
  method: "patch",
  path: "/recipes/{id}",
  tags,
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchRecipesSchema, "The recipe to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectRecipesSchema, "updated recipe"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Recipe not found"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(patchRecipesSchema).or(createErrorSchema(IdParamsSchema)), "Validation errors"),
  },
});

const removeRecipe = createRoute({
  path: "/recipes/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  middleware: [requireRole("admin")] as const,
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Recipe deleted",
    },
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      forbiddenSchema,
      "user does not have permission to delete recipe",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Recipe not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

type ListRoute = typeof list;
type CreateRecipeRoute = typeof createRecipe;
type GetOneRecipeRoute = typeof getOneRecipe;
type PatchRecipeRoute = typeof patchRecipe;
type RemoveRecipeRoute = typeof removeRecipe ;

export { createRecipe, getOneRecipe, list, patchRecipe, removeRecipe };
export type { CreateRecipeRoute, GetOneRecipeRoute, ListRoute, PatchRecipeRoute, RemoveRecipeRoute };
