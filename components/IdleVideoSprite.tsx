import React, { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------
// 🎞️ 待机小视频立绘（试做）
//
// Veo 生成的视频没有透明通道，是在纯绿底上拍的（scripts/remake/gen-idle-video.mjs）。
// 这里每一帧传进 WebGL，实时把绿色抠掉、把头发边上反射的绿光压回去（去溢色），
// 再裁成跟静态立绘一样的范围——跟 PuppetSprite 叠在同一个位置，换过去看不出跳动。
// 视频没加载出来、或者浏览器不让自动播放时，onFallback 让外面换回静态/木偶立绘。
// ---------------------------------------------------------

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
uniform vec4 uCrop;   // 立绘在视频画面里的位置（x, y, w, h，比例）
void main() {
  vec2 uv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  vUv = uCrop.xy + uv * uCrop.zw;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec3 uKey;
void main() {
  vec3 c = texture2D(uTex, vUv).rgb;
  // 绿得多"超出"红蓝多少：越超出越透明
  float g = c.g - max(c.r, c.b);
  float kg = uKey.g - max(uKey.r, uKey.b);
  float a = 1.0 - smoothstep(0.12 * kg, 0.55 * kg, g);
  // 去溢色：剩下的像素里绿色不许超过红蓝的较大者（头发边上那圈绿光）
  c.g = min(c.g, max(c.r, c.b) + 0.02);
  gl_FragColor = vec4(c * a, a);
}`;

interface Meta { frame: [number, number]; sprite: [number, number, number, number]; key: { r: number; g: number; b: number } }

interface Props {
  src: string;                 // /videos/idle/xxx.mp4（旁边有同名 .json）
  className?: string;
  style?: React.CSSProperties;
  onFallback?: () => void;
}

const IdleVideoSprite: React.FC<Props> = ({ src, className = '', style, onFallback }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState(0.5);

  useEffect(() => {
    let raf = 0, dead = false;
    const video = document.createElement('video');
    video.src = src; video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true });
    if (!gl) { onFallback?.(); return; }
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uCrop = gl.getUniformLocation(prog, 'uCrop'), uKey = gl.getUniformLocation(prog, 'uKey');

    fetch(src.replace(/\.mp4$/, '.json')).then(r => r.json()).then((m: Meta) => {
      if (dead) return;
      const [x, y, w, h] = m.sprite;
      gl.uniform4f(uCrop, x, y, w, h);
      gl.uniform3f(uKey, m.key.r / 255, m.key.g / 255, m.key.b / 255);
      setAspect((w * m.frame[0]) / (h * m.frame[1]));
      return video.play();
    }).catch(() => { if (!dead) onFallback?.(); });

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (video.readyState < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(canvas.clientWidth * dpr), ch = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      gl.viewport(0, 0, cw, ch);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);
    video.onerror = () => { if (!dead) onFallback?.(); };
    return () => { dead = true; cancelAnimationFrame(raf); video.pause(); video.removeAttribute('src'); video.load(); gl.deleteTexture(tex); };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} style={{ aspectRatio: String(aspect), ...style }} />;
};

// 有没有为这张立绘做好的待机视频：/images/characters/hikari/school_neutral.webp → /videos/idle/hikari_school_neutral.mp4
export const IDLE_VIDEOS: Record<string, string> = {
  '/images/characters/hikari/school_neutral.webp': '/videos/idle/hikari_school_neutral.mp4',
  // 大厅里光用的是 school_happy：同一套身体，画面位置一样，直接共用
  '/images/characters/hikari/school_happy.webp': '/videos/idle/hikari_school_neutral.mp4'
};

export default IdleVideoSprite;
