export function compileShader(
  gl: WebGL2RenderingContext,
  source: string,
  type: number,
): WebGLProgram {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Error creating shader: " + type);
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error("Error compiling shader: " + type);
  }

  return shader;
}
