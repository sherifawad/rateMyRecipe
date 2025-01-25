import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

import recipes from "./recipes";
import users from "./user";

const recipeLikes = sqliteTable("recipe_likes", {
  userId: integer("user_id").notNull().references(() => users.id),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
}, table => [primaryKey({ columns: [table.userId, table.recipeId] })]);

const recipeLikesRelations = relations(recipeLikes, ({ one }) => ({
  user: one(users, {
    fields: [recipeLikes.userId],
    references: [users.id],
  }),
  recipe: one(recipes, {
    fields: [recipeLikes.recipeId],
    references: [recipes.id],
  }),
}));

export { recipeLikesRelations };

export default recipeLikes;
