'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveNeuralVortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context =
      (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!context) {
      return;
    }

    const vertexShaderSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_uv;

      uniform float u_ratio;
      uniform float u_scroll_progress;
      uniform float u_time;
      uniform vec2 u_pointer_position;

      vec2 rotate(vec2 uv, float theta) {
        return mat2(cos(theta), sin(theta), -sin(theta), cos(theta)) * uv;
      }

      float neuro_shape(vec2 uv, float time, float pointerInfluence) {
        vec2 sineAccumulator = vec2(0.0);
        vec2 result = vec2(0.0);
        float scale = 8.0;

        for (int index = 0; index < 15; index++) {
          uv = rotate(uv, 1.0);
          sineAccumulator = rotate(sineAccumulator, 1.0);

          vec2 layer = uv * scale + float(index) + sineAccumulator - time;
          sineAccumulator += sin(layer) + 2.4 * pointerInfluence;
          result += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }

        return result.x + result.y;
      }

      void main() {
        vec2 uv = 0.5 * v_uv;
        uv.x *= u_ratio;

        vec2 pointerDelta = v_uv - u_pointer_position;
        pointerDelta.x *= u_ratio;

        float pointerInfluence = clamp(length(pointerDelta), 0.0, 1.0);
        pointerInfluence = 0.5 * pow(1.0 - pointerInfluence, 2.0);

        float time = 0.001 * u_time;
        float noise = neuro_shape(uv, time, pointerInfluence);

        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= 1.0 - length(v_uv - 0.5);

        vec3 color = vec3(0.5, 0.15, 0.65);
        color = mix(color, vec3(0.02, 0.7, 0.9), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.15, 0.0, 0.6) * sin(2.0 * u_scroll_progress + 1.5);
        color *= noise;

        gl_FragColor = vec4(color, noise);
      }
    `;

    const compileShader = (
      gl: WebGLRenderingContext,
      source: string,
      type: number
    ) => {
      const shader = gl.createShader(type);

      if (!shader) {
        return null;
      }

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compileShader(
      context,
      vertexShaderSource,
      context.VERTEX_SHADER
    );
    const fragmentShader = compileShader(
      context,
      fragmentShaderSource,
      context.FRAGMENT_SHADER
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const program = context.createProgram();
    if (!program) {
      return;
    }

    context.attachShader(program, vertexShader);
    context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      context.deleteProgram(program);
      return;
    }

    context.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);

    const positionLocation = context.getAttribLocation(program, 'a_position');
    context.enableVertexAttribArray(positionLocation);
    context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);

    const timeLocation = context.getUniformLocation(program, 'u_time');
    const ratioLocation = context.getUniformLocation(program, 'u_ratio');
    const pointerLocation = context.getUniformLocation(program, 'u_pointer_position');
    const scrollLocation = context.getUniformLocation(program, 'u_scroll_progress');

    const resizeCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      context.viewport(0, 0, canvas.width, canvas.height);

      if (ratioLocation) {
        context.uniform1f(ratioLocation, canvas.width / canvas.height);
      }
    };

    const render = () => {
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.2;

      if (timeLocation) {
        context.uniform1f(timeLocation, performance.now());
      }

      if (pointerLocation) {
        context.uniform2f(
          pointerLocation,
          pointer.current.x / window.innerWidth,
          1 - pointer.current.y / window.innerHeight
        );
      }

      if (scrollLocation) {
        context.uniform1f(
          scrollLocation,
          window.scrollY / Math.max(window.innerHeight * 2, 1)
        );
      }

      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
      animationRef.current = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.targetX = event.clientX;
      pointer.current.targetY = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      pointer.current.targetX = touch.clientX;
      pointer.current.targetY = touch.clientY;
    };

    resizeCanvas();
    render();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);

      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }

      context.deleteProgram(program);
      context.deleteShader(vertexShader);
      context.deleteShader(fragmentShader);
      if (vertexBuffer) {
        context.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-95"
      aria-hidden="true"
    />
  );
}
