import type { AppRouteHandler } from "@/lib/types";

import type { ListRoute } from "./recipes.routes";

const list: AppRouteHandler<ListRoute> = async (c) => {
  const recipes = await new Promise((resolve) => {
    resolve(["Recipe 1", "Recipe 2", "Recipe 3"]);
  }) as string[];
  return c.json(recipes);
};

export { list };
