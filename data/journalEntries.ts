import { StoryWord } from '../types';

// ---------------------------------------------------------
// 🕯️ 外公的手账
//
// 这本东西在剧本里被提到过很多次——第一天中午翻过它查食堂的乌冬多少钱，
// 序章里读过它，主角来的路上用球衣裹着它防止磕坏——但它在背包里
// 一直是一段说明文字，点开什么都没有。
//
// 【写法】
// 他一九六几年在这所学校读书。手账不是日记，是**记账和记事**：
// 价钱、天气、几点几分、谁说了什么。所以每一条都很短，
// 而且几乎不写感受——感受全在他记下来的东西**是什么**里面。
//
// 有几条是主角在剧情里已经读到过的（乌冬五十円那条），
// 在这里能翻到全文，这是这本手账最要紧的功能：
// 剧情里提过的东西，玩家能自己回去找。
// ---------------------------------------------------------

export interface JournalEntry {
  id: string;
  // 手账上他自己写的日期
  dateJp: string;
  jp: string;
  zh: string;
  en: string;
  // 主角在页边空白处写的东西。他来了之后开始在上面加批注。
  noteZh?: string;
  noteEn?: string;
  // 读到这一条才解锁（不写 = 一开始就能翻到）
  requiresFlag?: string;
  word?: StoryWord;
}

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j_first',
    dateJp: '昭和三十九年 四月十日',
    jp: '入学。坂を上る。長い。',
    zh: '入学。上坡。很长。',
    en: 'Enrolled. Walked up the hill. Long.',
    noteZh: '同一条坡。我第一天也走了两遍——第二遍是因为走过头了。',
    noteEn: 'The same hill. I did it twice on my first day; the second time because I overshot.'
  },
  {
    id: 'j_udon',
    dateJp: '昭和三十九年 五月二日',
    jp: '食堂のうどん、五十円。安いが、量が少ない。腹が減る。',
    zh: '食堂的乌冬，五十円。便宜，但量少。会饿。',
    en: 'Cafeteria udon, fifty yen. Cheap, but not much of it. You stay hungry.',
    noteZh: '现在二百八十。「腹が減る」这四个字没变。',
    noteEn: 'Two hundred and eighty now. The part about staying hungry has not changed.',
    word: { jp: '腹が減る', reading: 'はらがへる', zh: '肚子饿', en: 'to get hungry' }
  },
  {
    id: 'j_rain',
    dateJp: '昭和三十九年 六月十九日',
    jp: '梅雨。傘を忘れた。走って帰った。靴が鳴る。',
    zh: '梅雨。忘了带伞。跑回去的。鞋在响。',
    en: 'Rainy season. Forgot the umbrella. Ran home. Shoes squeaking.',
    noteZh: '「靴が鳴る」。他连这个都记。',
    noteEn: '"Shoes squeaking." He wrote even that down.'
  },
  {
    id: 'j_sea',
    dateJp: '昭和三十九年 八月三日',
    jp: '海。四時間。何も考えず。',
    zh: '海。四个小时。什么都没想。',
    en: 'The sea. Four hours. Thought about nothing.',
    noteZh: '四个小时。他也是一个人去的吧。',
    noteEn: 'Four hours. He must have gone alone too.'
  },
  {
    id: 'j_word',
    dateJp: '昭和三十九年 十月七日',
    jp: '「ぼちぼち」——どちらでもない、という意味らしい。便利。',
    zh: '「ぼちぼち」——好像是"不好也不坏"的意思。好用。',
    en: '"Bochi-bochi" — apparently means neither good nor bad. Useful.',
    noteZh: '他学的第一个关西词是这个。我学的第一个是「おおきに」。',
    noteEn: 'That was the first Kansai word he learned. Mine was "ookini".',
    word: { jp: 'ぼちぼち', zh: '还行、马马虎虎', en: 'so-so / getting by' }
  },
  {
    id: 'j_name',
    dateJp: '昭和四十年 二月十四日',
    jp: '名前を呼ばれた。四文字、全部合っていた。',
    zh: '被叫了名字。四个字，全对。',
    en: 'Somebody said my name. Four characters, all of them right.',
    noteZh: '他在这儿待了快一年，才有人把他的名字念对一次。而他把这件事记了下来。',
    noteEn: 'Nearly a year here before anybody got his name right once. And he wrote it down.'
  },
  {
    id: 'j_snow',
    dateJp: '昭和四十年 一月二十日',
    jp: '雪。三年で二日目。誰も来ない。境内、静か。',
    zh: '雪。三年里的第二天。没有人来。神社里，很安静。',
    en: 'Snow. Second day in three years. Nobody comes. The shrine grounds, quiet.',
    noteZh: '他也在下雪天去过神社。',
    noteEn: 'He went to the shrine on a snow day too.',
    requiresFlag: 'inari_story_1_done'
  },
  {
    id: 'j_last',
    dateJp: '昭和四十一年 三月二十四日',
    jp: '修了。坂を下る。短い。',
    zh: '修了。下坡。很短。',
    en: 'Term ended. Walked down the hill. Short.',
    noteZh: '第一页写的是「长」。最后一页写的是「短」。同一条坡。',
    noteEn: 'The first page says long. The last page says short. The same hill.',
    requiresFlag: 'year_end_done'
  }
];

export const readableEntries = (flags: Record<string, boolean>): JournalEntry[] =>
  JOURNAL_ENTRIES.filter(e => !e.requiresFlag || flags[e.requiresFlag]);
