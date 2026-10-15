// ---------------------------------------------------------
// 🎬 开场动画 第二版（2026-10-15）
//   node scripts/op/gen-op.mjs keys|videos|data --set op2 [--only ...] [--pick id=2]
//
// 第一版的问题（用户原话）：深雪的嘴一直在怪动、奈绪的头发变成了尾巴、空跳起来动作诡异、金城的镜头太多。
// 根子在于让 Veo 自由发挥了大动作：转身、挥手、跳投、跑、笑出声——它演不好，就开始变形。
// 这一版的规矩：
//   · 动的是镜头，不是人：推、拉、摇、移、视差。人物只做"一个小动作"：风吹头发、眨一次眼、视线移一下。
//   · 嘴一律闭着（不说话、不笑出声）。不跳、不跑、不转身、不挥手。
//   · 发型写死是"头发"（马尾、侧马尾不会摆成尾巴）；只有稻荷有尾巴，而且尾巴只是轻轻晃。
//   · 每个视频只用其中 2–4 秒（clipIn 选最稳的那一段），剪得更快、跟着节拍切。
//   · 金城只剩一个镜头；多出来的位置给女孩们的双人、三人镜头和全员合影（没有金城）。
// reuse：直接拿第一版里长相已经验证过的首帧（.generated/op/<id>/key_<n>.png），只重做视频。
// bars：这个镜头占几小节（切点由 scripts/audio/build_op_music.py 的 op_beats.json 决定）。
// ---------------------------------------------------------

const KEEP_STILL = 'The characters hold their pose; only hair and clothes move gently in the wind, and at most one slow blink. Mouths stay closed — nobody talks, nobody laughs.';

export const SHOTS = [
  // ---- 前奏：城市和海（没有人） ----
  { id: 'o2_sky', chars: [], bars: 2, reuse: 'op18_title/key_1.png',
    image: '', motion: 'The camera tilts slowly down from the twilight sky to the harbour lights; clouds drift, a few cherry petals float across.' },
  { id: 'o2_train', chars: [], bars: 2, reuse: 'op01_train/key_1.png',
    image: '', motion: 'The train glides steadily along the coastal track from right to left; the sea sparkles; the camera holds still.' },
  { id: 'o2_harbor', chars: [], bars: 2, reuse: 'op02_harbor/key_3.png',
    image: '', motion: 'A slow push-in toward the Port Tower; the ferry moves forward leaving a wake; gentle light flares.' },
  { id: 'o2_journal', chars: [], bars: 2, reuse: 'op03_journal/key_1.png',
    image: '', motion: 'A slow push-in on the hand-drawn map in the journal; one page lifts slightly in the breeze; cherry petals drift past. The hands stay still.' },

  // ---- 主歌：八个人各一镜（只做一个小动作） ----
  { id: 'o2_hikari', chars: ['hikari'], bars: 2, reuse: 'op04_hikari/key_1.png',
    image: '', motion: `A slow push-in on her face. The sea wind lifts her long golden side ponytail (it is hair) and the hem of her blazer. ${KEEP_STILL}` },
  { id: 'o2_asuka', chars: ['asuka'], bars: 2, reuse: 'op05_asuka/key_1.png',
    image: '', motion: `A slow sideways camera move along the window. Morning light shifts across her; her twin tails (hair) stir slightly; her eyes glance toward the camera once. ${KEEP_STILL}` },
  { id: 'o2_rei', chars: ['rei'], bars: 2, reuse: 'op06_rei/key_1.png',
    image: '', motion: `A slow push-in. Stars twinkle, one shooting star crosses the sky, a glint of light slides across her glasses. Her hand stays on her glasses. ${KEEP_STILL}` },
  { id: 'o2_nao', chars: ['nao'], bars: 2, reuse: 'op07_nao/key_1.png',
    image: '', motion: `A slow pull-back up the slope. Cherry petals fall around her. Her chestnut ponytail is HAIR tied at the side of her head and only stirs a little in the breeze — it never moves like a tail. ${KEEP_STILL}` },
  { id: 'o2_miyuki', chars: ['miyuki'], bars: 2, reuse: 'op08_miyuki/key_1.png',
    image: '', motion: `Steam curls up from the cup she holds. Her silver hair drifts in the evening breeze. The harbour lights twinkle. The camera pushes in very slowly. Her lips stay gently closed and do not move at all. ${KEEP_STILL}` },
  { id: 'o2_sora', chars: ['sora'], bars: 2,
    image: 'Sora sitting on a low bench at the side of an indoor school gym court after practice, a basketball resting under one arm, a white towel round her neck, leaning forward with elbows on her knees and a confident grin with closed lips, her short messy dark-brown hair damp, light sun-tanned skin, sunbeams through the high windows. Plain unlettered navy practice jersey (no letters, no numbers).',
    motion: `The camera tilts slowly up from the ball to her face; dust glitters in the sunbeams. She stays seated and still. ${KEEP_STILL}` },
  { id: 'o2_maki', chars: ['maki'], bars: 2, reuse: 'op10_maki/key_1.png',
    image: '', motion: `Neon lights flicker and change colour across her; the camera arcs slowly around her. She keeps her pose and her peace sign still. ${KEEP_STILL}` },
  { id: 'o2_inari', chars: ['inari'], bars: 2, reuse: 'op11_inari/key_1.png',
    image: '', motion: `Red maple leaves swirl slowly. Her nine fox tails sway gently and slowly together. A slow push-in toward her golden eyes. ${KEEP_STILL}` },

  // ---- 过门：宿敌一镜 + 两人组 ----
  { id: 'o2_kai', chars: ['kai'], bars: 1,
    image: 'ONLY ONE PERSON: Kai Kinjo leaning against the stone pillar of the school gate on a windy spring day, arms folded, navy blazer worn open, red tie loosened, short tight curly dark-brown hair, light-brown skin, sharp hazel-green eyes, a silver dog tag on his chest, a confident closed-mouth smirk; cherry petals blowing past. No second person, no duplicate of him.',
    motion: `Petals blow past; the dog tag glints once; a slow push-in. ${KEEP_STILL}` },
  { id: 'o2_duo_hikari_nao', chars: ['hikari', 'nao'], bars: 2,
    image: 'Seen FROM BEHIND, two girls in navy school blazers walk side by side up the steep Kitano-zaka slope in spring toward a school on the hill, schoolbags in hand, cherry blossoms overhead. Left: Hikari, long wavy golden blonde hair in a high side ponytail with white daisy clips. Right: Nao, long wavy chestnut-brown hair in a ponytail on the right side. Their faces are not visible.',
    motion: 'The camera follows them slowly from behind as they walk at an easy pace; petals fall; their hair sways a little.' },
  { id: 'o2_duo_asuka_rei', chars: ['asuka', 'rei'], bars: 2,
    image: 'A quiet school library at sunset. Asuka (very long crimson twin tails, navy blazer, a red pen in her hand) and Rei (short pale aqua-blue bob, thin red rectangular glasses, navy blazer) sit across a table from each other with open notebooks; Asuka points her red pen at Rei\'s notebook, Rei looks down at it calmly. Warm light through tall windows, dust motes.',
    motion: `A slow overhead camera drift across the table; dust motes float in the light; a page turns slightly. ${KEEP_STILL}` },
  { id: 'o2_duo_sora_maki', chars: ['sora', 'maki'], bars: 2,
    image: 'A neon-lit arcade at night. Sora (tall sporty tomboy, short messy dark-brown hair, light tan, navy blazer) and Maki (small, bright pink short side ponytails, purple cat-ear headphones, navy blazer) stand side by side in front of a basketball arcade machine, both looking up at its flashing scoreboard lights with competitive grins (closed lips). No readable text on the machine.',
    motion: `The scoreboard lights flash and the neon colours change on their faces; a slow push-in. ${KEEP_STILL}` },
  { id: 'o2_duo_miyuki_inari', chars: ['miyuki', 'inari'], bars: 2,
    image: 'Ikuta Shrine at night, stone lanterns glowing. Miyuki (softly wavy silver-white hair with a side braid, cream cardigan) and Inari (very long orange-red hair, fox ears, nine golden fox tails, a red-and-white shrine outfit) sit side by side on the wooden steps of the shrine sharing a thermos of tea, both smiling gently with closed lips.',
    motion: `Lantern light flickers softly; steam rises from the thermos cup; Inari's tails sway slowly. A slow sideways camera move. ${KEEP_STILL}` },

  // ---- 副歌：群戏 ----
  { id: 'o2_fireworks', chars: ['hikari', 'asuka', 'nao'], bars: 2, reuse: 'op15_fireworks/key_2.png',
    image: '', motion: `Fireworks burst one after another; coloured light flashes across them; the camera tilts slowly up to the sky. ${KEEP_STILL}` },
  { id: 'o2_rooftop', chars: ['sora', 'maki', 'rei'], bars: 2,
    image: 'The school rooftop at golden sunset, seen FROM BEHIND: three girls in navy school blazers stand still at the chain-link fence looking out over the glowing city and the sea. Left: Sora, tall, short messy dark-brown hair. Middle: Maki, small, bright pink short side ponytails, purple cat-ear headphones. Right: Rei, petite, short pale aqua-blue bob, thin red glasses. Their hair and skirts blown by the wind, long shadows.',
    motion: 'The wind blows their hair and skirts; the sun flares; the camera pushes in slowly behind them. They stand still.' },
  { id: 'o2_hands', chars: [], bars: 1,
    image: 'Close-up of two hands resting on an iron harbour railing at sunset, almost touching: a boy\'s hand in a navy blazer sleeve and a girl\'s hand in a navy blazer sleeve, a few centimetres apart; the sea glitters out of focus behind.',
    motion: 'The light glitters on the sea behind; the girl\'s little finger moves a tiny bit closer to his; the camera holds still.' },
  { id: 'o2_all', chars: ['hikari', 'asuka', 'rei', 'inari', 'miyuki', 'sora', 'nao', 'maki'], bars: 4, still: true,
    image: 'Opening key visual seen FROM BEHIND: eight girls stand in a row along the iron railing of Kobe harbour at sunset, all with their backs to the viewer, looking out at the glowing sea, the Port Tower and the Ferris wheel. Recognisable by hair and silhouette alone, left to right: a golden blonde high side ponytail (Hikari); very long crimson twin tails (Asuka); a short pale aqua-blue bob (Rei); very long orange-red hair with fox ears and nine fluffy golden fox tails (Inari); wavy silver-white hair with a side braid (Miyuki); short messy dark-brown pixie hair, tall and sporty (Sora); a chestnut-brown side ponytail (Nao); short pink side ponytails with purple cat-ear headphones (Maki). Only eight people, all girls. Long shadows, warm backlight, petals in the air.',
    motion: '' },

  // ---- 尾声 ----
  { id: 'o2_torii', chars: [], bars: 2,
    image: 'The great vermilion torii of Ikuta Shrine at dawn, seen from the stone approach, cherry petals drifting, the first sunlight breaking through between the trees, nobody there.',
    motion: 'A slow pull-back from the torii; petals drift down through the morning light.' },
  { id: 'o2_title', chars: [], bars: 2, title: true, reuse: 'op18_title/key_1.png',
    image: '', motion: 'Slow drift of clouds and petals; the city lights come on below; the sky darkens gently.' }
];

// 给 Veo 的禁止项（Vertex 的 negativePrompt）
export const NEGATIVE = 'talking, lip movement, mouth moving, open mouth laughing, morphing, melting, face distortion, extra limbs, extra fingers, extra tails, hair turning into a tail, ponytail turning into an animal tail, jumping, running, spinning around, fast motion, camera shake, text, letters, subtitles, logos, watermark';
