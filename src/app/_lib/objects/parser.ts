import OBJFile, { ObjModel } from "obj-file-parser";

export function parseSimpleObjects(text: string): ObjModel[] {
  return new OBJFile(text).parse().models;
}
