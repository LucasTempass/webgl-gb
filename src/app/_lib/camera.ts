import { mat4, vec3 } from "gl-matrix";

export default class Camera {
  position: vec3;
  rotation: vec3;
  viewMatrix: mat4;
  projectionMatrix: mat4;

  constructor(
    position: vec3 = vec3.fromValues(0, 0, 1),
    rotation: vec3 = vec3.create(),
    fov: number = 45,
    aspect: number = window.innerWidth / window.innerHeight,
    near: number = 0.1,
    far: number = 10000,
  ) {
    this.position = position;
    this.rotation = rotation;
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.updateViewMatrix();
    this.updateProjectionMatrix(fov, aspect, near, far);
  }

  updateViewMatrix() {
    const cosPitch = Math.cos(this.rotation[0]);
    const sinPitch = Math.sin(this.rotation[0]);
    const cosYaw = Math.cos(this.rotation[1]);
    const sinYaw = Math.sin(this.rotation[1]);

    const xaxis = vec3.fromValues(cosYaw, 0, -sinYaw);
    const yaxis = vec3.fromValues(
      sinYaw * sinPitch,
      cosPitch,
      cosYaw * sinPitch,
    );
    const zaxis = vec3.fromValues(
      sinYaw * cosPitch,
      -sinPitch,
      cosPitch * cosYaw,
    );

    this.viewMatrix[0] = xaxis[0];
    this.viewMatrix[1] = yaxis[0];
    this.viewMatrix[2] = zaxis[0];
    this.viewMatrix[3] = 0;
    this.viewMatrix[4] = xaxis[1];
    this.viewMatrix[5] = yaxis[1];
    this.viewMatrix[6] = zaxis[1];
    this.viewMatrix[7] = 0;
    this.viewMatrix[8] = xaxis[2];
    this.viewMatrix[9] = yaxis[2];
    this.viewMatrix[10] = zaxis[2];
    this.viewMatrix[11] = 0;
    this.viewMatrix[12] = -vec3.dot(xaxis, this.position);
    this.viewMatrix[13] = -vec3.dot(yaxis, this.position);
    this.viewMatrix[14] = -vec3.dot(zaxis, this.position);
    this.viewMatrix[15] = 1;
  }

  updateProjectionMatrix(
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) {
    mat4.perspective(
      this.projectionMatrix,
      fov * (Math.PI / 180),
      aspect,
      near,
      far,
    );
  }

  moveForward(distance: number) {
    const forward = vec3.fromValues(
      Math.sin(this.rotation[1]),
      0,
      Math.cos(this.rotation[1]),
    );
    vec3.scaleAndAdd(this.position, this.position, forward, distance);
    this.updateViewMatrix();
  }

  moveRight(distance: number) {
    const right = vec3.fromValues(
      Math.cos(this.rotation[1]),
      0,
      -Math.sin(this.rotation[1]),
    );
    vec3.scaleAndAdd(this.position, this.position, right, distance);
    this.updateViewMatrix();
  }

  moveUp(distance: number) {
    this.position[1] += distance;
    this.updateViewMatrix();
  }

  rotate(pitch: number, yaw: number) {
    this.rotation[0] += pitch;
    this.rotation[1] += yaw;
    this.updateViewMatrix();
  }
}
