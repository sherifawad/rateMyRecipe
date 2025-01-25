import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import recipeLikes from "./recipe-likes";
import recipes from "./recipes";

const users = sqliteTable("users", {
  id: integer("id", { mode: "number" })
    .primaryKey({ autoIncrement: true })
    .unique(),
  username: text("username", { length: 255 }).notNull().unique(),
  password: text("password", { length: 255 }).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(() => new Date()),
});

const userRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  recipeLikes: many(recipeLikes),
}));

export { userRelations };

export default users;
