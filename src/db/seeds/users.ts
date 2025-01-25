import * as argon2 from "argon2";

import type { Db } from "@/db";

import * as schema from "@/db/schema";

import users from "./data/users.json";

async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export default async function seedUsers(db: Db) {
  await Promise.all(
    users.map(async (user) => {
      await db
        .insert(schema.users)
        .values({
          ...user,
          password: await hashPassword(user.password),
        });
    }),
  );
}
