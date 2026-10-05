import React, { useMemo, useState } from 'react';
import PuppetSprite from './PuppetSprite';
import { PUPPET_RIGS } from '../data/puppetRigs';

// ---------------------------------------------------------
// 🧪 木偶调试台（开发用）：网址带 ?puppet 打开
//
// 列出所有标过骨骼的立绘，选角色、选衣服，挨个看表情、眨眼和动作。
// 再加 &rig 给头/眼睛/摆动区着色，&blink 一直闭眼，&talk 一直在说话。
// ---------------------------------------------------------
const PuppetLab: React.FC = () => {
  const q = new URLSearchParams(window.location.search);
  const all = useMemo(() => Object.keys(PUPPET_RIGS).sort(), []);
  const chars = useMemo(() => [...new Set(all.map(s => s.split('/')[3]))], [all]);
  const [char, setChar] = useState(q.get('char') || chars[0]);
  const files = all.filter(s => s.split('/')[3] === char);
  const outfits = [...new Set(files.map(s => { const n = s.split('/').pop()!.replace('.webp', ''); return n.includes('_') ? n.split('_')[0] : '(root)'; }))];
  const [outfit, setOutfit] = useState(q.get('outfit') || outfits[0]);
  const shown = files.filter(s => { const n = s.split('/').pop()!.replace('.webp', ''); return outfit === '(root)' ? !n.includes('_') : n.startsWith(outfit + '_'); });
  const [cur, setCur] = useState(0);
  const src = shown[Math.min(cur, shown.length - 1)];
  const [talk, setTalk] = useState(q.has('talk'));
  const zoom = Number(q.get('zoom') || 1);

  return (
    <div style={{ background: 'linear-gradient(#2b3550, #151a28)', color: '#eee', minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif' }}>
      <div style={{ width: 260, padding: 12, overflowY: 'auto', maxHeight: '100vh', fontSize: 13 }}>
        <div style={{ marginBottom: 8 }}>
          {chars.map(c => <button key={c} onClick={() => { setChar(c); setOutfit(''); setCur(0); }}
            style={{ margin: 2, padding: '2px 6px', background: c === char ? '#e0a' : '#334', color: '#fff', border: 0 }}>{c}</button>)}
        </div>
        <div style={{ marginBottom: 8 }}>
          {outfits.map(o => <button key={o} onClick={() => { setOutfit(o); setCur(0); }}
            style={{ margin: 2, padding: '2px 6px', background: o === outfit ? '#0ae' : '#334', color: '#fff', border: 0 }}>{o}</button>)}
        </div>
        {shown.map((s, i) => <div key={s} onClick={() => setCur(i)}
          style={{ cursor: 'pointer', padding: '2px 4px', background: s === src ? '#456' : 'transparent' }}>
          {s.split('/').pop()} {PUPPET_RIGS[s].blink ? '👁' : ''}
        </div>)}
        <label style={{ display: 'block', marginTop: 10 }}><input type="checkbox" checked={talk} onChange={e => setTalk(e.target.checked)} /> 说话中</label>
      </div>
      <div style={{ flex: 1, height: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
        {/* &zoom=4：放大看脸（眨眼帧、表情接缝） */}
        <div style={{ height: '95vh', transform: `scale(${zoom})`, transformOrigin: '50% 8%' }}>
          {src && <PuppetSprite src={src} speaking={talk} className="block h-full w-auto" />}
        </div>
      </div>
    </div>
  );
};

export default PuppetLab;
