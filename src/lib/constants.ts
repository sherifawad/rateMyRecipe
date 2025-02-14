import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const LOGIN_ERROR_MESSAGES = {
  INVALID_USERNAME: "Invalid username",
  INVALID_PASSWORD: "Invalid password",
};

export const JWT_ERROR_MESSAGES = {
  INVALID_TOKEN: "Invalid token",
  EXPIRED_TOKEN: "Expired token",
};

export const LOGOUT_MESSAGES = {
  success: "Logout success",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
export const unAuthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED);
export const forbiddenSchema = createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN);
export const loggingOutSchema = createMessageObjectSchema(LOGOUT_MESSAGES.success);
