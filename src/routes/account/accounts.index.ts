import { createRouter } from "@/lib/create-app";

import * as accountsHandlers from "./accounts.handlers";
import * as accountsRoutes from "./accounts.routes";

const router = createRouter().openapi(accountsRoutes.login, accountsHandlers.login).openapi(accountsRoutes.logout, accountsHandlers.logout);

export default router;
