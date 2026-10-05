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
uniform sampler2D uTex;      // 这一张立绘（含表情）
uniform vec2 uImg;           // 图片像素尺寸
uniform vec4 uPad;           // 画布四周留白（左、上、右、下，按图片宽高的比例）
uniform float uAlpha;
uniform vec4 uBody;          // 中线 x、半宽、腰线 y、脚底 y
uniform vec4 uSway;          // 头发摆动支点 y（<0 = 尾巴，支点在胯部）、离中线的横向距离、幅度倍数、（不用）
uniform float uBodyAng;      // 整个人绕脚底的倾斜
uniform vec2 uShift;         // 整个人平移（按图片宽高的比例）
uniform vec2 uScale;         // 整个人以脚底为基准的缩放（呼吸）
uniform float uTailPhase; uniform float uTailAmp;
uniform sampler2D uBlinkTex; // 眨眼过渡帧：两帧竖着拼（上半闭、下全闭），只覆盖眼睛那一块
uniform vec4 uBlinkRect;     // 这一块在原图上的位置（比例）。z<=0 = 没有过渡帧
uniform float uBlinkFrame;   // 0 睁眼、1 半闭、2 全闭
uniform sampler2D uBodyTex;  // 分层：去掉垂发后补画的身体
uniform sampler2D uHairTex;  // 分层：垂发蒙版（r 通道）
uniform float uHasLayer;
uniform float uDebug;

vec2 rot(vec2 p, vec2 c, float a) {
  float s = sin(a), co = cos(a);
  p -= c;
  return c + vec2(co * p.x - s * p.y, s * p.x + co * p.y);
}

bool inside(vec2 uv) { return uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0; }

// 垂发蒙版往外扩一点：头发边上的抗锯齿那一圈也算头发，摆起来才不会在原地留一道发丝轮廓
float hairMask(vec2 uv) {
  if (!inside(uv)) return 0.0;
  vec2 d = vec2(0.004, 0.004 * uImg.x / uImg.y);
  float m = texture2D(uHairTex, uv).r;
  m = max(m, texture2D(uHairTex, uv + vec2(d.x, 0.0)).r);
  m = max(m, texture2D(uHairTex, uv - vec2(d.x, 0.0)).r);
  m = max(m, texture2D(uHairTex, uv + vec2(0.0, d.y)).r);
  m = max(m, texture2D(uHairTex, uv - vec2(0.0, d.y)).r);
  m = max(m, texture2D(uHairTex, uv + d).r);
  m = max(m, texture2D(uHairTex, uv - d).r);
  m = max(m, texture2D(uHairTex, uv + vec2(d.x, -d.y)).r);
  m = max(m, texture2D(uHairTex, uv + vec2(-d.x, d.y)).r);
  return smoothstep(0.05, 0.6, m);
}

// 眨眼帧盖在睁眼图上
vec4 withBlink(vec4 col, vec2 uv) {
  if (uBlinkRect.z > 0.0 && uBlinkFrame > 0.5) {
    vec2 pu = (uv - uBlinkRect.xy) / uBlinkRect.zw;
    if (pu.x > 0.0 && pu.x < 1.0 && pu.y > 0.0 && pu.y < 1.0) {
      float edge = smoothstep(0.0, 0.12, min(min(pu.x, 1.0 - pu.x), min(pu.y, 1.0 - pu.y)));
      vec4 bc = texture2D(uBlinkTex, vec2(pu.x, (pu.y + (uBlinkFrame > 1.5 ? 1.0 : 0.0)) * 0.5));
      col = mix(col, bc, edge);
    }
  }
  return col;
}

void main() {
  vec2 full = uImg * vec2(1.0 + uPad.x + uPad.z, 1.0 + uPad.y + uPad.w);
  vec2 p = vUv * full - uImg * uPad.xy;

  // 1) 整个人的刚体运动：平移、以脚底为基准的伸缩（呼吸）、绕脚底的轻摇。
  //    整张图一起动，不做任何局部变形——局部变形会把脸侧的头发、肩膀、举起的手一起扭歪
  vec2 feet = vec2(uBody.x, uBody.w) * uImg;
  p -= uShift * uImg;
  p = feet + (p - feet) / uScale;
  p = rot(p, feet, -uBodyAng);

  vec2 uv = p / uImg;
  vec4 col = inside(uv) ? texture2D(uTex, uv) : vec4(0.0);
  col = withBlink(col, uv);

  // 2) 分层的头发/尾巴：身体层里，垂发的地方换成补画的身体；头发层单独绕扎头发的地方（尾巴绕胯部）摆，
  //    再盖在身体上面。手、袖子都在身体层，永远不会被拉弯
  if (uHasLayer > 0.5) {
    float m = hairMask(uv);
    if (m > 0.0) col = mix(col, texture2D(uBodyTex, uv), m);

    float bx = uBody.x * uImg.x;
    float side = p.x < bx ? -1.0 : 1.0;
    vec2 piv = uSway.x < 0.0
      ? vec2(bx + side * 0.05 * uImg.x, (uBody.z + 0.04) * uImg.y)
      : vec2(bx + side * uSway.y * uImg.x, uSway.x * uImg.y);
    // 离支点越远摆得越多；上下有相位差，像波浪
    float w = clamp(length(p - piv) / (0.32 * uImg.y), 0.0, 1.0);
    w = w * w * (3.0 - 2.0 * w);
    float ang = uTailAmp * max(uSway.z, 0.35) * sin(uTailPhase + (p.y / uImg.y) * 3.2 + (side > 0.0 ? 1.7 : 0.0));
    vec2 hq = rot(p, piv, -ang * w * side);
    vec2 huv = hq / uImg;
    float hm = hairMask(huv);
    if (hm > 0.0) {
      vec4 hc = texture2D(uTex, huv) * hm;
      col = hc + col * (1.0 - hc.a);
    }
    if (uDebug > 0.5) col.rgb = mix(col.rgb, vec3(0.0, 0.3, 1.0) * col.a, 0.5 * hm);
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

interface Layer { src: string; rig: PuppetRig; tex: WebGLTexture; blinkTex: WebGLTexture | null; maskTex: WebGLTexture | null; bodyTex: WebGLTexture | null; hairTex: WebGLTexture | null; w: number; h: number; born: number; }

const uploadTexture = (gl: WebGLRenderingContext, img: HTMLImageElement) => {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
};
const loadImage = (src: string) => { const img = new Image(); img.src = src; return img.decode().then(() => img); };

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
      'uHeadAng', 'uHeadOff', 'uBodyAng', 'uBreath', 'uTailPhase', 'uTailAmp', 'uBlink', 'uDebug',
      'uBlinkTex', 'uBlinkRect', 'uBlinkFrame', 'uHairLag', 'uMask', 'uHasMask', 'uShift', 'uScale',
      'uBodyTex', 'uHairTex', 'uHasLayer'];
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
    let last = t0;
    let nextBlink = t0 + 1500 + Math.random() * 2500;
    let blinkStart = -1;
    let doubleBlink = false;
    let impulse = { kind: '', at: -9999 };
    let lastEmotion = '';
    let lastSrc = '';
    let raf = 0;
    // 待机时偶尔换个"看的方向"：头慢慢转过去停一会儿，不是一直匀速地晃
    let tailPhase = 0;   // 分层头发/尾巴的摆动相位
    let idle = { tilt: 0, nod: 0 }, idleTarget = { tilt: 0, nod: 0 }, nextIdle = t0 + 2500;

    const blinkCurve = (ms: number) => {
      // 70ms 闭上、停 50ms、110ms 睁开（睁眼比闭眼慢，看着才不像开关）
      if (ms < 0) return 0;
      if (ms < 70) return ms / 70;
      if (ms < 120) return 1;
      if (ms < 230) return 1 - (ms - 120) / 110;
      return 0;
    };
    const BLINK_MS = 230;

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
      // 换表情的那一下顺势眨个眼：真人变脸时也会，交叉淡化也被盖住了
      if (top.src !== lastSrc) {
        if (lastSrc && blinkStart < 0) { blinkStart = now + 40; doubleBlink = false; }
        lastSrc = top.src;
      }
      const target = POSES[emo];
      const ease = 1 - Math.pow(0.02, dt);   // 大约 1 秒走完
      (Object.keys(pose) as (keyof Pose)[]).forEach(k => { pose[k] += (target[k] - pose[k]) * ease; });

      // ---- 全部是整个人的刚体运动，不做局部变形（局部变形会把脸侧的头发、肩膀、手扭歪）----
      // 冲击动作：换表情的那一下，衰减的弹簧
      const it = (now - impulse.at) / 1000;
      const env = it < 1.2 ? Math.exp(-it * 4.5) : 0;
      let impAng = 0, impY = 0;
      if (env > 0) {
        const osc = Math.sin(it * 14);
        if (impulse.kind === 'happy') impY = -0.008 * env * Math.abs(osc);        // 开心：轻轻跳两下
        else if (impulse.kind === 'surprised') impY = -0.010 * env;               // 惊讶：往上一缩
        else if (impulse.kind === 'angry') impAng = 0.004 * env * osc;            // 生气：抖一下
        else if (impulse.kind === 'shy') impAng = 0.004 * env;                    // 害羞：往一边缩
        else if (impulse.kind === 'sad') impY = 0.005 * env;                      // 难过：往下一沉
        else impAng = 0.002 * env * osc;
      }
      // 情绪的姿态：害羞/难过微微歪着站，开心的时候站得高一点（都很小，整个人一起）
      const lean = pose.tilt * 0.08;
      const lift = pose.nod * 0.6;

      // 待机：重心在两条腿之间慢慢换（两个频率叠起来，看不出循环），偶尔换个站姿
      if (now >= nextIdle) {
        idleTarget = { tilt: (Math.random() - 0.5) * 0.004, nod: 0 };
        nextIdle = now + 4000 + Math.random() * 5000;
        if (blinkStart < 0 && Math.random() < 0.35) { blinkStart = now + 60; doubleBlink = false; }
      }
      const idleEase = 1 - Math.pow(0.2, dt);
      idle.tilt += (idleTarget.tilt - idle.tilt) * idleEase;
      const bodyAng = 0.0035 * Math.sin(t * 0.47) + 0.0015 * Math.sin(t * 0.19 + 2.1) + idle.tilt + lean + impAng;

      // 呼吸：吸气快一点、呼气慢一点（不是正弦对称的）；以脚底为基准，纵向比横向多一点
      const bp = (t * 0.26) % 1;
      const breathWave = bp < 0.4 ? Math.sin((bp / 0.4) * Math.PI / 2) : Math.cos(((bp - 0.4) / 0.6) * Math.PI / 2);
      const scaleX = 1 + 0.0015 * breathWave, scaleY = 1 + 0.0045 * breathWave;

      // 分层的头发/尾巴：情绪决定摆得多快多大；换表情那一下多甩一下
      tailPhase += dt * 1.5 * pose.tailSpeed;
      const tailAmp = 0.05 * (pose.tailAmp + (env > 0 && (impulse.kind === 'happy' || impulse.kind === 'surprised') ? 1.2 * env : 0));

      // 说话：整个人轻轻点动
      let shiftY = lift + impY;
      if (speakingRef.current) shiftY += -0.0035 * Math.max(0, Math.sin(t * 8.5));
      const shiftX = 0.0012 * Math.sin(t * 0.31 + 0.7);

      // 眨眼：2~5 秒一次，偶尔连眨两下
      if (blinkStart < 0 && now >= nextBlink) { blinkStart = now; doubleBlink = Math.random() < 0.18; }
      let blink = 0;
      if (blinkStart >= 0) {
        const ms = now - blinkStart;
        blink = Math.max(blinkCurve(ms), doubleBlink ? blinkCurve(ms - BLINK_MS - 40) : 0);
        if (ms > (doubleBlink ? BLINK_MS * 2 + 40 : BLINK_MS)) { blinkStart = -1; nextBlink = now + 2000 + Math.random() * 3200; }
      }
      if (forceBlink) blink = 1;
      // 有过渡帧时：睁 → 半闭 → 全闭 → 半闭 → 睁
      const blinkFrame = blink < 0.2 ? 0 : blink < 0.75 ? 1 : 2;

      const { gl, loc } = g;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(loc.uPad, PAD.l, PAD.t, PAD.r, PAD.b);
      gl.uniform1f(loc.uHeadAng, 0);
      gl.uniform2f(loc.uHeadOff, 0, 0);
      gl.uniform1f(loc.uBodyAng, bodyAng);
      gl.uniform1f(loc.uBreath, 0);
      gl.uniform1f(loc.uTailPhase, tailPhase);
      gl.uniform1f(loc.uTailAmp, tailAmp);
      gl.uniform1f(loc.uHairLag, 0);
      gl.uniform2f(loc.uShift, shiftX, shiftY);
      gl.uniform2f(loc.uScale, scaleX, scaleY);
      gl.uniform1f(loc.uDebug, debug ? 1 : 0);

      // 新图在下面全显，旧图盖在上面淡出
      const ordered = [top, ...layers.slice(0, -1).reverse()];
      ordered.forEach((L, i) => {
        const alpha = i === 0 ? 1 : Math.max(0, 1 - (now - top.born) / FADE_MS);
        if (alpha <= 0) return;
        const r = L.rig;
        const e = r.eyes || [];
        const ex = r.exclude || [];
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, L.blinkTex);
        gl.uniform1i(loc.uBlinkTex, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, L.tex);
        gl.uniform1i(loc.uTex, 0);
        if (L.blinkTex && r.blink) gl.uniform4f(loc.uBlinkRect, ...r.blink.rect);
        else gl.uniform4f(loc.uBlinkRect, 0, 0, 0, 0);
        gl.uniform1f(loc.uBlinkFrame, blinkFrame);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, L.maskTex);
        gl.uniform1i(loc.uMask, 2);
        gl.uniform1f(loc.uHasMask, L.maskTex ? 1 : 0);
        // 分层：身体层、头发蒙版
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, L.bodyTex);
        gl.uniform1i(loc.uBodyTex, 3);
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, L.hairTex);
        gl.uniform1i(loc.uHairTex, 4);
        gl.uniform1f(loc.uHasLayer, L.bodyTex && L.hairTex ? 1 : 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, L.tex);
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
        layers.slice(0, -1).forEach(L => { gl.deleteTexture(L.tex); if (L.blinkTex) gl.deleteTexture(L.blinkTex); if (L.maskTex) gl.deleteTexture(L.maskTex); if (L.bodyTex) gl.deleteTexture(L.bodyTex); if (L.hairTex) gl.deleteTexture(L.hairTex); });
        layersRef.current = [top];
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      layersRef.current.forEach(L => { gl.deleteTexture(L.tex); if (L.blinkTex) gl.deleteTexture(L.blinkTex); if (L.maskTex) gl.deleteTexture(L.maskTex); if (L.bodyTex) gl.deleteTexture(L.bodyTex); if (L.hairTex) gl.deleteTexture(L.hairTex); });
      layersRef.current = [];
      glRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- 换图：解码好再上传，避免闪一下空白 ----------
  useEffect(() => {
    const rig = puppetRigFor(src);
    if (!rig) return;
    let cancelled = false;
    // 眨眼过渡帧是可选的：加载失败就当没有，退回压扁眼睛
    const blinkImg = rig.blink ? loadImage(rig.blink.src).catch(() => null) : Promise.resolve(null);
    // 摆动蒙版只在局部变形（头发/尾巴单独摆）时有用；现在全是整个人的刚体运动，不加载
    const maskImg: Promise<HTMLImageElement | null> = Promise.resolve(null);
    // 分层（scripts/remake/hair-layers.mjs）：去掉垂发的身体 + 垂发蒙版。没有就整张一起动
    // 分层头发暂时关掉：试下来垂在身体前面的头发一摆就跟头断开、补画的身体有污迹（见 hair-layers.mjs 顶部说明）
    const LAYERS_ON = false;
    const bodyImg = LAYERS_ON && rig.layer ? loadImage(rig.layer.body).catch(() => null) : Promise.resolve(null);
    const hairImg = LAYERS_ON && rig.layer ? loadImage(rig.layer.hair).catch(() => null) : Promise.resolve(null);
    loadImage(src).then(async img => {
      const bimg = await blinkImg;
      const mimg = await maskImg;
      const bdImg = await bodyImg, hrImg = await hairImg;
      const g = glRef.current;
      if (cancelled || !g) return;
      const { gl } = g;
      const tex = uploadTexture(gl, img);
      const blinkTex = bimg ? uploadTexture(gl, bimg) : null;
      const maskTex = mimg ? uploadTexture(gl, mimg) : null;
      const bodyTex = bdImg && hrImg ? uploadTexture(gl, bdImg) : null;
      const hairTex = bdImg && hrImg ? uploadTexture(gl, hrImg) : null;
      const w = img.naturalWidth, h = img.naturalHeight;
      layersRef.current = [...layersRef.current, { src, rig, tex, blinkTex, maskTex, bodyTex, hairTex, w, h, born: performance.now() }];
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
