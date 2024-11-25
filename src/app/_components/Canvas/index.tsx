"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { compileShader } from "@/app/_lib/utils/compileShader.ts";
import { vertexShaderContent } from "@/app/_lib/shaders/vertexShader.ts";
import { fragmentShaderContent } from "@/app/_lib/shaders/fragmentShader.ts";
import { mat4 } from "gl-matrix";
import Camera from "@/app/_lib/camera.ts";
import Mesh from "@/app/_lib/mesh.ts";
import { onKeyDown as onKeyDownFn } from "@/app/_lib/handlers.ts";
import { AnimationSchema } from "@/app/_lib/schema.ts";
import { applyAnimation } from "@/app/_lib/applyAnimation.ts";

interface CanvasProps {
  meshes: Mesh[];
  onReset: () => void;
  cameraPosition: [number, number, number];
  lightPosition: [number, number, number];
}

export default function Canvas({
  onReset,
  meshes,
  cameraPosition,
  lightPosition,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const animationRequestRef = useRef<number | null>(null);

  const shaderProgramRef = useRef<WebGLProgram | null>(null);

  const [selectedMeshIndex, setSelectedMeshIndex] = useState<number | null>(
    null,
  );

  const isMouseDownRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);
  const lastMouseYRef = useRef<number>(0);

  const [webGLContext, setWebGLContext] =
    useState<WebGL2RenderingContext | null>(null);

  const camera = useMemo(() => new Camera(cameraPosition), [cameraPosition]);

  const textures = useMemo(() => {
    if (!webGLContext) return [];
    return meshes.map(() => webGLContext.createTexture());
  }, [meshes, webGLContext]);

  useEffect(() => {
    async function initWebGL() {
      if (!canvasRef.current) return;

      const gl = canvasRef.current.getContext("webgl2");

      if (!gl) {
        throw new Error("WebGL 2 not supported.");
      }

      setWebGLContext(gl);

      const vertexShader = compileShader(
        gl,
        vertexShaderContent,
        gl.VERTEX_SHADER,
      );

      const fragmentShader = compileShader(
        gl,
        fragmentShaderContent,
        gl.FRAGMENT_SHADER,
      );

      const shaderProgram = gl.createProgram();

      if (!shaderProgram) {
        throw new Error("Unable to create shader program.");
      }

      shaderProgramRef.current = shaderProgram;

      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
          "Unable to link shader program: ",
          gl.getProgramInfoLog(shaderProgram),
        );
      }

      gl.useProgram(shaderProgram);

      const lightPositionLocation = gl.getUniformLocation(
        shaderProgram,
        "light_position",
      );

      gl.uniform3f(
        lightPositionLocation,
        lightPosition[0],
        lightPosition[1],
        lightPosition[2],
      );

      const lightColorLocation = gl.getUniformLocation(
        shaderProgram,
        "light_color",
      );

      gl.uniform3f(lightColorLocation, 1.0, 1.0, 1.0);

      gl.uniform1f(gl.getUniformLocation(shaderProgram, "q"), 10);

      gl.enable(gl.DEPTH_TEST);
    }

    initWebGL();
  }, [lightPosition]);

  const vertexBuffer = useMemo(() => {
    if (!webGLContext) return null;
    return webGLContext.createBuffer();
  }, [webGLContext]);

  const indexBuffer = useMemo(() => {
    if (!webGLContext) return null;
    return webGLContext.createBuffer();
  }, [webGLContext]);

  const render = useCallback(() => {
    if (!webGLContext || !shaderProgramRef.current) return;

    const gl = webGLContext;
    const shaderProgram = shaderProgramRef.current;

    const glCanvas = gl.canvas;
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;
    gl.viewport(0, 0, glCanvas.width, glCanvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const viewMatrixLocation = gl.getUniformLocation(shaderProgram, "view");
    gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix);

    const projectionMatrixLocation = gl.getUniformLocation(
      shaderProgram,
      "projection",
    );
    gl.uniformMatrix4fv(
      projectionMatrixLocation,
      false,
      camera.projectionMatrix,
    );

    meshes.forEach((mesh, index) => {
      const transformation = mesh.transformation;

      const animation: AnimationSchema | undefined = mesh.animation;

      if (animation) {
        applyAnimation(animation, transformation);
      }

      // Criação da matriz de modelo (transformação)
      const model = mat4.create();
      mat4.translate(model, model, [
        transformation.translation.x,
        transformation.translation.y,
        transformation.translation.z,
      ]);
      mat4.rotateX(model, model, transformation.rotation.x);
      mat4.rotateY(model, model, transformation.rotation.y);
      mat4.rotateZ(model, model, transformation.rotation.z);
      mat4.scale(model, model, [
        transformation.scale,
        transformation.scale,
        transformation.scale,
      ]);

      // Passar a matriz de transformação ao shader
      const uniformLocation = gl.getUniformLocation(shaderProgram, "model");
      gl.uniformMatrix4fv(uniformLocation, false, model);

      // Restante do código permanece igual (materiais, texturas, vértices, etc.)
      const faces = mesh.faces;

      const material = faces[0].material;
      gl.uniform1f(gl.getUniformLocation(shaderProgram, "ka"), material.ka);
      gl.uniform1f(gl.getUniformLocation(shaderProgram, "ks"), material.ks);
      gl.uniform1f(gl.getUniformLocation(shaderProgram, "kd"), material.kd);

      const textureBuffer = textures[index];

      gl.bindTexture(gl.TEXTURE_2D, textureBuffer as WebGLTexture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const texture = material.texture;

      if (texture) {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          texture,
        );
      } else {
        // textura padrão
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          1,
          1,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          new Uint8Array([255, 255, 255, 255]),
        );
      }

      gl.uniform1i(gl.getUniformLocation(shaderProgram, "texture_buffer"), 0);

      const faceVertices = new Float32Array(
        faces.flatMap((face) =>
          face.positionVertices.flatMap((v, i) => [
            v.x,
            v.y,
            v.z,
            face.normalVertices[i].x,
            face.normalVertices[i].y,
            face.normalVertices[i].z,
            face.textureVertices[i].u,
            face.textureVertices[i].v,
          ]),
        ),
      );

      const faceIndices = new Uint32Array(
        faces.flatMap((face, faceIndex) =>
          face.positionVertices.map(
            (_, vertexIndex) =>
              faceIndex * face.positionVertices.length + vertexIndex,
          ),
        ),
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, faceVertices, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceIndices, gl.STATIC_DRAW);

      const positionAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "base_position",
      );
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        3,
        gl.FLOAT,
        false,
        8 * Float32Array.BYTES_PER_ELEMENT,
        0,
      );

      const normalAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "base_normal",
      );
      gl.enableVertexAttribArray(normalAttributeLocation);
      gl.vertexAttribPointer(
        normalAttributeLocation,
        3,
        gl.FLOAT,
        false,
        8 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT,
      );

      const texcoordAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "base_texcoord",
      );
      gl.enableVertexAttribArray(texcoordAttributeLocation);
      gl.vertexAttribPointer(
        texcoordAttributeLocation,
        2,
        gl.FLOAT,
        false,
        8 * Float32Array.BYTES_PER_ELEMENT,
        6 * Float32Array.BYTES_PER_ELEMENT,
      );

      gl.drawElements(gl.TRIANGLES, faceIndices.length, gl.UNSIGNED_INT, 0);
    });

    animationRequestRef.current = requestAnimationFrame(render);
  }, [
    camera.projectionMatrix,
    camera.viewMatrix,
    indexBuffer,
    meshes,
    textures,
    vertexBuffer,
    webGLContext,
  ]);

  useEffect(() => {
    console.count("Render updated.");

    animationRequestRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRequestRef.current) {
        cancelAnimationFrame(animationRequestRef.current);
      }
    };
  }, [render]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const index = onKeyDownFn(e, meshes, selectedMeshIndex, camera);

      setSelectedMeshIndex(index);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      const deltaX = e.clientX - lastMouseXRef.current;
      const deltaY = e.clientY - lastMouseYRef.current;

      lastMouseXRef.current = e.clientX;
      lastMouseYRef.current = e.clientY;

      camera.rotate(deltaY * 0.001, deltaX * 0.001);
    };

    const onMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      lastMouseXRef.current = e.clientX;
      lastMouseYRef.current = e.clientY;
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [camera, meshes, selectedMeshIndex]);

  const objModel =
    selectedMeshIndex === null ? null : meshes[selectedMeshIndex];

  return (
    <div className="text-amber-900 bg-amber-50">
      {
        <p className="absolute top-4 left-4 font-bold text-xl">
          {objModel
            ? objModel.name
            : "Selecione um objeto utilizando os números de 1 a 9."}
        </p>
      }

      <button
        onClick={onReset}
        className="font-bold text-xl absolute top-4 right-8 text-amber-950"
      >
        X
      </button>

      <canvas ref={canvasRef} className="h-full w-full"></canvas>
    </div>
  );
}
