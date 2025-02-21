import type { Context, MiddlewareHandler, Next } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { JwtPayload } from "@/lib/authentication/validator";
import type { AppBindings } from "@/lib/types";

function requireRole(role: JwtPayload["role"]): MiddlewareHandler<AppBindings> {
  return async (c: Context<AppBindings>, next: Next) => {
    const user = c.var.user;
    if (!user || user.role !== role) {
      return c.json({ error: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
    }
    await next();
  };
}

export { requireRole };
