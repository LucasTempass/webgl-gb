import { ObjModel } from "obj-file-parser";
import { Transformation } from "@/app/_lib/types/Transformation.ts";

export default class Mesh {
  vertices: Float32Array;
  indices: Uint32Array;
  transformation: Transformation;
  name: string;

  constructor(model: ObjModel) {
    const serializedVertices: number[] = [];
    const serializedIndices: number[] = [];

    const faceVertices = model.faces.map((face) => face.vertices).flat();

    faceVertices.forEach((faceVertex, index) => {
      const position = model.vertices[faceVertex.vertexIndex - 1];

      const normal = model.vertexNormals[faceVertex.vertexNormalIndex - 1];

      const texcoord = model.textureCoords[faceVertex.textureCoordsIndex - 1];

      // coordenadas
      serializedVertices.push(position?.x || 0);
      serializedVertices.push(position?.y || 0);
      serializedVertices.push(position?.z || 0);
      // cores
      serializedVertices.push(Math.random());
      serializedVertices.push(Math.random());
      serializedVertices.push(Math.random());
      // normal
      serializedVertices.push(normal?.x || 0);
      serializedVertices.push(normal?.y || 0);
      serializedVertices.push(normal?.z || 0);
      // texture coordinates
      serializedVertices.push(texcoord?.u || 0);
      serializedVertices.push(texcoord?.v || 0);

      serializedIndices.push(index);
    });

    this.vertices = Float32Array.from(serializedVertices);
    this.indices = Uint32Array.from(serializedIndices);
    this.name = model.name;
    this.transformation = {
      rotation: { x: 0, y: 0, z: 0 },
      translation: { x: 0, y: 0, z: 0 },
      scale: 1,
    };
  }
}
