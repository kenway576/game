import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { SPRITE_OUTLINE, SPRITE_OUTLINE_WIDTH } from '../constants';

interface Props {
  character: Character;
  emotion?: string;
  isSpeaking: boolean;
  className?: string;
  // 'height'：按容器高度对齐（所有角色等高，宽图向两侧展开）；'contain'：完整塞进容器
  fit?: 'contain' | 'height';
}

// 立绘描边 + 落地阴影：基于透明 PNG 的 alpha 轮廓，用 drop-shadow 画出白/黑圈
const buildSpriteFilter = (isSpeaking: boolean) => {
  const parts: string[] = [];
  if (SPRITE_OUTLINE !== 'none') {
    const c = SPRITE_OUTLINE === 'white' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)';
    const w = SPRITE_OUTLINE_WIDTH;
    parts.push(
      `drop-shadow(${w}px 0 0 ${c})`,
      `drop-shadow(-${w}px 0 0 ${c})`,
      `drop-shadow(0 ${w}px 0 ${c})`,
      `drop-shadow(0 -${w}px 0 ${c})`
    );
  }
  parts.push('drop-shadow(0 14px 28px rgba(0,0,0,0.55))'); // 柔和落地阴影，增强与场景的融合感
  parts.push(isSpeaking ? 'brightness(1.06) saturate(1.08)' : 'brightness(0.97)');
  return parts.join(' ');
};

// 识别情绪大类以触发对应的 Galgame 动作
const getEmotionAnimClass = (emo: string): string => {
  const lower = emo.toLowerCase();
  if (lower.includes('shock') || lower.includes('surprised') || lower.includes('angry')) {
    return 'galgame-anim-shock';
  }
  if (lower.includes('happy') || lower.includes('laugh') || lower.includes('smile') || lower.includes('cute') || lower.includes('love') || lower.includes('cheer')) {
    return 'galgame-anim-hop';
  }
  if (lower.includes('shy') || lower.includes('pout') || lower.includes('blush') || lower.includes('tea')) {
    return 'galgame-anim-shy';
  }
  if (lower.includes('sad') || lower.includes('worry') || lower.includes('cold') || lower.includes('droop')) {
    return 'galgame-anim-droop';
  }
  if (lower.includes('thinking') || lower.includes('curious') || lower.includes('lecturing') || lower.includes('reading')) {
    return 'galgame-anim-think';
  }
  return 'tachie-anim-speak';
};

// 获取 Galgame 情绪气泡符号
const getEmotionBubbleIcon = (emo: string): string | null => {
  const lower = emo.toLowerCase();
  if (lower.includes('shock') || lower.includes('surprised')) return '❗';
  if (lower.includes('angry')) return '💢';
  if (lower.includes('love')) return '💖';
  if (lower.includes('happy') || lower.includes('smile') || lower.includes('cute') || lower.includes('laugh')) return '✨';
  if (lower.includes('shy') || lower.includes('blush') || lower.includes('pout')) return '💦';
  if (lower.includes('thinking') || lower.includes('curious')) return '💡';
  return null;
};

const CharacterSprite: React.FC<Props> = ({ character, emotion = 'neutral', isSpeaking, className = "", fit = 'contain' }) => {
  const [hasError, setHasError] = useState(false);
  const [activeAnim, setActiveAnim] = useState<string>('');
  const [pokeCount, setPokeCount] = useState(0);
  const [isPoked, setIsPoked] = useState(false);
  const prevUrlRef = useRef(character.avatarUrl);

  // 换装/换表情（URL 变化或 emotion 变化）时触发 Galgame 动态动作与气泡
  useEffect(() => {
    setHasError(false);
    const animClass = getEmotionAnimClass(emotion);

    setActiveAnim(animClass);

    const timer = setTimeout(() => {
      setActiveAnim('');
    }, 850);


    prevUrlRef.current = character.avatarUrl;
    return () => {
      clearTimeout(timer);
    };
  }, [character.avatarUrl, emotion]);

  // 点击立绘的反馈：柔光 + 光尘，落点跟着鼠标。
  // 不再弹 emoji 气泡——情绪由换立绘表达，头顶顶个符号是十年前的做法。
  const [touch, setTouch] = useState<{ x: number; y: number; key: number } | null>(null);

  const handlePoke = (e: React.MouseEvent) => {
    e.stopPropagation();
    const box = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTouch({
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
      key: Date.now()
    });
    setIsPoked(true);
    setPokeCount(prev => prev + 1);
    setTimeout(() => setIsPoked(false), 620);
    setTimeout(() => setTouch(null), 1100);
  };

  // 如果没有 URL 或已经报错，显示占位符
  if (!character.avatarUrl || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className} ${character.color} bg-opacity-20 border-4 border-white/10 rounded-[2rem]`}>
        <span className="text-4xl font-black text-white/20">{character.name.slice(0, 1)}</span>
      </div>
    );
  }

  // 决定当前立绘的复合动画类名
  const dynamicAnimClass = isPoked
    ? 'galgame-anim-poke'
    : activeAnim
      ? activeAnim
      : 'tachie-anim-breathe';

  return (
    <div
      onClick={handlePoke}
      title=""
      className={`relative w-full h-full flex items-end justify-center cursor-pointer select-none ${className}`}
    >
      {/* 触摸反馈：落点柔光 + 一圈扩散 + 几粒上浮的光尘 */}
      {touch && (
        <div
          key={touch.key}
          className="absolute z-30 pointer-events-none"
          style={{ left: `${touch.x}%`, top: `${touch.y}%`, width: 0, height: 0 }}
        >
          {/* 柔光：没有边界的一团暖光 */}
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full touch-bloom"
            style={{
              width: 150, height: 150,
              background: 'radial-gradient(circle, rgba(255,248,225,0.55) 0%, rgba(255,226,168,0.22) 38%, rgba(255,214,140,0) 70%)'
            }}
          />
          {/* 扩散环 */}
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/70 touch-ring"
            style={{ width: 26, height: 26 }}
          />
          {/* 光尘：五粒，各自的角度和延迟都不同 */}
          {[0, 1, 2, 3, 4].map(i => (
            <span
              key={i}
              className="absolute rounded-full bg-amber-50 touch-mote"
              style={{
                width: i % 2 ? 3 : 4,
                height: i % 2 ? 3 : 4,
                left: (i - 2) * 13,
                top: 0,
                animationDelay: `${i * 55}ms`,
                boxShadow: '0 0 8px 2px rgba(255,236,190,0.75)'
              }}
            />
          ))}
        </div>
      )}

      {/* 说话时的柔光背晕反馈 */}
      {isSpeaking && (
        <div className="absolute inset-x-0 bottom-0 top-1/4 pointer-events-none bg-radial from-yellow-400/15 via-transparent to-transparent z-0 animate-pulse duration-1000" />
      )}

      {/* key=URL：表情变化时平滑过场与重置动画 */}
      <img
        key={`${character.avatarUrl}_${pokeCount}`}
        src={character.avatarUrl}
        alt={character.name}
        decoding="async"
        className={`${fit === 'height' ? 'h-full w-auto max-w-none' : 'w-full h-full'} object-contain transition-all duration-300 ${dynamicAnimClass}`}
        style={{ filter: buildSpriteFilter(isSpeaking) }}
        onError={(e) => {
          console.error("Image Dead:", character.name, e.currentTarget.src);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default CharacterSprite;

