"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ScenePicker } from "@/app/_components/ScenePicker";
import { Scene } from "@/app/_lib/parseScene.ts";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [scene, setScene] = useState<Scene | null>(null);

  if (!scene) {
    return <ScenePicker onChange={(v) => setScene(v)} />;
  }

  return (
    <div>
      <CanvasLazy
        onReset={() => setScene(null)}
        cameraPosition={scene.cameraPosition}
        meshes={scene.objects}
      />
    </div>
  );
}
