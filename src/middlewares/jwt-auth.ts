import type { Context, Next } from "hono";

import { verify } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import env from "@/env";
import { JWT_ERROR_MESSAGES } from "@/lib/constants";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = await verify(token, env.JWT_SECRET);
    c.set("user", payload);
    await next();
  }
  catch {
    return c.json({ error: JWT_ERROR_MESSAGES.INVALID_TOKEN }, HttpStatusCodes.UNAUTHORIZED);
  }
}
