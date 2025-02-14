import { z } from "zod";

import { selectUsersSchema } from "@/db/validator";

const loginSchema = z.object({
  username: selectUsersSchema.shape.username.min(1),
  password: selectUsersSchema.shape.password.min(8),
});

const tokenSchema = z.object({
  token: z.string(),
});
export { loginSchema, tokenSchema };
