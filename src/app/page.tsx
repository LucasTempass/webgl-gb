"use client";

import dynamic from "next/dynamic";
import { useState, ChangeEvent } from "react";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setFileContent(event.target?.result as string);
    reader.readAsText(selectedFile);
  };

  if (!fileContent) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="p-6 border-[2px] border-dashed border-white rounded-lg">
          <h1 className="text-2xl font-medium">
            Insira um arquivo <span className="font-bold">.obj</span> para
            visualizar
          </h1>

          <input
            type="file"
            accept=".obj"
            className="mt-4 p-2 border-[2px] border-white rounded-lg"
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <CanvasLazy file={fileContent} />
    </div>
  );
}
