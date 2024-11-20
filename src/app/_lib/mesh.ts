import ObjFileParser, {
  ObjModel,
  Vertex,
  VertexTexture,
} from "obj-file-parser";
import { Transformation } from "@/app/_lib/types/Transformation.ts";

export class Material {
  name: string;
  ka: number;
  ks: number;
  kd: number;
  q: number;
  texture: ImageBitmap | null;

  constructor(name: string) {
    this.name = name;
    this.texture = null;
    this.ka = 0.2;
    this.ks = 1;
    this.kd = 0.8;
    this.q = 10;
  }
}

export class Face {
  positionVertices: Vertex[];
  normalVertices: Vertex[];
  textureVertices: VertexTexture[];
  material: Material;

  constructor(
    positionVertices: Vertex[],
    normalVertices: Vertex[],
    textureVertices: VertexTexture[],
    material: Material,
  ) {
    this.positionVertices = positionVertices;
    this.normalVertices = normalVertices;
    this.textureVertices = textureVertices;
    this.material = material;
  }
}

export default class Mesh {
  name: string;
  transformation: Transformation;
  faces: Face[];

  constructor(
    model: ObjModel,
    texture: ImageBitmap | null,
    transformation: Transformation,
    name: string,
  ) {
    this.name = name;
    this.faces = model.faces.map((face) => this.mapFace(face, model, texture));
    this.transformation = transformation ?? {
      rotation: { x: 0, y: 0, z: 0 },
      translation: { x: 0, y: 0, z: 0 },
      scale: 1,
    };
  }

  private mapFace(
    face: ObjFileParser.Face,
    model: ObjModel,
    texture: ImageBitmap | null,
  ) {
    const material = new Material(face.material);
    material.texture = texture;

    const faceVertices = face.vertices;

    const positionVertices = faceVertices.map(
      (v) => model.vertices[v.vertexIndex - 1],
    );

    const normalVertices = faceVertices.map(
      (v) => model.vertexNormals[v.vertexNormalIndex - 1],
    );

    const textureVertices = faceVertices.map(
      (v) => model.textureCoords[v.textureCoordsIndex - 1],
    );

    return new Face(
      positionVertices,
      normalVertices,
      textureVertices,
      material,
    );
  }
}

//   // // coordenadas
//     // serializedVertices.push(position.x);
//     // serializedVertices.push(position.y);
//     // serializedVertices.push(position.z);
//     // // normal
//     // serializedVertices.push(normal?.x || 0);
//     // serializedVertices.push(normal?.y || 0);
//     // serializedVertices.push(normal?.z || 0);
//     // // texture coordinates
//     // serializedVertices.push(texcoord?.u || 0);
//     // serializedVertices.push(texcoord?.v || 0);
