// ---------------------------------------------------------
// 🪪 立绘重制：每个角色的"形象标准"
//
// gen-character-card.mjs 按这里生成角色卡。这是新立绘的唯一事实来源：
// 旧立绘之间本来就不统一（真纪的眼睛有粉有琥珀，空的眼睛有灰有琥珀），
// 这里定下来的就是以后的标准。改设定改这里，然后重跑那个角色。
//
// ref：只用来认长相（脸、发型、发色）。衣服一律以 outfit 文字为准。
// ---------------------------------------------------------

// 学校统一校服（所有学生角色共用）
const UNIFORM = 'Japanese high school uniform: navy blue single-breasted blazer with two gold buttons, gold buttons on the cuffs, flap pockets, and a gold embroidered school crest on the left chest pocket; crisp white collared shirt; red ribbon bow tie at the collar; navy pleated skirt above the knee; black knee-high socks; brown penny loafers.';

export const CARDS = [
  {
    id: 'asuka', outfit: 'school_blazer',
    ref: 'public/images/character_cards/asuka/school_blazer.jpg',
    identity: 'Asuka, a proud tsundere class president, about 16 years old, slender build. Long straight crimson red hair in high twin tails reaching her thighs, tied with small black hair ties, side-swept bangs falling between sharp crimson red eyes, a few loose strands framing her face.',
    uniform: UNIFORM
  },
  {
    id: 'hikari', outfit: 'school_blazer',
    ref: 'public/images/character_cards/hikari/school_blazer.jpg',
    identity: 'Hikari, a bubbly, energetic exchange student, about 16 years old. Long wavy golden blonde hair gathered in a high side ponytail on her left side, a springy ahoge on top, messy side bangs, two small white daisy hair clips, bright golden amber eyes, a cheerful open face.',
    uniform: UNIFORM
  },
  {
    id: 'rei', outfit: 'school_blazer',
    ref: 'public/images/characters/rei/neutral.webp',
    identity: 'Rei, a quiet, intellectual study supporter, about 16 years old, petite. Pale icy aqua-blue hair in a neat bob just above the shoulders with a small ahoge, thin red rectangular glasses, calm deep blue eyes, composed, slightly reserved expression.',
    uniform: UNIFORM
  },
  {
    id: 'sora', outfit: 'school_blazer',
    ref: 'public/images/characters/sora/school_neutral.webp',
    identity: 'Sora, a boyish, sporty basketball ace, about 16 years old, tall and lean athletic build. A cute Japanese anime girl face drawn in the same style as the other characters, with large bright amber eyes. Healthy light sun-tanned skin (a light golden tan, not dark). Short dark brown hair in a tomboyish pixie cut with soft tousled bangs, a little spiky but neat. A confident easygoing grin. She wears the uniform casually: blazer unbuttoned, sleeves pushed up slightly.',
    uniform: UNIFORM
  },
  {
    id: 'nao', outfit: 'school_blazer',
    ref: 'public/images/characters/nao/neutral.webp',
    identity: 'Nao, a gentle, slightly airheaded childhood friend, about 17 years old. Long wavy chestnut brown hair in a high ponytail tied on her right side, soft straight bangs, warm brown eyes, a sweet friendly expression.',
    uniform: UNIFORM
  },
  {
    id: 'maki', outfit: 'school_blazer',
    ref: 'public/images/characters/maki/neutral.webp',
    identity: 'Maki, a cheeky Kansai-dialect underclassman gamer girl, about 15 years old, petite. Bright pink hair in two messy short side ponytails, choppy bangs, three small rainbow star hair clips, purple cat-ear gaming headphones worn as a headband, pink-magenta eyes, a mischievous grin with a small fang. Under the standard blazer she wears a black knit vest with a small white paw-print motif.',
    uniform: UNIFORM
  },
  {
    id: 'miyuki', outfit: 'cardigan',
    ref: 'public/images/characters/miyuki/cardigan_neutral.webp',
    identity: 'Miyuki, a kind, gentle older neighbour in her early twenties, graceful and soft-spoken. Medium-length softly wavy silver-white hair with one thin braid on the side and a small pink flower hair clip, pale lavender eyes, a warm gentle smile.',
    uniform: 'Casual everyday outfit: oversized cream cable-knit cardigan with wooden buttons, pale pink blouse with a rounded frilled collar, dusty rose pleated skirt above the knee, white knee-high socks, light canvas sneakers.'
  },
  {
    id: 'inari', outfit: 'school_blazer',
    ref: 'public/images/characters/inari/school_neutral.webp',
    identity: 'Inari, a playful thousand-year-old fox goddess disguised as a student, looks about 17. Very long straight orange-red hair, a golden knotted-cord hair ornament with teal tassels on one side, upright orange fox ears with white inner fur, nine large fluffy golden-orange fox tails with cream tips fanning out behind her, golden eyes, a sly knowing smile.',
    uniform: UNIFORM
  }
];
