import type { JwtPayload } from "@/lib/authentication/validator";

import * as argon2 from "argon2";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import env from "@/env";
import { LOGOUT_MESSAGES } from "@/lib/constants";

import type { LoginRoute, LogoutRoute } from "./accounts.routes";

const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { username, password } = c.req.valid("json");
  ;
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.username, username);
    },
  });
  if (!user) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }
  const passwordMatch = await argon2.verify(user.password, password);
  if (!passwordMatch) {
    return c.json({
      message: HttpStatusPhrases.UNAUTHORIZED,
    }, HttpStatusCodes.UNAUTHORIZED);
  }

  const payload: JwtPayload = {
    sub: user.id,
    username: user.username,
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };
  const token = await sign(payload, env.JWT_SECRET);
  setCookie(c, "auth_token", token, {
    secure: true,
    httpOnly: true,
  });
  return c.json({
    token,
  }, HttpStatusCodes.OK);
};

const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  deleteCookie(c, "auth_token");
  return c.json({
    message: LOGOUT_MESSAGES.success,
  }, HttpStatusCodes.OK);
};

export { login, logout };
