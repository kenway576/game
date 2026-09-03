// ============================================================================
// 剧本立绘一致性检查
//
// 一个场景里同一个人不该换装。表情可以变（neutral → happy → shy），
// 但 casual_* 换成 school_*、cardigan_* 换成默认那套，观感上就是"人换了一身衣服"，
// 严重时甚至像换了个人（有些素材不同服装组的画风差得很远）。
//
// 这个脚本顺着剧本文件从上往下扫：遇到 scene 节点就切换当前场景，
// 遇到 characterImage 就记下"谁 / 哪套服装 / 哪个表情"，最后按场景汇总。
// 同一场景内某个角色出现两套以上服装 → 报警。
//
// 用法: node scripts/audit-sprite-outfits.mjs [剧本文件...]
//       默认检查 story/ 下所有 .ts
// ============================================================================
import fs from 'fs';
import path from 'path';

// 这些词是表情，不是服装。文件名首段命中就归到"默认那套"。
const EMOTIONS = new Set([
  'neutral', 'happy', 'sad', 'angry', 'shy', 'smug', 'surprised', 'love',
  'laugh', 'pout', 'thinking', 'think', 'smile', 'cool', 'cute', 'tired',
  'sleepy', 'sleep', 'cheer', 'lecturing', 'reading', 'welcome', 'eating',
  'camera', 'umbrella', 'elegant', 'snow', 'sparkle', 'game', 'tea', 'bag',
  'curious', 'sly', 'cold', 'jealous', 'serious', 'majestic', 'ok'
]);

const parse = (url) => {
  const m = url.match(/\/images\/characters\/(?:([a-z_0-9]+)\/)?([a-z_0-9]+)\.webp/i);
  if (!m) return null;
  const [, dir, file] = m;
  const char = dir || file.replace(/_[a-z0-9]+$/, ''); // 散装文件如 clerk_misaki_welcome
  const rest = dir ? file : file.slice(char.length + 1);
  const head = rest.split('_')[0];
  return { char, outfit: EMOTIONS.has(head) ? '(默认)' : head, face: rest, url };
};

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync('story').filter(f => f.endsWith('.ts')).map(f => path.join('story', f));

let problems = 0;

for (const file of targets) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  // 剧本里立绘路径多半写成模板串（`${MAKI}punk_pout.webp`），
  // 先把文件顶部那些前缀常量解出来，否则会漏掉绝大多数引用。
  const prefixes = {};
  for (const m of src.matchAll(/const ([A-Z_]+)\s*=\s*'([^']*characters\/[^']*)'/g)) {
    prefixes[m[1]] = m[2];
  }
  let scene = '(开场前)', sceneLine = 0;
  // scene -> char -> Map<outfit, {count, faces:Set, lines:[]}>
  const byScene = new Map();

  lines.forEach((line, idx) => {
    const s = line.match(/\bscene:\s*'([a-z_0-9]+)'/);
    if (s) { scene = s[1]; sceneLine = idx + 1; return; }
    // 两种写法都要认：直接写死的字符串，和用前缀常量拼的模板串
    const quoted = line.match(/characterImage:\s*'([^']*)'/);
    const templ = line.match(/characterImage:\s*`\$\{([A-Z_]+)\}([^`]*)`/);
    if (!quoted && !templ) return;
    const url = quoted ? quoted[1] : (prefixes[templ[1]] || '') + templ[2];
    if (!url) return;                        // 空串 = 立绘退场
    const info = parse(url);
    if (!info) { console.log(`⚠️  ${file}:${idx + 1} 无法解析立绘路径: ${url}`); return; }
    const key = `${scene}@${sceneLine}`;
    if (!byScene.has(key)) byScene.set(key, new Map());
    const chars = byScene.get(key);
    if (!chars.has(info.char)) chars.set(info.char, new Map());
    const outfits = chars.get(info.char);
    if (!outfits.has(info.outfit)) outfits.set(info.outfit, { faces: new Set(), lines: [] });
    outfits.get(info.outfit).faces.add(info.face);
    outfits.get(info.outfit).lines.push(idx + 1);
  });

  console.log(`\n=== ${file} ===`);
  for (const [key, chars] of byScene) {
    const [scn] = key.split('@');
    for (const [char, outfits] of chars) {
      const tag = `  ${scn.padEnd(28)} ${char.padEnd(14)}`;
      if (outfits.size > 1) {
        problems++;
        console.log(`❌${tag} 同一场景内换了 ${outfits.size} 套服装:`);
        for (const [outfit, d] of outfits) {
          console.log(`     · ${outfit.padEnd(12)} ${[...d.faces].join(', ')}   (行 ${d.lines.join(',')})`);
        }
      } else {
        const [[outfit, d]] = [...outfits];
        console.log(`✅${tag} ${outfit.padEnd(12)} ${[...d.faces].join(', ')}`);
      }
    }
  }
}

console.log(problems ? `\n❌ 共 ${problems} 处同场景换装` : '\n✅ 没有同场景换装');
process.exit(problems ? 1 : 0);
