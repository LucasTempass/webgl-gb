import Camera from "./camera.ts";

interface Point2D {
  x: number;
  y: number;
}

interface Point3D extends Point2D {
  z: number;
}

interface Transformations {
  rotation: Point3D;
  translation: Point3D;
  scale: number;
}

export function onKeyDown(
  event: KeyboardEvent,
  transformations: Transformations[],
  index: number | null,
  camera: Camera,
): number | null {
  const transformation: Transformations | null =
    index == null ? null : transformations[index];

  if (!transformation) {
    updateCamera(event, camera);
    return getIndex(event, index);
  }

  updateTransformation(event, transformation);

  return getIndex(event, index);
}

function updateCamera(event: KeyboardEvent, camera: Camera) {
  switch (event.key) {
    case "w":
      camera.moveForward(0.1);
      break;
    case "s":
      camera.moveForward(-0.1);
      break;
    case "a":
      camera.moveRight(-0.1);
      break;
    case "d":
      camera.moveRight(0.1);
      break;
    case "ArrowUp":
      camera.moveUp(0.1);
      break;
    case "ArrowDown":
      camera.moveUp(-0.1);
      break;
    case "ArrowLeft":
      camera.rotate(0, -0.1);
      break;
    case "ArrowRight":
      camera.rotate(0, 0.1);
      break;
  }
}

function getIndex(event: KeyboardEvent, index: number | null): number | null {
  switch (event.key) {
    case "1":
      return 0;
    case "2":
      return 1;
    case "3":
      return 2;
    case "4":
      return 3;
    case "5":
      return 4;
    case "6":
      return 5;
    case "7":
      return 6;
    case "8":
      return 7;
    case "9":
      return 8;
    case "0":
      return 9;
    default:
      return index;
  }
}

function updateTransformation(
  event: KeyboardEvent,
  transformation: Transformations,
) {
  switch (event.key) {
    // Translação
    case "ArrowUp":
      transformation.translation.y += 0.1;
      break;
    case "ArrowDown":
      transformation.translation.y -= 0.1;
      break;
    case "ArrowLeft":
      transformation.translation.x -= 0.1;
      break;
    case "ArrowRight":
      transformation.translation.x += 0.1;
      break;
    // Rotação
    case "w":
      transformation.rotation.x += 0.1;
      break;
    case "s":
      transformation.rotation.x -= 0.1;
      break;
    case "a":
      transformation.rotation.y -= 0.1;
      break;
    case "d":
      transformation.rotation.y += 0.1;
      break;
    case "q":
      transformation.rotation.z += 0.1;
      break;
    case "e":
      transformation.rotation.z -= 0.1;
      break;
    // Escala
    case "+":
      transformation.scale += 0.1;
      break;
    case "-":
      transformation.scale -= 0.1;
      break;
  }
}
