"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ScenePicker } from "@/app/_components/ScenePicker";
import { parseSimpleObjects } from "@/app/_lib/objects/parser.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { Scene } from "@/app/_lib/parseScene.ts";
import { ObjModel } from "obj-file-parser";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [scene, setScene] = useState<Scene | null>(null);

  const models: ObjModel[] = useMemo(() => {
    if (!scene) return [];

    const models: ObjModel[][] = scene.objects.map((v) =>
      parseSimpleObjects(v),
    );

    return models.flat();
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
