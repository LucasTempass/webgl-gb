export interface Point2D {
  x: number;
  y: number;
}

export interface Point3D extends Point2D {
  z: number;
}

export interface Transformation {
  rotation: Point3D;
  translation: Point3D;
  scale: number;
}
