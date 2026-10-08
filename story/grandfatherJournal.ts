import { StoryNode } from '../types';

// ==========================================================
// 📓 外公手账里的那几页（八条线接到主线上的那根细线）
//
// 外公那张地图上，除了描了三遍的鸟居，还有几个很小的铅笔点，
// 散在城里：港口的栏杆、学校的教室和天台、校门、六甲山、
// 海风庄那一带、元町的高架底下。主角一直以为是随手点的。
//
// 其实每个点在手账里都对得上一页——六十年前他在那个地方看见过一件小事。
// 而那个地方，正好是她第③段发生的地方。
//
// 【为什么只给一页，而不是给每个人编一段家族渊源】
// 用户定的：关联要轻。她们的故事是她们自己的，不该被改写成"原来你外公认识我奶奶"。
// 一页手账只做一件事：让玩家意识到这一年不是第一次被人记下来——
// 六十年前同一个地方，也有一个人在挥手、在擦没人看的黑板、在两人份地做饭。
// 外公照例只写价钱、天气、谁做了什么，不写感受。感受留给读的人。
//
// 播放时机：第③段结局之后（相爱、挚友两条都播），作为那一段的最后几行。
// 置 journal_page_<角色> flag，主线最终章里地图上亮起来的点就是这些。
// ==========================================================

type Page = { dotZh: string; dotEn: string; entry: string; glossZh: string; glossEn: string; afterZh: string; afterEn: string };

const PAGES: Record<string, Page> = {
  hikari: {
    dotZh: '港口那根栏杆的位置', dotEn: 'the harbour railing',
    entry: '昭和三十九年五月。メリケン波止場。風強し。船を見送る女学生一人。船が見えなくなっても、まだ手を振っていた。帰りの市電十五円。',
    glossZh: '美利坚码头。风大。有个女学生在送船。船都看不见了，她还在挥手。回程的电车十五日元。',
    glossEn: 'Meriken Pier. Strong wind. A schoolgirl seeing off a ship. Long after the ship was out of sight she was still waving. Tram home, fifteen yen.',
    afterZh: '他没有上去搭话。他把那个挥手的人和电车票价写在同一行里，像是觉得这两件事一样值得记。你想起她那只总是先举起来的手。',
    afterEn: 'He did not go over and speak to her. He put the girl who kept waving and the price of a tram ticket on the same line, as if he thought they were equally worth keeping. You think of that hand of hers, always the first one up.'
  },
  asuka: {
    dotZh: '学校教室那一栋', dotEn: 'the classroom block of the school',
    entry: '昭和三十九年十一月。放課後。委員長、黒板を消してから帰る。誰も見ておらんのに、隅まで消す。',
    glossZh: '放学后。班长把黑板擦干净才走。明明没有人看，连角落都擦了。',
    glossEn: 'After school. The class president wiped the blackboard before going home. Nobody was watching, and she still did the corners.',
    afterZh: '他记下来的不是那块黑板，是「没有人看」这几个字。你想起那三百多个注音，和那个说这是「顺手」的人。',
    afterEn: 'What he wrote down was not the blackboard. It was "nobody was watching". You think of three hundred-odd furigana, and of the person who said it was nothing, she just happened to be doing it anyway.'
  },
  rei: {
    dotZh: '六甲山上', dotEn: 'up on Rokko',
    entry: '昭和四十年八月。六甲。夜景が明るすぎて星が見えぬ。それでも隣で数えている者あり。望遠鏡は借り物。',
    glossZh: '六甲。夜景太亮，看不见星星。可旁边还是有人在数。望远镜是借来的。',
    glossEn: 'Rokko. The city is too bright to see the stars. Somebody beside me was counting them anyway. The telescope was borrowed.',
    afterZh: '六十年前那个人数出来的数字，大概没有交给过任何人。你想起第十九册扉页上那一栏，现在写着两个名字。',
    afterEn: 'Whatever number that person counted to sixty years ago, they probably never gave it to anyone. You think of the space on the flyleaf of volume nineteen, which now holds two names.'
  },
  miyuki: {
    dotZh: '海风庄现在的那个位置', dotEn: 'where Umikaze-sō stands now',
    entry: '昭和四十年二月。下宿。隣の部屋より毎晩、味噌汁の匂い。礼を言いそびれて三週間。',
    glossZh: '寄宿处。隔壁房间每天晚上飘来味噌汤的味道。一直没找到机会道谢，已经三个星期了。',
    glossEn: 'Lodgings. Every night the smell of miso soup from the room next door. Three weeks now and I still have not managed to thank them.',
    afterZh: '这一带六十年前就有人在隔壁做饭，也有人在隔壁不好意思道谢。你决定明天去二〇二敲门的时候，不说「谢谢款待」，直接叫她的名字。',
    afterEn: 'Sixty years ago, too, someone round here was cooking next door, and someone else was too shy to say thank you for it. You decide that tomorrow, when you knock on 202, you will skip "thank you for the meal" and just say her name.'
  },
  sora: {
    dotZh: '学校的天台', dotEn: 'the school roof',
    entry: '昭和四十年六月。屋上。野球部の某、肩を痛めて見学。一日中ボールを握っていた。投げぬのに、握る。',
    glossZh: '天台。棒球部的某某肩膀受了伤，在旁边看。他攥着一个球攥了一整天。不扔，就是攥着。',
    glossEn: 'The roof. Someone from the baseball club, shoulder injured, sitting out. He held a ball all day long. Not throwing it. Just holding it.',
    afterZh: '「不扔，就是攥着」。外公很少在一句话里用两次逗号。你想起那张申请表，现在已经盖了章。',
    afterEn: '"Not throwing it. Just holding it." Your grandfather rarely broke a line twice. You think of that application form, which has a stamp on it now.'
  },
  nao: {
    dotZh: '校门口那棵樱花树', dotEn: 'the cherry tree at the school gate',
    entry: '昭和三十九年四月十五日。校門の桜、満開。郷里の友より手紙。知らぬ言葉が三つ増えていた。返事に三日かかる。',
    glossZh: '校门口的樱花开满了。老家的朋友来信。信里多了三个我不认识的词。回信花了三天。',
    glossEn: 'The cherry at the school gate in full bloom. A letter from a friend back home, with three words in it I did not know. It took me three days to answer.',
    afterZh: '六十年前，也有一个人在这棵树底下，发现老朋友会了自己不会的词。他花了三天才回信——但他回了。你想起那本新的笔记，一天都没有断过。',
    afterEn: 'Sixty years ago, under this same tree, somebody found that an old friend knew words he did not. It took him three days to write back, but he wrote back. You think of that new notebook, which has not missed a day.'
  },
  maki: {
    dotZh: '元町的高架底下', dotEn: 'under the tracks at Motomachi',
    entry: '昭和四十一年一月。元町高架下。射的屋の娘、客が帰るたびに「もう一回」と言う。言われた客はたいてい、もう一回やる。自分も、やった。',
    glossZh: '元町高架下。打靶摊的女儿，每个客人要走的时候都说一句「再来一局」。被这么说的客人，多半会再来一局。我也来了。',
    glossEn: 'Under the tracks at Motomachi. The shooting-gallery girl says "one more go" to every customer who turns to leave. Most of them have one more go. So did I.',
    afterZh: '「我也来了」。整本手账里，他很少写到自己。你想起那台月底要搬走的机器，和那两格空着的名字。',
    afterEn: '"So did I." In the whole journal he hardly ever writes about himself. You think of that machine, due to go at the end of the month, and the two empty letters in its name.'
  }
};

// 第③段结局之后接上的那几行
export const journalPage = (charId: string): StoryNode[] => {
  const p = PAGES[charId];
  if (!p) return [];
  return [
    {
      type: 'narration',
      characterImage: '',
      zh: `那天晚上你翻外公的手账，想找点东西来读。翻到中间，你在一页的页角看见一个很小的铅笔点——和地图上${p.dotZh}那个点一模一样。`,
      en: `That night you leaf through your grandfather's journal, looking for something to read. Halfway through, in the corner of a page, there is a tiny pencil dot, exactly like the one on the map at ${p.dotEn}.`
    },
    {
      type: 'narration',
      zh: `「${p.entry}」——${p.glossZh}`,
      en: `"${p.entry}" (${p.glossEn})`
    },
    {
      type: 'narration',
      zh: p.afterZh,
      en: p.afterEn
    },
    { type: 'effect', setFlags: [`journal_page_${charId}`] }
  ];
};
