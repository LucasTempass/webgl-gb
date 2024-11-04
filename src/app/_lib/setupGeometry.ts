import { VertexAttribute } from "./utils/attributes.ts";

export function setupGeometry(
  gl: WebGL2RenderingContext,
  vertices: ArrayBuffer,
) {
  const VAO = gl.createVertexArray();
  gl.bindVertexArray(VAO);

  const VBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.vertexAttribPointer(
    VertexAttribute.POSITION,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0,
  );
  gl.enableVertexAttribArray(VertexAttribute.POSITION);

  gl.vertexAttribPointer(
    VertexAttribute.COLOR,
    3,
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(VertexAttribute.COLOR);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);

  return VAO;
}
