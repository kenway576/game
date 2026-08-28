import React, { useState, useEffect } from 'react';
import { Character } from '../types';
import { SPRITE_OUTLINE, SPRITE_OUTLINE_WIDTH } from '../constants';

interface Props {
  character: Character;
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
  parts.push(isSpeaking ? 'brightness(1.06) saturate(1.05)' : 'brightness(0.97)');
  return parts.join(' ');
};

const CharacterSprite: React.FC<Props> = ({ character, isSpeaking, className = "", fit = 'contain' }) => {
  const [hasError, setHasError] = useState(false);

  // 换装/换表情（URL 变化）时重置加载失败状态
  useEffect(() => { setHasError(false); }, [character.avatarUrl]);

  // 如果没有 URL 或已经报错，显示占位符
  if (!character.avatarUrl || hasError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className} ${character.color} bg-opacity-20 border-4 border-white/10 rounded-[2rem]`}>
        <span className="text-4xl font-black text-white/20">{character.name.slice(0, 1)}</span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full flex items-end justify-center ${className}`}>
      {/* key=URL：表情变化时强制重新渲染，避免卡在旧图上 */}
      <img
        key={character.avatarUrl}
        src={character.avatarUrl}
        alt={character.name}
        decoding="async"
        className={`${fit === 'height' ? 'h-full w-auto max-w-none' : 'w-full h-full'} object-contain transition-all duration-300`}
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
