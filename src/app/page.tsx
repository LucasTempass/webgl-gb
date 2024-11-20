"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const CanvasLazy = dynamic(() => import("@/app/_components/Canvas"), {
  ssr: false,
});

export default function Page() {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [directoryHandle, setDirectoryHandle] =
    useState<FileSystemDirectoryHandle | null>(null);

  const handleClick = async () => {
    if (!directoryHandle) return;

    const values = directoryHandle.values();

    const list: FileSystemFileHandle[] = [];

    for await (const value of values) {
      if (value.kind === "file") {
        list.push(value);
      }
    }

    const indexFile = list.find((v) => v.name === "index.json");

    if (!indexFile) {
      setError(
        "Diretório não possui arquivo index.json. Por favor, selecione outro diretório.",
      );

      setDirectoryHandle(null);

      return;
    }

    const contents = list.map((v) => v.name).join(", ");

    console.log(contents);
  };

  if (!fileContent) {
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

  return (
    <div>
      <CanvasLazy file={fileContent} onReset={() => setFileContent(null)} />
    </div>
  );
}
