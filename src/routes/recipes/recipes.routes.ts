import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["Recipes"];

const list = createRoute({
  method: "get",
  path: "/recipes",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(z.string()), "List of recipes"),
  },

});

type ListRoute = typeof list;

export { list };
export type { ListRoute };
