import type { z } from "zod";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { recipes } from "@/db/schema";

import { selectRecipeLikesSchema } from "./recipe-likes";
import { selectUserWithRecipesSchema } from "./user";

const selectRecipesSchema = createSelectSchema(recipes);

const insertRecipesSchema = createInsertSchema(
  recipes,
  {
    title: schema => schema.min(1).max(255),
    description: schema => schema.min(1),
    createdBy: schema => schema.int().positive(),
    updatedBy: schema => schema.int().optional(),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const patchRecipesSchema = insertRecipesSchema.partial();

const selectRecipesWithUsersSchema = selectRecipesSchema.extend({
  createdBy: selectUserWithRecipesSchema,
  updatedBy: selectUserWithRecipesSchema.optional(),
  recipeLikes: selectRecipeLikesSchema.pick({ userId: true }).array().optional(),
});

export { insertRecipesSchema, patchRecipesSchema, selectRecipesSchema, selectRecipesWithUsersSchema };

export type Recipe = z.infer<typeof selectRecipesWithUsersSchema>;
