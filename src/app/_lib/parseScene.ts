import {
  MaterialSchema,
  ObjectSchema,
  SceneSchema,
  schema,
} from "@/app/_lib/schema.ts";
import { parseFile } from "@/app/_lib/utils/files.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { ObjModel } from "obj-file-parser";
import { parseSimpleObjects } from "@/app/_lib/objects/parser.ts";

export interface Scene {
  lightPosition: [number, number, number];
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
    lightPosition: scene.light.position,
    cameraPosition: scene.camera.position,
    objects: meshes,
  };
}

async function mapObject(
  objectSchema: ObjectSchema,
  files: FileSystemFileHandle[],
): Promise<Mesh[]> {
  const file = files.find((v) => v.name === objectSchema.file);

  if (!file) {
    return [];
  }

  const texture = await parseTexture(files, objectSchema.material);

  const fileContent = await parseFile(file);

  const models: ObjModel[] = parseSimpleObjects(fileContent);

  return models.map((model) => new Mesh(model, texture, objectSchema));
}

async function parseTexture(
  files: FileSystemFileHandle[],
  materialSchema: MaterialSchema,
) {
  const texture = files.find((v) => v.name === materialSchema.texture);

  if (!texture) {
    return null;
  }

  return await createImageBitmap(await texture.getFile());
}
