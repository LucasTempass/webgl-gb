import { z } from "zod";

const point3dSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const transformationSchema = z.object({
  rotation: point3dSchema,
  translation: point3dSchema,
  scale: z.number(),
});

const keyframeSchema = z.object({
  rotation: point3dSchema.optional(),
  translation: point3dSchema.optional(),
});

const animationSchema = z.object({
  type: z.string(),
  duration: z.number(),
  start: keyframeSchema,
  end: keyframeSchema,
});

export type AnimationSchema = z.infer<typeof animationSchema>;

const materialSchema = z.object({
  texture: z.string(),
  ka: z.number(),
  ks: z.number(),
  kd: z.number(),
});

export type MaterialSchema = z.infer<typeof materialSchema>;

const objectSchema = z.object({
  name: z.string(),
  transformation: transformationSchema,
  material: materialSchema,
  file: z.string(),
  animation: animationSchema.optional(),
});

export type ObjectSchema = z.infer<typeof objectSchema>;

export const schema = z.object({
  objects: z.array(objectSchema),
  camera: z.object({
    position: z.tuple([z.number(), z.number(), z.number()]),
  }),
  light: z.object({
    position: z.tuple([z.number(), z.number(), z.number()]),
  }),
});

export type SceneSchema = z.infer<typeof schema>;
