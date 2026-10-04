import React, { useEffect, useRef } from 'react';
import { PuppetRig, puppetRigFor } from '../data/puppetRigs';

// ---------------------------------------------------------
// 🎎 木偶立绘
//
// 在一整张立绘上做"反向网格变形"：片元着色器里对画布上每个像素，
// 倒推它应该取原图哪个位置的颜色。于是不用拆图层、不会出现缝，
// 头、眼睛、尾巴却能各动各的：
//   · 头绕脖子转、点头（待机时慢慢晃，说话时一点一点）
//   · 眨眼：把眼睛那一条往下眼睑压扁，再把上方一小条皮肤拉下来补
//   · 九条尾巴左右分两组摆，越往外摆得越多，上下有相位差像波浪
//   · 上半身呼吸、整个人绕脚底轻轻摇
//   · 换表情：有个姿势（难过低头、害羞歪头、开心摇尾巴）慢慢过渡过去
//
// 骨骼位置在 data/puppetRigs.ts。网址带 ?rig 时把各区域着色出来，方便标定。
// ---------------------------------------------------------

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uImg;          // 图片像素尺寸
uniform vec4 uPad;          // 画布四周留白（左、上、右、下，按图片宽高的比例）
uniform float uAlpha;
uniform vec2 uHeadC; uniform vec2 uHeadR; uniform vec2 uNeck;
uniform vec4 uEyeL; uniform vec4 uEyeR;
uniform vec4 uBody;         // 中线 x、半宽、腰线 y、脚底 y
uniform vec4 uEx[4];        // 摆动 / 转头时要绕开的地方（手、手肘），没用到的半径写 0
uniform vec4 uSway;         // 摆动支点 y（比例，<0 = 默认胯部）、离中线的横向距离、幅度倍数、摆动区的下边界 y（比例）
uniform float uHeadAng; uniform vec2 uHeadOff;
uniform float uBodyAng; uniform float uBreath;
uniform float uTailPhase; uniform float uTailAmp;
uniform float uBlink;
uniform float uDebug;

vec2 rot(vec2 p, vec2 c, float a) {
  float s = sin(a), co = cos(a);
  p -= c;
  return c + vec2(co * p.x - s * p.y, s * p.x + co * p.y);
}

float keepOut(vec2 p, vec4 e) {
  if (e.z <= 0.0) return 1.0;
  float d = length((p - e.xy * uImg) / (e.zw * uImg));
  return smoothstep(0.8, 1.25, d);
}

// 眨眼：眼睛那一条压到下眼睑附近，上方一小条皮肤拉下来盖住空出来的地方
vec2 blinkEye(vec2 p, vec4 e, float amount) {
  if (e.z <= 0.0 || amount <= 0.001) return p;
  vec2 c = e.xy * uImg; vec2 r = e.zw * uImg;
  float u = (p.x - c.x) / (r.x * 1.3);
  float amt = amount * (1.0 - smoothstep(0.7, 1.0, abs(u)));
  if (amt <= 0.001) return p;
  float k = 1.0 - 0.9 * amt;
  float piv = c.y + 0.5 * r.y;
  float dy = p.y - piv;
  float R = dy < 0.0 ? (piv - (c.y - 1.6 * r.y)) : ((c.y + 1.6 * r.y) - piv);
  float m = 0.45;
  float a = abs(dy);
  float s;
  if (a <= R * k) s = a / k;
  else if (a <= R * (1.0 + m)) s = R + (a - R * k) * (R * m) / (R * (1.0 + m) - R * k);
  else s = a;
  p.y = piv + sign(dy) * s;
  return p;
}

void main() {
  vec2 full = uImg * vec2(1.0 + uPad.x + uPad.z, 1.0 + uPad.y + uPad.w);
  vec2 p = vUv * full - uImg * uPad.xy;

  // 1) 整个人绕脚底轻摇：越高摇得越多
  vec2 feet = vec2(uBody.x, uBody.w) * uImg;
  float hb = clamp((feet.y - p.y) / feet.y, 0.0, 1.0);
  p = rot(p, feet, -uBodyAng * hb);

  // 2) 呼吸：腰线以上纵向微微伸缩
  float hip = uBody.z * uImg.y;
  if (p.y < hip) p.y += (hip - p.y) * uBreath;

  float ex = keepOut(p, uEx[0]) * keepOut(p, uEx[1]) * keepOut(p, uEx[2]) * keepOut(p, uEx[3]);

  // 3) 头：椭圆里权重 1，往外渐变到 0；脖子以下一律不动
  vec2 hc = uHeadC * uImg, hr = uHeadR * uImg;
  float wh = 1.0 - smoothstep(0.85, 1.25, length((p - hc) / hr));
  float neckY = uNeck.y * uImg.y;
  wh *= 1.0 - smoothstep(neckY - 0.01 * uImg.y, neckY + 0.025 * uImg.y, p.y);
  wh *= ex;
  vec2 hp = p - uHeadOff * uImg * wh;
  hp = rot(hp, uNeck * uImg, -uHeadAng * wh);

  // 4) 尾巴：躯干两侧往外渐变，左右各绕一个靠近胯部的支点转
  float bx = uBody.x * uImg.x, hw = uBody.y * uImg.x;
  float dx = hp.x - bx;
  float wt = smoothstep(hw, hw + 0.09 * uImg.x, abs(dx)) * ex * (1.0 - wh);
  // 摆动区的下边界：双马尾到腰就没了，再往下是腿和裙子，不能跟着晃
  wt *= 1.0 - smoothstep(uSway.w - 0.05, uSway.w, hp.y / uImg.y);
  float side = dx < 0.0 ? -1.0 : 1.0;
  // 支点：尾巴长在胯部（默认）；双马尾这种挂在头上的，支点放在扎头发的地方，发梢摆得最多
  vec2 piv = uSway.x < 0.0
    ? vec2(bx + side * 0.05 * uImg.x, hip + 0.04 * uImg.y)
    : vec2(bx + side * uSway.y * uImg.x, uSway.x * uImg.y);
  float wave = (hp.y / uImg.y) * 3.2;
  float ang = uTailAmp * uSway.z * sin(uTailPhase + wave + (side > 0.0 ? 1.7 : 0.0));
  vec2 q = rot(hp, piv, -ang * wt * side);

  // 5) 眨眼（在头的局部坐标里做，所以头歪着也能眨对位置）
  q = blinkEye(q, uEyeL, uBlink);
  q = blinkEye(q, uEyeR, uBlink);

  vec2 uv = q / uImg;
  vec4 col = vec4(0.0);
  if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) col = texture2D(uTex, uv);

  if (uDebug > 0.5) {
    vec3 tint = vec3(wh, 0.0, wt);
    float eyeL = uEyeL.z > 0.0 ? step(length((q - uEyeL.xy * uImg) / (uEyeL.zw * uImg)), 1.0) : 0.0;
    float eyeR = uEyeR.z > 0.0 ? step(length((q - uEyeR.xy * uImg) / (uEyeR.zw * uImg)), 1.0) : 0.0;
    tint.g = max(eyeL, eyeR);
    col.rgb = mix(col.rgb, tint * col.a, 0.45 * max(max(tint.r, tint.g), tint.b));
  }
  gl_FragColor = col * uAlpha;
}`;

// 每种情绪的姿势：头歪多少、低多少，尾巴摆得多快多大
interface Pose { tilt: number; nod: number; tailSpeed: number; tailAmp: number; }
const POSES: Record<string, Pose> = {
  neutral:   { tilt: 0,      nod: 0,      tailSpeed: 1,   tailAmp: 1 },
  happy:     { tilt: -0.035, nod: -0.003, tailSpeed: 2.3, tailAmp: 1.6 },
  surprised: { tilt: 0,      nod: -0.005, tailSpeed: 1.4, tailAmp: 1.3 },
  sad:       { tilt: 0.045,  nod: 0.007,  tailSpeed: 0.55, tailAmp: 0.45 },
  angry:     { tilt: 0,      nod: 0.003,  tailSpeed: 2.8, tailAmp: 0.9 },
  shy:       { tilt: 0.06,   nod: 0.004,  tailSpeed: 1.2, tailAmp: 0.8 },
  sly:       { tilt: -0.06,  nod: 0,      tailSpeed: 1.3, tailAmp: 1.1 }
};
const emotionOf = (src: string): string => {
  const n = (src.split('/').pop() || '').toLowerCase();
  if (/surprised|shock/.test(n)) return 'surprised';
  if (/happy|cute|laugh|love/.test(n)) return 'happy';
  if (/sad|cold/.test(n)) return 'sad';
  if (/angry/.test(n)) return 'angry';
  if (/shy|jealous|pout/.test(n)) return 'shy';
  if (/sly|smug|curious|thinking/.test(n)) return 'sly';
  return 'neutral';
};

const PAD = { l: 0.05, t: 0.04, r: 0.05, b: 0.01 };
const FADE_MS = 380;

interface Layer { src: string; rig: PuppetRig; tex: WebGLTexture; w: number; h: number; born: number; }

interface Props {
  src: string;
  speaking?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onError?: () => void;
}

const PuppetSprite: React.FC<Props> = ({ src, speaking = false, className = '', style, onError }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<{ gl: WebGLRenderingContext; prog: WebGLProgram; loc: Record<string, WebGLUniformLocation | null> } | null>(null);
  const layersRef = useRef<Layer[]>([]);
  const speakingRef = useRef(speaking);
  speakingRef.current = speaking;
  const aspectRef = useRef<number>(1);
  // 标定用：?rig 给各区域着色，?blink 一直闭着眼（检查眼睛压得对不对）
  const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const debug = !!query?.has('rig');
  const forceBlink = !!query?.has('blink');

  // ---------- 初始化 WebGL ----------
  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { onError?.(); return; }
    const sh = (type: number, srcCode: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, srcCode); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const names = ['uTex', 'uImg', 'uPad', 'uAlpha', 'uHeadC', 'uHeadR', 'uNeck', 'uEyeL', 'uEyeR', 'uBody', 'uEx[0]', 'uSway',
      'uHeadAng', 'uHeadOff', 'uBodyAng', 'uBreath', 'uTailPhase', 'uTailAmp', 'uBlink', 'uDebug'];
    const loc: Record<string, WebGLUniformLocation | null> = {};
    names.forEach(n => { loc[n] = gl.getUniformLocation(prog, n); });
    glRef.current = { gl, prog, loc };

    // 画布像素跟着显示尺寸走（高分屏乘 dpr，最多 2 倍）
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    fit();

    // ---------- 动画状态 ----------
    const t0 = performance.now();
    let pose = { ...POSES.neutral };
    let tailPhase = 0;
    let last = t0;
    let nextBlink = t0 + 1500 + Math.random() * 2500;
    let blinkStart = -1;
    let doubleBlink = false;
    let impulse = { kind: '', at: -9999 };
    let lastEmotion = '';
    let raf = 0;

    const blinkCurve = (ms: number) => {
      // 60ms 闭上、停 40ms、90ms 睁开
      if (ms < 0) return 0;
      if (ms < 60) return ms / 60;
      if (ms < 100) return 1;
      if (ms < 190) return 1 - (ms - 100) / 90;
      return 0;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const layers = layersRef.current;
      const g = glRef.current;
      if (!g || !layers.length) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      const top = layers[layers.length - 1];

      // 换了表情：姿势慢慢过渡，另外来一下冲击动作
      const emo = emotionOf(top.src);
      if (emo !== lastEmotion) {
        if (lastEmotion) impulse = { kind: emo, at: now };
        lastEmotion = emo;
      }
      const target = POSES[emo];
      const ease = 1 - Math.pow(0.02, dt);   // 大约 1 秒走完
      (Object.keys(pose) as (keyof Pose)[]).forEach(k => { pose[k] += (target[k] - pose[k]) * ease; });
      tailPhase += dt * 1.5 * pose.tailSpeed;

      // 冲击动作：衰减的弹簧
      const it = (now - impulse.at) / 1000;
      const env = it < 1.2 ? Math.exp(-it * 4.5) : 0;
      let impAng = 0, impY = 0, impTail = 0;
      if (env > 0) {
        const osc = Math.sin(it * 14);
        if (impulse.kind === 'happy') { impY = -0.012 * env * Math.abs(osc); impTail = 1.2 * env; }
        else if (impulse.kind === 'surprised') { impY = -0.014 * env; impTail = 1.5 * env; }
        else if (impulse.kind === 'angry') { impAng = 0.03 * env * osc; }
        else if (impulse.kind === 'shy') { impAng = 0.03 * env; }
        else if (impulse.kind === 'sad') { impY = 0.006 * env; }
        else { impAng = 0.015 * env * osc; }
      }

      // 待机：两个频率叠起来的慢晃，看不出循环
      let headAng = pose.tilt + 0.032 * Math.sin(t * 0.73) + 0.013 * Math.sin(t * 1.91 + 1.2) + impAng;
      let headY = pose.nod + 0.0025 * Math.sin(t * 1.13) + impY;
      if (speakingRef.current) {
        headY += 0.005 * Math.max(0, Math.sin(t * 8.5));
        headAng += 0.018 * Math.sin(t * 4.3);
      }
      const bodyAng = 0.009 * Math.sin(t * 0.47);
      const breath = 0.007 * (0.5 + 0.5 * Math.sin(t * 1.55));
      const tailAmp = 0.06 * (pose.tailAmp + impTail);

      // 眨眼：2~5 秒一次，偶尔连眨两下
      if (blinkStart < 0 && now >= nextBlink) { blinkStart = now; doubleBlink = Math.random() < 0.18; }
      let blink = 0;
      if (blinkStart >= 0) {
        const ms = now - blinkStart;
        blink = Math.max(blinkCurve(ms), doubleBlink ? blinkCurve(ms - 230) : 0);
        if (ms > (doubleBlink ? 430 : 200)) { blinkStart = -1; nextBlink = now + 2000 + Math.random() * 3200; }
      }
      if (forceBlink) blink = 1;

      const { gl, loc } = g;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(loc.uPad, PAD.l, PAD.t, PAD.r, PAD.b);
      gl.uniform1f(loc.uHeadAng, headAng);
      gl.uniform2f(loc.uHeadOff, 0, headY);
      gl.uniform1f(loc.uBodyAng, bodyAng);
      gl.uniform1f(loc.uBreath, breath);
      gl.uniform1f(loc.uTailPhase, tailPhase);
      gl.uniform1f(loc.uTailAmp, tailAmp);
      gl.uniform1f(loc.uDebug, debug ? 1 : 0);

      // 新图在下面全显，旧图盖在上面淡出
      const ordered = [top, ...layers.slice(0, -1).reverse()];
      ordered.forEach((L, i) => {
        const alpha = i === 0 ? 1 : Math.max(0, 1 - (now - top.born) / FADE_MS);
        if (alpha <= 0) return;
        const r = L.rig;
        const e = r.eyes || [];
        const ex = r.exclude || [];
        gl.bindTexture(gl.TEXTURE_2D, L.tex);
        gl.uniform1i(loc.uTex, 0);
        gl.uniform2f(loc.uImg, L.w, L.h);
        gl.uniform1f(loc.uAlpha, alpha);
        gl.uniform2f(loc.uHeadC, r.headC[0], r.headC[1]);
        gl.uniform2f(loc.uHeadR, r.headR[0], r.headR[1]);
        gl.uniform2f(loc.uNeck, r.neck[0], r.neck[1]);
        gl.uniform4f(loc.uEyeL, ...(e[0] || [0, 0, 0, 0]));
        gl.uniform4f(loc.uEyeR, ...(e[1] || [0, 0, 0, 0]));
        gl.uniform4f(loc.uBody, ...r.body);
        gl.uniform4fv(loc['uEx[0]'], [0, 1, 2, 3].flatMap(k => ex[k] || [0, 0, 0, 0]));
        gl.uniform4f(loc.uSway, r.sway?.pivotY ?? -1, r.sway?.pivotDX ?? 0, r.sway?.amp ?? 1, r.sway?.maxY ?? 2);
        gl.uniform1f(loc.uBlink, r.eyes ? blink : 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });

      // 淡出完了的旧图释放掉
      if (layers.length > 1 && now - top.born > FADE_MS + 50) {
        layers.slice(0, -1).forEach(L => gl.deleteTexture(L.tex));
        layersRef.current = [top];
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      layersRef.current.forEach(L => gl.deleteTexture(L.tex));
      layersRef.current = [];
      glRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- 换图：解码好再上传，避免闪一下空白 ----------
  useEffect(() => {
    const rig = puppetRigFor(src);
    if (!rig) return;
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.decode().then(() => {
      const g = glRef.current;
      if (cancelled || !g) return;
      const { gl } = g;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const w = img.naturalWidth, h = img.naturalHeight;
      layersRef.current = [...layersRef.current, { src, rig, tex, w, h, born: performance.now() }];
      // 画布比例跟着当前这张图（含留白）走
      const aspect = (w * (1 + PAD.l + PAD.r)) / (h * (1 + PAD.t + PAD.b));
      if (Math.abs(aspect - aspectRef.current) > 0.001 && canvasRef.current) {
        aspectRef.current = aspect;
        canvasRef.current.style.aspectRatio = String(aspect);
      }
    }).catch(() => { if (!cancelled) onError?.(); });
    return () => { cancelled = true; };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={className} style={{ aspectRatio: String(aspectRef.current), ...style }} />;
};

export const hasPuppetRig = (src: string | null | undefined) => !!puppetRigFor(src);

export default PuppetSprite;
