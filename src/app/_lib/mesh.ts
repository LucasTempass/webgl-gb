import ObjFileParser, {
  ObjModel,
  Vertex,
  VertexTexture,
} from "obj-file-parser";
import { Transformation } from "@/app/_lib/types/Transformation.ts";
import { AnimationSchema, ObjectSchema } from "@/app/_lib/schema.ts";

export class Material {
  ka: number;
  ks: number;
  kd: number;
  texture: ImageBitmap | null;

  constructor() {
    this.texture = null;
    this.ka = 0.2;
    this.ks = 1;
    this.kd = 0.8;
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
  animation?: AnimationSchema;

  constructor(
    model: ObjModel,
    texture: ImageBitmap | null,
    objectSchema: ObjectSchema,
  ) {
    const material = new Material();
    material.ka = objectSchema.material.ka;
    material.ks = objectSchema.material.ks;
    material.kd = objectSchema.material.kd;
    material.texture = texture;

    this.name = objectSchema.name;
    this.animation = objectSchema.animation;
    this.transformation = objectSchema.transformation;
    this.faces = model.faces.map((face) => {
      return this.mapFace(face, model, material);
    });
  }

  private mapFace(
    face: ObjFileParser.Face,
    model: ObjModel,
    material: Material,
  ) {
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
