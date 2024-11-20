"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ScenePicker } from "@/app/_components/ScenePicker";
import { parseSimpleObjects } from "@/app/_lib/objects/parser.ts";
import Mesh from "@/app/_lib/mesh.ts";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const models = useMemo(() => {
    if (!fileContent) return [];
    return parseSimpleObjects(fileContent);
  }, [fileContent]);

  const meshes: Mesh[] = useMemo(
    () => models.map((model) => new Mesh(model)),
    [models],
  );

  if (!fileContent) {
    return <ScenePicker onChange={(v) => setFileContent(v)} />;
  }

  return (
    <div>
      <CanvasLazy meshes={meshes} onReset={() => setFileContent(null)} />
    </div>
  );
}
