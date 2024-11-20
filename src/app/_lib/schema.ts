import { z } from "zod";

const objectSchema = z.object({
  name: z.string(),
  file: z.string(),
});

export const schema = z.object({
  objects: z.array(objectSchema),
});
