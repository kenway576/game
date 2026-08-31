import React, { useState, useEffect } from 'react';

interface Props {
  bgUrl: string;
  customBg?: string | null;
  // 图不存在时的替补（序章新场景的图还没交付时用）
  fallbackUrl?: string | null;
}

const Background: React.FC<Props> = ({ bgUrl, customBg, fallbackUrl }) => {
  const primary = customBg || bgUrl;
  const [src, setSrc] = useState(primary);

  // 换场景时回到首选图重试一次：图补进 public 之后无需改代码即可自动生效
  useEffect(() => { setSrc(primary); }, [primary]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-gray-900 select-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black z-0"></div>
      <img
        key={src}
        src={src}
        alt="Background"
        loading="eager"
        decoding="async"
        onError={() => { if (fallbackUrl && src !== fallbackUrl) setSrc(fallbackUrl); }}
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-10 scale-105 transition-all duration-1000 ease-in-out"
        style={{ animation: 'breathe 20s ease-in-out infinite' }}
      />
      <div className="absolute inset-0 bg-black/30 z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

export default Background;
