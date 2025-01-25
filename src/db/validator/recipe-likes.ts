import type { z } from "zod";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { recipeLikes } from "@/db/schema";

const insertRecipeLikesSchema = createInsertSchema(recipeLikes, {
  userId: schema => schema.int().positive(),
  recipeId: schema => schema.int().positive(),
});

const selectRecipeLikesSchema = createSelectSchema(recipeLikes);

export { insertRecipeLikesSchema, selectRecipeLikesSchema };

export type RecipeLike = z.infer<typeof selectRecipeLikesSchema>;
