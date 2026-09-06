// 🧹 立绘上飘着的碎片。
//
// 大厅那几张图的左上角有一小块颜色，跟人物本身完全不挨着——
// 是抠图时被带进来的一小片背景。屏幕上它就是一粒脏东西。
//
// 判据只有一条：alpha 的连通块里，除了最大的那一块（人物本身），
// 其余小到一定程度的一律删掉。真正属于人物的东西（飘起来的发梢、
// 手里拿的本子）都是跟身体连着的，不会单独成块。
import sharp from 'sharp';
import fs from 'fs';

const args=process.argv.slice(2);
const MINRATIO=Number((args.find(a=>a.startsWith('--min='))||'--min=0.02').split('=')[1]);
const files=args.filter(a=>!a.startsWith('--'));

for(const p of files){
  const {data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,N=W*H;
  const seen=new Int32Array(N).fill(-1);
  const comps=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;
    if(seen[i]>=0||data[i*4+3]<40) continue;
    const id=comps.length; const st=[i]; seen[i]=id; let n=0;
    while(st.length){
      const c=st.pop(); n++;
      const cx=c%W, cy=(c-cx)/W;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const nx=cx+dx, ny=cy+dy;
        if(nx<0||ny<0||nx>=W||ny>=H) continue;
        const j=ny*W+nx;
        if(seen[j]>=0||data[j*4+3]<40) continue;
        seen[j]=id; st.push(j);
      }
    }
    comps.push(n);
  }
  const biggest=comps.indexOf(Math.max(...comps));
  let dropped=0, blobs=0;
  const limit=Math.max(64, Math.round(comps[biggest]*MINRATIO));
  for(let i=0;i<N;i++){
    const id=seen[i];
    if(id<0||id===biggest) continue;
    if(comps[id]>limit) continue;
    data[i*4+3]=0; dropped++;
  }
  blobs=comps.filter((n,idx)=>idx!==biggest&&n<=limit).length;
  const tmp=p.replace(/\.webp$/,'.__tmp.webp');
  await sharp(Buffer.from(data),{raw:{width:W,height:H,channels:4}}).webp({quality:92}).toFile(tmp);
  console.log(p.split(/[\/]/).pop().padEnd(14),'连通块',comps.length,'│删掉碎片',blobs,'共',dropped,'像素 →',tmp);
}
