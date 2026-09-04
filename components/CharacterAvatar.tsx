import React from 'react';
import { CharacterId } from '../types';
import { CHARACTERS } from '../constants';

// ---------------------------------------------------------
// 🙂 圆形头像
//
// 圆框里以前直接放的是立绘。立绘是 528×1400 的全身站姿图，
// 塞进一个正方形再 object-cover，正中间那一块是**胸口**——
// 所以那些圆圈里全是"半个身子"，脸在框外面。
//
// 加 object-top 只能算缓解：头在整张图里只占两成高，
// 顶上对齐之后脸只占圆框上面一小块，剩下全是校服。
//
// 真正的解法是裁一张头像出来（scripts/make-avatars.mjs，
// 按内容高度的 24% 取头，横向中心取中位数避开呆毛和狐耳）。
// 这个组件就是那批图的唯一入口；万一某张没生成出来，
// 回退到立绘 + object-top，至少不会变成一张空框。
// ---------------------------------------------------------

interface Props {
  charId: CharacterId;
  /** 圆框直径的 tailwind 类，例如 "w-10 h-10" */
  size?: string;
  className?: string;
  ring?: string;
}

const CharacterAvatar: React.FC<Props> = ({
  charId, size = 'w-10 h-10', className = '', ring = 'border border-white/15'
}) => {
  const c = CHARACTERS[charId];
  return (
    <div className={`${size} rounded-full overflow-hidden bg-black/40 shrink-0 ${ring} ${className}`}>
      <img
        src={`/images/avatars/${charId}.webp`}
        alt={c?.name || ''}
        className="w-full h-full object-cover"
        onError={e => {
          const img = e.currentTarget;
          if (img.dataset.fallback) return;
          img.dataset.fallback = '1';
          img.className = 'w-full h-full object-cover object-top';
          img.src = c?.avatarUrl || '';
        }}
      />
    </div>
  );
};

export default CharacterAvatar;
