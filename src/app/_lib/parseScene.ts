import { schema } from "@/app/_lib/schema.ts";
import { parseFile } from "@/app/_lib/utils/files.ts";

export interface Scene {
  objects: FileSystemFileHandle[];
}

export async function parseScene(list: FileSystemFileHandle[]): Promise<Scene> {
  const indexFile = list.find((v) => v.name === "index.json");

  if (!indexFile) {
    throw new Error(
      "Diretório não possui arquivo index.json. Por favor, selecione outro diretório.",
    );
  }

  const scene = schema.parse(JSON.parse(await parseFile(indexFile)));

  const objectsFiles = list.filter((v) =>
    scene.objects.some((o) => v.name === o.file),
  );

  return {
    objects: objectsFiles,
  };
}
