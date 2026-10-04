import React, { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------
// 🌬 动态立绘（"伪 Live2D"）
//
// 不拆图层，只用现有的整张立绘，靠几层叠起来的小幅变换让人"活"过来：
//   · 呼吸：从脚底往上的极轻微纵向伸缩
//   · 重心摇摆：周期跟呼吸错开（4.1s / 7.3s），叠在一起不会看出是循环
//   · 说话：打字期间很轻的上下起伏
//   · 换表情：新旧两张交叉淡化，不再硬切；同一个人换表情时按情绪做一个小动作
//
// 先在稻荷身上试，觉得好再往 LIVELY_SPRITES 里加人。
// 动画的 keyframes 在 App.tsx 的全局样式里（lively-*）。
// ---------------------------------------------------------

// 文件夹名 → 剧本里这个人的 speakerEn（用来判断"现在说话的是不是她"）
export const LIVELY_SPRITES: Record<string, { speakerEn: string }> = {
  inari: { speakerEn: 'Inari' }
};

const folderOf = (src: string | null | undefined): string | null => {
  const m = src?.match(/\/images\/characters\/([^/]+)\//);
  return m ? m[1] : null;
};

export const isLivelySprite = (src: string | null | undefined): boolean => {
  const f = folderOf(src);
  return !!f && f in LIVELY_SPRITES;
};

export const livelySpeakerOf = (src: string | null | undefined): string | null => {
  const f = folderOf(src);
  return f && LIVELY_SPRITES[f] ? LIVELY_SPRITES[f].speakerEn : null;
};

// 从文件名猜情绪，选换表情时的那个小动作。
// 幅度都比 galgame-anim-* 小得多：那套是给"整张贴纸跳一下"用的，
// 这里要的是人身上自然的反应。
const reactionFor = (src: string): string => {
  const name = (src.split('/').pop() || '').toLowerCase();
  if (/surprised|shock/.test(name)) return 'lively-react-jolt';
  if (/happy|cute|laugh|love/.test(name)) return 'lively-react-lift';
  if (/sad|cold/.test(name)) return 'lively-react-sink';
  if (/shy|jealous|pout/.test(name)) return 'lively-react-shy';
  if (/angry/.test(name)) return 'lively-react-huff';
  if (/sly|smug|curious|thinking|serious/.test(name)) return 'lively-react-tilt';
  return 'lively-react-settle';
};

const FADE_MS = 380;

interface Layer { src: string; id: number; }

interface Props {
  src: string;
  alt?: string;
  speaking?: boolean;
  // 当前那张图的尺寸类（决定整块立绘多大），旧图会绝对定位叠在它上面
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  // 套在每一层包裹 div 上。立绘要按父容器高度铺满时（h-full）得一路传下去，否则高度断掉
  boxClassName?: string;
  onError?: () => void;
}

const LivelySprite: React.FC<Props> = ({ src, alt = '', speaking = false, imgClassName = '', imgStyle, boxClassName = '', onError }) => {
  const idRef = useRef(0);
  const [current, setCurrent] = useState<Layer>({ src, id: 0 });
  const [leaving, setLeaving] = useState<Layer | null>(null);
  // 换表情的小动作直接改 DOM 的 class 重播，不用 key 重挂：
  // 重挂会连里面的 <img> 一起重建，偶尔会闪一帧
  const reactRef = useRef<HTMLDivElement>(null);
  const playReaction = (cls: string) => {
    const el = reactRef.current;
    if (!el) return;
    el.classList.forEach(c => { if (c.startsWith('lively-react-')) el.classList.remove(c); });
    void el.offsetWidth; // 强制回流，让同名动画也能从头再播
    el.classList.add(cls);
  };

  useEffect(() => {
    if (src === current.src) return;
    let cancelled = false;
    // 先把新图解码好再换：没加载完就开始淡入的话，中间会闪一下空白
    const img = new Image();
    img.src = src;
    const swap = () => {
      if (cancelled) return;
      const id = ++idRef.current;
      const sameChar = folderOf(src) === folderOf(current.src);
      setLeaving(current);
      setCurrent({ src, id });
      if (sameChar) playReaction(reactionFor(src));
    };
    (img.decode ? img.decode() : Promise.resolve()).then(swap, swap);
    return () => { cancelled = true; };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), FADE_MS + 40);
    return () => clearTimeout(t);
  }, [leaving]);

  return (
    <div className={`lively-sway ${boxClassName}`}>
      <div className={`lively-breathe ${boxClassName}`}>
        <div ref={reactRef} className={boxClassName}>
          <div className={`${speaking ? 'lively-talk' : ''} ${boxClassName}`}>
            <div className={`relative ${boxClassName}`}>
              <img
                key={current.id}
                src={current.src}
                alt={alt}
                decoding="async"
                draggable={false}
                className={imgClassName}
                style={imgStyle}
                onError={onError}
              />
              {leaving && (
                <img
                  key={leaving.id}
                  src={leaving.src}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="lively-fade-out absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none"
                  style={imgStyle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivelySprite;
