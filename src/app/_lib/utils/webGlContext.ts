export function getWebGLContext(): WebGL2RenderingContext {
  const canvas = document.getElementById("canvas");

  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas not found");
  }

  const context = canvas?.getContext("webgl2");

  if (!context) {
    throw new Error("WebGL 2 not supported");
  }

  return context;
}
