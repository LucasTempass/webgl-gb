import { AnimationSchema } from "@/app/_lib/schema.ts";
import { Transformation } from "@/app/_lib/types/Transformation.ts";

export function applyAnimation(
  animation: AnimationSchema,
  transformation: Transformation,
) {
  const t = (performance.now() % animation.duration) / animation.duration;
  const interpolatedT = interpolate(t, animation.type);
  const endFrame = animation.end;
  const startFrame = animation.start;

  const elapsedTime = performance.now();

  if (elapsedTime > animation.duration) {
    return;
  }

  if (startFrame.translation && endFrame.translation) {
    transformation.translation.x =
      startFrame.translation.x +
      interpolatedT * (endFrame.translation.x - startFrame.translation.x);
    transformation.translation.y =
      startFrame.translation.y +
      interpolatedT * (endFrame.translation.y - startFrame.translation.y);
    transformation.translation.z =
      startFrame.translation.z +
      interpolatedT * (endFrame.translation.z - startFrame.translation.z);
  }

  if (startFrame.rotation && endFrame.rotation) {
    transformation.rotation.x =
      startFrame.rotation.x +
      interpolatedT * (endFrame.rotation.x - startFrame.rotation.x);
    transformation.rotation.y =
      startFrame.rotation.y +
      interpolatedT * (endFrame.rotation.y - startFrame.rotation.y);
    transformation.rotation.z =
      startFrame.rotation.z +
      interpolatedT * (endFrame.rotation.z - startFrame.rotation.z);
  }
}

function interpolate(t: number, type: string): number {
  switch (type) {
    case "bezier":
      return 3 * t * t - 2 * t * t * t;
    case "easeIn":
      return t * t;
    case "linear":
    default:
      return t;
  }
}
