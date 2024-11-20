import { schema } from "@/app/_lib/schema.ts";
import { parseFile } from "@/app/_lib/utils/files.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { ObjModel } from "obj-file-parser";
import { useMemo } from "react";
import { parseSimpleObjects } from "@/app/_lib/objects/parser.ts";

export interface Scene {
  cameraPosition: [number, number, number];
  objects: Mesh[];
}

export async function parseScene(list: FileSystemFileHandle[]): Promise<Scene> {
  const indexFile = list.find((v) => v.name === "index.json");

  if (!indexFile) {
    throw new Error(
      "Diretório não possui uma cena válida. Por favor, selecione outro diretório.",
    );
  }

  const scene = schema.parse(JSON.parse(await parseFile(indexFile)));

  const objectsFiles = list.filter((v) =>
    scene.objects.some((o) => v.name === o.file),
  );

  const objectsFilesContent = await Promise.all(
    objectsFiles.map((v) => parseFile(v)),
  );

  const models: ObjModel[] = objectsFilesContent
    .map((file) => parseSimpleObjects(file))
    .flat();

  const meshes: Mesh[] = models.map((model) => new Mesh(model));

  return {
    cameraPosition: scene.camera.position,
    objects: meshes,
  };
}
