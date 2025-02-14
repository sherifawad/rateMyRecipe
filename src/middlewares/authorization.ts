import type { Context, Next } from "hono";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { JwtPayload } from "@/lib/authentication/validator";

function requireRole(role: JwtPayload["role"]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user || user.role !== role) {
      return c.json({ error: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
    }

    await next();
  };
}

export { requireRole };
