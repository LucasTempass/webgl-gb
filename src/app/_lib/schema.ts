import { z } from "zod";

const transformationSchema = z.object({
  rotation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  translation: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }),
  scale: z.number(),
});

const objectSchema = z.object({
  name: z.string(),
  transformation: transformationSchema.optional(),
  file: z.string(),
});

export type ObjectSchema = z.infer<typeof objectSchema>;

export const schema = z.object({
  objects: z.array(objectSchema),
  camera: z.object({
    position: z.tuple([z.number(), z.number(), z.number()]),
  }),
});

export type SceneSchema = z.infer<typeof schema>;
