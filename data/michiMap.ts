import { PracticeTier } from '../types';

// ==========================================================
// 🗺️ 三宫站周边示意图（给游客指路用）
//
// 真实地理的一个简化网格：上北下南。神户人自己指路说「山側／海側」——
// 山在北、海在南，整座城市就是一条夹在山和海之间的坡。
//
//         x=0        x=1       x=2        x=3        x=4        x=5
//  y=0  ─────────────── 生田神社 ─ 北野坂 ──────────────────────  山側（北）
//  y=1  元町駅 ─────────────────────────── 三ノ宮駅 ─────────
//  y=2  ──────────────────────── センター街 ─────── 国際会館 ─
//  y=3  ──────── 南京町 ─ 大丸 ─────────────────────── 市役所 ─
//  y=4  ──────── メリケン ────────────────────────────────── 海側（南）
//
// 相对位置跟现实一致：生田神社在三宫站的西北、北野坂在正北，
// センター街往西通向元町，南京町和大丸在西南，市役所和花時計在花之路往南，
// 再往南就是海边的メリケンパーク。距离是示意的，不是比例尺。
// ==========================================================

export type Dir = 'N' | 'E' | 'S' | 'W';
export interface Node { x: number; y: number }

export const MAP_W = 6;
export const MAP_H = 5;

export interface Landmark {
  id: string;
  at: Node;
  jp: string;
  reading: string;
  zh: string;
  en: string;
  emoji: string;
}

export const LANDMARKS: Landmark[] = [
  { id: 'sannomiya', at: { x: 4, y: 1 }, jp: '三ノ宮駅', reading: 'さんのみやえき', zh: '三宫站', en: 'Sannomiya Sta.', emoji: '🚉' },
  { id: 'motomachi', at: { x: 0, y: 1 }, jp: '元町駅', reading: 'もとまちえき', zh: '元町站', en: 'Motomachi Sta.', emoji: '🚉' },
  { id: 'ikuta', at: { x: 2, y: 0 }, jp: '生田神社', reading: 'いくたじんじゃ', zh: '生田神社', en: 'Ikuta Shrine', emoji: '⛩️' },
  { id: 'kitano', at: { x: 3, y: 0 }, jp: '北野坂', reading: 'きたのざか', zh: '北野坂', en: 'Kitano-zaka', emoji: '⛰️' },
  { id: 'center', at: { x: 3, y: 2 }, jp: 'センター街', reading: 'センターがい', zh: '中心街', en: 'Center Gai', emoji: '🛍️' },
  { id: 'kokusai', at: { x: 5, y: 2 }, jp: '国際会館', reading: 'こくさいかいかん', zh: '国际会馆', en: 'Kokusai Kaikan', emoji: '🏢' },
  { id: 'daimaru', at: { x: 2, y: 3 }, jp: '大丸', reading: 'だいまる', zh: '大丸百货', en: 'Daimaru', emoji: '🏬' },
  { id: 'nankin', at: { x: 1, y: 3 }, jp: '南京町', reading: 'なんきんまち', zh: '南京町', en: 'Nankinmachi', emoji: '🏮' },
  { id: 'cityhall', at: { x: 5, y: 3 }, jp: '市役所', reading: 'しやくしょ', zh: '市政府', en: 'City Hall', emoji: '🌸' },
  { id: 'meriken', at: { x: 1, y: 4 }, jp: 'メリケンパーク', reading: 'メリケンパーク', zh: '美利坚公园', en: 'Meriken Park', emoji: '🗼' }
];

export const landmark = (id: string) => LANDMARKS.find(l => l.id === id)!;

// 横着的街名（沿 y），竖着的街名（沿 x）。地图上印着，玩家读图用。
export const STREETS_H: Record<number, string> = { 0: '山手幹線', 1: 'JR線沿い', 2: 'センター街', 3: '明石町筋', 4: '海岸通' };
export const STREETS_V: Record<number, string> = { 1: 'トアロード', 2: '生田ロード', 3: '北野坂', 5: 'フラワーロード' };

const STEP: Record<Dir, Node> = { N: { x: 0, y: -1 }, E: { x: 1, y: 0 }, S: { x: 0, y: 1 }, W: { x: -1, y: 0 } };
const RIGHT: Record<Dir, Dir> = { N: 'E', E: 'S', S: 'W', W: 'N' };
const LEFT: Record<Dir, Dir> = { N: 'W', W: 'S', S: 'E', E: 'N' };

// 指路的一段：往前走 n 个路口，然后右转 / 左转 / 到了
export interface Leg { n: number; turn: 'R' | 'L' | 'end' }

export interface WalkResult {
  path: Node[];      // 游客走过的每一个路口（含起点）
  end: Node;
  offMap: boolean;   // 走出了地图
}

export const walk = (start: Node, facing: Dir, legs: Leg[]): WalkResult => {
  let p = { ...start };
  let d = facing;
  const path: Node[] = [{ ...p }];
  for (const leg of legs) {
    for (let i = 0; i < leg.n; i++) {
      p = { x: p.x + STEP[d].x, y: p.y + STEP[d].y };
      if (p.x < 0 || p.y < 0 || p.x >= MAP_W || p.y >= MAP_H) return { path, end: p, offMap: true };
      path.push({ ...p });
    }
    if (leg.turn === 'R') d = RIGHT[d];
    else if (leg.turn === 'L') d = LEFT[d];
    else break;
  }
  return { path, end: p, offMap: false };
};

const NUM = ['', '一つ目', '二つ目', '三つ目', '四つ目', '五つ目'];

// 玩家拼出来的那句日语
export const sentenceOf = (legs: Leg[], destJp: string): string => {
  if (!legs.length) return '';
  const parts: string[] = [];
  legs.forEach((leg, i) => {
    const first = i === 0;
    if (leg.turn === 'end') {
      parts.push(`${first ? 'まっすぐ行くと、' : ''}${NUM[leg.n]}の角に${destJp}があります。`);
    } else {
      parts.push(`${first ? 'まっすぐ行って、' : ''}${NUM[leg.n]}の角を${leg.turn === 'R' ? '右' : '左'}に曲がって、`);
    }
  });
  return parts.join('');
};

// 出题：起点、面朝哪边、去哪儿
export interface MichiScenario {
  start: string;        // 起点地标
  facing: Dir;
  dest: string;
  tier: PracticeTier;
  // 起点那一句交代："你站在三宫站中央口，面朝海的方向"
  whereZh: string; whereEn: string;
}

export const MICHI_SCENARIOS: MichiScenario[] = [
  // 一档：三宫站中央口出来，面朝海（南）
  { start: 'sannomiya', facing: 'S', dest: 'daimaru', tier: 1, whereZh: '三宫站中央口，面朝海的方向', whereEn: 'Sannomiya central exit, facing the sea' },
  { start: 'sannomiya', facing: 'S', dest: 'cityhall', tier: 1, whereZh: '三宫站中央口，面朝海的方向', whereEn: 'Sannomiya central exit, facing the sea' },
  { start: 'sannomiya', facing: 'S', dest: 'center', tier: 1, whereZh: '三宫站中央口，面朝海的方向', whereEn: 'Sannomiya central exit, facing the sea' },
  { start: 'sannomiya', facing: 'S', dest: 'nankin', tier: 1, whereZh: '三宫站中央口，面朝海的方向', whereEn: 'Sannomiya central exit, facing the sea' },
  // 二档：换个出口、换个朝向——左右要重新想
  { start: 'sannomiya', facing: 'N', dest: 'ikuta', tier: 2, whereZh: '三宫站北口，面朝山的方向', whereEn: 'Sannomiya north exit, facing the mountains' },
  { start: 'sannomiya', facing: 'N', dest: 'kitano', tier: 2, whereZh: '三宫站北口，面朝山的方向', whereEn: 'Sannomiya north exit, facing the mountains' },
  { start: 'motomachi', facing: 'S', dest: 'meriken', tier: 2, whereZh: '元町站东口，面朝海的方向', whereEn: 'Motomachi east exit, facing the sea' },
  { start: 'motomachi', facing: 'E', dest: 'center', tier: 2, whereZh: '元町站前，面朝三宫的方向', whereEn: 'Outside Motomachi Sta., facing towards Sannomiya' },
  // 三档：起点和朝向更刁钻，而且不再预览路线
  { start: 'meriken', facing: 'N', dest: 'kokusai', tier: 3, whereZh: '美利坚公园入口，背对着海', whereEn: 'Meriken Park entrance, back to the sea' },
  { start: 'cityhall', facing: 'W', dest: 'ikuta', tier: 3, whereZh: '市政府前，面朝元町方向', whereEn: 'Outside City Hall, facing towards Motomachi' },
  { start: 'kitano', facing: 'S', dest: 'nankin', tier: 3, whereZh: '北野坂坡底，面朝海', whereEn: 'Foot of Kitano-zaka, facing the sea' },
  { start: 'motomachi', facing: 'E', dest: 'cityhall', tier: 3, whereZh: '元町站前，面朝三宫的方向', whereEn: 'Outside Motomachi Sta., facing towards Sannomiya' }
];
