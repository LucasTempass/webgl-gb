import { ObjectSchema, SceneSchema, schema } from "@/app/_lib/schema.ts";
import { parseFile } from "@/app/_lib/utils/files.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { ObjModel } from "obj-file-parser";
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

  const scene: SceneSchema = schema.parse(
    JSON.parse(await parseFile(indexFile)),
  );

  const meshes: Mesh[] = await Promise.all(
    scene.objects.map((objectSchema) => mapObject(objectSchema, list)),
  ).then((v) => v.flat());

  return {
    cameraPosition: scene.camera.position,
    objects: meshes,
  };
}

async function mapObject(
  objectSchema: ObjectSchema,
  files: FileSystemFileHandle[],
): Promise<Mesh[]> {
  const file = files.filter((v) => v.name === objectSchema.file)[0];

  if (!file) {
    return [];
  }

  const fileContent = await parseFile(file);

  const models: ObjModel[] = parseSimpleObjects(fileContent);

  return models.map((model) => new Mesh(model, objectSchema.transformation));
}
