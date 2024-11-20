"use client";

import { useState } from "react";
import { listFiles, parseFile } from "@/app/_lib/utils/files.ts";
import { parseScene, Scene } from "@/app/_lib/parseScene.ts";

interface ScenePickerProps {
  onChange: (content: Scene) => void;
}

export function ScenePicker({ onChange }: ScenePickerProps) {
  const [error, setError] = useState<string | null>(null);

  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);

  const handleClick = async () => {
    if (!directoryHandle) return;

    const list = await listFiles(directoryHandle);

    const scene = await parseScene(list);

    onChange(scene);
  };

  const handlePickDir = async () => {
    setError(null);

    const dirHandle = await window.showDirectoryPicker();

    setDirectoryHandle(dirHandle);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-8">
      <div className="p-6 border-[2px] border-dashed border-white rounded-lg space-y-4">
        <h1 className="text-2xl font-bold">
          Selecione um diretório para visualizar a cena
        </h1>

        <p className="text-lg">
          O diretório deve conter um arquivo <code>index.json</code> com a
          especificação da cena, além de todos os arquivos <code>.obj</code> e{" "}
          <code>.mtl</code> necessários.
        </p>

        <button
          onClick={handlePickDir}
          className="p-2 bg-yellow-500 text-white rounded-lg"
        >
          Selecionar diretório
        </button>

        {error && (
          <div className="mt-4 p-2 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}

        {directoryHandle && (
          <div className="space-x-4 flex items-center">
            <button
              className="p-2 bg-green-500 text-white rounded-lg"
              onClick={handleClick}
            >
              Visualizar
            </button>

            <h6 className="font-bold text-lg text-white">
              Selecionado: {directoryHandle.name}
            </h6>
          </div>
        )}
      </div>
    </div>
  );
}
