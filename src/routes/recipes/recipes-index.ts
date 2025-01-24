import { createRouter } from "@/lib/create-app";

import * as handlers from "./recipes.handlers";
import * as routes from "./recipes.routes";

const router = createRouter().openapi(routes.list, handlers.list);

export default router;
