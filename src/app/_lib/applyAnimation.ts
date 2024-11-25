import { AnimationSchema } from "@/app/_lib/schema.ts";
import { Transformation } from "@/app/_lib/types/Transformation.ts";

export function applyAnimation(
  animation: AnimationSchema,
  transformation: Transformation,
) {
  const t = (performance.now() % animation.duration) / animation.duration;
  const endFrame = animation.end;
  const startFrame = animation.start;
  transformation.translation.x =
    startFrame.translation.x +
    t * (endFrame.translation.x - startFrame.translation.x);
  transformation.translation.y =
    startFrame.translation.y +
    t * (endFrame.translation.y - startFrame.translation.y);
  transformation.translation.z =
    startFrame.translation.z +
    t * (endFrame.translation.z - startFrame.translation.z);
  transformation.rotation.x =
    startFrame.rotation.x + t * (endFrame.rotation.x - startFrame.rotation.x);
  transformation.rotation.y =
    startFrame.rotation.y + t * (endFrame.rotation.y - startFrame.rotation.y);
  transformation.rotation.z =
    startFrame.rotation.z + t * (endFrame.rotation.z - startFrame.rotation.z);
  transformation.scale =
    startFrame.scale + t * (endFrame.scale - startFrame.scale);
}
