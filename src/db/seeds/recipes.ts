import type { Db } from "@/db";

import * as schema from "@/db/schema";

import recipes from "./data/recipes.json";

export default async function seedRecipes(db: Db) {
  const users = await db.select().from(schema.users);

  await Promise.all(
    recipes.map(async (recipe) => {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      const createdByUser = users[randomUserIndex];

      await db
        .insert(schema.recipes)
        .values({
          ...recipe,
          createdBy: createdByUser.id,
        });
    }),
  );
}
