import type { z } from "zod";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { recipes, users } from "@/db/schema";

const selectUsersSchema = createSelectSchema(users);

const insertUsersSchema = createInsertSchema(
  users,
  {
    username: schema => schema.min(1).max(500),
  },
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const patchUsersSchema = insertUsersSchema.partial();

const selectRecipesSchema = createSelectSchema(recipes);

const selectUserWithRecipesSchema = selectUsersSchema.omit({ password: true }).extend({
  recipes: selectRecipesSchema.required({ createdAt: true }).omit({ createdBy: true, updatedBy: true }).array().optional(),
  recipeLikes: selectRecipesSchema.pick({ id: true }).array().optional(),
});

export { insertUsersSchema, patchUsersSchema, selectUsersSchema, selectUserWithRecipesSchema };

export type User = z.infer<typeof selectUserWithRecipesSchema>;
