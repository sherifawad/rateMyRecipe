import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import recipeLikes from "./recipe-likes";
import users from "./user";

const recipes = sqliteTable("recipes", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  title: text("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  updatedBy: integer("updated_by").references(() => users.id),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

const recipeRelations = relations(recipes, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [recipes.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [recipes.updatedBy],
    references: [users.id],
  }),
  likes: many(recipeLikes),
}));

export { recipeRelations };

export default recipes;
