import { z } from "zod";

const jwtPayloadSchema = z.object({
  sub: z.number(),
  username: z.string(),
  role: z.enum(["user", "admin"]),
  exp: z.number().refine(val => val > Date.now() / 1000, {
    message: "expired",
  }),
});

type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export type { JwtPayload };
export { jwtPayloadSchema };
