"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ScenePicker } from "@/app/_components/ScenePicker";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [fileContent, setFileContent] = useState<string | null>(null);

  if (!fileContent) {
    return <ScenePicker onChange={(v) => setFileContent(v)} />;
  }

  return (
    <div>
      <CanvasLazy file={fileContent} onReset={() => setFileContent(null)} />
    </div>
  );
}
