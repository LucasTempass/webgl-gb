"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ScenePicker } from "@/app/_components/ScenePicker";
import { parseSimpleObjects } from "@/app/_lib/objects/parser.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { Scene } from "@/app/_lib/parseScene.ts";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [scene, setScene] = useState<Scene | null>(null);

  const models = useMemo(() => {
    if (!scene) return [];

    const object = scene.objects[0];

    if (!object) return [];

    return parseSimpleObjects(object);
  }, [scene]);

  const meshes: Mesh[] = useMemo(
    () => models.map((model) => new Mesh(model)),
    [models],
  );

  if (!scene) {
    return <ScenePicker onChange={(v) => setScene(v)} />;
  }

  return (
    <div>
      <CanvasLazy
        onReset={() => setScene(null)}
        cameraPosition={scene.cameraPosition}
        meshes={meshes}
      />
    </div>
  );
}
