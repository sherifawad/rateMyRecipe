import type { Db } from "@/db";
import type { Recipe, User } from "@/db/validator";

import * as schema from "@/db/schema";

export function generateLikes(users: User[], recipes: Omit<Recipe, "createdBy" | "updatedBy">[]): { userId: number; recipeId: number }[] {
  const likes: { userId: number; recipeId: number }[] = [];

  for (const recipe of recipes) {
    const numberOfLikes = Math.floor(Math.random() * users.length);
    const likedUsersSet = new Set<number>();

    while (likedUsersSet.size < numberOfLikes) {
      const randomUserIndex = Math.floor(Math.random() * users.length);
      likedUsersSet.add(users[randomUserIndex].id);
    }

    for (const userId of likedUsersSet) {
      likes.push({ userId, recipeId: recipe.id });
    }
  }

  return likes;
}

export default async function seedLikes(db: Db) {
  // Fetch users and recipes from the database
  const users = await db.select().from(schema.users);
  const recipes = await db.select().from(schema.recipes);

  // Generate likes using fetched users and recipes
  const likes = generateLikes(users, recipes);

  // Insert the likes into the database
  await db.insert(schema.recipeLikes).values(likes);

  return likes;
}
