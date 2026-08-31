const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images', 'items');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const items = [
  {
    name: 'item_onigiri.webp',
    emoji: '🍙',
    title: 'おにぎり（明太子）',
    sub: 'Mentaiko Onigiri',
    badge: '定番',
    color1: '#dc2626',
    color2: '#f87171',
    bg: '#18181b',
    detail: 'パリパリ海苔 × 辛子明太子'
  },
  {
    name: 'item_oden.webp',
    emoji: '🍢',
    title: 'おでん（大根・卵）',
    sub: 'Hot Oden Broth',
    badge: '熱々',
    color1: '#d97706',
    color2: '#fbbf24',
    bg: '#18181b',
    detail: '出汁染み大根 ＆ 煮込み玉子'
  },
  {
    name: 'item_karaage.webp',
    emoji: '🍗',
    title: 'からあげクン',
    sub: 'Crispy Karaage',
    badge: '人気',
    color1: '#ea580c',
    color2: '#fb923c',
    bg: '#18181b',
    detail: 'レジ横揚げたて ジューシー'
  },
  {
    name: 'item_croquette.webp',
    emoji: '🍘',
    title: '神戸牛コロッケ',
    sub: 'Kobe Beef Croquette',
    badge: '名物',
    color1: '#b45309',
    color2: '#f59e0b',
    bg: '#18181b',
    detail: 'サクサク衣 × 特製牛挽肉'
  },
  {
    name: 'item_bento.webp',
    emoji: '🍱',
    title: '特選 幕の内弁当',
    sub: 'Makunouchi Bento',
    badge: '豪華',
    color1: '#e11d48',
    color2: '#fda4af',
    bg: '#18181b',
    detail: '鮭塩焼き ＆ 揚げ物盛り合せ'
  },
  {
    name: 'item_cup_noodle.webp',
    emoji: '🍜',
    title: '海鮮カップ麺',
    sub: 'Seafood Cup Noodle',
    badge: '夜食',
    color1: '#0284c7',
    color2: '#38bdf8',
    bg: '#18181b',
    detail: '熱湯3分 濃厚シーフード'
  },
  {
    name: 'item_coffee.webp',
    emoji: '☕',
    title: '無糖ブラック缶コーヒー',
    sub: 'Deep Black Coffee',
    badge: '覚醒',
    color1: '#713f12',
    color2: '#a16207',
    bg: '#18181b',
    detail: '深煎りキリマンジャロブレンド'
  },
  {
    name: 'item_tea_ole.webp',
    emoji: '🥛',
    title: '関西限定 紅茶オレ',
    sub: 'Royal Milk Tea',
    badge: '限定',
    color1: '#9333ea',
    color2: '#c084fc',
    bg: '#18181b',
    detail: '濃厚ミルク × アッサム茶葉'
  },
  {
    name: 'item_kobe_pudding.webp',
    emoji: '🍮',
    title: '特製 神戸プリン',
    sub: 'Kobe Caramel Pudding',
    badge: '名物',
    color1: '#ca8a04',
    color2: '#fde047',
    bg: '#18181b',
    detail: '伝統の焦がしカラメルソース'
  },
  {
    name: 'item_dish_soap.webp',
    emoji: '🧴',
    title: '食器用洗剤（柑橘）',
    sub: 'Citrus Dish Soap',
    badge: '生活',
    color1: '#0d9488',
    color2: '#2dd4bf',
    bg: '#18181b',
    detail: '油汚れスッキリ 新生活必需品'
  },
  {
    name: 'item_towel.webp',
    emoji: '🧺',
    title: '綿100% フェイスタオル',
    sub: 'Cotton Towel Set',
    badge: '救急',
    color1: '#059669',
    color2: '#34d399',
    bg: '#18181b',
    detail: 'ふんわり吸水 今夜のお風呂に'
  },
  {
    name: 'item_umbrella.webp',
    emoji: '☂️',
    title: '耐風ワンタッチ折りたたみ傘',
    sub: 'Windproof Umbrella',
    badge: '防災',
    color1: '#2563eb',
    color2: '#60a5fa',
    bg: '#18181b',
    detail: '六甲山特有の急な雨に安心'
  },
  {
    name: 'item_clipper.webp',
    emoji: '✂️',
    title: '匠の技 ステンレス爪切り',
    sub: 'Craftsman Nail Clipper',
    badge: '逸品',
    color1: '#475569',
    color2: '#94a3b8',
    bg: '#18181b',
    detail: '岐阜県関市産 身だしなみ清潔'
  },
  {
    name: 'item_lipbalm.webp',
    emoji: '💄',
    title: '薬用リップ＆ハンドクリーム',
    sub: 'Lip Balm & Hand Cream',
    badge: '保湿',
    color1: '#db2777',
    color2: '#f472b6',
    bg: '#18181b',
    detail: '春の海風乾燥対策 好印象'
  },
  {
    name: 'item_stationery.webp',
    emoji: '📝',
    title: 'フリクションペン＆ノート',
    sub: 'Erasable Pen & Grid Note',
    badge: '学業',
    color1: '#4f46e5',
    color2: '#818cf8',
    bg: '#18181b',
    detail: '消せるボールペン × 方眼用紙'
  },
  {
    name: 'item_town_magazine.webp',
    emoji: '📖',
    title: '神戸タウン情報誌',
    sub: 'Kobe Walker Guide',
    badge: '知性',
    color1: '#16a34a',
    color2: '#4ade80',
    bg: '#18181b',
    detail: '北野・三宫・港町散歩マップ'
  }
];

async function generateCards() {
  console.log(`Generating ${items.length} illustrated P5-styled item cards...`);
  for (const it of items) {
    const idKey = it.name.replace('.webp', '');
    const titleEsc = escapeXml(it.title);
    const subEsc = escapeXml(it.sub);
    const badgeEsc = escapeXml(it.badge);
    const detailEsc = escapeXml(it.detail);

    const svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad_${idKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${it.bg}" />
          <stop offset="100%" stop-color="#09090b" />
        </linearGradient>
        <linearGradient id="accentGrad_${idKey}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${it.color1}" />
          <stop offset="100%" stop-color="${it.color2}" />
        </linearGradient>
        <filter id="glow_${idKey}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Card Background -->
      <rect width="400" height="300" rx="16" fill="url(#bgGrad_${idKey})" stroke="#3f3f46" stroke-width="3"/>

      <!-- Accent Top Pattern -->
      <path d="M 0,0 L 400,0 L 400,8 L 0,8 Z" fill="url(#accentGrad_${idKey})"/>
      <path d="M 0,0 L 120,0 L 90,40 L 0,40 Z" fill="url(#accentGrad_${idKey})" opacity="0.9"/>
      <text x="20" y="26" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" font-style="italic">${badgeEsc}</text>

      <!-- Outer Ring & Glow -->
      <circle cx="200" cy="120" r="70" fill="${it.color1}" opacity="0.15" filter="url(#glow_${idKey})"/>
      <circle cx="200" cy="120" r="55" fill="#27272a" stroke="${it.color2}" stroke-width="3" stroke-dasharray="8 4"/>

      <!-- Center Emoji Graphic -->
      <text x="200" y="145" font-family="sans-serif" font-size="64" text-anchor="middle">${it.emoji}</text>

      <!-- Divider Ribbon -->
      <path d="M 20,210 L 380,210" stroke="${it.color1}" stroke-width="2" stroke-dasharray="4 4" opacity="0.6"/>

      <!-- Japanese Title -->
      <text x="200" y="240" font-family="sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">${titleEsc}</text>

      <!-- English Subtitle -->
      <text x="200" y="262" font-family="sans-serif" font-size="12" font-weight="700" fill="${it.color2}" text-anchor="middle" letter-spacing="1.5" text-transform="uppercase">${subEsc}</text>

      <!-- Detail Snippet -->
      <text x="200" y="282" font-family="sans-serif" font-size="11" font-weight="500" fill="#a1a1aa" text-anchor="middle">${detailEsc}</text>
    </svg>
    `;

    const outPath = path.join(targetDir, it.name);
    await sharp(Buffer.from(svg))
      .resize(400, 300)
      .webp({ quality: 95 })
      .toFile(outPath);

    console.log(`Saved ${it.name} successfully!`);
  }
  console.log(`All ${items.length} item cards generated successfully!`);
}

generateCards();
