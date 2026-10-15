import React from 'react';
import { EMOJI_ICONS } from '../data/emojiIcons';

// ---------------------------------------------------------
// 🖼 emoji → 专门画的图标（public/images/icons/emoji/，scripts/icons/gen-emoji-icons.mjs 出的）
//
// 游戏里所有当图标用的 emoji 都走这里，系统 emoji 字体不再出现在画面上：
// 各平台的 emoji 长得不一样，而且跟这个游戏的画风完全不搭。
//
//   <Emo e="📖" />                 单个图标，默认 1.15em，跟着文字大小走
//   <EmoText text="🍙 饭团" />      一段字里夹着 emoji：emoji 换成图标，字照常
//   emojiHtml(html)                 HTML 字符串（AI 回复、带高亮的台词）里的 emoji 换成 <img>
//   <SvgEmo e x y size />           SVG 里
//   stripEmoji(s)                   放不了图的地方（title、placeholder、<option>）直接去掉
//
// 数据里照旧写 emoji（物品、菜单、地点……）：emoji 本身就是那个图标的名字，不用另起一套 id。
// ---------------------------------------------------------

const EMO_RE = /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*)/gu;
const norm = (e: string) => e.replace(/\uFE0F/g, '');
// 这几个在界面上是排版符号（按钮上的箭头、勾），不是图标：保持文字
const KEEP = new Set(['▶', '◀', '✔']);
export const emojiSrc = (e: string): string | null => {
  if (KEEP.has(norm(e))) return null;
  const f = EMOJI_ICONS[norm(e)];
  return f ? `/images/icons/emoji/${f}.webp` : null;
};

interface EmoProps {
  e: string | null | undefined;
  // 像素；不写就是 1.15em，跟着周围的字号
  size?: number;
  className?: string;
  title?: string;
}

export const Emo: React.FC<EmoProps> = ({ e, size, className = '', title }) => {
  if (!e) return null;
  // 传进来的不止一个 emoji（比如 '🍱🍙'）就逐个画
  const parts = [...e.matchAll(EMO_RE)].map(m => m[0]);
  if (parts.length > 1) return <>{parts.map((p, i) => <Emo key={i} e={p} size={size} className={className} />)}</>;
  const src = emojiSrc(e);
  const style: React.CSSProperties = size
    ? { width: size, height: size }
    : { width: '1.15em', height: '1.15em', verticalAlign: '-0.2em' };
  if (!src) {
    // 还没画的（新加的 emoji、AI 临时冒出来的）：退回文字，至少不留空框
    return <span className={className} style={size ? { fontSize: size * 0.85, lineHeight: 1 } : undefined}>{e}</span>;
  }
  return <img src={src} alt="" title={title} draggable={false} className={`inline-block object-contain select-none ${className}`} style={style} />;
};

// text 可以是任何东西：数字、false、null 原样交给 React（自动改写时整段表达式都包进来，类型不一定是字符串）
export const EmoText: React.FC<{ text: unknown; size?: number; className?: string }> = ({ text, size, className }) => {
  if (typeof text !== 'string') return <>{text as React.ReactNode}</>;
  if (!text) return null;
  const out: React.ReactNode[] = [];
  let last = 0, k = 0;
  for (const m of text.matchAll(EMO_RE)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push(emojiSrc(m[0]) ? <Emo key={k++} e={m[0]} size={size} /> : m[0]);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <span className={className}>{out}</span>;
};

// SVG 里（<text> 放不了 <img>）：画成 <image>，(x, y) 是左上角
export const SvgEmo: React.FC<{ e: string; x: number; y: number; size: number }> = ({ e, x, y, size }) => {
  const src = emojiSrc(e);
  if (!src) return <text x={x + size / 2} y={y + size * 0.85} textAnchor="middle" fontSize={size * 0.85}>{e}</text>;
  return <image href={src} x={x} y={y} width={size} height={size} preserveAspectRatio="xMidYMid meet" />;
};

export const hasEmoji = (s: string | null | undefined) => !!s && new RegExp(EMO_RE.source, 'u').test(s);

export const emojiHtml = (html: string): string =>
  (html || '').replace(EMO_RE, m => {
    const src = emojiSrc(m);
    return src ? `<img src="${src}" alt="" draggable="false" style="display:inline-block;width:1.15em;height:1.15em;vertical-align:-0.2em;object-fit:contain">` : m;
  });

export const stripEmoji = (s: string): string => (s || '').replace(EMO_RE, '').replace(/\s{2,}/g, ' ').trim();

export default Emo;
