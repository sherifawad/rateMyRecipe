import { createRouter } from "@/lib/create-app";

import * as handlers from "./recipes.handlers";
import * as routes from "./recipes.routes";

const router = createRouter().openapi(routes.list, handlers.list).openapi(routes.createRecipe, handlers.createRecipe).openapi(routes.getOneRecipe, handlers.getOneRecipe).openapi(routes.patchRecipe, handlers.patchRecipe).openapi(routes.removeRecipe, handlers.removeRecipeHandler);

export default router;
