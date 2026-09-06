// 👻 沿着轮廓的一圈白色"重影"。
//
// 这些立绘有一部分是拿另一张改出来的，改完之后旧的头发轮廓
// 以一条发白的丝留在了新轮廓外面。放到深色背景上，看着像人物带了个残影。
//
// 判据用位置，不用颜色深浅：把 alpha 往里腐蚀若干像素得到"核心"，
// 核心以内的浅色一律是画出来的（眼睛高光、衣服图案、白衬衫），不许动；
// 只有落在核心以外那一圈里的浅色连通块才可能是重影。
// 再要求这个块大部分邻居是透明或深色描边——真正的白衣服边缘旁边还是白衣服。
//
// 用法：node scripts/kill-ghost-edge.mjs <文件…> [--band=8] [--light=195] [--dry]
import sharp from 'sharp';
import fs from 'fs';

const args=process.argv.slice(2);
const opt=k=>{const a=args.find(s=>s.startsWith('--'+k+'='));return a?Number(a.split('=')[1]):null;};
const DRY=args.includes('--dry');
const BAND=opt('band')??8, LIGHT=opt('light')??195;
const files=args.filter(a=>!a.startsWith('--'));

for(const p of files){
  const {data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,N=W*H,idx=(x,y)=>(y*W+x)*4;
  // 距离最近透明像素有多远（切比雪夫距离，两遍扫描够用）
  const dist=new Int32Array(N).fill(1e9);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;
    if(data[i*4+3]<60){dist[i]=0;continue;}
    if(x>0)dist[i]=Math.min(dist[i],dist[i-1]+1);
    if(y>0)dist[i]=Math.min(dist[i],dist[i-W]+1);
    if(x>0&&y>0)dist[i]=Math.min(dist[i],dist[i-W-1]+1);
  }
  for(let y=H-1;y>=0;y--)for(let x=W-1;x>=0;x--){
    const i=y*W+x; if(dist[i]===0)continue;
    if(x<W-1)dist[i]=Math.min(dist[i],dist[i+1]+1);
    if(y<H-1)dist[i]=Math.min(dist[i],dist[i+W]+1);
    if(x<W-1&&y<H-1)dist[i]=Math.min(dist[i],dist[i+W+1]+1);
  }
  const light=(x,y)=>{const i=idx(x,y);return data[i+3]>40&&data[i]>LIGHT&&data[i+1]>LIGHT&&data[i+2]>LIGHT;};
  // 按像素判，不按连通块判。
  // 按块判会漏：轮廓上的白丝常常经过一条细链连到身体里的浅色区（毛衣上的猫、
  // 皮肤高光），于是整块被当成"长在里面的"保下来，白丝一根没少。
  let killed=0, kept=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!light(x,y)) continue;
    if(dist[y*W+x]>BAND){ kept++; continue; }
    data[idx(x,y)+3]=0; killed++;
  }
  console.log(p.split(/[\/]/).pop().padEnd(26),'抹掉重影',String(killed).padStart(6),'│保留内部浅色像素',kept);
  // sharp 读写同一个文件会报错，而这台机器上目标文件常被开发服务器占着，
  // rename/copy 也会失败。所以只落一个 .__tmp.webp，换文件交给调用方（cp）。
  if(!DRY){
    const tmp=p.replace(/\.webp$/,'.__tmp.webp');
    await sharp(Buffer.from(data),{raw:{width:W,height:H,channels:4}}).webp({quality:92}).toFile(tmp);
    console.log('   写出 ->', tmp);
  }
}
