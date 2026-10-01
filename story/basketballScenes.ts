import { CharacterId, StoryNode } from '../types';

// ==========================================================
// 🏀 空和投篮机
//
// 投篮机（一分間シュート）有两种玩法：
//   · 一个人：体育馆午休 / 放学后的活动，或者三宫中央街游戏厅里的机台
//   · 跟空一起：在她常在的地方碰到她，她会拉你比一场
//
// 第一次一定是她教——不管是开学第一天放学后去了体育馆，
// 还是之后第一次在别处碰到她（BB_SORA_FIRST）。
// 教过之后才解锁一个人练的那两个活动。
//
// 每一局的输赢写在 bb_won_now 上：开局前先用「!bb_won_now」清掉上一局的，
// 打完 branch 读它接不同的台词，结尾再清一次。
// 加好感、加属性不在剧本里写死，统一由 App 的 settleBasketball 按比分结算。
// ==========================================================

const S = '/images/characters/sora/';
const SAY = (jp: string, zh: string, en: string, img = 'happy'): StoryNode => ({
  type: 'speech', speakerZh: '空', speakerEn: 'Sora',
  characterImage: `${S}${img}.webp`, jp, zh, en, color: 'bg-orange-500'
});

// 一局：清旗 → 开打 → 按输赢接台词 → 收尾
const MATCH = (venue: 'gym' | 'arcade', extraWinFlags: string[] = []): StoryNode[] => [
  { type: 'effect', setFlags: ['!bb_won_now'] },
  { type: 'minigame', game: 'basketball', mode: 'vs_sora', venue, setFlagsOnWin: ['bb_won_now', 'bb_beat_sora', ...extraWinFlags] },
  {
    type: 'branch', ifFlag: 'bb_won_now',
    then: [
      { type: 'narration', characterImage: `${S}shock.webp`, zh: '她盯着计分板看了好一会儿，像是在确认那两个数字没有被谁偷偷换过。', en: 'She stares at the scoreboard for a while, as if checking that nobody has swapped the two numbers round.' },
      SAY('うそやろ……ウチ、本気やったで？', '不会吧……我可是认真的哦？', 'No way... I was trying, you know?', 'shock'),
      { type: 'narration', characterImage: `${S}happy.webp`, zh: '然后她突然笑出声，用力拍了一下你的背。力气还是大得让你往前踉跄了半步。', en: 'Then she bursts out laughing and claps you on the back, still hard enough to push you half a step forward.' },
      SAY('おもろいわ、{name}。次は絶対負けへんからな！', '有意思，{name}。下次绝对不会输给你！', 'You are fun, {name}. I am not losing next time!')
    ],
    otherwise: [
      SAY('へへん、まだまだやな！', '嘿嘿，还差得远呢！', 'Heh. Not yet, you are not!'),
      { type: 'narration', characterImage: `${S}cute.webp`, zh: '她把最后一个球在指尖上转了两圈，抛给你。', en: 'She spins the last ball twice on a fingertip and tosses it to you.' },
      SAY('でも最後のほう、ええ感じやったで。また来いや。', '不过最后那几个，感觉很对哦。下次再来。', 'Those last few felt right, though. Come back.', 'cute')
    ]
  },
  { type: 'effect', setFlags: ['basketball_tutorial_done', '!bb_won_now'] }
];

// ---------------------------------------------------------
// 第一次碰到她（第一天没去体育馆的人）：她教，然后比一场
// ---------------------------------------------------------
export const BB_SORA_FIRST = (where: 'gym' | 'rooftop' | 'arcade'): StoryNode[] => where === 'arcade' ? [
  { type: 'scene', scene: 'sannomiya_arcade', bgm: 'town', titleZh: '中央街 · 游戏厅', titleEn: 'Center Gai · Game Centre' },
  { type: 'narration', zh: '游戏厅门口那台投篮机前，有个短发女生正一个人投得飞快。屏幕上的排行榜第一名写着「SORA」。', en: 'At the basketball machine by the game centre entrance, a short-haired girl is shooting at a furious pace. Top of the leaderboard: SORA.' },
  { type: 'narration', characterImage: `${S}happy.webp`, zh: '最后一球进了。她转过身，正好跟你对上眼。', en: 'The last one drops. She turns round and catches your eye.' },
  SAY('お、{name}やん！これやったことある？ない？……ほな、ウチが教えたる。百円もウチが出したるわ。', '哦，{name}！玩过这个吗？没有？……那我来教你。一百日元我也请了。', 'Oh, {name}! Ever played this? No? ...Then I will teach you. My hundred yen.'),
  ...MATCH('arcade')
] : [
  ...(where === 'rooftop' ? [
    { type: 'scene', scene: 'rooftop_sunset', bgm: 'chat', titleZh: '天台', titleEn: 'The Rooftop' } as StoryNode,
    { type: 'narration', characterImage: `${S}happy.webp`, zh: '天台上，空靠着护栏在拍球。看见你，她眼睛一亮，抓起球就往楼梯口走。', en: 'Up on the roof, Sora is leaning on the rail, bouncing a ball. She sees you, lights up, grabs the ball and heads for the stairs.' } as StoryNode,
    SAY('ちょうどええとこ来た！ちょっと付き合ってや、体育館行くで！', '来得正好！陪我一下，去体育馆！', 'Perfect timing! Come with me — gym!')
  ] : []),
  { type: 'scene', scene: 'basketball_gym_sunset', bgm: 'chat', titleZh: '体育馆', titleEn: 'The Gym', subtitleZh: '一分間シュート', subtitleEn: 'The one-minute shootout' },
  { type: 'narration', zh: '体育馆里只开了一半的灯。地板上摆着一台计时器，旁边是一整筐球。', en: 'Only half the lights are on. There is a timer on the floor, and a whole cart of balls beside it.' },
  { type: 'narration', characterImage: `${S}happy.webp`, zh: '空站在三分线外，一边投一边念：「……じゅうろく、じゅうなな」。看见你，她把球夹在腰间。', en: 'Sora is outside the arc, counting her shots under her breath: "...sixteen, seventeen." She sees you and tucks the ball against her hip.' },
  SAY('お、{name}やん！ウチの特訓メニュー、一緒にやらへん？', '哦，{name}！我的特训菜单，要不要一起来？', 'Oh, {name}! Want to do my training drill with me?'),
  {
    type: 'speech', speakerZh: '空', speakerEn: 'Sora', characterImage: `${S}cute.webp`,
    jp: '「一分間シュート」。時間内に何本入るかや。ゲーセンのシュートマシンと一緒やで。',
    words: [{ jp: '特訓', reading: 'とっくん', zh: '特训', en: 'special training' }],
    zh: '「一分钟投篮」。看在时间里能投进几个。跟游戏厅的投篮机一样的玩法。',
    en: 'The one-minute shootout. How many you can sink before time runs out — same as the arcade machine.',
    color: 'bg-orange-500'
  },
  SAY('ルールはウチが教えたる。ほな、いくで！', '规则我来教你。那，开始了！', 'I will teach you the rules. Here we go!'),
  ...MATCH('gym')
];

// ---------------------------------------------------------
// 之后再碰到她：拉你比一场（可以不比）
// ---------------------------------------------------------
export const BB_SORA_CHALLENGE = (fromRooftop: boolean): StoryNode[] => [
  ...(fromRooftop ? [
    { type: 'scene', scene: 'rooftop_sunset', bgm: 'chat', titleZh: '天台', titleEn: 'The Rooftop' } as StoryNode,
    { type: 'narration', characterImage: `${S}cute.webp`, zh: '空在天台上一个人对着空气比划投篮的动作。被你看见了，她一点也不尴尬。', en: 'Sora is on the roof, shooting at thin air. Being caught at it does not embarrass her in the slightest.' } as StoryNode
  ] : [
    { type: 'scene', scene: 'gym', bgm: 'chat', titleZh: '体育馆', titleEn: 'The Gym' } as StoryNode,
    { type: 'narration', characterImage: `${S}happy.webp`, zh: '体育馆里，空正把计时器往地板上一放。看见你，她把手里的球高高举起来晃了晃。', en: 'In the gym, Sora is just setting the timer down on the floor. She sees you and waves the ball over her head.' } as StoryNode
  ]),
  SAY('お、{name}！ちょうどええ。一分間シュート、勝負せえへん？', '哦，{name}！正好。一分钟投篮，比一场？', 'Oh, {name}! Perfect. One-minute shootout — fancy a match?'),
  {
    type: 'choice',
    promptZh: '她已经把球递过来了。', promptEn: 'She is already holding the ball out.',
    options: [
      {
        id: 'bb_accept', labelZh: '「よし、やろう。」接过球', labelEn: '"Right, let us go." Take the ball',
        jp: 'よし、やろう。',
        hintZh: '赢了她会记很久，输了她也会记很久', hintEn: 'She will remember a win for ages. Also a loss.',
        then: [
          ...(fromRooftop ? [
            { type: 'scene', scene: 'gym', bgm: 'chat' } as StoryNode,
            { type: 'narration', zh: '她几乎是拽着你的袖子下的楼。', en: 'She more or less drags you downstairs by the sleeve.' } as StoryNode
          ] : []),
          ...MATCH('gym')
        ]
      },
      {
        id: 'bb_decline', labelZh: '「今天就算了吧」', labelEn: '"Not today."',
        jp: '今日はやめとく。',
        hintZh: '她不会生气，只会有点无聊', hintEn: 'She will not be cross. Just a bit bored.',
        then: [
          SAY('なんや、つまらんなー。ほな、また今度な！', '什么嘛，真没劲～那下次吧！', 'Aw, boring. Next time, then!', 'sad')
        ]
      }
    ]
  }
];

// ---------------------------------------------------------
// 中央街的游戏厅：投篮机的排行榜第一名写着 SORA
// ---------------------------------------------------------
export const BB_SORA_ARCADE: StoryNode[] = [
  { type: 'scene', scene: 'sannomiya_arcade', bgm: 'town', titleZh: '中央街 · 游戏厅', titleEn: 'Center Gai · Game Centre' },
  { type: 'narration', zh: '游戏厅门口那台投篮机前围了一小圈人。屏幕上的排行榜，第一名写着「SORA」。', en: 'A small crowd has gathered round the basketball machine at the front of the game centre. Top of the leaderboard: SORA.' },
  { type: 'narration', characterImage: `${S}happy.webp`, zh: '本人就站在机台旁边，正一脸得意地给围观的小学生讲解手腕要怎么压。', en: 'The lady herself is standing beside it, smugly explaining wrist snap to a couple of primary schoolers.' },
  SAY('あ、{name}！見てみ、ランキング一位ウチやで。……勝負する？百円はウチが出したる。', '啊，{name}！你看，排行第一是我哦。……比一场？一百日元我请。', 'Oh, {name}! Look — top of the board, that is me. ...Want a match? My hundred yen.'),
  {
    type: 'choice',
    promptZh: '她已经把硬币塞进投币口了。', promptEn: 'She has already fed the coin into the slot.',
    options: [
      { id: 'bb_arcade_accept', labelZh: '站到隔壁那台前面', labelEn: 'Step up to the machine next to hers', jp: '受けて立つ。', then: MATCH('arcade') },
      {
        id: 'bb_arcade_decline', labelZh: '「我看你打就好」', labelEn: '"I will just watch."',
        then: [
          { type: 'narration', characterImage: `${S}cute.webp`, zh: '她撇撇嘴，自己投完了一整局。最后一球空心入网，小学生们一起「おおー」了一声。', en: 'She pouts and plays a whole round by herself. The last one is a swish, and the primary schoolers all go "ohhh".' },
          SAY('見とるだけやったらおもんないで？次はやろな！', '光看着可没意思哦？下次一起！', 'Watching is no fun, you know? Next time you play!', 'cute')
        ]
      }
    ]
  }
];

// 会触发"碰到空 → 投篮"的地方
export const BB_SPOTS = ['gym', 'rooftop_sunset', 'sannomiya_arcade'];
export const SORA_ID = CharacterId.SORA;
