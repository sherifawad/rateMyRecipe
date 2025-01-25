import db from "@/db";
import * as schema from "@/db/schema";

import * as seeds from "./seeds";

for (const table of [
  schema.users,
  schema.recipes,
  schema.recipeLikes,
]) {
  await db.delete(table);
}

await seeds.user(db);
await seeds.recipe(db);
await seeds.recipeLikes(db);
