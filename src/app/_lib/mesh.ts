import { ObjModel } from "obj-file-parser";

export default class Mesh {
  vertices: Float32Array;
  indices: Uint32Array;
  name: string;

  constructor(model: ObjModel) {
    const serializedVertices: number[] = [];
    const serializedIndices: number[] = [];

    const faceVertices = model.faces.map((face) => face.vertices).flat();

    faceVertices.forEach((faceVertex, index) => {
      const position = model.vertices[faceVertex.vertexIndex - 1];

      const normal = model.vertexNormals[faceVertex.vertexNormalIndex - 1];

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

      serializedIndices.push(index);
    });

    this.vertices = Float32Array.from(serializedVertices);
    this.indices = Uint32Array.from(serializedIndices);
    this.name = model.name;
  }
}
