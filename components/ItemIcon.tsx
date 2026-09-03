import React, { useState } from 'react';

// ---------------------------------------------------------
// 🎨 物品图标。图标文件名就是物品 id，所以不用再维护一张映射表。
//
// 加载不出来就退回 emoji。这一层不是装饰性的容错：
// 图标是拼版切出来的，将来加新物品时必然有一段时间"数据有了、图还没切"，
// 那期间界面得照样能用，而不是留一排空框。
// ---------------------------------------------------------

interface Props {
  id?: string | null;
  emoji: string;
  size?: number;
  className?: string;
}

const ItemIcon: React.FC<Props> = ({ id, emoji, size = 32, className = '' }) => {
  const [failed, setFailed] = useState(false);
  if (!id || failed) {
    return (
      <span className={`inline-flex items-center justify-center leading-none ${className}`}
            style={{ width: size, height: size, fontSize: Math.round(size * 0.8) }}>
        {emoji}
      </span>
    );
  }
  return (
    <img
      src={`/images/items/${id}.webp`}
      alt=""
      onError={() => setFailed(true)}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default ItemIcon;
