import React from 'react';
import { stickerById, StickerDef } from '../data/stickers';

// 📱 一张表情包。
// 角色贴图是裁好的胸像（白边已经烧在图里），字用 CSS 叠上去：
// 白字黑描边、微微歪一点——LINE 贴图那种"手写上去"的感觉。
// 通用贴图是一个大 emoji 坐在渐变圆角块上。
interface Props {
  id?: string;
  def?: StickerDef;
  size?: number;
  // 气泡里不显示意思；面板里挑的时候显示
  showMeaning?: boolean;
  en?: boolean;
}

const Sticker: React.FC<Props> = ({ id, def, size = 120, showMeaning = false, en = false }) => {
  const s = def || stickerById(id);
  if (!s) return null;
  const capSize = Math.max(10, Math.round(size * 0.13));
  // 每张歪的角度固定（按 id 算），不然每次重渲染都抖一下
  const tilt = ((s.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0) % 7) - 3) * 1.2;
  return (
    <span className="inline-flex flex-col items-center select-none" style={{ width: size }}>
      <span className="relative block" style={{ width: size, height: size }}>
        {s.img ? (
          <img src={s.img} alt={s.jp} draggable={false}
               className="w-full h-full object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.45)]" />
        ) : (
          <span className={`absolute inset-[8%] rounded-[28%] bg-gradient-to-br ${s.tint || 'from-zinc-300 to-zinc-500'} border-[3px] border-white shadow-[0_3px_8px_rgba(0,0,0,0.4)] flex items-center justify-center`}>
            <span style={{ fontSize: size * 0.42, lineHeight: 1 }}>{s.emoji}</span>
          </span>
        )}
        <span
          className="absolute left-1/2 bottom-[4%] whitespace-nowrap font-black text-white px-1"
          style={{
            fontSize: capSize,
            transform: `translateX(-50%) rotate(${tilt}deg)`,
            WebkitTextStroke: `${Math.max(2, Math.round(capSize / 4))}px #1f1b2e`,
            paintOrder: 'stroke fill',
            letterSpacing: '0.02em'
          }}
        >
          {s.jp}
        </span>
      </span>
      {showMeaning && (
        <span className="mt-0.5 text-[9px] text-white/45 leading-tight text-center truncate w-full">
          {en ? s.en : s.zh}
        </span>
      )}
    </span>
  );
};

export default Sticker;
