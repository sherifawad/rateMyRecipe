import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { loginSchema, tokenSchema } from "@/lib/authentication/validator";
import { loggingOutSchema, notFoundSchema, unAuthorizedSchema } from "@/lib/constants";

const tags = ["Account"];

const login = createRoute({
  method: "post",
  path: "/login",
  tags,
  request: {
    body: jsonContentRequired(loginSchema, "The user to login"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(tokenSchema, "The token"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(loginSchema), "Validation errors"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(unAuthorizedSchema, "Validation errors"),
  },
});

const logout = createRoute({
  method: "post",
  path: "/logout",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      loggingOutSchema,
      "Logged out",
    ),
  },
});

type LoginRoute = typeof login;
type LogoutRoute = typeof logout;

export type { LoginRoute, LogoutRoute };

export { login, logout };
