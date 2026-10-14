import { CharacterId, StoryNode, StoryOption, StoryWord, StatKey, StoryBgmTrack } from '../../types';
import { outfitImg, Mood } from '../../data/outfitContext';
import { eventCgNode } from '../../data/eventCgs';

// ---------------------------------------------------------
// 第④⑤段和后日谈共用的写法（每个人一个 kit）
//
// 第③段是双结局（相爱 / 挚友），④⑤和后日谈都接在它后面，
// 所以几乎每一段都要在关键的那几句上按 `xxx_ending_love` 分开写。
// fork(love, friend) 就是干这个的——同一段戏，两种关系各自的说法。
// ---------------------------------------------------------

export interface Opt {
  id: string; zh: string; en: string; jp?: string; hintZh: string; hintEn: string;
  aff?: number; fam?: number; stat?: StatKey; words?: StoryWord[]; setFlags?: string[];
  then: StoryNode[];
}

export const kit = (c: CharacterId, color: string, nameZh: string, nameEn: string) => {
  const slug = c as string;
  return {
    slug,
    // 第一张场景卡：副标题只写时段（「放学后」「傍晚」「夜」），不写季节——
    // 每个人走到③的时间早晚不一，写了季节就可能永远等不到
    scene: (s: string, titleZh?: string, titleEn?: string, subtitleZh?: string, subtitleEn?: string, bgm?: StoryBgmTrack): StoryNode =>
      ({ type: 'scene', scene: s, ...(bgm ? { bgm } : {}), ...(titleZh ? { titleZh, titleEn } : {}), ...(subtitleZh ? { subtitleZh, subtitleEn } : {}) }),
    nar: (zh: string, en: string, img?: string, words?: StoryWord[]): StoryNode =>
      ({ type: 'narration', zh, en, ...(img !== undefined ? { characterImage: img } : {}), ...(words ? { words } : {}) }),
    say: (outfit: string, mood: Mood, jp: string, zh: string, en: string, words?: StoryWord[]): StoryNode =>
      ({ type: 'speech', speakerZh: nameZh, speakerEn: nameEn, color, characterImage: outfitImg(c, outfit, mood), jp, zh, en, ...(words ? { words } : {}) }),
    me: (jp: string, zh: string, en: string): StoryNode =>
      ({ type: 'speech', speakerZh: '你', speakerEn: 'You', color: 'bg-yellow-500', jp, zh, en }),
    img: (outfit: string, mood: Mood) => outfitImg(c, outfit, mood),
    choice: (promptZh: string, promptEn: string, opts: Opt[]): StoryNode => ({
      type: 'choice', promptZh, promptEn,
      options: opts.map<StoryOption>(o => ({
        id: o.id, labelZh: o.zh, labelEn: o.en, ...(o.jp ? { jp: o.jp } : {}), hintZh: o.hintZh, hintEn: o.hintEn,
        ...(o.words ? { words: o.words } : {}), ...(o.setFlags ? { setFlags: o.setFlags } : {}),
        relations: [{ char: c, affection: o.aff ?? 0, familiarity: o.fam ?? 0, reasonZh: o.zh.replace(/[「」]/g, ''), reasonEn: o.en.replace(/"/g, '') }],
        ...(o.stat ? { effects: [{ stat: o.stat, amount: 2, reasonZh: o.zh.replace(/[「」]/g, ''), reasonEn: o.en.replace(/"/g, '') }] } : {}),
        then: o.then
      }))
    }),
    // 相爱线 / 挚友线各自的说法
    fork: (love: StoryNode[], friend: StoryNode[]): StoryNode =>
      ({ type: 'branch', ifFlag: `${slug}_ending_love`, then: love, otherwise: friend }),
    // 这一段的动画（8 秒，OP 同款画风）——data/eventCgs.ts 里登记的 cg_ev_<slug>4 / 5
    anime: (n: 4 | 5): StoryNode => eventCgNode(`${slug}${n}`),
    // 收尾：关系变化 + 演完的 flag
    done: (n: 4 | 5, aff: number, fam: number, zh: string, en: string): StoryNode =>
      ({ type: 'effect', relations: [{ char: c, affection: aff, familiarity: fam, reasonZh: zh, reasonEn: en }], setFlags: [`${slug}_story_${n}_done`] })
  };
};
