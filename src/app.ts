import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import accounts from "@/routes/account/accounts.index";
import index from "@/routes/index.route";
import recipes from "@/routes/recipes/recipes-index";

import { authMiddleware } from "./middlewares/jwt-auth";

const app = createApp();

configureOpenAPI(app);

const protectedRoutes = [recipes] as const;

const publicRoutes = [
  index,
  accounts,
] as const;

publicRoutes.forEach((route) => {
  app.route("/", route);
});
protectedRoutes.forEach((route) => {
  app.use("/", authMiddleware);
  app.route("/", route);
});

export type AppType = typeof publicRoutes[number] & typeof protectedRoutes[number];

export default app;
