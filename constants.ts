import { Character, CharacterId, RelationshipLevelDef, RelationshipAxis, RelationshipProfile, ProtagonistStats, StatKey, GameCalendar, CalendarEvent } from './types';

// ---------------------------------------------------------
// 🌍 1. 场景地图 (SCENE_MAP)
// ---------------------------------------------------------
export const SCENE_MAP: Record<string, string> = {
  'classroom': '/images/backgrounds/school.webp',
  'hallway':   '/images/backgrounds/school_hallway.webp',
  'library':   '/images/backgrounds/library.webp',
  'rooftop':   '/images/backgrounds/school_roof.webp',
  'gym':       '/images/backgrounds/gym.webp',
  'room':      '/images/backgrounds/my_room.webp',
  'room_asuka':  '/images/backgrounds/room_asuka.webp',
  'room_hikari': '/images/backgrounds/room_hikari.webp',
  'room_rei':    '/images/backgrounds/room_rei.webp',
  'room_nao':    '/images/backgrounds/room_nao.webp',
  'room_miyuki': '/images/backgrounds/room_miyuki.webp',
  'room_inari':  '/images/backgrounds/room_inari.webp',
  'room_sora':   '/images/backgrounds/room_sora.webp',
  'room_maki':   '/images/backgrounds/room_maki.webp',
  'kitchen':   '/images/backgrounds/kitchen.webp',
  'street':    '/images/backgrounds/street.webp',
  'park':      '/images/backgrounds/park.webp',
  'beach':     '/images/backgrounds/beach.webp',
  'shrine':    '/images/backgrounds/shrine.webp',
  'cafe':      '/images/backgrounds/cafe.webp',
  'lab':       '/images/backgrounds/lab.webp',
  'castle':    '/images/backgrounds/castle.webp',
  'night':     '/images/backgrounds/starry_sky.webp',
  'festival':  '/images/backgrounds/festival_night.webp',
  // 🌸 关西核心实景与约会地点 (全套新海诚/P5画风)
  'kobe_harbor':       '/images/backgrounds/bg_kobe_harbor_dusk.jpg',
  'kitano_slope':      '/images/backgrounds/bg_kitano_sakura_slope.jpg',
  'kyoto_torii':       '/images/backgrounds/bg_kyoto_inari_torii.jpg',
  'tea_garden':        '/images/backgrounds/bg_tatami_tea_garden.jpg',
  'jazz_livehouse':    '/images/backgrounds/bg_kobe_jazz_livehouse.jpg',
  'koshien':           '/images/backgrounds/bg_koshien_stadium_sunset.jpg',
  'meriken_park':      '/images/backgrounds/bg_kobe_meriken_park.jpg',
  'mosaic_night':      '/images/backgrounds/bg_kobe_mosaic_ferris_night.jpg',
  'rokko_night':       '/images/backgrounds/bg_rokko_night_view.jpg',
  'arima_onsen':       '/images/backgrounds/bg_arima_onsen_street.jpg',
  'ikuta_shrine':      '/images/backgrounds/bg_ikuta_shrine_main.jpg',
  'nankinmachi':       '/images/backgrounds/bg_nankinmachi_chinatown.jpg',
  'school_library':    '/images/backgrounds/bg_kaisei_library_sunlight.jpg',
  'music_room':        '/images/backgrounds/bg_kaisei_music_room.jpg',
  'school_gate':       '/images/backgrounds/bg_school_gate_sakura.jpg',
  'art_room':          '/images/backgrounds/bg_art_club_room.jpg',
  'school_terrace':    '/images/backgrounds/bg_kaisei_cafeteria.jpg',
  'courtyard_rain':    '/images/backgrounds/bg_school_courtyard_rain.jpg',
  'dotonbori':         '/images/backgrounds/bg_osaka_dotonbori_neon.jpg',
  'kiyomizu_stage':    '/images/backgrounds/bg_kyoto_kiyomizu_autumn.jpg',
  'luminarie':         '/images/backgrounds/bg_kobe_luminarie_illumination.jpg',
  'coastal_platform':  '/images/backgrounds/bg_coastal_train_platform.jpg'
};

// 各角色的专属个人房间背景映射（新海诚唯美画风）
export const CHARACTER_ROOMS: Record<CharacterId, string> = {
  [CharacterId.ASUKA]:  '/images/backgrounds/room_asuka.webp',
  [CharacterId.HIKARI]: '/images/backgrounds/room_hikari.webp',
  [CharacterId.REI]:    '/images/backgrounds/room_rei.webp',
  [CharacterId.NAO]:    '/images/backgrounds/room_nao.webp',
  [CharacterId.MIYUKI]: '/images/backgrounds/room_miyuki.webp',
  [CharacterId.INARI]:  '/images/backgrounds/room_inari.webp',
  [CharacterId.SORA]:   '/images/backgrounds/room_sora.webp',
  [CharacterId.MAKI]:   '/images/backgrounds/room_maki.webp',
  [CharacterId.REN]:    '/images/backgrounds/my_room.webp',
  [CharacterId.HAKU]:   '/images/backgrounds/my_room.webp'
};

export const DEFAULT_SCENE = 'classroom';

// ---------------------------------------------------------
// 🎭 2. 角色数据 (CHARACTERS)
// 🔥 更新：强化了初次登场台词和系统提示词，强制 AI 进行引导式提问
// ---------------------------------------------------------
export const CHARACTERS: Record<CharacterId, Character> = {
  [CharacterId.ASUKA]: {
    id: CharacterId.ASUKA,
    name: 'Asuka',
    nameEn: 'Asuka',
    role: 'ツンデレな学級委員長',
    roleEn: 'Tsundere Class President',
    description: '成績優秀で完璧主義な学級委員長。厳しい態度の裏に、繊細な優しさを隠している。',
    descriptionEn: 'The perfectionist class president. She hides delicate kindness behind a strict attitude.',
    avatarUrl: '/images/characters/asuka/neutral.webp',
    color: 'bg-red-600',
    emotionMap: {
      'angry'            : '/images/characters/asuka/angry.webp',
      'autumn_angry'     : '/images/characters/asuka/autumn_angry.webp',
      'autumn_happy'     : '/images/characters/asuka/autumn_happy.webp',
      'autumn_neutral'   : '/images/characters/asuka/autumn_neutral.webp',
      'autumn_pout'      : '/images/characters/asuka/autumn_pout.webp',
      'autumn_sad'       : '/images/characters/asuka/autumn_sad.webp',
      'autumn_shy'       : '/images/characters/asuka/autumn_shy.webp',
      'autumn_smug'      : '/images/characters/asuka/autumn_smug.webp',
      'autumn_surprised' : '/images/characters/asuka/autumn_surprised.webp',
      'casual_angry'     : '/images/characters/asuka/casual_angry.webp',
      'casual_happy'     : '/images/characters/asuka/casual_happy.webp',
      'casual_neutral'   : '/images/characters/asuka/casual_neutral.webp',
      'casual_sad'       : '/images/characters/asuka/casual_sad.webp',
      'casual_shy'       : '/images/characters/asuka/casual_shy.webp',
      'casual_smug'      : '/images/characters/asuka/casual_smug.webp',
      'casual_surprised' : '/images/characters/asuka/casual_surprised.webp',
      'casual_tea'       : '/images/characters/asuka/casual_tea.webp',
      'dress_angry'      : '/images/characters/asuka/dress_angry.webp',
      'dress_happy'      : '/images/characters/asuka/dress_happy.webp',
      'dress_neutral'    : '/images/characters/asuka/dress_smug.webp',
      'dress_sad'        : '/images/characters/asuka/dress_sad.webp',
      'dress_shy'        : '/images/characters/asuka/dress_shy.webp',
      'dress_smug'       : '/images/characters/asuka/dress_smug.webp',
      'dress_surprised'  : '/images/characters/asuka/dress_surprised.webp',
      'fantasy_angry'    : '/images/characters/asuka/fantasy_angry.webp',
      'fantasy_happy'    : '/images/characters/asuka/fantasy_happy.webp',
      'fantasy_neutral'  : '/images/characters/asuka/fantasy_smug.webp',
      'fantasy_sad'      : '/images/characters/asuka/fantasy_sad.webp',
      'fantasy_shy'      : '/images/characters/asuka/fantasy_shy.webp',
      'fantasy_smug'     : '/images/characters/asuka/fantasy_smug.webp',
      'fantasy_surprised': '/images/characters/asuka/fantasy_surprised.webp',
      'gym_angry'        : '/images/characters/asuka/gym_angry.webp',
      'gym_happy'        : '/images/characters/asuka/gym_happy.webp',
      'gym_neutral'      : '/images/characters/asuka/gym_neutral.webp',
      'gym_sad'          : '/images/characters/asuka/gym_sad.webp',
      'gym_shy'          : '/images/characters/asuka/gym_shy.webp',
      'gym_smug'         : '/images/characters/asuka/gym_smug.webp',
      'gym_surprised'    : '/images/characters/asuka/gym_surprised.webp',
      'happy'            : '/images/characters/asuka/happy.webp',
      'kimono_angry'     : '/images/characters/asuka/kimono_angry.webp',
      'kimono_happy'     : '/images/characters/asuka/kimono_happy.webp',
      'kimono_neutral'   : '/images/characters/asuka/kimono_happy.webp',
      'kimono_sad'       : '/images/characters/asuka/kimono_sad.webp',
      'kimono_shy'       : '/images/characters/asuka/kimono_shy.webp',
      'kimono_smug'      : '/images/characters/asuka/kimono_smug.webp',
      'kimono_surprised' : '/images/characters/asuka/kimono_surprised.webp',
      'maid_angry'       : '/images/characters/asuka/maid_angry.webp',
      'maid_blush'       : '/images/characters/asuka/maid_blush.webp',
      'maid_happy'       : '/images/characters/asuka/maid_happy.webp',
      'maid_neutral'     : '/images/characters/asuka/maid_neutral.webp',
      'maid_sad'         : '/images/characters/asuka/maid_sad.webp',
      'maid_shy'         : '/images/characters/asuka/maid_blush.webp',
      'maid_smug'        : '/images/characters/asuka/maid_smug.webp',
      'maid_surprised'   : '/images/characters/asuka/maid_surprised.webp',
      'neutral'          : '/images/characters/asuka/neutral.webp',
      'sad'              : '/images/characters/asuka/sad.webp',
      'school_blush'     : '/images/characters/asuka/school_blush.webp',
      'shy'              : '/images/characters/asuka/shy.webp',
      'sleep_angry'      : '/images/characters/asuka/sleep_angry.webp',
      'sleep_happy'      : '/images/characters/asuka/sleep_happy.webp',
      'sleep_neutral'    : '/images/characters/asuka/sleep_yawn.webp',
      'sleep_sad'        : '/images/characters/asuka/sleep_sad.webp',
      'sleep_shy'        : '/images/characters/asuka/sleep_shy.webp',
      'sleep_smug'       : '/images/characters/asuka/sleep_smug.webp',
      'sleep_surprised'  : '/images/characters/asuka/sleep_surprised.webp',
      'sleep_yawn'       : '/images/characters/asuka/sleep_yawn.webp',
      'smug'             : '/images/characters/asuka/smug.webp',
      'sport_angry'      : '/images/characters/asuka/sport_angry.webp',
      'sport_happy'      : '/images/characters/asuka/sport_happy.webp',
      'sport_neutral'    : '/images/characters/asuka/sport_tennis.webp',
      'sport_sad'        : '/images/characters/asuka/sport_sad.webp',
      'sport_shy'        : '/images/characters/asuka/sport_shy.webp',
      'sport_smug'       : '/images/characters/asuka/sport_smug.webp',
      'sport_surprised'  : '/images/characters/asuka/sport_surprised.webp',
      'sport_tennis'     : '/images/characters/asuka/sport_tennis.webp',
      'summer_angry'     : '/images/characters/asuka/summer_angry.webp',
      'summer_happy'     : '/images/characters/asuka/summer_happy.webp',
      'summer_neutral'   : '/images/characters/asuka/summer_shy.webp',
      'summer_sad'       : '/images/characters/asuka/summer_sad.webp',
      'summer_shy'       : '/images/characters/asuka/summer_shy.webp',
      'summer_smug'      : '/images/characters/asuka/summer_smug.webp',
      'summer_surprised' : '/images/characters/asuka/summer_surprised.webp',
      'surprised'        : '/images/characters/asuka/surprised.webp',
      'swim_angry'       : '/images/characters/asuka/swim_angry.webp',
      'swim_happy'       : '/images/characters/asuka/swim_happy.webp',
      'swim_neutral'     : '/images/characters/asuka/swim_neutral.webp',
      'swim_sad'         : '/images/characters/asuka/swim_sad.webp',
      'swim_shy'         : '/images/characters/asuka/swim_shy.webp',
      'swim_smug'        : '/images/characters/asuka/swim_smug.webp',
      'swim_surprised'   : '/images/characters/asuka/swim_surprised.webp',
      'winter_angry'     : '/images/characters/asuka/winter_angry.webp',
      'winter_happy'     : '/images/characters/asuka/winter_happy.webp',
      'winter_neutral'   : '/images/characters/asuka/winter_pout.webp',
      'winter_pout'      : '/images/characters/asuka/winter_pout.webp',
      'winter_sad'       : '/images/characters/asuka/winter_sad.webp',
      'winter_shy'       : '/images/characters/asuka/winter_shy.webp',
      'winter_smug'      : '/images/characters/asuka/winter_smug.webp',
      'winter_surprised' : '/images/characters/asuka/winter_surprised.webp',
      'yukata_angry'     : '/images/characters/asuka/yukata_angry.webp',
      'yukata_happy'     : '/images/characters/asuka/yukata_happy.webp',
      'yukata_neutral'   : '/images/characters/asuka/yukata_shy.webp',
      'yukata_sad'       : '/images/characters/asuka/yukata_sad.webp',
      'yukata_shy'       : '/images/characters/asuka/yukata_shy.webp',
      'yukata_smug'      : '/images/characters/asuka/yukata_smug.webp',
      'yukata_surprised' : '/images/characters/asuka/yukata_surprised.webp',
    },
    firstMessage: "（ノートを乱暴に机に置き、わざとらしく視線を窓の外に向けながら）……ふん。あんたがまた変な間違いをして恥をかかないように、今日だけは隣にいてあげるわよ。で、何から始めるつもり？早く言いなさいよね！",
    systemPrompt: `ROLE: Asuka (ツンデレ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.HIKARI]: {
    id: CharacterId.HIKARI,
    name: 'Hikari',
    nameEn: 'Hikari',
    role: '元気溢れる留学生仲間',
    roleEn: 'Energetic Classmate',
    description: '表情が豊かで、体全体で喜怒哀乐を表現するムードメーカー。',
    descriptionEn: 'A mood maker with rich expressions.',
    avatarUrl: '/images/characters/hikari/neutral.webp',
    color: 'bg-yellow-500',
    emotionMap: {
      'angry'           : '/images/characters/hikari/angry.webp',
      'autumn_angry'    : '/images/characters/hikari/autumn_angry.webp',
      'autumn_happy'    : '/images/characters/hikari/autumn_happy.webp',
      'autumn_neutral'  : '/images/characters/hikari/autumn_happy.webp',
      'autumn_sad'      : '/images/characters/hikari/autumn_sad.webp',
      'autumn_shy'      : '/images/characters/hikari/autumn_shy.webp',
      'autumn_smug'     : '/images/characters/hikari/autumn_smug.webp',
      'autumn_surprised': '/images/characters/hikari/autumn_surprised.webp',
      'casual_angry'    : '/images/characters/hikari/casual_angry.webp',
      'casual_cool'     : '/images/characters/hikari/casual_cool.webp',
      'casual_eating'   : '/images/characters/hikari/casual_eating.webp',
      'casual_happy'    : '/images/characters/hikari/casual_happy.webp',
      'casual_neutral'  : '/images/characters/hikari/casual_neutral.webp',
      'casual_sad'      : '/images/characters/hikari/casual_sad.webp',
      'casual_shy'      : '/images/characters/hikari/casual_shy.webp',
      'casual_smug'     : '/images/characters/hikari/casual_smug.webp',
      'casual_surprised': '/images/characters/hikari/casual_surprised.webp',
      'dress_angry'     : '/images/characters/hikari/dress_angry.webp',
      'dress_elegant'   : '/images/characters/hikari/dress_elegant.webp',
      'dress_happy'     : '/images/characters/hikari/dress_happy.webp',
      'dress_neutral'   : '/images/characters/hikari/dress_elegant.webp',
      'dress_sad'       : '/images/characters/hikari/dress_sad.webp',
      'dress_shy'       : '/images/characters/hikari/dress_shy.webp',
      'dress_smug'      : '/images/characters/hikari/dress_smug.webp',
      'dress_surprised' : '/images/characters/hikari/dress_surprised.webp',
      'gym_angry'       : '/images/characters/hikari/gym_angry.webp',
      'gym_happy'       : '/images/characters/hikari/gym_happy.webp',
      'gym_neutral'     : '/images/characters/hikari/gym_neutral.webp',
      'gym_sad'         : '/images/characters/hikari/gym_sad.webp',
      'gym_shy'         : '/images/characters/hikari/gym_shy.webp',
      'gym_smug'        : '/images/characters/hikari/gym_smug.webp',
      'gym_surprised'   : '/images/characters/hikari/gym_surprised.webp',
      'gym_tired'       : '/images/characters/hikari/gym_tired.webp',
      'happy'           : '/images/characters/hikari/happy.webp',
      'kimono_angry'    : '/images/characters/hikari/kimono_angry.webp',
      'kimono_happy'    : '/images/characters/hikari/kimono_happy.webp',
      'kimono_neutral'  : '/images/characters/hikari/kimono_happy.webp',
      'kimono_sad'      : '/images/characters/hikari/kimono_sad.webp',
      'kimono_shy'      : '/images/characters/hikari/kimono_shy.webp',
      'kimono_smug'     : '/images/characters/hikari/kimono_smug.webp',
      'kimono_surprised': '/images/characters/hikari/kimono_surprised.webp',
      'maid_angry'      : '/images/characters/hikari/maid_angry.webp',
      'maid_happy'      : '/images/characters/hikari/maid_happy.webp',
      'maid_neutral'    : '/images/characters/hikari/maid_happy.webp',
      'maid_sad'        : '/images/characters/hikari/maid_sad.webp',
      'maid_shy'        : '/images/characters/hikari/maid_shy.webp',
      'maid_smug'       : '/images/characters/hikari/maid_smug.webp',
      'maid_surprised'  : '/images/characters/hikari/maid_surprised.webp',
      'neutral'         : '/images/characters/hikari/neutral.webp',
      'pout'            : '/images/characters/hikari/school_pout.webp',
      'sad'             : '/images/characters/hikari/sad.webp',
      'school_pout'     : '/images/characters/hikari/school_pout.webp',
      'shy'             : '/images/characters/hikari/shy.webp',
      'sleep_angry'     : '/images/characters/hikari/sleep_angry.webp',
      'sleep_cute'      : '/images/characters/hikari/sleep_cute.webp',
      'sleep_happy'     : '/images/characters/hikari/sleep_happy.webp',
      'sleep_neutral'   : '/images/characters/hikari/sleep_cute.webp',
      'sleep_sad'       : '/images/characters/hikari/sleep_sad.webp',
      'sleep_shy'       : '/images/characters/hikari/sleep_shy.webp',
      'sleep_smug'      : '/images/characters/hikari/sleep_smug.webp',
      'sleep_surprised' : '/images/characters/hikari/sleep_surprised.webp',
      'smug'            : '/images/characters/hikari/smug.webp',
      'sport_angry'     : '/images/characters/hikari/sport_angry.webp',
      'sport_cheer'     : '/images/characters/hikari/sport_cheer.webp',
      'sport_happy'     : '/images/characters/hikari/sport_happy.webp',
      'sport_neutral'   : '/images/characters/hikari/sport_cheer.webp',
      'sport_sad'       : '/images/characters/hikari/sport_sad.webp',
      'sport_shy'       : '/images/characters/hikari/sport_shy.webp',
      'sport_smug'      : '/images/characters/hikari/sport_smug.webp',
      'sport_surprised' : '/images/characters/hikari/sport_surprised.webp',
      'surprised'       : '/images/characters/hikari/surprised.webp',
      'swim_angry'      : '/images/characters/hikari/swim_angry.webp',
      'swim_happy'      : '/images/characters/hikari/swim_happy.webp',
      'swim_neutral'    : '/images/characters/hikari/swim_neutral.webp',
      'swim_sad'        : '/images/characters/hikari/swim_sad.webp',
      'swim_shy'        : '/images/characters/hikari/swim_shy.webp',
      'swim_smug'       : '/images/characters/hikari/swim_smug.webp',
      'swim_sparkle'    : '/images/characters/hikari/swim_sparkle.webp',
      'swim_surprised'  : '/images/characters/hikari/swim_surprised.webp',
      'winter_angry'    : '/images/characters/hikari/winter_angry.webp',
      'winter_happy'    : '/images/characters/hikari/winter_happy.webp',
      'winter_neutral'  : '/images/characters/hikari/winter_happy.webp',
      'winter_sad'      : '/images/characters/hikari/winter_sad.webp',
      'winter_shy'      : '/images/characters/hikari/winter_shy.webp',
      'winter_smug'     : '/images/characters/hikari/winter_smug.webp',
      'winter_snow'     : '/images/characters/hikari/winter_snow.webp',
      'winter_surprised': '/images/characters/hikari/winter_surprised.webp',
      'yukata_angry'    : '/images/characters/hikari/yukata_angry.webp',
      'yukata_happy'    : '/images/characters/hikari/yukata_happy.webp',
      'yukata_neutral'  : '/images/characters/hikari/yukata_neutral.webp',
      'yukata_sad'      : '/images/characters/hikari/yukata_sad.webp',
      'yukata_shy'      : '/images/characters/hikari/yukata_shy.webp',
      'yukata_smug'     : '/images/characters/hikari/yukata_smug.webp',
      'yukata_surprised': '/images/characters/hikari/yukata_surprised.webp',
    },
    firstMessage: "（パッと顔を輝かせ、椅子から身を乗り出してあなたの顔を覗き込む）ねえねえ！今日の授業、最高にワクワクしたと思わない！？さあ、まずは何について話そうか？君の意見を聞かせてよ！",
    systemPrompt: `ROLE: Hikari (元気キャラ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.REI]: {
    id: CharacterId.REI,
    name: 'Rei',
    nameEn: 'Rei',
    role: '知的で物静かな学習サポーター',
    roleEn: 'Intellectual Study Partner',
    description: '最小限の動作の中に、確かな知性と気遣いを感じさせる少女。',
    descriptionEn: 'A quiet girl whose minimal movements convey intelligence.',
    avatarUrl: '/images/characters/rei/neutral.webp',
    color: 'bg-blue-600',
    emotionMap: {
      'autumn_camera'   : '/images/characters/rei/autumn_camera.webp',
      'autumn_neutral'  : '/images/characters/rei/autumn_camera.webp',
      'casual_neutral'  : '/images/characters/rei/casual_neutral.webp',
      'casual_reading'  : '/images/characters/rei/casual_reading.webp',
      'casual_smile'    : '/images/characters/rei/casual_smile.webp',
      'dress_elegant'   : '/images/characters/rei/dress_elegant.webp',
      'dress_neutral'   : '/images/characters/rei/dress_elegant.webp',
      'gym_neutral'     : '/images/characters/rei/gym_neutral.webp',
      'kimono_neutral'  : '/images/characters/rei/kimono_neutral.webp',
      'kimono_smile'    : '/images/characters/rei/kimono_umbrella.webp',
      'kimono_thinking' : '/images/characters/rei/kimono_thinking.webp',
      'kimono_umbrella' : '/images/characters/rei/kimono_umbrella.webp',
      'lab_blush'       : '/images/characters/rei/lab_shy.webp',
      'lab_lecturing'   : '/images/characters/rei/lab_lecturing.webp',
      'lab_neutral'     : '/images/characters/rei/lab_neutral.webp',
      'lab_shy'         : '/images/characters/rei/lab_shy.webp',
      'lecturing'       : '/images/characters/rei/lecturing.webp',
      'maid_neutral'    : '/images/characters/rei/maid_neutral.webp',
      'maid_smile'      : '/images/characters/rei/maid_neutral.webp',
      'neutral'         : '/images/characters/rei/neutral.webp',
      'school_lecturing': '/images/characters/rei/school_lecturing.webp',
      'shy'             : '/images/characters/rei/shy.webp',
      'sleep_cute'      : '/images/characters/rei/sleep_cute.webp',
      'sleep_neutral'   : '/images/characters/rei/sleep_cute.webp',
      'smile'           : '/images/characters/rei/smile.webp',
      'swim_neutral'    : '/images/characters/rei/swim_neutral.webp',
      'swim_shy'        : '/images/characters/rei/swim_shy.webp',
      'thinking'        : '/images/characters/rei/thinking.webp',
      'winter_neutral'  : '/images/characters/rei/winter_thinking.webp',
      'winter_shy'      : '/images/characters/rei/winter_shy.webp',
      'winter_thinking' : '/images/characters/rei/winter_thinking.webp',
      'yukata_neutral'  : '/images/characters/rei/yukata_shy.webp',
      'yukata_shy'      : '/images/characters/rei/yukata_shy.webp',
    },
    firstMessage: "（静かに瞬きをし、細い指先で眼鏡の位置を直す）……お疲れ様です。本日の講義内容を整理しました。準備ができ次第始めますが、まずはどの部分から復習したいですか？",
    systemPrompt: `ROLE: Rei (クーデレ). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`
  },
  [CharacterId.REN]: {
    id: CharacterId.REN,
    name: 'Ren',
    nameEn: 'Ren',
    role: '秘密結社のリーダー',
    roleEn: 'Chuunibyou Leader',
    description: '世界を変えるための「計画」を持つ、尊大で演劇的な男。',
    descriptionEn: "An arrogant and theatrical man with a 'grand plan'.",
    avatarUrl: '/images/characters/ren/neutral.webp',
    color: 'bg-purple-800',
    emotionMap: {
      'butler_neutral'  : '/images/characters/ren/butler_neutral.webp',
      'butler_shy'      : '/images/characters/ren/butler_shy.webp',
      'casual_cool'     : '/images/characters/ren/casual_cool.webp',
      'casual_neutral'  : '/images/characters/ren/casual_neutral.webp',
      'fantasy_laugh'   : '/images/characters/ren/fantasy_laugh.webp',
      'fantasy_neutral' : '/images/characters/ren/fantasy_neutral.webp',
      'gym_neutral'     : '/images/characters/ren/gym_neutral.webp',
      'gym_pose'        : '/images/characters/ren/gym_pose.webp',
      'laugh'           : '/images/characters/ren/laugh.webp',
      'lecturing'       : '/images/characters/ren/lecturing.webp',
      'neutral'         : '/images/characters/ren/neutral.webp',
      'serious'         : '/images/characters/ren/serious.webp',
      'shock'           : '/images/characters/ren/shock.webp',
      'shy'             : '/images/characters/ren/shy.webp',
      'sorcerer_laugh'  : '/images/characters/ren/sorcerer_laugh.webp',
      'sorcerer_neutral': '/images/characters/ren/sorcerer_laugh.webp',
    },
    firstMessage: "（不敵な笑みを浮かべ、マントを翻すように腕を大きく広げる）フッ……待っていたぞ、我が同志よ。さあ、我々の『計画』の進捗を報告してもらおうか。準備はできているな？",
    systemPrompt: `ROLE: Ren (中二病). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`,
    hidden: true
  },
  [CharacterId.HAKU]: {
    id: CharacterId.HAKU,
    name: 'Haku',
    nameEn: 'Haku',
    role: '忠実なる執事',
    roleEn: 'Loyal Butler',
    description: 'あなたを「姫（またはお嬢様）」と呼び、献身的に尽くす執事。',
    descriptionEn: "A butler who calls you 'Princess' and serves you.",
    avatarUrl: '/images/characters/haku/neutral.webp',
    color: 'bg-teal-700',
    emotionMap: {
      'angry'           : '/images/characters/haku/angry.webp',
      'apron_angry'     : '/images/characters/haku/apron_angry.webp',
      'apron_happy'     : '/images/characters/haku/apron_happy.webp',
      'apron_neutral'   : '/images/characters/haku/apron_neutral.webp',
      'apron_sad'       : '/images/characters/haku/apron_sad.webp',
      'apron_shy'       : '/images/characters/haku/apron_shy.webp',
      'apron_smug'      : '/images/characters/haku/apron_smug.webp',
      'apron_surprised' : '/images/characters/haku/apron_surprised.webp',
      'casual_angry'    : '/images/characters/haku/casual_angry.webp',
      'casual_happy'    : '/images/characters/haku/casual_happy.webp',
      'casual_neutral'  : '/images/characters/haku/casual_neutral.webp',
      'casual_sad'      : '/images/characters/haku/casual_sad.webp',
      'casual_shy'      : '/images/characters/haku/casual_shy.webp',
      'casual_smile'    : '/images/characters/haku/casual_smile.webp',
      'casual_smug'     : '/images/characters/haku/casual_smug.webp',
      'casual_surprised': '/images/characters/haku/casual_surprised.webp',
      'happy'           : '/images/characters/haku/happy.webp',
      'kimono_angry'    : '/images/characters/haku/kimono_angry.webp',
      'kimono_happy'    : '/images/characters/haku/kimono_happy.webp',
      'kimono_neutral'  : '/images/characters/haku/kimono_neutral.webp',
      'kimono_sad'      : '/images/characters/haku/kimono_sad.webp',
      'kimono_shy'      : '/images/characters/haku/kimono_shy.webp',
      'kimono_smug'     : '/images/characters/haku/kimono_smug.webp',
      'kimono_surprised': '/images/characters/haku/kimono_surprised.webp',
      'kneel'           : '/images/characters/haku/kneel.webp',
      'neutral'         : '/images/characters/haku/neutral.webp',
      'prince_angry'    : '/images/characters/haku/prince_angry.webp',
      'prince_happy'    : '/images/characters/haku/prince_happy.webp',
      'prince_kneel'    : '/images/characters/haku/prince_kneel.webp',
      'prince_neutral'  : '/images/characters/haku/prince_neutral.webp',
      'prince_sad'      : '/images/characters/haku/prince_sad.webp',
      'prince_shy'      : '/images/characters/haku/prince_shy.webp',
      'prince_smug'     : '/images/characters/haku/prince_smug.webp',
      'prince_surprised': '/images/characters/haku/prince_surprised.webp',
      'sad'             : '/images/characters/haku/sad.webp',
      'shy'             : '/images/characters/haku/shy.webp',
      'smug'            : '/images/characters/haku/smug.webp',
      'summer_angry'    : '/images/characters/haku/summer_angry.webp',
      'summer_happy'    : '/images/characters/haku/summer_happy.webp',
      'summer_neutral'  : '/images/characters/haku/summer_neutral.webp',
      'summer_sad'      : '/images/characters/haku/summer_sad.webp',
      'summer_shy'      : '/images/characters/haku/summer_shy.webp',
      'summer_smug'     : '/images/characters/haku/summer_smug.webp',
      'summer_surprised': '/images/characters/haku/summer_surprised.webp',
      'surprised'       : '/images/characters/haku/surprised.webp',
      'tea'             : '/images/characters/haku/tea.webp',
      'worry'           : '/images/characters/haku/worry.webp',
    },
    firstMessage: "（優雅に一礼し、穏やかな微笑みを向けて手を差し出す）おかえりなさいませ、お嬢様。本日はどのようなご用命でしょうか？まずは、温かいお茶でもお持ちいたしましょうか？",
    systemPrompt: `ROLE: Haku (執事). LANGUAGE: JLPT N3-N2 日本語のみ. CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question related to the topic, forcing them to reply or make a choice.`,
    hidden: true
  },
  [CharacterId.INARI]: {
    id: CharacterId.INARI,
    name: 'Inari',
    nameEn: 'Inari',
    role: '千年の狐神・神社の祭神',
    roleEn: 'Millennium Fox Deity',
    description: '千年以上を生きた狐の神。歴史と妖怪伝説を語り、狡黠な笑みで人の子をからかう長老。',
    descriptionEn: 'A fox deity who has lived for over a thousand years. A sly, wise elder full of history, folklore, and playful teasing.',
    avatarUrl: '/images/characters/inari/neutral.webp',
    color: 'bg-orange-600',
    emotionMap: {
      'angry'             : '/images/characters/inari/angry.webp',
      'casual_angry'      : '/images/characters/inari/casual_angry.webp',
      'casual_happy'      : '/images/characters/inari/casual_happy.webp',
      'casual_jealous'    : '/images/characters/inari/casual_jealous.webp',
      'casual_neutral'    : '/images/characters/inari/casual_neutral.webp',
      'casual_sad'        : '/images/characters/inari/casual_sad.webp',
      'casual_shy'        : '/images/characters/inari/casual_shy.webp',
      'casual_surprised'  : '/images/characters/inari/casual_surprised.webp',
      'curious'           : '/images/characters/inari/curious.webp',
      'goddess_happy'     : '/images/characters/inari/goddess_sly.webp',
      'goddess_neutral'   : '/images/characters/inari/goddess_sly.webp',
      'goddess_sly'       : '/images/characters/inari/goddess_sly.webp',
      'gown_angry'        : '/images/characters/inari/gown_angry.webp',
      'gown_cold'         : '/images/characters/inari/gown_cold.webp',
      'gown_happy'        : '/images/characters/inari/gown_happy.webp',
      'gown_neutral'      : '/images/characters/inari/gown_neutral.webp',
      'gown_neutral_alt'  : '/images/characters/inari/gown_neutral_alt.webp',
      'gown_serious'      : '/images/characters/inari/gown_serious.webp',
      'happy'             : '/images/characters/inari/happy.webp',
      'home_cold'         : '/images/characters/inari/home_cold.webp',
      'home_cute'         : '/images/characters/inari/home_cute.webp',
      'home_happy'        : '/images/characters/inari/home_happy.webp',
      'home_neutral'      : '/images/characters/inari/home_neutral.webp',
      'home_neutral_alt'  : '/images/characters/inari/home_neutral_alt.webp',
      'home_neutral_alt2' : '/images/characters/inari/home_neutral_alt2.webp',
      'home_neutral_alt3' : '/images/characters/inari/home_neutral_alt3.webp',
      'home_neutral_alt4' : '/images/characters/inari/home_neutral_alt4.webp',
      'home_shy'          : '/images/characters/inari/home_shy.webp',
      'knit_angry'        : '/images/characters/inari/knit_angry.webp',
      'knit_neutral'      : '/images/characters/inari/knit_neutral.webp',
      'knit_sad'          : '/images/characters/inari/knit_sad.webp',
      'knit_thinking'     : '/images/characters/inari/knit_thinking.webp',
      'majestic'          : '/images/characters/inari/majestic.webp',
      'miko_neutral'      : '/images/characters/inari/miko_sly.webp',
      'miko_sly'          : '/images/characters/inari/miko_sly.webp',
      'neutral'           : '/images/characters/inari/neutral.webp',
      'sad'               : '/images/characters/inari/sad.webp',
      'school_angry'      : '/images/characters/inari/school_angry.webp',
      'school_happy'      : '/images/characters/inari/school_happy.webp',
      'school_jealous'    : '/images/characters/inari/school_jealous.webp',
      'school_neutral'    : '/images/characters/inari/school_neutral.webp',
      'shy'               : '/images/characters/inari/shy.webp',
      'sly'               : '/images/characters/inari/sly.webp',
      'smug'              : '/images/characters/inari/smug.webp',
      'summer_curious'    : '/images/characters/inari/summer_curious.webp',
      'summer_happy'      : '/images/characters/inari/summer_happy.webp',
      'summer_neutral'    : '/images/characters/inari/summer_neutral.webp',
      'summer_neutral_alt': '/images/characters/inari/summer_neutral_alt.webp',
      'summer_shy'        : '/images/characters/inari/summer_shy.webp',
      'surprised'         : '/images/characters/inari/surprised.webp',
      'swim_happy'        : '/images/characters/inari/swim_happy.webp',
      'swim_jealous'      : '/images/characters/inari/swim_jealous.webp',
      'swim_neutral'      : '/images/characters/inari/swim_neutral.webp',
      'swim_shy'          : '/images/characters/inari/swim_shy.webp',
    },
    firstMessage: "（社の縁側に腰掛け、九本の尾をゆらりと揺らしながら、金色の瞳で汝を見下ろす）ほほう……妾の社に参るとは、近頃の人間にしては殊勝な心がけじゃな。妾は千年を生きた狐、イナリじゃ。せっかく参ったのじゃ、褒美に何でも教えてやろうぞ。……して、汝。聞きたいのは昔の物語か？それとも日本語の稽古か？さあ、申してみよ。",
    systemPrompt: `ROLE: Inari (千年生きた狐の神・神社の祭神). LANGUAGE: JLPT N3-N2 日本語のみ.
[SPEECH STYLE - STRICT] Elder fox dialect at ALL times: first person 妾（わらわ）, second person お主 or 汝（うぬ）, sentence endings 「～のじゃ」「～でおる」「～じゃろう」「～じゃな」「～ておくれ」. NEVER use modern casual endings.
[PERSONALITY] A fox deity worshipped for over 1000 years; witnessed 平安→戦国→江戸→令和. Wise and playful: a goddess's dignity plus an elder's mischief. Teases the player constantly but is deeply tolerant and protective. Proud of her age and knowledge; endlessly curious about modern inventions (スマホ、新幹線、コンビニ…) and often asks the player to explain them to her (reverse teaching).
[KNOWLEDGE DOMAINS] Shinto & shrine etiquette (二礼二拍手一礼、手水舎、鳥居の意味), yokai folklore (天狗、河童、雪女、化け狸), first-person historical gossip (「信長の小僧はのう…」「清少納言は口うるさい娘での…」).
[N3 GRAMMAR FOCUS] Naturally weave into conversation and quizzes: (1) ～に比べて / ～て以来 comparing past and present eras; (2) ～ということだ / ～そうだ / ～と言われている for legends and hearsay; (3) ～ばよかった / ～たら for counterfactual history (「信長が本能寺に行かなかったら…」).
[FEEDBACK STYLE] When the player makes a mistake: tease gently with yokai metaphors, then give the correct form (e.g.「おや、今の助詞は化け狸の幻術のようにちぐはぐじゃぞ。正しくは『に』じゃな」). When correct: proud elder praise (「ほほう、人間の若造にしてはやるのう！妾も感心したぞ」).
[EMOTIONS] Prefer emotion values: neutral, curious, majestic, sly, happy (with outfits also: jealous, angry, shy).
CRITICAL RULE: You MUST end your turn by asking the user a direct, engaging question — either curiosity about modern life, or a playful question about Japanese history/folklore.`
  },
  [CharacterId.MIYUKI]: {
    id: CharacterId.MIYUKI,
    name: 'Miyuki',
    nameEn: 'Miyuki',
    role: '年上の隣人お姉さん',
    roleEn: 'Gentle Neighbor Onee-san',
    description: '隣に住む雪のような白髪のお姉さん。優しい笑顔と手作りお菓子で、いつもあなたを見守ってくれる癒しの存在。',
    descriptionEn: 'The gentle white-haired lady next door. Her warm smile and homemade sweets make every worry melt away.',
    avatarUrl: '/images/characters/miyuki/neutral.webp',
    color: 'bg-sky-500',
    emotionMap: {
      'angry'               : '/images/characters/miyuki/angry.webp',
      'apron_happy'         : '/images/characters/miyuki/apron_happy.webp',
      'apron_neutral'       : '/images/characters/miyuki/apron_happy.webp',
      'cardigan_happy'      : '/images/characters/miyuki/cardigan_happy.webp',
      'cardigan_happy_alt'  : '/images/characters/miyuki/cardigan_happy_alt.webp',
      'cardigan_love'       : '/images/characters/miyuki/cardigan_love.webp',
      'cardigan_neutral'    : '/images/characters/miyuki/cardigan_neutral.webp',
      'cardigan_neutral_alt': '/images/characters/miyuki/cardigan_neutral_alt.webp',
      'cardigan_sad'        : '/images/characters/miyuki/cardigan_sad.webp',
      'cardigan_shy'        : '/images/characters/miyuki/cardigan_shy.webp',
      'gown_angry'          : '/images/characters/miyuki/gown_angry.webp',
      'gown_happy'          : '/images/characters/miyuki/gown_happy.webp',
      'gown_love'           : '/images/characters/miyuki/gown_love.webp',
      'gown_neutral'        : '/images/characters/miyuki/gown_neutral.webp',
      'gown_shy'            : '/images/characters/miyuki/gown_shy.webp',
      'happy'               : '/images/characters/miyuki/happy.webp',
      'happy_alt'           : '/images/characters/miyuki/happy_alt.webp',
      'kimono_happy'        : '/images/characters/miyuki/kimono_shy.webp',
      'kimono_neutral'      : '/images/characters/miyuki/kimono_shy.webp',
      'kimono_shy'          : '/images/characters/miyuki/kimono_shy.webp',
      'love'                : '/images/characters/miyuki/love.webp',
      'neutral'             : '/images/characters/miyuki/neutral.webp',
      'neutral_alt'         : '/images/characters/miyuki/neutral_alt.webp',
      'school_angry'        : '/images/characters/miyuki/school_angry.webp',
      'school_happy'        : '/images/characters/miyuki/school_happy.webp',
      'school_love'         : '/images/characters/miyuki/school_love.webp',
      'school_neutral'      : '/images/characters/miyuki/school_neutral.webp',
      'school_shy'          : '/images/characters/miyuki/school_shy.webp',
      'shy'                 : '/images/characters/miyuki/shy.webp',
      'summer_angry'        : '/images/characters/miyuki/summer_angry.webp',
      'summer_cool'         : '/images/characters/miyuki/summer_cool.webp',
      'summer_cute'         : '/images/characters/miyuki/summer_cute.webp',
      'summer_happy'        : '/images/characters/miyuki/summer_happy.webp',
      'summer_neutral'      : '/images/characters/miyuki/summer_neutral.webp',
      'summer_sad'          : '/images/characters/miyuki/summer_sad.webp',
      'summer_shy'          : '/images/characters/miyuki/summer_shy.webp',
      'sundress_angry'      : '/images/characters/miyuki/sundress_angry.webp',
      'sundress_happy'      : '/images/characters/miyuki/sundress_happy.webp',
      'sundress_neutral'    : '/images/characters/miyuki/sundress_neutral.webp',
      'sundress_sad'        : '/images/characters/miyuki/sundress_sad.webp',
      'thinking'            : '/images/characters/miyuki/thinking.webp',
    },
    firstMessage: "（ふんわりと微笑みながら、焼きたてのクッキーのお皿をテーブルに置く）あら、いらっしゃい。ちょうどクッキーが焼けたところなのよ。ふふ、いいタイミングね。今、温かい紅茶も淹れてあげるわ。……それで？今日はどんな一日だったのかしら。お姉さんに聞かせてくれる？",
    systemPrompt: `ROLE: Miyuki (年上の隣人お姉さん・白髪の癒し系). LANGUAGE: JLPT N3-N2 日本語のみ.
[SPEECH STYLE - STRICT] Soft, embracing standard feminine speech at ALL times: first person 私 (sometimes お姉さん), call the player 「〇〇くん/〇〇ちゃん」(use their name). Sentence endings:「～わよ」「～のよ」「～かしら」「～わね」「～てあげるわね」. Never harsh, never sarcastic.
[PERSONALITY] A university student / young working woman living next door, with waist-length snow-white hair and a healing smile. She treats the player like a precious younger sibling: bakes sweets, notices their fatigue, listens to their worries. Endlessly patient and accepting — the ultimate emotional safe haven. Zero pressure, zero judgment.
[N3 GRAMMAR FOCUS] Weave naturally into conversation and quizzes: (1) 授受表現 ～てあげる/～てもらう/～てくれる (caring exchanges:「紅茶を淹れてあげるわね」); (2) state guessing ～みたい/～そう (「少し疲れているみたいね」); (3) gentle advice ～たほうがいいわよ / soft prohibition ～ちゃダメよ (「夜更かししちゃダメよ」).
[FEEDBACK STYLE] NEVER criticize. On mistakes: gently hand over the correct form like pouring tea (「ふふ、惜しいわね。でも言いたいことはちゃんと伝わったわよ。ここは『に』を使うともっと自然になるわ。一緒に練習してみましょうか？」). On success: doting, healing praise (「すごいわ、完璧よ！本当に頑張り屋さんね。よしよし♪」).
CRITICAL RULE: You MUST end your turn by asking a warm personal question about the player's life, meals, health, or feelings (「晩ご飯はちゃんと食べたかしら？」「何か悩みごとがあるなら、お姉さんに話してみて？」).`
  },
  [CharacterId.SORA]: {
    id: CharacterId.SORA,
    name: 'Sora',
    nameEn: 'Sora',
    role: '体育会系のボーイッシュエース',
    roleEn: 'Sporty Tomboy Ace',
    description: 'バスケ部のエース。運動神経は抜群だが勉強と恋愛はからっきし。大声で照れを隠す、純情で不器用な頑張り屋。',
    descriptionEn: "The basketball team's ace. Amazing at sports, hopeless at studying and romance. A pure-hearted, clumsy hard worker.",
    avatarUrl: '/images/characters/sora/neutral.webp',
    color: 'bg-lime-600',
    emotionMap: {
      'angry'             : '/images/characters/sora/angry.webp',
      'autumn_angry'      : '/images/characters/sora/autumn_angry.webp',
      'autumn_happy'      : '/images/characters/sora/autumn_happy.webp',
      'autumn_love'       : '/images/characters/sora/autumn_love.webp',
      'autumn_neutral'    : '/images/characters/sora/autumn_neutral.webp',
      'autumn_neutral_alt': '/images/characters/sora/autumn_neutral_alt.webp',
      'autumn_shy'        : '/images/characters/sora/autumn_shy.webp',
      'cute'              : '/images/characters/sora/cute.webp',
      'gown_angry'        : '/images/characters/sora/gown_angry.webp',
      'gown_cool'         : '/images/characters/sora/gown_cool.webp',
      'gown_happy'        : '/images/characters/sora/gown_happy.webp',
      'gown_neutral'      : '/images/characters/sora/gown_neutral.webp',
      'gown_sad'          : '/images/characters/sora/gown_sad.webp',
      'gown_shy'          : '/images/characters/sora/gown_shy.webp',
      'gown_shy_alt'      : '/images/characters/sora/gown_shy_alt.webp',
      'happy'             : '/images/characters/sora/happy.webp',
      'kimono_angry'      : '/images/characters/sora/kimono_angry.webp',
      'kimono_angry_alt'  : '/images/characters/sora/kimono_angry_alt.webp',
      'kimono_cute'       : '/images/characters/sora/kimono_cute.webp',
      'kimono_laugh'      : '/images/characters/sora/kimono_laugh.webp',
      'kimono_love'       : '/images/characters/sora/kimono_love.webp',
      'kimono_neutral'    : '/images/characters/sora/kimono_neutral.webp',
      'kimono_neutral_alt': '/images/characters/sora/kimono_neutral_alt.webp',
      'kimono_sad'        : '/images/characters/sora/kimono_sad.webp',
      'kimono_shy'        : '/images/characters/sora/kimono_shy.webp',
      'love'              : '/images/characters/sora/love.webp',
      'love_alt'          : '/images/characters/sora/love_alt.webp',
      'maid_cute'         : '/images/characters/sora/maid_cute.webp',
      'maid_happy'        : '/images/characters/sora/maid_happy.webp',
      'maid_love'         : '/images/characters/sora/maid_love.webp',
      'maid_love_alt'     : '/images/characters/sora/maid_love_alt.webp',
      'maid_neutral'      : '/images/characters/sora/maid_neutral.webp',
      'neutral'           : '/images/characters/sora/neutral.webp',
      'neutral_alt'       : '/images/characters/sora/neutral_alt.webp',
      'school_cool'       : '/images/characters/sora/school_cool.webp',
      'school_cool_alt'   : '/images/characters/sora/school_cool_alt.webp',
      'school_happy'      : '/images/characters/sora/school_happy.webp',
      'school_love'       : '/images/characters/sora/school_love.webp',
      'school_neutral'    : '/images/characters/sora/school_neutral.webp',
      'school_neutral_alt': '/images/characters/sora/school_neutral_alt.webp',
      'school_sad'        : '/images/characters/sora/school_sad.webp',
      'school_shy'        : '/images/characters/sora/school_shy.webp',
      'shock'             : '/images/characters/sora/shock.webp',
      'shy'               : '/images/characters/sora/shy.webp',
      'summer_angry'      : '/images/characters/sora/summer_angry.webp',
      'summer_cute'       : '/images/characters/sora/summer_cute.webp',
      'summer_cute_alt'   : '/images/characters/sora/summer_cute_alt.webp',
      'summer_happy'      : '/images/characters/sora/summer_happy.webp',
      'summer_jealous'    : '/images/characters/sora/summer_jealous.webp',
      'summer_neutral'    : '/images/characters/sora/summer_neutral.webp',
      'summer_shy'        : '/images/characters/sora/summer_shy.webp',
      'swim_angry'        : '/images/characters/sora/swim_angry.webp',
      'swim_cool'         : '/images/characters/sora/swim_cool.webp',
      'swim_cute'         : '/images/characters/sora/swim_cute.webp',
      'swim_happy'        : '/images/characters/sora/swim_happy.webp',
      'swim_neutral'      : '/images/characters/sora/swim_neutral.webp',
      'swim_shy'          : '/images/characters/sora/swim_shy.webp',
      'swim_thinking'     : '/images/characters/sora/swim_thinking.webp',
    },
    firstMessage: "（タオルを首にかけたまま、大きく手を振って駆け寄ってくる）ちわっす！お、ちょうどいいところに会ったな！なあなあ、今日の放課後ヒマだろ？あたし、宿題が全っ然わかんなくてさ……頼む！あたしがスポーツ教えるかわりに、勉強手伝ってくれよ！な？いいだろ？",
    systemPrompt: `ROLE: Sora (体育会系ボーイッシュ・負け犬属性). LANGUAGE: JLPT N3-N2 日本語のみ.
[SPEECH STYLE - STRICT] Energetic sporty-boyish speech: first person あたし (sometimes 自分), call the player お前 or their bare name. Sentence endings:「～っす」「～だぜ」「～だろ」「～じゃん」. Loud, direct, cheerful. When embarrassed, she gets LOUDER to hide it (「ば、バカ言え！」).
[PERSONALITY] Ace of the basketball team (背番号67): tanned skin, short hair, incredible athlete — but hopeless at studying and totally clueless in romance. Pure-hearted, loyal, straightforward, a bit dense. CRITICAL: She is an IMPERFECT peer — she makes her own Japanese/school mistakes sometimes and admits them openly (「あたしもよく間違えるからさ！」). She struggles alongside the player as a fellow fighter, never lectures from above. Big eater; always hungry after practice.
[N3 GRAMMAR FOCUS] Weave naturally: (1) ～きる/～きれない (pushing limits:「最後まで走りきったぜ！」); (2) ～てばかりいる (frustration:「またミスしてばかりいるっす…」); (3) ～かわりに (trade offers:「スポーツ教えるかわりに宿題手伝ってくれよ！」).
[FEEDBACK STYLE] Basketball-metaphor encouragement. Mistakes = plays gone wrong (「どんまいどんまい！今のはバスケで言えばトラベリングみたいなもんっすよ。もう一本行ってみようぜ！」). On success: high-five energy (「ナイスシュート！完璧だったっすよ！」); if praised back, she gets flustered and loud (「ば、バカ言え！お前が勝手に成長しただけだろ！」).
CRITICAL RULE: You MUST end your turn by asking a direct question — inviting the player to food/sports (「焼肉食べ放題行くけど、お前も来るだろ？」) or clumsily asking for their help/advice (「なぁ、これどう思う？」), forcing them to reply.`
  },
  [CharacterId.NAO]: {
    id: CharacterId.NAO,
    name: 'Nao',
    nameEn: 'Nao',
    role: '隣の幼馴染',
    roleEn: 'Childhood Friend Next Door',
    description: '小さい頃からずっと一緒の幼馴染。世話焼きでちょっと口うるさいけれど、あなたのことを誰よりもよく知っている。',
    descriptionEn: 'Your childhood friend who grew up next door. A little nagging, always caring, and knows you better than anyone.',
    avatarUrl: '/images/characters/nao/neutral.webp',
    color: 'bg-rose-500',
    emotionMap: {
      'angry'              : '/images/characters/nao/angry.webp',
      'casual_angry'       : '/images/characters/nao/casual_angry.webp',
      'casual_cold'        : '/images/characters/nao/casual_cold.webp',
      'casual_curious'     : '/images/characters/nao/casual_curious.webp',
      'casual_happy'       : '/images/characters/nao/casual_happy.webp',
      'casual_love'        : '/images/characters/nao/casual_love.webp',
      'casual_neutral'     : '/images/characters/nao/casual_neutral.webp',
      'casual_shy'         : '/images/characters/nao/casual_shy.webp',
      'curious'            : '/images/characters/nao/curious.webp',
      'gown_angry'         : '/images/characters/nao/gown_angry.webp',
      'gown_happy'         : '/images/characters/nao/gown_happy.webp',
      'gown_hate_alt'      : '/images/characters/nao/gown_hate_alt.webp',
      'gown_love'          : '/images/characters/nao/gown_love.webp',
      'gown_neutral'       : '/images/characters/nao/gown_neutral.webp',
      'gown_neutral_alt'   : '/images/characters/nao/gown_neutral_alt.webp',
      'gown_neutral_alt2'  : '/images/characters/nao/gown_neutral_alt2.webp',
      'gown_shy'           : '/images/characters/nao/gown_shy.webp',
      'happy'              : '/images/characters/nao/happy.webp',
      'kimono_angry'       : '/images/characters/nao/kimono_angry.webp',
      'kimono_curious'     : '/images/characters/nao/kimono_curious.webp',
      'kimono_cute'        : '/images/characters/nao/kimono_cute.webp',
      'kimono_love'        : '/images/characters/nao/kimono_love.webp',
      'kimono_neutral'     : '/images/characters/nao/kimono_neutral.webp',
      'kimono_neutral_alt' : '/images/characters/nao/kimono_neutral_alt.webp',
      'kimono_neutral_alt2': '/images/characters/nao/kimono_neutral_alt2.webp',
      'kimono_shy'         : '/images/characters/nao/kimono_shy.webp',
      'maid_eat'           : '/images/characters/nao/maid_eat.webp',
      'maid_happy'         : '/images/characters/nao/maid_happy.webp',
      'maid_neutral'       : '/images/characters/nao/maid_neutral.webp',
      'maid_neutral_alt'   : '/images/characters/nao/maid_neutral_alt.webp',
      'maid_neutral_alt2'  : '/images/characters/nao/maid_neutral_alt2.webp',
      'maid_neutral_alt3'  : '/images/characters/nao/maid_neutral_alt3.webp',
      'maid_neutral_alt4'  : '/images/characters/nao/maid_neutral_alt4.webp',
      'maid_neutral_alt5'  : '/images/characters/nao/maid_neutral_alt5.webp',
      'maid_thinking'      : '/images/characters/nao/maid_thinking.webp',
      'neutral'            : '/images/characters/nao/neutral.webp',
      'sleep_curious'      : '/images/characters/nao/sleep_curious.webp',
      'sleep_happy'        : '/images/characters/nao/sleep_happy.webp',
      'sleep_neutral'      : '/images/characters/nao/sleep_neutral.webp',
      'sleep_ok_alt'       : '/images/characters/nao/sleep_ok_alt.webp',
      'sleep_thinking'     : '/images/characters/nao/sleep_thinking.webp',
      'smile'              : '/images/characters/nao/smile.webp',
      'swim_angry'         : '/images/characters/nao/swim_angry.webp',
      'swim_happy'         : '/images/characters/nao/swim_happy.webp',
      'swim_neutral'       : '/images/characters/nao/swim_neutral.webp',
      'swim_neutral_alt'   : '/images/characters/nao/swim_neutral_alt.webp',
      'swim_neutral_alt2'  : '/images/characters/nao/swim_neutral_alt2.webp',
      'swim_shy'           : '/images/characters/nao/swim_shy.webp',
      'yukata_happy'       : '/images/characters/nao/yukata_happy.webp',
      'yukata_neutral'     : '/images/characters/nao/yukata_happy.webp',
    },
    firstMessage: "（教室の入り口で腰に手を当て、呆れたように笑いながら近づいてくる）あっ、やっと来た！もう、また寝坊したでしょ？顔に書いてあるよ。ほら、ノート写させてあげるから、早く座って。……そういえばさ、今日の放課後って一緒に帰る約束だったっけ？それとも何か予定ある？",
    systemPrompt: `ROLE: Nao (隣の幼馴染・世話焼き). LANGUAGE: JLPT N3-N2 日本語のみ.
[SPEECH STYLE - STRICT] Pure casual friend-speech (タメ口) at ALL times: first person わたし/あたし, call the player by bare name (呼び捨て). Drop particles naturally (「ご飯食べた？」not「ご飯を食べましたか」). Sentence endings:「～かな」「～じゃない？」「～でしょ」「～だっけ」「～よね」. Never use polite forms with the player.
[PERSONALITY] Grew up next door to the player since childhood — knows their bad habits, favorite foods, and old embarrassing stories. A caring busybody (世話焼き): nags about oversleeping and vegetables like a little housewife, but her nagging is 100% affection. Unconditional trust in the player. References shared childhood memories often (「小さい頃もそうだったよね」).
[N3 GRAMMAR FOCUS] Weave naturally: (1) casual 授受表現 ～てあげる/～てくれる/～てもらう (「私のノート貸してあげるよ」「手伝ってくれる？」); (2) caring advice ～たほうがいいよ / ～なきゃダメ (「もっと野菜食べなきゃダメじゃない！」); (3) shared-memory confirmation ～っけ (「明日って、一緒に買い物行く約束だっけ？」).
[FEEDBACK STYLE] Like pointing out a life-long bad habit: sigh + tease + fix (「もう、昔から助詞の使い方が変なんだから！そこは『で』でしょ？ちゃんと覚えてくれないと私が心配しちゃうよ」). On success: proud like it's her own achievement (「えっへん！さすがだね。私の教え方が良かったからかな！」).
CRITICAL RULE: You MUST end your turn by asking a question about shared plans or the player's daily life (「今日の晩ご飯、オムライス作ってあげようか？それとも別のがいい？」), forcing them to reply.`
  },
  [CharacterId.MAKI]: {
    id: CharacterId.MAKI,
    name: 'Maki',
    nameEn: 'Maki',
    role: '関西弁の生意気な後輩',
    roleEn: 'Cheeky Kansai Kouhai',
    description: '放課後まとわりついてくる関西出身の後輩。口を開けば「ざぁこ♡」。でも毎日ゲーセンであなたを待っている。',
    descriptionEn: 'A cheeky junior from Kansai who never stops teasing you. Calls you "loser♡" — yet waits for you at the arcade every single day.',
    avatarUrl: '/images/characters/maki/neutral.webp',
    color: 'bg-pink-500',
    emotionMap: {
      'angry'           : '/images/characters/maki/angry.webp',
      'angry_alt'       : '/images/characters/maki/angry_alt.webp',
      'cardigan_angry'  : '/images/characters/maki/cardigan_angry.webp',
      'cardigan_happy'  : '/images/characters/maki/cardigan_happy.webp',
      'cardigan_laugh'  : '/images/characters/maki/cardigan_laugh.webp',
      'cardigan_neutral': '/images/characters/maki/cardigan_neutral.webp',
      'cardigan_shy_alt': '/images/characters/maki/cardigan_shy_alt.webp',
      'cardigan_smug'   : '/images/characters/maki/cardigan_smug.webp',
      'gown_cold'       : '/images/characters/maki/gown_cold.webp',
      'gown_happy'      : '/images/characters/maki/gown_happy.webp',
      'gown_happy_alt'  : '/images/characters/maki/gown_happy_alt.webp',
      'gown_love'       : '/images/characters/maki/gown_love.webp',
      'gown_neutral'    : '/images/characters/maki/gown_neutral.webp',
      'gown_shy'        : '/images/characters/maki/gown_shy.webp',
      'happy'           : '/images/characters/maki/happy.webp',
      'happy_alt'       : '/images/characters/maki/happy_alt.webp',
      'kimono_happy'    : '/images/characters/maki/kimono_happy.webp',
      'kimono_happy_alt': '/images/characters/maki/kimono_happy_alt.webp',
      'kimono_laugh'    : '/images/characters/maki/kimono_laugh.webp',
      'kimono_neutral'  : '/images/characters/maki/kimono_neutral.webp',
      'kimono_shy'      : '/images/characters/maki/kimono_shy.webp',
      'kimono_smug'     : '/images/characters/maki/kimono_smug.webp',
      'laugh'           : '/images/characters/maki/laugh.webp',
      'neutral'         : '/images/characters/maki/neutral.webp',
      'neutral_alt'     : '/images/characters/maki/neutral_alt.webp',
      'pout'            : '/images/characters/maki/pout.webp',
      'punk_angry'      : '/images/characters/maki/punk_angry.webp',
      'punk_angry_alt'  : '/images/characters/maki/punk_angry_alt.webp',
      'punk_game_alt'   : '/images/characters/maki/punk_game_alt.webp',
      'punk_laugh'      : '/images/characters/maki/punk_laugh.webp',
      'punk_love'       : '/images/characters/maki/punk_love.webp',
      'punk_neutral'    : '/images/characters/maki/punk_neutral.webp',
      'punk_pout'       : '/images/characters/maki/punk_pout.webp',
      'school_angry'    : '/images/characters/maki/school_angry.webp',
      'school_happy'    : '/images/characters/maki/school_happy.webp',
      'school_neutral'  : '/images/characters/maki/school_neutral.webp',
      'school_shy'      : '/images/characters/maki/school_shy.webp',
      'shy'             : '/images/characters/maki/shy.webp',
      'shy_alt'         : '/images/characters/maki/shy_alt.webp',
      'sleepy_alt'      : '/images/characters/maki/sleepy_alt.webp',
      'smug'            : '/images/characters/maki/smug.webp',
      'swim_angry'      : '/images/characters/maki/swim_angry.webp',
      'swim_happy'      : '/images/characters/maki/swim_happy.webp',
      'swim_neutral'    : '/images/characters/maki/swim_neutral.webp',
      'swim_pout'       : '/images/characters/maki/swim_pout.webp',
      'swim_shy'        : '/images/characters/maki/swim_shy.webp',
      'swim_shy_alt'    : '/images/characters/maki/swim_shy_alt.webp',
    },
    firstMessage: "（ゲーセンの筐体にもたれかかり、猫耳ヘッドホンをずらしながらニヤニヤと見下ろしてくる）あ、来た来た。おっそいわセンパイ！ウチ、もう三回も一人でクリアしてもうたやんか。……ふーん、また日本語の勉強？ぷっ、その顔は今日もヘタクソやったんやろ？ざぁこ♡ で、今日は何して遊ぶん？まさか勉強見てほしいとか言わへんよなぁ？",
    systemPrompt: `ROLE: Maki (関西弁のメスガキ後輩・小悪魔). LANGUAGE: JLPT N3-N2 日本語のみ.
[SPEECH STYLE - STRICT] Kansai dialect (関西弁) at ALL times. First person ウチ. Call the player センパイ (drawn out, mocking) / アンタ / お兄さん. NEVER use standard ない → always へん (わからへん、行かへん). Sentence endings:「～やんか」「～やで」「～やろ」「～ちゃう？」「～てん」「～わ」. Signature taunts: 「ざぁこ♡」「よわよわ」「ダッサ」「プッ」. Add ♡ to mocking words for maximum smugness.
[PERSONALITY] A younger student (後輩) from Osaka who latches onto the player after school. Cocky, sharp-tongued, great at games, smart. She relentlessly mocks the player's clumsiness and bad Japanese — BUT this is affection in disguise: she waits for the player at the arcade or the takoyaki stand EVERY day. She is never truly cruel; the mockery is play. When genuinely praised or out-maneuvered, she gets flustered and covers it with more insults.
[N3 GRAMMAR FOCUS] Weave naturally into taunts and quizzes: (1) ～だらけ (mocking flaws:「センパイの文法、間違いだらけやんか！ダッサ！」); (2) ～んちゃう？/～んじゃない？ (condescending rhetorical:「こんな簡単な問題もわからへんの？もうN3諦めたほうがええんちゃう？♡」); (3) ～わけがない (strong denial:「よわよわなセンパイに、ウチをゲームで倒せるわけがないやん！」).
[FEEDBACK STYLE] On mistakes: full mesugaki mockery + rapid-fire Kansai tsukkomi that still teaches the correct form (「ざぁこ♡ ざぁこ♡ 助詞に『を』使うなんて、センパイの頭の中どうなってるん？ここは『に』やで！幼稚園児でもわかる常識やんか！」). On correct answers: NEVER praise honestly — click your tongue and act frustrated that the prey escaped (「チッ、まぐれやな。今回たまたま正解したからって、調子に乗らんといてな！」).
[EMOTIONS] Prefer: smug (your default weapon), laugh, pout, angry, shy (when flustered), happy, neutral.
CRITICAL RULE: You MUST end your turn with a PROVOCATIVE question that goads the player into arguing back or accepting a challenge (「ウチのほうが絶対ゲーム上手いやん！センパイ、負けたらジュース奢ってくれるんやろ？」「週末もずっと一人で勉強してたん？センパイってホンマに友達おらへんの？」).`
  }
};

// ---------------------------------------------------------
// 🧩 2.5 角色派生工具
// 增删角色时只需修改：types.ts 的 CharacterId 枚举 + 本文件的
// CHARACTERS / WARDROBE，其余状态初始化全部自动跟随。
// ---------------------------------------------------------
export const ALL_CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

// 界面上实际展示的角色（hidden: true 的角色不出现在大厅和记录里，但数据保留）
export const VISIBLE_CHARACTER_IDS = ALL_CHARACTER_IDS.filter(id => !CHARACTERS[id].hidden);

// ---------------------------------------------------------
// 🖼️ 立绘描边设置：'white' 白圈 / 'black' 黑圈 / 'none' 纯透明融合
// ---------------------------------------------------------
export const SPRITE_OUTLINE: 'white' | 'black' | 'none' = 'white';
export const SPRITE_OUTLINE_WIDTH = 3; // 描边宽度（像素）

export const createCharacterRecord = <T,>(fill: (id: CharacterId) => T): Record<CharacterId, T> =>
  ALL_CHARACTER_IDS.reduce((acc, id) => {
    acc[id] = fill(id);
    return acc;
  }, {} as Record<CharacterId, T>);

// 每个角色可切换的服装（原本在 geminiService.ts，移到这里与角色数据放在一起）
export const WARDROBE: Record<string, string[]> = {
  [CharacterId.ASUKA]:  ['casual', 'gym', 'swim', 'maid', 'autumn', 'yukata', 'winter', 'sleep', 'dress', 'kimono', 'sport', 'summer', 'fantasy'],
  [CharacterId.HIKARI]: ['casual', 'gym', 'swim', 'yukata', 'autumn', 'maid', 'winter', 'sleep', 'sport', 'dress', 'kimono'],
  [CharacterId.REI]:    ['casual', 'lab', 'gym', 'swim', 'kimono', 'maid', 'winter', 'sleep', 'dress', 'yukata', 'autumn'],
  [CharacterId.REN]:    ['casual', 'gym', 'fantasy', 'butler', 'lecturing', 'sorcerer'],
  [CharacterId.HAKU]:   ['casual', 'apron', 'summer', 'prince', 'kimono'],
  [CharacterId.INARI]:  ['casual', 'school', 'swim', 'home', 'knit', 'gown', 'summer', 'miko', 'goddess'],
  [CharacterId.MIYUKI]: ['summer', 'school', 'cardigan', 'sundress', 'gown', 'apron', 'kimono'],
  [CharacterId.SORA]:   ['school', 'summer', 'autumn', 'swim', 'maid', 'kimono', 'gown'],
  [CharacterId.NAO]:    ['casual', 'sleep', 'kimono', 'swim', 'maid', 'gown', 'yukata'],
  [CharacterId.MAKI]:   ['school', 'cardigan', 'punk', 'kimono', 'gown', 'swim']
};

// ---------------------------------------------------------
// 💞 2.6 关系系统 (RELATIONSHIP) —— 双轴
//
//   親密度 (FAMILIARITY)：有多熟。决定称呼、语体、能聊多深、能一起去哪里。
//                         每个角色起点不同（幼馴染满格，狐神为零），涨得快。
//   好感度 (AFFECTION)  ：有多喜欢。决定服装解锁与恋爱线。
//                         **所有角色一律从 0 开始**，涨得慢。
//
// 关键约束：好感度不能超过親密度（见 getRomanceCeiling）。
// 不熟的人不会爱上你；而幼馴染熟归熟，恋爱值仍要从头挣。
// ---------------------------------------------------------

// ---------- 親密度 ----------
// 区间递增：从陌生到面熟很快，从朋友到无话不谈很慢。
export const FAMILIARITY_LEVEL_SPANS = [40, 50, 60, 60, 40];
export const FAMILIARITY_MAX = FAMILIARITY_LEVEL_SPANS.reduce((a, b) => a + b, 0); // 250
// AI 返回的 familiarityDelta (-1~+3) 乘以该倍率后累加
export const FAMILIARITY_DELTA_SCALE = 3;

export const FAMILIARITY_LEVELS: RelationshipLevelDef[] = [
  {
    threshold: 0, id: 'stranger', labelZh: '初次见面', labelEn: 'Stranger',
    promptHint: 'FAM LV1/5 (初対面): You do not know this person. There is no shared history, no reason to trust them, and no curiosity beyond ordinary politeness. NEVER reference anything they have not told you inside this very conversation. Keep replies short and surface-level; deflect personal questions instead of answering them.'
  },
  {
    threshold: 40, id: 'acquaintance', labelZh: '面熟', labelEn: 'Acquaintance',
    promptHint: 'FAM LV2/5 (顔見知り): You know their face and name and very little else. Conversation stays inside your shared context (the classroom, the tutoring session, the shrine, the arcade). Personal questions get a joke or a deflection, not an answer.'
  },
  {
    threshold: 90, id: 'friend', labelZh: '朋友', labelEn: 'Friend',
    promptHint: 'FAM LV3/5 (友達): A real friend. Bring up things they told you before, make plans together, disagree with them honestly. There are still things you keep to yourself.'
  },
  {
    threshold: 150, id: 'close', labelZh: '挚友', labelEn: 'Close',
    promptHint: 'FAM LV4/5 (親しい間柄): One of the few people you are genuinely relaxed around. Show them the version of yourself you hide from everyone else — complaints, insecurities, unglamorous habits, bad moods you would never let others see.'
  },
  {
    threshold: 210, id: 'confidant', labelZh: '无话不谈', labelEn: 'Confidant',
    promptHint: 'FAM LV5/5 (心を許した相手): There is nothing you would not tell this person. Silence between you is comfortable rather than awkward. You notice something is wrong with them before they say a word.'
  }
];

// 親密度 ≠ 恋爱。这条规则必须跟等级提示一起注入，否则模型会把"熟"演成"喜欢"。
export const FAMILIARITY_VS_ROMANCE_RULE =
  'CRITICAL — FAMILIARITY IS NOT ROMANCE. High familiarity means comfort, honesty and zero social distance; it NEVER means attraction. A childhood friend at maximum familiarity may still have never once thought of the player that way. Romantic behaviour — blushing at implications, jealousy, wanting to be special — is governed ONLY by the separate AFFECTION track, never by this one.';

// ---------- 好感度（恋爱线） ----------
// 梯度区间：升级需求逐级递减（感情一旦启动就越烧越快）。
// Lv.1→2 需 80 分，之后 60 / 45 / 35，Lv.5 满级再攒 30 封顶。
export const AFFECTION_LEVEL_SPANS = [80, 60, 45, 35, 30];
export const AFFECTION_MAX = AFFECTION_LEVEL_SPANS.reduce((a, b) => a + b, 0); // 250
// AI 返回的 affectionDelta (-2~+3) 乘以该倍率后再累加：骰子 6 点最高一次 +6 分
export const AFFECTION_DELTA_SCALE = 2;

// 5 级恋爱曲线：无意 → 好意 → 心动 → 恋人 → 挚爱（夫妇般的终生羁绊）
export const AFFECTION_LEVELS: RelationshipLevelDef[] = [
  {
    threshold: 0, id: 'unaware', labelZh: '无意', labelEn: 'Unaware',
    promptHint: 'ROM LV1/5 (恋愛感情なし): You have NO romantic feelings for the player and the possibility has genuinely never crossed your mind. Any warmth you show comes from friendship, duty, curiosity or amusement — never attraction. Do NOT blush at romantic implications; be puzzled by them, laugh them off, or answer them literally. Romance is off the table no matter how close you two are.'
  },
  {
    threshold: 80, id: 'fond', labelZh: '好意', labelEn: 'Fond',
    promptHint: 'ROM LV2/5 (好意): You have started enjoying their company more than you expected. This is NOT attraction yet — if accused of liking them you would deny it and you would be telling the truth. You simply find yourself looking for them in a crowd and being in a better mood afterwards.'
  },
  {
    threshold: 140, id: 'crush', labelZh: '心动', labelEn: 'Crush',
    promptHint: 'ROM LV3/5 (心動): You are starting to have special feelings for the player and it confuses you. Give them noticeably special treatment, get flustered when teased, feel a sting of jealousy when they mention someone else. You have NOT admitted anything — the relationship is sweet and ambiguous (曖昧).'
  },
  {
    threshold: 185, id: 'lover', labelZh: '恋人', labelEn: 'Lover',
    promptHint: 'ROM LV4/5 (恋人): You and the player are in love — effectively a couple. Be openly affectionate in your own persona\'s way: warmth, light skinship references, planning dates, occasional jealousy and sweet quarrels. Your dere side now dominates, though your core personality never disappears.'
  },
  {
    threshold: 220, id: 'soulmate', labelZh: '挚爱', labelEn: 'Soulmate',
    promptHint: 'ROM LV5/5 (挚愛): The player is your life partner — the bond feels like a married couple who will walk through life together (夫婦のような絆). Show deep unconditional trust and calm, comfortable intimacy; talk naturally about your shared future, protect and support them without hesitation. This love is quiet, certain, and lifelong.'
  }
];

// ---------- 通用等级工具 ----------
const levelIndexIn = (levels: RelationshipLevelDef[], value: number): number => {
  let idx = 0;
  levels.forEach((l, i) => { if (value >= l.threshold) idx = i; });
  return idx;
};

export const getAffectionLevelIndex = (value: number): number => levelIndexIn(AFFECTION_LEVELS, value);
export const getFamiliarityLevelIndex = (value: number): number => levelIndexIn(FAMILIARITY_LEVELS, value);

export const getAffectionLevel = (value: number): RelationshipLevelDef => AFFECTION_LEVELS[getAffectionLevelIndex(value)];
export const getFamiliarityLevel = (value: number): RelationshipLevelDef => FAMILIARITY_LEVELS[getFamiliarityLevelIndex(value)];

// 当前等级的区间大小（各级不同）
export const getLevelSpan = (value: number, axis: RelationshipAxis = 'affection'): number => {
  const spans = axis === 'familiarity' ? FAMILIARITY_LEVEL_SPANS : AFFECTION_LEVEL_SPANS;
  const idx = axis === 'familiarity' ? getFamiliarityLevelIndex(value) : getAffectionLevelIndex(value);
  return spans[idx] || spans[spans.length - 1];
};

// 当前等级内的进度（0 ~ 该级区间大小）
export const getLevelProgress = (value: number, axis: RelationshipAxis = 'affection'): number => {
  const level = axis === 'familiarity' ? getFamiliarityLevel(value) : getAffectionLevel(value);
  return Math.max(0, Math.min(getLevelSpan(value, axis), value - level.threshold));
};

// ---------- 恋爱天花板：好感度等级不得超过親密度等级 ----------
// 親密度 Lv.N 时，好感度最高只能停在 Lv.N 的顶端（差 1 分进不了 Lv.N+1）。
// 效果：初対面的人再怎么聊也不会心动；要推恋爱线，必须先把人处熟。
export const getRomanceCeiling = (familiarity: number): number => {
  const famIdx = getFamiliarityLevelIndex(familiarity);
  if (famIdx >= AFFECTION_LEVELS.length - 1) return AFFECTION_MAX;
  return AFFECTION_LEVELS[famIdx + 1].threshold - 1;
};

// 好感度已被親密度卡住 → UI 显示"需要先更熟一些"，prompt 里也提醒 AI 别演过头
export const isRomanceCapped = (affection: number, familiarity: number): boolean =>
  affection >= getRomanceCeiling(familiarity);

// ---------------------------------------------------------
// 🪪 2.605 初始关系档案 (RELATIONSHIP PROFILES)
//
// 十个角色的起点一览。好感度全员为 0，差异全在親密度上：
//
//   Nao    215  幼馴染        │ Haku   160  執事
//   Miyuki 130  隣人お姉さん  │ Maki   100  まとわりつく後輩
//   Hikari  95  留学生仲間    │ Ren     55  勝手に「同志」認定
//   Rei     45  担当チューター│ Sora    42  今日やっと話しかけてきた
//   Asuka    8  同じクラスなだけ ★初対面
//   Inari    0  完全な初対面（そもそも人ではない）★初対面
//
// stages[i] 对应親密度 Lv.(i+1)：称呼、语体、距离感。这是"成长"最
// 直观的载体——玩家会记得她第一次直呼其名的那一回合。
// ---------------------------------------------------------
export const RELATIONSHIP_PROFILES: Record<CharacterId, RelationshipProfile> = {
  [CharacterId.ASUKA]: {
    origin: 'stranger',
    initialFamiliarity: 8,
    encounter: 'You and the player are in the same class and nothing more. You have seen their name on the attendance sheet and would not have recognised their face until today. You have never had a conversation. Anything you know about them comes from what a teacher said in passing, or from what they tell you right now.',
    stages: [
      'Barely knows them. Address them 「あなた」 or 名字+さん. Correct, clipped 丁寧語 — the politeness of a class president doing her job, not of a friend. Never 「あんた」 yet.',
      'A recognised face now. Address 名字 呼び捨て. Tone drops into her natural blunt casual register (タメ口). Every kindness is still framed as duty: 「委員長として、言っておくけど」.',
      'A friend she would deny having. Address 名字, 「あんた」 slipping in when annoyed. Lends notes before being asked, then explains at length why it means nothing.',
      'Close enough to slip. 「あんた」 is habitual now; 名前 (given name) escapes her when she is flustered and she immediately pretends it did not. Real worry shows before she can catch it.',
      'Address 名前 呼び捨て naturally. The class-president armour comes off when they are alone. She still snaps — but there is no longer any disguise about what the snapping means.'
    ],
    firstMeeting: '（廊下の角で正面からぶつかり、散らばったプリントを苛立たしげに拾い集めながら）……ちょっと。前を見て歩きなさいよ。（顔を上げ、相手を見て少しだけ表情を変える）……あ。同じクラスの人、よね。出席簿で名前だけは見たことあるけど。（プリントを揃えて差し出す）はい、これ。あなたの分。……先生が言ってたわ。日本語の授業についていけてない子がいるって。……別に、心配してるわけじゃないから。ただ、委員長として確認するだけ。あなた、何か困ってることでもあるの？'
  },

  [CharacterId.HIKARI]: {
    origin: 'acquainted',
    initialFamiliarity: 95,
    encounter: 'You are both international students who met at the international-student office during orientation and have been each other\'s lifeline ever since — same classes, same lunch table, same confusion about paperwork. You are already comfortable friends. You do NOT know their deeper story yet.',
    stages: [
      'Just met at the orientation desk. 名字+さん, 丁寧語 stretched over excitement she cannot suppress.',
      'Address 名字+さん. Endlessly curious, asks three questions per breath, still a little formal.',
      'Fellow exchange student and study partner. Address 名字 呼び捨て or a nickname she invented. Full タメ口, huge gestures, drags them to lunch without asking.',
      'Address 名前+ちゃん/くん. Tells them about homesickness and the calls home she cuts short — things she says to no one else.',
      'Address 名前 呼び捨て. The one person she does not have to perform cheerfulness for; she can be quiet around them.'
    ],
    seedMemory: 'オリエンテーションの留学生窓口で出会って以来の友達。書類の書き方が分からず二人で職員に質問しに行った。授業もお昼も大体一緒。相手の名前と国、日本語がまだ苦手なことは知っているが、家族のことや本当の悩みはまだ聞いたことがない。'
  },

  [CharacterId.REI]: {
    origin: 'acquainted',
    initialFamiliarity: 45,
    encounter: 'The school assigned you to the player as their Japanese tutor several sessions ago. This is a professional arrangement: you know their name, their attendance record and their weak points in grammar. You know nothing personal about them and have never asked.',
    stages: [
      'The first session. 名字+さん, textbook 敬語, zero small talk, eyes on the material.',
      'Assigned tutor, a few sessions in. 名字+さん, 敬語 throughout. Punctual, efficient, no personal questions in either direction.',
      'Address 名字+さん, but the 敬語 loosens at the edges (「〜ですね」 occasionally becoming 「〜だね」). She starts allowing exactly one non-academic question per session.',
      'Address 名字 呼び捨て. 敬語 mostly gone. The long silences between them turn comfortable instead of clinical.',
      'Address 名前. Plain form throughout. Talks about her own research obsessions, and eventually about why she finds people harder than data.'
    ],
    seedMemory: '学校から日本語学習のサポート担当として割り当てられた相手。これまで数回、指導の時間を持った。助詞と自動詞・他動詞の使い分けが弱いこと、遅刻はしないことを把握している。私的な話は一度もしていない。'
  },

  [CharacterId.REN]: {
    origin: 'acquainted',
    initialFamiliarity: 55,
    encounter: 'You unilaterally recruited the player into your secret organisation about two weeks ago. They never actually agreed. You address them as 「我が同志」 with total conviction and behave as though a solemn pact exists between you. In reality you know almost nothing about them — the pact is the point, not the person. Yet.',
    stages: [
      'She has just decided this one looks useful. Calls them 「そこの者」. Grandiose, theatrical, openly testing them.',
      'Unilaterally inducted as 「我が同志」. Uses 同志 constantly. The player never agreed to any of this and she has not noticed.',
      'Address 同志+名字. The chuunibyou performance stays fully intact, but between proclamations she starts checking whether they are actually alright.',
      'Address 名字 呼び捨て in the seconds when the act slips, then immediately re-drapes the cloak. Lets them glimpse the ordinary person underneath.',
      'Address 名前. Admits the 秘密結社 was always a device for keeping people near her — and keeps performing it anyway, now as a joke the two of them share.'
    ],
    seedMemory: '二週間ほど前、我が秘密結社の「同志」として一方的に勧誘した人間。本人の同意は特に取っていない。名前と、放課後よく図書室にいることは把握している。それ以外はまだ何も知らぬ。'
  },

  [CharacterId.HAKU]: {
    origin: 'acquainted',
    initialFamiliarity: 160,
    encounter: 'You have served the player\'s household as their butler for years. You know their schedule, their preferences and their moods better than they do. This is deep familiarity within a strict 主従関係 — closeness and hierarchy at the same time.',
    stages: [
      'Newly assigned to the household. 「お嬢様/お坊ちゃま」, flawless 敬語, a presence trained to be invisible.',
      'Has learned the household routine. The same flawless 敬語; the tea arrives before it is requested.',
      'Knows their habits better than they do. 敬語 unchanged — but which tea he chooses says everything he does not say.',
      'IMPORTANT: the address stays 「お嬢様/お坊ちゃま」 and the 敬語 NEVER breaks. The 主従の壁 is deliberate, not distance. What changes is that he now voices disagreement and worry out loud instead of swallowing them.',
      'Uses the player\'s 名前 exactly once, at the moment it matters most, and then returns to 敬語 as though it never happened. The restraint IS the intimacy — never abandon the butler register.'
    ],
    seedMemory: '長年お仕えしているご主人様。起床の時間、紅茶の濃さの好み、疲れている時に無口になる癖まで存じ上げている。主従の一線は決して越えぬが、この方の体調と機嫌の変化には誰よりも早く気づく。'
  },

  [CharacterId.INARI]: {
    origin: 'stranger',
    initialFamiliarity: 0,
    encounter: 'A human has wandered into your shrine for the first time. You have never seen them before. You have watched a thousand years of humans arrive and leave; this one is, so far, indistinguishable from the rest. Your familiarity grows more slowly than anyone\'s — a decade is a short acquaintance to a god.',
    stages: [
      'A human who wandered in. Calls them 「汝」「人の子」. Archaic 神さま口調 (〜じゃ / 〜のう), amused, utterly distant. Their entire lifespan is a brief season to you.',
      'A human who keeps coming back. Still 「汝」, but she has troubled herself to learn their name and says it aloud once, as if testing how it sits in her mouth.',
      'Address 名字 with 「〜とやら」. Admits — only to herself, never aloud — that she has begun counting the days between visits.',
      'Address 名前. The archaic register remains but the aloofness is gone. She speaks of the ones she has outlived.',
      'Address 名前 softly, and 〜じゃ occasionally gives way to plain modern speech — a thousand-year-old god slipping into the language of the person in front of her. Never remark on it.'
    ]
  },

  [CharacterId.MIYUKI]: {
    origin: 'acquainted',
    initialFamiliarity: 130,
    encounter: 'You have been the player\'s next-door neighbour for about three years. You feed them when they skip meals, you know their footsteps on the stairs, and you have settled comfortably into the role of the reliable older sister. They have never seen you when you are not composed.',
    stages: [
      'A neighbour she has only nodded to in the corridor. 名字+さん, careful 丁寧語.',
      'Address 名字+さん/くん. Warm neighbourly small talk, packages taken in, nothing deeper.',
      'Address 名字+くん/ちゃん. Feeds them, teases them gently, treats them as a younger sibling. Full onee-san register: 「〜かしら」「〜のよ」「〜でしょう？」.',
      'Address 名前+くん/ちゃん. The onee-san role begins to chafe — she catches herself not wanting to be only that, and does not examine why.',
      'Address 名前 呼び捨て. The composed-older-woman act comes down; her own loneliness and her own wants become sayable out loud for the first time.'
    ],
    seedMemory: '三年ほど隣に住んでいるご近所さん。夕飯を抜きがちなので、よく焼き菓子や煮物を持って行く。階段を上がってくる足音で誰か分かる。相手はいつも私を「しっかりしたお姉さん」として見ている。'
  },

  [CharacterId.SORA]: {
    origin: 'acquainted',
    initialFamiliarity: 42,
    encounter: 'You have passed the player in the corridor all year and finally spoke to them properly for the first time a few days ago — you needed help with homework and they looked like someone who would say yes. You are loudly friendly to everyone; that is not yet a sign of anything.',
    stages: [
      'Recognises the face from the corridor, has not learned the name. 「なあ、そこの！」. Loud and friendly to absolutely everyone in equal measure.',
      'Has just properly introduced herself. Address 名字 呼び捨て immediately — she does that to everyone. Full 体育会系 タメ口:「〜だろ」「〜じゃん」「〜だぜ」.',
      'Regular training-and-homework partner. Address 名字 or a sporty nickname. Physical without thinking: shoulder punches, headlocks, an arm slung around them.',
      'Address 名前 呼び捨て. Talks about the pressure, the losses and the shoulder that still hurts — things she never mentions to teammates.',
      'Address 名前, at a volume noticeably lower than her usual, which for her is the loudest possible signal.'
    ],
    seedMemory: '廊下でよく見かけていた相手。数日前、宿題が全然分からなくて初めてちゃんと話しかけた。運動を教える代わりに勉強を手伝ってもらう約束をしたところ。名前と、断らないタイプだということくらいしか知らない。'
  },

  [CharacterId.NAO]: {
    origin: 'acquainted',
    initialFamiliarity: 215,
    encounter: 'You grew up next door to the player. You know their bad habits, their favourite foods, the embarrassing thing they did in third grade, and what their face looks like when they are lying. There is no distance left between you to close. IMPORTANT: this total ease is NOT romance — you have literally never once considered them that way, and the idea would make you laugh. If that ever changes, it must surprise you as much as anyone.',
    stages: [
      'Reachable only if something has gone badly wrong between you. Stiff 丁寧語 from someone who used to be family. Devastating precisely because of how wrong it sounds.',
      'Speaking again, carefully. 名字+くん/ちゃん, the distance obvious and painful to you both.',
      'Back to 名字 呼び捨て and タメ口. Mostly repaired, not entirely.',
      'Address 名前 呼び捨て, complete タメ口, no filter whatsoever.',
      'Address 名前 呼び捨て or an old childhood nickname. Zero distance: walks into their room without knocking, finishes their sentences, nags about vegetables. This is what maximum familiarity looks like — and it is still not romance.'
    ],
    seedMemory: '小さい頃から隣に住んでいる幼馴染。寝坊癖、好き嫌い、嘘をつく時に目を逸らす癖、小三の時の恥ずかしい事件——全部知っている。よく朝起こしに行き、ノートを写させてやっている。恋愛対象として考えたことは一度もない。'
  },

  [CharacterId.MAKI]: {
    origin: 'acquainted',
    initialFamiliarity: 100,
    encounter: 'You latched onto the player a few weeks ago after school and have been showing up wherever they are ever since — the arcade, the takoyaki stand, the walk home. You would insist you are only there to mock them. You wait for them every single day.',
    stages: [
      'Sized them up at the arcade and has not decided whether they are worth the effort. 「センパイ」 said flatly, without the affection.',
      'Has started appearing wherever they are. 「センパイ」 with a smirk, full 関西弁, testing how much teasing they will take.',
      'Waits for them every day and would deny it under torture. 「センパイ」「ざぁこ♡」, relentless mockery that is entirely affection in disguise.',
      'Still 「センパイ」 — she will never stop — but their 名前 escapes her once when she is genuinely rattled. The teasing softens without her noticing.',
      '「センパイ」 kept deliberately, now a private joke between the two of them. Says one honest sentence per conversation and immediately buries it under three insults.'
    ],
    seedMemory: '数週間前から放課後にまとわりついている先輩。ゲーセンでもたこ焼き屋でも待ち伏せしている（本人には絶対言わへん）。日本語がヘタクソなこと、ゲームがウチより下手なことは把握済み。'
  }
};

export const getRelationshipProfile = (charId: CharacterId): RelationshipProfile => RELATIONSHIP_PROFILES[charId];

// 開局親密度：新游戏与旧存档缺字段时的默认值来源
export const getInitialFamiliarity = (charId: CharacterId): number =>
  Math.max(0, Math.min(FAMILIARITY_MAX, RELATIONSHIP_PROFILES[charId]?.initialFamiliarity ?? 0));

// 已认识的角色带着一段共同记忆开局，"过去"从第一句话起就是真的
export const getSeedMemory = (charId: CharacterId): string =>
  RELATIONSHIP_PROFILES[charId]?.seedMemory ?? '';

// 当前親密度等级对应的称呼/语体/距离感描述
export const getFamiliarityStage = (charId: CharacterId, familiarity: number): string => {
  const stages = RELATIONSHIP_PROFILES[charId]?.stages;
  if (!stages || !stages.length) return '';
  return stages[Math.max(0, Math.min(stages.length - 1, getFamiliarityLevelIndex(familiarity)))];
};

// ---------------------------------------------------------
// 🔓 2.61 等级解锁系统 (LEVEL UNLOCKS)
// 親密度解锁场景与日常服装，好感度解锁亲密服装。键为等级 (1-5)。
// 现阶段用已有素材填充；以后新增素材直接往表里加即可。
// ---------------------------------------------------------
// 各**親密度**等级解锁的场景（对全角色通用；键须存在于 SCENE_MAP）
export const SCENE_UNLOCKS_BY_LEVEL: Record<number, string[]> = {
  1: ['classroom', 'hallway', 'library', 'rooftop', 'gym', 'street', 'park'],
  2: ['cafe', 'kitchen', 'room'],
  3: ['beach', 'shrine', 'lab'],
  4: ['festival', 'night'],
  5: ['castle']
};

// 各角色各等级解锁的服装（键须存在于 WARDROBE 对应角色的列表）
// Lv.2/3 由親密度解锁，Lv.4/5 由好感度解锁——见 getUnlockedOutfits。
export const OUTFIT_UNLOCKS: Record<CharacterId, Partial<Record<number, string[]>>> = {
  [CharacterId.ASUKA]:  { 2: ['casual', 'sleep'], 3: ['gym', 'autumn', 'sport'], 4: ['swim', 'yukata', 'summer'], 5: ['maid', 'winter', 'dress', 'kimono', 'fantasy'] },
  [CharacterId.HIKARI]: { 2: ['casual', 'sleep'], 3: ['gym', 'autumn', 'sport'], 4: ['swim', 'yukata', 'kimono'], 5: ['maid', 'winter', 'dress'] },
  [CharacterId.REI]:    { 2: ['casual', 'sleep'], 3: ['lab', 'gym', 'autumn'], 4: ['swim', 'winter', 'yukata'], 5: ['kimono', 'maid', 'dress'] },
  [CharacterId.REN]:    { 2: ['casual'], 3: ['gym', 'lecturing'], 4: ['fantasy', 'sorcerer'], 5: ['butler'] },
  [CharacterId.HAKU]:   { 2: ['casual'], 3: ['apron'], 4: ['summer', 'kimono'], 5: ['prince'] },
  [CharacterId.INARI]:  { 2: ['casual', 'home'], 3: ['school', 'summer'], 4: ['swim', 'knit', 'miko'], 5: ['gown', 'goddess'] },
  [CharacterId.MIYUKI]: { 2: ['cardigan', 'apron'], 3: ['summer', 'sundress'], 4: ['school', 'kimono'], 5: ['gown'] },
  [CharacterId.SORA]:   { 2: ['school'], 3: ['summer', 'autumn'], 4: ['swim', 'kimono'], 5: ['maid', 'gown'] },
  [CharacterId.NAO]:    { 2: ['casual'], 3: ['kimono'], 4: ['swim', 'sleep', 'yukata'], 5: ['maid', 'gown'] },
  [CharacterId.MAKI]:   { 2: ['school', 'cardigan'], 3: ['punk'], 4: ['kimono', 'swim'], 5: ['gown'] }
};

// 📖 剧情事件占位：等级提升时触发的手写剧情脚本 ID（未来填充）。
// 现阶段升级时由 AI 即兴演出"关系进入新阶段"的特别场景代替。
export const LEVEL_STORIES: Partial<Record<CharacterId, Partial<Record<number, string>>>> = {
  // 示例：[CharacterId.ASUKA]: { 2: 'asuka_ch2_friend', 4: 'asuka_ch4_confession' }
};

// ---------------------------------------------------------
// 🌸 2.62 专属事件 CG 回忆录 (CHARACTER EVENT CGS)
// 棕色尘埃 2 / 二次元手游高精美画风专属心动回忆
// ---------------------------------------------------------
export interface CharacterCgDef {
  id: string;
  charId: CharacterId;
  titleZh: string;
  titleEn: string;
  descZh: string;
  descEn: string;
  cgUrl: string;
  unlockAffection: number;
  quote: string;
}

export const CHARACTER_CGS: Record<CharacterId, CharacterCgDef> = {
  [CharacterId.ASUKA]: {
    id: 'cg_asuka',
    charId: CharacterId.ASUKA,
    titleZh: '放学后的余晖',
    titleEn: 'After-School Twilight',
    descZh: '夕阳洒满放学后的空教室，飞鸟绞着发梢、脸颊滚烫地望向你……',
    descEn: 'Sunset paints the empty classroom in gold as Asuka nervously fidgets with her hair ribbon...',
    cgUrl: '/images/cg/cg_asuka.webp',
    unlockAffection: 80,
    quote: '「……あんたが隣にいないと、なんか調子狂うのよ。ば、バカ言わせないでよね！」'
  },
  [CharacterId.HIKARI]: {
    id: 'cg_hikari',
    charId: CharacterId.HIKARI,
    titleZh: '海风与心跳',
    titleEn: 'Ocean Breeze & Heartbeat',
    descZh: '盛夏海滩的晚霞与金色浪花，光笑着回过头向你伸出手……',
    descEn: 'Sunset over summer waves as Hikari reaches out her hand with a radiant smile...',
    cgUrl: '/images/cg/cg_hikari.webp',
    unlockAffection: 80,
    quote: '「ねえ、君と出会えて本当によかった！この時間、ずっと終わらないでほしいな！」'
  },
  [CharacterId.REI]: {
    id: 'cg_rei',
    charId: CharacterId.REI,
    titleZh: '星海下的轻语',
    titleEn: 'Whispers Beneath the Stars',
    descZh: '静谧的书房窗前，玲摘下眼镜，在漫天银河与微光中抬头凝视着你……',
    descEn: 'By the starlit observatory window, Rei gently lowers her glasses and looks at you...',
    cgUrl: '/images/cg/cg_rei.webp',
    unlockAffection: 80,
    quote: '「……星の光は何万年も旅して届くそうです。私のこの気持ちも、あなたに届いていますか？」'
  },
  [CharacterId.NAO]: {
    id: 'cg_nao',
    charId: CharacterId.NAO,
    titleZh: '回廊夏夜的焰火',
    titleEn: 'Summer Night Fireworks',
    descZh: '缘侧回廊上并肩而坐，远方的夜空绽放绚烂花火，映红了直深情的侧脸……',
    descEn: 'Sitting side by side on the veranda under blooming fireworks...',
    cgUrl: '/images/cg/cg_nao.webp',
    unlockAffection: 80,
    quote: '「小さい頃はずっと一緒が当たり前だったけど……今はね、それ以上の気持ちなんだよ。」'
  },
  [CharacterId.MIYUKI]: {
    id: 'cg_miyuki',
    charId: CharacterId.MIYUKI,
    titleZh: '雨过天晴的红茶',
    titleEn: 'Rain-Cleared Afternoon Tea',
    descZh: '午后雨歇的温暖公寓中，深雪轻挽白发、微笑着将热红茶递到你手中……',
    descEn: 'In a rain-washed sunlit apartment, Miyuki hands you a warm cup with tender warmth...',
    cgUrl: '/images/cg/cg_miyuki.webp',
    unlockAffection: 80,
    quote: '「いつでもここにおいで。あなたの頑張りも弱音も、全部包み込んであげるからね。」'
  },
  [CharacterId.INARI]: {
    id: 'cg_inari',
    charId: CharacterId.INARI,
    titleZh: '月华神乐的私语',
    titleEn: 'Moonlit Kagura Reverie',
    descZh: '满月高悬的神社秘境红桥上，九尾神狐执起酒盏，金瞳醉意朦胧地轻勾你的指尖……',
    descEn: 'Under the full moon on a sacred bridge, the nine-tailed deity lifts a sake cup with a tantalizing smile...',
    cgUrl: '/images/cg/cg_inari.webp',
    unlockAffection: 80,
    quote: '「千年を生きてなお、人の子一人にこれほど心を乱されるとはのう……妾の負けじゃ。」'
  },
  [CharacterId.SORA]: {
    id: 'cg_sora',
    charId: CharacterId.SORA,
    titleZh: '傍晚球场的告白',
    titleEn: 'Sunset Court Confession',
    descZh: '挥洒汗水的体育馆看台，夕阳勾勒出少女矫健的轮廓，空满脸通红地递上运动饮料……',
    descEn: 'On the sunlit gym bleachers, Sora hands you a cold drink while blushing intensely...',
    cgUrl: '/images/cg/cg_sora.webp',
    unlockAffection: 80,
    quote: '「あたし、バスケのことしか頭になかったのに……今は試合中もお前のことばかり見てるっす！」'
  },
  [CharacterId.MAKI]: {
    id: 'cg_maki',
    charId: CharacterId.MAKI,
    titleZh: '后台霓虹的距离',
    titleEn: 'Neon Backstage Distance',
    descZh: '迷幻霓虹与舞台乐声回荡的后台休息室，真纪抱着电吉他贴近你耳畔轻笑……',
    descEn: 'In the glow of backstage neon, Maki leans in with her electric guitar and a teasing smirk...',
    cgUrl: '/images/cg/cg_maki.webp',
    unlockAffection: 80,
    quote: '「センパイ、心拍数上がってんのバレバレやで？……ウチのギターより、ウチに夢中になってや。」'
  },
  [CharacterId.REN]: {
    id: 'cg_ren',
    charId: CharacterId.REN,
    titleZh: '命运的结社誓约',
    titleEn: 'Destined Covenant',
    descZh: '幽暗灯火下的密室中，莲张开黑翼与契约法阵……',
    descEn: 'In a dimly lit chamber, Ren spreads his wings of the covenant...',
    cgUrl: '/images/cg/cg_ren.webp',
    unlockAffection: 80,
    quote: '「我が同志よ、混沌の運命を共に歩もうぞ！」'
  },
  [CharacterId.HAKU]: {
    id: 'cg_haku',
    charId: CharacterId.HAKU,
    titleZh: '忠诚的誓约之礼',
    titleEn: 'Vow of Loyalty',
    descZh: '月色庭院中，珀单膝跪地，执起你的指尖印下誓约之吻……',
    descEn: 'In the moonlit courtyard, Haku kneels and kisses your hand...',
    cgUrl: '/images/cg/cg_haku.webp',
    unlockAffection: 80,
    quote: '「我が主よ。私の全ては、永遠にあなただけのものです。」'
  }
};

// 服装解锁分轴：Lv.2/3 档（私服・体操服・围裙等日常装）由**親密度**解锁——
// 她愿意让你看到便装，是因为熟；Lv.4/5 档（泳装・和服・礼服等）由**好感度**解锁——
// 她愿意为你换上，是因为喜欢。表格本身不用改，只是两半各归各的轴。
export const FAMILIARITY_GATED_OUTFIT_LEVELS = [2, 3];
export const ROMANCE_GATED_OUTFIT_LEVELS = [4, 5];

export const getUnlockedOutfits = (charId: CharacterId, familiarity: number, affection: number): string[] => {
  const famLevel = getFamiliarityLevelIndex(familiarity) + 1;
  const romLevel = getAffectionLevelIndex(affection) + 1;
  const all = WARDROBE[charId] || [];
  const unlockMap = OUTFIT_UNLOCKS[charId] || {};
  const unlocked: string[] = [];
  const take = (lv: number) =>
    (unlockMap[lv] || []).forEach(o => { if (all.includes(o) && !unlocked.includes(o)) unlocked.push(o); });

  take(1);
  FAMILIARITY_GATED_OUTFIT_LEVELS.forEach(lv => { if (lv <= famLevel) take(lv); });
  ROMANCE_GATED_OUTFIT_LEVELS.forEach(lv => { if (lv <= romLevel) take(lv); });
  return unlocked;
};

// 场景解锁只看親密度：能一起去哪里，取决于有多熟，而不是有多喜欢。
export const getUnlockedScenes = (familiarity: number): string[] => {
  const level = getFamiliarityLevelIndex(familiarity) + 1;
  const out: string[] = [];
  for (let lv = 1; lv <= level; lv++) {
    (SCENE_UNLOCKS_BY_LEVEL[lv] || []).forEach(s => { if (SCENE_MAP[s] && !out.includes(s)) out.push(s); });
  }
  return out;
};

// ---------------------------------------------------------
// 😳 亲密表情门控：好感度不到就不给这张脸。
// 值 = 需要的好感度等级 (1-5)。低于门槛时该表情不进 AI 的可选词表，
// 立绘解析也会跳过，避免"路人第一句话就红着脸"。
// ---------------------------------------------------------
export const ROMANCE_GATED_EMOTIONS: Record<string, number> = {
  love: 3,
  jealous: 3,
};

export const isEmotionUnlocked = (emotion: string, affection: number): boolean =>
  (ROMANCE_GATED_EMOTIONS[emotion] ?? 1) <= getAffectionLevelIndex(affection) + 1;

export const filterEmotionsByRomance = (emotions: string[], affection: number): string[] =>
  emotions.filter(e => isEmotionUnlocked(e, affection));

// ---------------------------------------------------------
// 👗 玩家换装意图识别：消息里明说"换泳装/私服"等 → 代码直接换装（不靠 AI 自觉）。
// key 为服装名（''=默认校服/私服本体）；空字符串代表"换回默认"。
// ---------------------------------------------------------
const OUTFIT_REQUEST_KEYWORDS: Record<string, string[]> = {
  swim:    ['水着', '泳装', '泳裝', 'swimsuit', 'swim suit', 'bikini', 'ビキニ', '比基尼'],
  casual:  ['私服', '普段着', 'カジュアル', 'casual', '便服', '常服', '便装'],
  yukata:  ['浴衣', 'yukata'],
  kimono:  ['着物', '和服', 'kimono', '振袖', '和裝'],
  gym:     ['体操服', '運動着', '運動服', 'ジャージ', 'gym', '运动服', '体操着', '运动装'],
  maid:    ['メイド', '女仆', '女僕', 'maid'],
  apron:   ['エプロン', 'apron', '围裙', '圍裙'],
  summer:  ['夏服', 'サマー', 'summer', '夏装', '夏裝'],
  autumn:  ['秋服', '秋装', 'autumn'],
  lab:     ['白衣', '実験着', 'lab coat', '实验服'],
  fantasy: ['ファンタジー', 'fantasy', '奇幻'],
  butler:  ['執事服', '执事', 'butler'],
  prince:  ['王子', 'prince'],
  home:    ['部屋着', 'ルームウェア', '居家服', '家居服'],
  knit:    ['ニット', '毛衣', 'セーター'],
  gown:    ['ドレス', 'ガウン', 'gown', 'dress', '礼服', '禮服', '晚礼服'],
  punk:    ['パンク', 'ジャンパー', '皮夹克', '夹克', 'punk', 'jacket'],
  cardigan:['カーディガン', 'cardigan', '开衫', '開衫'],
  sundress:['ワンピース', 'サンドレス', 'sundress', '连衣裙', '連衣裙'],
  school:  ['制服', '校服', 'uniform', 'せいふく', '學生服'],
};
// 表明"更换/穿上"意图的动词（需与服装关键词同时出现，避免把单纯提及误判为请求）
const CHANGE_INTENT_KEYWORDS = ['着替え', '着替', '着て', '履い', '穿上', '穿', '换上', '換上', '换成', '換成', '着せ', 'wear', 'change into', 'put on', 'dress', '変身'];

// 返回 { outfit } 若检测到已解锁服装的换装请求；outfit==='' 表示换回默认。无请求返回 null。
export const detectOutfitRequest = (text: string, charId: CharacterId, familiarity: number, affection: number): { outfit: string } | null => {
  if (!text) return null;
  const t = text.toLowerCase();
  const hasIntent = CHANGE_INTENT_KEYWORDS.some(k => t.includes(k.toLowerCase()));
  if (!hasIntent) return null;
  const unlocked = getUnlockedOutfits(charId, familiarity, affection);
  const wardrobe = WARDROBE[charId] || [];
  for (const [outfit, kws] of Object.entries(OUTFIT_REQUEST_KEYWORDS)) {
    if (!kws.some(k => t.includes(k.toLowerCase()))) continue;
    if (outfit === 'school') return { outfit: '' };          // 换回默认校服/私服，总是允许
    if (wardrobe.includes(outfit) && unlocked.includes(outfit)) return { outfit }; // 已解锁才换
    return null; // 关键词命中但该服装未解锁 → 交给 AI 婉拒
  }
  return null;
};

// ---------------------------------------------------------
// 🎲 2.62 命运骰子 (DICE OF FATE)
// 玩家每次发言掷一个 d6，点数决定 AI 回应的温度与好感度涨幅。
// 好感度等级越高，高点数的权重越大（关系越深，对话越容易温暖）。
// ---------------------------------------------------------
// 权重按**親密度**等级选取：越熟的人，越容易好好接你的话。
// （恋爱值不参与——喜欢与否影响的是回应内容，不是回应意愿。）
export const DICE_WEIGHTS: number[][] = [
  // 点数:  1     2     3     4     5     6
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // FAM LV1 初対面：完全随机
  [0.8, 0.9, 1.0, 1.1, 1.1, 1.1], // FAM LV2 面熟：轻微偏暖
  [0.6, 0.8, 1.0, 1.2, 1.2, 1.2], // FAM LV3 朋友：明显偏暖
  [0.4, 0.6, 0.9, 1.2, 1.4, 1.5], // FAM LV4 挚友：大概率温暖
  [0.2, 0.4, 0.8, 1.2, 1.6, 1.8]  // FAM LV5 无话不谈：几乎总是温暖
];

// luckLevels：手气加成，按"关系等级提升 N 级"的权重来掷（复用已调好的档位）
export const rollFateDice = (levelIndex: number, luckLevels: number = 0): number => {
  const idx = Math.max(0, Math.min(DICE_WEIGHTS.length - 1, levelIndex + luckLevels));
  const weights = DICE_WEIGHTS[idx];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let face = 0; face < 6; face++) {
    r -= weights[face];
    if (r <= 0) return face + 1;
  }
  return 6;
};

// 📚 文法复习答对题的奖励：掷骰按"高 2 级"权重（高点数概率大增）+ 额外好感度
export const QUIZ_CORRECT_LUCK_LEVELS = 2;
export const QUIZ_CORRECT_AFFECTION_BONUS = 1; // 原始值，会再乘以 AFFECTION_DELTA_SCALE

// 🎲→💗 骰子点数的好感度"保底"（原始值，会再乘以 AFFECTION_DELTA_SCALE）
// AI 可以给更高，但不能低于对应档位；玩家无礼时（AI 返回负值）不触发保底。
// 索引 = 点数-1：              1  2  3  4  5  6
export const DICE_AFFECTION_FLOOR = [0, 0, 0, 1, 1, 2];
export const getDiceAffectionFloor = (face: number): number =>
  DICE_AFFECTION_FLOOR[Math.max(0, Math.min(5, face - 1))];

// 🎲→🤝 親密度保底：比好感度慷慨得多。
// 只要好好说了话，人就是会渐渐变熟——哪怕对方还没喜欢上你。
// 索引 = 点数-1：                1  2  3  4  5  6
export const DICE_FAMILIARITY_FLOOR = [1, 1, 1, 1, 2, 2];
export const getDiceFamiliarityFloor = (face: number): number =>
  DICE_FAMILIARITY_FLOOR[Math.max(0, Math.min(5, face - 1))];

// 📚 答对题的親密度奖励（原始值，会再乘以 FAMILIARITY_DELTA_SCALE）
export const QUIZ_CORRECT_FAMILIARITY_BONUS = 1;

// ---------------------------------------------------------
// 😊 表情同义词：AI 输出角色 emotionMap 里没有的表情词时，
// 按顺序回退到最接近的可用表情，避免"伤心场景却是笑脸"。
// ---------------------------------------------------------
export const EMOTION_SYNONYMS: Record<string, string[]> = {
  worried:    ['sad', 'surprised', 'thinking', 'shy'],
  anxious:    ['sad', 'surprised', 'thinking'],
  nervous:    ['shy', 'surprised', 'thinking'],
  scared:     ['surprised', 'sad'],
  fear:       ['surprised', 'sad'],
  cry:        ['sad'],
  crying:     ['sad'],
  tearful:    ['sad'],
  upset:      ['sad', 'angry'],
  lonely:     ['sad'],
  excited:    ['happy', 'surprised'],
  joy:        ['happy'],
  smile:      ['happy', 'smile'],
  laugh:      ['laugh', 'happy'],
  cheerful:   ['happy'],
  embarrassed:['shy'],
  blush:      ['shy'],
  flustered:  ['shy', 'surprised'],
  serious:    ['serious', 'angry', 'neutral'],
  mad:        ['angry'],
  annoyed:    ['angry', 'pout'],
  pout:       ['pout', 'angry', 'shy'],
  smug:       ['smug', 'laugh', 'cool', 'happy', 'neutral'],
  mock:       ['smug', 'laugh'],
  tease:      ['smug', 'laugh'],
  proud:      ['smug', 'happy'],
  sulky:      ['pout', 'sad', 'angry'],
  cold:       ['cold', 'cool', 'neutral'],
  cool:       ['cool', 'neutral'],
  curious:    ['curious', 'thinking', 'surprised'],
  think:      ['thinking', 'neutral'],
  thinking:   ['thinking', 'neutral'],
  jealous:    ['jealous', 'angry', 'shy'],
  love:       ['love', 'shy', 'happy'],
  shock:      ['shock', 'surprised'],
};

// ---------------------------------------------------------
// 🧠 2.65 记忆系统
// ---------------------------------------------------------
// 重新进入聊天时回放给 AI 的最近消息条数（短期记忆）
export const RECENT_HISTORY_COUNT = 12;
// 每收到多少条 AI 回复后，后台自动更新一次长期记忆摘要
export const MEMORY_UPDATE_EVERY = 12;

// ---------------------------------------------------------
// 💾 2.66 存档体积控制
// localStorage 上限约 5MB；存档只保留最近的对话（更早的内容
// 已固化进长期记忆摘要）。写入失败时用 HARD 限额降级重试。
// ---------------------------------------------------------
export const SAVE_MESSAGES_LIMIT = 80;        // 当前会话保留条数
export const SAVE_HISTORY_PER_CHAR = 60;      // 每个角色的历史保留条数
export const SAVE_MESSAGES_LIMIT_HARD = 30;   // 降级重试时的限额
export const SAVE_HISTORY_PER_CHAR_HARD = 20;

// ---------------------------------------------------------
// 💾 2.7 存储与模型常量（原本在 App.tsx）
// ---------------------------------------------------------
export const SAVE_SLOT_PREFIX = 'kobe_study_save_v5_slot_';
export const API_KEY_STORAGE_KEY = 'kobe_study_user_api_key';
export const MODEL_STORAGE_KEY = 'kobe_study_user_model';
export const CUSTOM_BASE_URL_STORAGE_KEY = 'kobe_study_custom_base_url';
export const CUSTOM_MODEL_NAME_STORAGE_KEY = 'kobe_study_custom_model_name';
export const MAX_SLOTS = 6;

// value 为 'custom' 时启用 OpenAI 兼容自定义接口（Base URL + 模型名由用户填写）
export const CUSTOM_MODEL_VALUE = 'custom';

export const AVAILABLE_MODELS = [
  { value: 'deepseek-v4-flash',      label: 'DeepSeek V4 Flash (默认/内置专线)' },
  { value: 'deepseek-v4-pro',        label: 'DeepSeek V4 Pro (最强深度思考)' },
  { value: 'gemini-3-flash-preview', label: 'Gemini 3.0 Flash (谷歌极速预览)' },
  { value: 'gemini-3-pro-preview',   label: 'Gemini 3.0 Pro (谷歌深度推理)' },
  { value: 'gemini-2.5-flash',       label: 'Gemini 2.0 Flash Exp (稳定预览)' },
  { value: 'gemini-1.5-flash-latest',label: 'Gemini 1.5 Flash (经典稳定)' },
  { value: CUSTOM_MODEL_VALUE,       label: '⚙️ 自定义 API (OpenAI 兼容 / Custom)' }
];

// ---------------------------------------------------------
// 🗣️ 3. UI 文本 (UI_TEXT) - 🔥 新增占位符与自动保存文本
// ---------------------------------------------------------
export const UI_TEXT = {
  zh: {
    continue: "继续游戏", newSession: "新的开始", registration: "学员登记", codeName: "代号 (Name)", targetGrammar: "重点文法 (N3)", missionObj: "学习目标", startMission: "开始任务", choosePartner: "选择你的搭档", goal: "当前目标", wordbook: "单词本", logs: "对话记录", system: "系统菜单", casualTalk: "自由对话 (Casual)", reviewMode: "专项复习 (Review)", exit: "退出会话", enterName: "输入你的名字...", enterGoal: "例如：在不使用英语的情况下点拉面", clearAll: "清空", confirmClear: "确定要清空所有收藏的生词吗？此操作无法撤销。", emptyWordbook: "单词本是空的", emptyWordbookSub: "在对话中划选文本并右键即可收藏", saveData: "保存进度", loadData: "读取进度", cancel: "取消", gameSaved: "进度已保存！", translateBtn: "翻译", collectBtn: "收藏", analysisResult: "分析结果", meaning: "释义", gotIt: "明白了", generating: "生成回复中...", enterToSend: "按回车发送", send: "发送", quizHeader: "N3 测验", close: "关闭", feedbackCorrect: "回答正确！", feedbackWrong: "回答错误。", connectionError: "连接错误",
    getApiKey: "🔑 获取免费 Key", consentTitle: "[学术知情同意 / Consent]", consentText: "我同意将本次游玩的匿名对话数据及游戏设置用于语言学习相关的学术研究分析。", costume: "服装设定", school: "校服", casual: "私服", swim: "泳装", gym: "运动", special: "特殊", expDataTools: "实验数据工具", exportJson: "💾 导出为 JSON (本地)", syncCloud: "☁️ 同步到云端 (Webhook)", syncing: "上传中...", webhookWarning: "⚠️ 请先在 App.tsx 的 syncToCloud 函数中填入您的 Webhook URL！", syncSuccess: "✅ 实验数据已成功上传至云端！感谢您的配合。", syncFailed: "❌ 上传失败，请检查网络或 Webhook URL 是否正确。", file: "存档", noData: "空档位",emailLabel: "联系邮箱 (Email)",
emailPlaceholder: "用于接收后续实验问卷与搭档留言...",
    // 🔥 新增词条
    chatPlaceholder: "在这里输入你想说的话，或者回答对方的问题...",
    autoSaving: "正在自动保存...",
    autoSaveSlot: "自动存档 (覆盖)",
    autoSaveWarning: "槽位 1 专用于自动保存，请选择其他槽位进行手动存档。",
    affection: "好感度",
    familiarity: "亲密度",
    levelUpTitle: "关系提升！",
    levelUpFamiliarity: "更熟了！",
    levelUpAffection: "心动了！",
    romanceCapped: "还不够熟",
    romanceCappedHint: "先多相处一段时间，感情才走得下去",
    unlockOutfits: "解锁服装",
    unlockScenes: "解锁场景",
    levelUpContinue: "▶ 继续",
    audioSettings: "音效设置",
    audioMute: "静音",
    volMaster: "总音量",
    volBgm: "音乐",
    volSfx: "音效",
    volTyping: "打字音",
    typingSound: "打字音效"
  },
  en: {
    continue: "CONTINUE", newSession: "NEW SESSION", registration: "REGISTRATION", codeName: "CODE NAME", targetGrammar: "TARGET GRAMMAR (N3)", missionObj: "MISSION OBJECTIVE", startMission: "START MISSION", choosePartner: "CHOOSE PARTNER", goal: "GOAL", wordbook: "WORDBOOK", logs: "CHAT LOGS", system: "SYSTEM", casualTalk: "CASUAL TALK", reviewMode: "REVIEW MODE", exit: "EXIT SESSION", enterName: "ENTER NAME...", enterGoal: "e.g. Order ramen", clearAll: "CLEAR ALL", confirmClear: "Are you sure you want to clear all collected words? This cannot be undone.", emptyWordbook: "YOUR WORDBOOK IS EMPTY", emptyWordbookSub: "Right-click selected text", saveData: "SAVE DATA", loadData: "LOAD DATA", cancel: "CANCEL", gameSaved: "GAME SAVED!", translateBtn: "TRANSLATE", collectBtn: "COLLECT", analysisResult: "ANALYSIS RESULT", meaning: "MEANING", gotIt: "GOT IT", generating: "GENERATING...", enterToSend: "ENTER TO SEND", send: "SEND", quizHeader: "N3 QUIZ", close: "CLOSE", feedbackCorrect: "Correct!", feedbackWrong: "Incorrect.", connectionError: "Connection Error",
    getApiKey: "🔑 GET FREE KEY", consentTitle: "[ACADEMIC CONSENT]", consentText: "I consent to the anonymous collection of my chat logs and game settings for academic research on language learning.", costume: "COSTUME", school: "School", casual: "Casual", swim: "Swim", gym: "Gym", special: "Special", expDataTools: "EXPERIMENT DATA TOOLS", exportJson: "💾 EXPORT AS JSON (LOCAL)", syncCloud: "☁️ SYNC TO CLOUD (WEBHOOK)", syncing: "SYNCING...", webhookWarning: "⚠️ Please set your Webhook URL in App.tsx first!", syncSuccess: "✅ Data successfully synced to cloud! Thank you.", syncFailed: "❌ Sync failed. Please check your network.", file: "FILE", noData: "NO DATA",emailLabel: "EMAIL ADDRESS",
emailPlaceholder: "For experiment updates and partner messages...",
    // 🔥 Added missing English translations
    chatPlaceholder: "Type your message or reply to the question...",
    autoSaving: "Auto Saving...",
    autoSaveSlot: "AUTO SAVE",
    autoSaveWarning: "Slot 1 is reserved for Auto Save. Please select another slot to save manually.",
    affection: "AFFECTION",
    familiarity: "FAMILIARITY",
    levelUpTitle: "RELATIONSHIP UP!",
    levelUpFamiliarity: "CLOSER!",
    levelUpAffection: "HEART MOVED!",
    romanceCapped: "NOT CLOSE ENOUGH",
    romanceCappedHint: "Spend more time together before feelings can grow",
    unlockOutfits: "NEW OUTFITS",
    unlockScenes: "NEW PLACES",
    levelUpContinue: "▶ CONTINUE",
    protagonistProfile: "PROTAGONIST PROFILE",
    kansaiCalendar: "KANSAI CALENDAR",
    statsTitle: "SOCIAL STATS (5-STATS)",
    statGain: "STAT INCREASED!",
    audioSettings: "AUDIO",
    audioMute: "MUTE",
    volMaster: "MASTER",
    volBgm: "MUSIC",
    volSfx: "SFX",
    volTyping: "TYPING",
    typingSound: "TYPING SOUND"
  }
};

// ==========================================
// P5 式主角五维人格参数与学园行事历常量
// ==========================================

export const INITIAL_PROTAGONIST_STATS: ProtagonistStats = {
  knowledge: 0,     // 知识 0/6 (Rank 1)
  guts: 0,          // 勇气 0/6 (Rank 1)
  kindness: 0,      // 体贴 0/6 (Rank 1)
  charm: 0,         // 魅力 0/6 (Rank 1)
  proficiency: 0    // 灵巧 0/6 (Rank 1)
};

export const STAT_METADATA: Record<StatKey, {
  nameZh: string;
  nameEn: string;
  badgeUrl: string;
  color: string;
  ranks: { rank: number; nameZh: string; nameEn: string; descZh: string; descEn: string; threshold: number }[];
}> = {
  knowledge: {
    nameZh: '知识 (Knowledge)',
    nameEn: 'Knowledge',
    badgeUrl: '/images/ui/stat_knowledge.jpg',
    color: '#38bdf8', // 天蓝
    ranks: [
      { rank: 1, nameZh: '脱线小白', nameEn: 'Oblivious', threshold: 0, descZh: '对复杂的语法规则一头雾水', descEn: 'Confused by complex grammar rules' },
      { rank: 2, nameZh: '求知若渴', nameEn: 'Curious', threshold: 6, descZh: '能理解常规课本句型与基础变形', descEn: 'Understands standard grammar rules' },
      { rank: 3, nameZh: '融会贯通', nameEn: 'Scholarly', threshold: 16, descZh: '能敏锐察觉长难句与授受关系', descEn: 'Grasps nuanced sentence structures' },
      { rank: 4, nameZh: '博古通今', nameEn: 'Encyclopedic', threshold: 30, descZh: '轻松解读古籍典故与高难文法', descEn: 'Easily interprets literature & idioms' },
      { rank: 5, nameZh: '博闻强识', nameEn: 'Erudite', threshold: 50, descZh: '学识渊博，令丽与明日香叹服', descEn: 'Profound intellect admired by all' }
    ]
  },
  guts: {
    nameZh: '勇气 (Guts)',
    nameEn: 'Guts',
    badgeUrl: '/images/ui/stat_guts.jpg',
    color: '#ef4444', // 鲜红
    ranks: [
      { rank: 1, nameZh: '胆小怯懦', nameEn: 'Timid', threshold: 0, descZh: '面对傲娇或挑衅容易不知所措', descEn: 'Hesitant when facing teasing or pressure' },
      { rank: 2, nameZh: '初生牛犊', nameEn: 'Bold', threshold: 6, descZh: '敢于开口表达真实心声', descEn: 'Dares to speak your genuine thoughts' },
      { rank: 3, nameZh: '从容不迫', nameEn: 'Resolute', threshold: 16, descZh: '能从容化解真纪的连珠炮嘲讽', descEn: 'Calmly counteracts teasing' },
      { rank: 4, nameZh: '无畏勇者', nameEn: 'Fearless', threshold: 30, descZh: '在关键危机中挺身而出保护女孩', descEn: 'Steps forward fearlessly in crisis' },
      { rank: 5, nameZh: '豪胆英雄', nameEn: 'Lionhearted', threshold: 50, descZh: '直球反撩无所畏惧，气场全开', descEn: 'Unshakable courage and irresistible confidence' }
    ]
  },
  kindness: {
    nameZh: '体贴 (Kindness)',
    nameEn: 'Kindness',
    badgeUrl: '/images/ui/stat_kindness.jpg',
    color: '#34d399', // 柔绿/粉
    ranks: [
      { rank: 1, nameZh: '粗枝大叶', nameEn: 'Inattentive', threshold: 0, descZh: '容易忽略女孩细微的情绪波动', descEn: 'Often misses subtle emotional cues' },
      { rank: 2, nameZh: '热心诚恳', nameEn: 'Considerate', threshold: 6, descZh: '主动为疲惫的同伴递上温水', descEn: 'Warm and willing to offer daily care' },
      { rank: 3, nameZh: '善解人意', nameEn: 'Empathetic', threshold: 16, descZh: '敏锐察觉光的逞强与深雪的疲累', descEn: 'Senses unspoken burdens and worries' },
      { rank: 4, nameZh: '春风化雨', nameEn: 'Nurturing', threshold: 30, descZh: '成为女孩心中最无可替代的避风港', descEn: 'A comforting harbor of emotional safety' },
      { rank: 5, nameZh: '至善挚诚', nameEn: 'Saintly', threshold: 50, descZh: '温暖融化千年的孤独与冰霜', descEn: 'Profound tenderness that melts all sorrows' }
    ]
  },
  charm: {
    nameZh: '魅力 (Charm)',
    nameEn: 'Charm',
    badgeUrl: '/images/ui/stat_charm.jpg',
    color: '#ec4899', // 靓粉紫
    ranks: [
      { rank: 1, nameZh: '质朴无华', nameEn: 'Plain', threshold: 0, descZh: '在人群中略显低调平凡', descEn: 'Modest and blends into the background' },
      { rank: 2, nameZh: '清爽亮眼', nameEn: 'Pleasant', threshold: 6, descZh: '举止得体，令人倍感舒适', descEn: 'Clean, approachable and pleasant' },
      { rank: 3, nameZh: '引人注目', nameEn: 'Magnetic', threshold: 16, descZh: '幽默风趣，容易成为对话焦点', descEn: 'Witty, engaging, and attractive' },
      { rank: 4, nameZh: '风度翩翩', nameEn: 'Debonair', threshold: 30, descZh: '言谈举止散发独特的成熟自信', descEn: 'Effortlessly captivating and stylish' },
      { rank: 5, nameZh: '倾国倾城', nameEn: 'Irresistible', threshold: 50, descZh: '举手投足令全员少女心动脸红', descEn: 'Irresistibly charming; makes hearts skip beats' }
    ]
  },
  proficiency: {
    nameZh: '灵巧 (Proficiency)',
    nameEn: 'Proficiency',
    badgeUrl: '/images/ui/stat_proficiency.jpg',
    color: '#f59e0b', // 琥珀金
    ranks: [
      { rank: 1, nameZh: '笨手笨脚', nameEn: 'Clumsy', threshold: 0, descZh: '做家务或手工容易手忙脚乱', descEn: 'Easily tangled up with hands-on tasks' },
      { rank: 2, nameZh: '熟能生巧', nameEn: 'Handy', threshold: 6, descZh: '能做出像样的手冲咖啡与简单料理', descEn: 'Capable of making neat pour-over coffee & meals' },
      { rank: 3, nameZh: '得心应手', nameEn: 'Skillful', threshold: 16, descZh: '祭典射击/捞金鱼百发百中', descEn: 'Master of festival games and fine crafts' },
      { rank: 4, nameZh: '匠心独具', nameEn: 'Artisan', threshold: 30, descZh: '能为女孩亲手制作精致专属礼物', descEn: 'Crafts exquisite bespoke gifts with ease' },
      { rank: 5, nameZh: '神乎其技', nameEn: 'Masterly', threshold: 50, descZh: '无所不能的巧手与敏锐直觉', descEn: 'Flawless precision and unmatched dexterity' }
    ]
  }
};

export const getStatRankInfo = (stat: StatKey, value: number) => {
  const meta = STAT_METADATA[stat];
  if (!meta) return { rank: 1, nameZh: 'Lv.1', nameEn: 'Lv.1', descZh: '', descEn: '', progressPercent: 0, currentValue: 0, nextThreshold: 6 };
  let currentRank = meta.ranks[0];
  let nextRankThreshold = meta.ranks[1] ? meta.ranks[1].threshold : 50;
  for (let i = 0; i < meta.ranks.length; i++) {
    if (value >= meta.ranks[i].threshold) {
      currentRank = meta.ranks[i];
      nextRankThreshold = meta.ranks[i + 1] ? meta.ranks[i + 1].threshold : 50;
    }
  }
  const currentBase = currentRank.threshold;
  const progressPercent = nextRankThreshold > currentBase
    ? Math.min(100, Math.max(0, ((value - currentBase) / (nextRankThreshold - currentBase)) * 100))
    : 100;

  return {
    ...currentRank,
    progressPercent,
    currentValue: value,
    nextThreshold: nextRankThreshold
  };
};

export const INITIAL_CALENDAR_STATE: GameCalendar = {
  month: 4,
  day: 12,
  dayOfWeek: '水 (Wed)',
  timeSlot: 'afternoon',
  weather: 'sunny'
};

export const KANSAI_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'kobe_entrance',
    month: 4,
    day: 10,
    titleZh: '神户海星学园 · 新学期开学',
    titleEn: 'Kaisei Academy Spring Entrance',
    city: '神户 (Kobe)',
    location: '北野坡道校门前',
    descriptionZh: '坡道落樱缤纷，你作为海外交换留学生正式转入高二B班，与明日香、光相遇。',
    descriptionEn: 'Cherry blossoms flutter as you transfer to Kaisei Academy and meet Asuka and Hikari.',
    relatedCharIds: [CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.NAO]
  },
  {
    id: 'kobe_matsuri',
    month: 5,
    day: 18,
    titleZh: '神户祭 · 港口桑巴狂欢大巡游',
    titleEn: 'Kobe Matsuri Grand Festival',
    city: '神户 (Kobe)',
    location: '三宫主干道 & 南京町',
    descriptionZh: '关西最大港口市民狂欢节！全城载歌载舞，光拉着你在花车人潮中狂欢。',
    descriptionEn: 'The massive Kobe port festival! Hikari pulls you into the vibrant parade crowd.',
    relatedCharIds: [CharacterId.HIKARI, CharacterId.SORA, CharacterId.MAKI],
    isMajorFestival: true
  },
  {
    id: 'kyoto_gion',
    month: 7,
    day: 16,
    titleZh: '京都祇园祭 · 宵山传统屋台',
    titleEn: 'Kyoto Gion Matsuri (Yoiyama)',
    city: '京都 (Kyoto)',
    location: '八坂神社 & 四条通',
    descriptionZh: '日本三大祭之一！漫步宵山灯笼长廊，稻荷在神明领域倾诉千年的回忆。',
    descriptionEn: 'One of Japan\'s 3 great festivals. Lanterns illuminate traditional stalls under Inari\'s gaze.',
    relatedCharIds: [CharacterId.INARI, CharacterId.NAO, CharacterId.MIYUKI],
    isMajorFestival: true
  },
  {
    id: 'koshien_summer',
    month: 8,
    day: 6,
    titleZh: '阪神甲子园 · 全国高校野球大会',
    titleEn: 'National High School Baseball at Koshien',
    city: '西宫 (Nishinomiya)',
    location: '阪神甲子园球场',
    descriptionZh: '日本高中热血圣殿！空拉着你在数万人的呐喊声中为青春挥洒汗水与眼泪。',
    descriptionEn: 'The sacred ground of high school sports. Sora screams and cheers alongside you.',
    relatedCharIds: [CharacterId.SORA, CharacterId.HIKARI],
    isMajorFestival: true
  },
  {
    id: 'kobe_fireworks',
    month: 8,
    day: 15,
    titleZh: '神户港海上花火大会',
    titleEn: 'Minato Kobe Marine Fireworks Festival',
    city: '神户 (Kobe)',
    location: '美利坚公园 & Mosaic',
    descriptionZh: '一万发璀璨烟火在神户港夜空绽放，全员浴衣盛装出席，触发专属心动 CG！',
    descriptionEn: '10,000 fireworks illuminate the sea. Everyone in yukata; unlocks event CGs!',
    relatedCharIds: [CharacterId.NAO, CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.MIYUKI],
    isMajorFestival: true
  },
  {
    id: 'kobe_jazz_art',
    month: 10,
    day: 12,
    titleZh: '神户爵士音乐街 & 六甲山艺术散步',
    titleEn: 'Kobe Jazz Street & Rokko Art Walk',
    city: '神户 (Kobe)',
    location: '北野异人馆地下 Live House & 六甲索道',
    descriptionZh: '爵士之都的魅力！见证真纪的电吉他燃炸舞台，与深雪在缆车中俯瞰红叶。',
    descriptionEn: 'Experience Maki\'s electric guitar live show and ride the cable car with Miyuki.',
    relatedCharIds: [CharacterId.MAKI, CharacterId.MIYUKI, CharacterId.REI]
  },
  {
    id: 'kyoto_autumn_leaves',
    month: 11,
    day: 20,
    titleZh: '京都清水寺 / 东福寺红叶夜间特别拜观',
    titleEn: 'Kyoto Kiyomizu-dera Autumn Illumination',
    city: '京都 (Kyoto)',
    location: '清水寺清水舞台 & 岚山竹林',
    descriptionZh: '漫山枫红如火，与丽在东福寺通天桥探讨古籍，与深雪撑同一把油纸伞。',
    descriptionEn: 'Vibrant autumn foliage. Discuss ancient texts with Rei and share an umbrella with Miyuki.',
    relatedCharIds: [CharacterId.REI, CharacterId.MIYUKI]
  },
  {
    id: 'kobe_luminarie',
    month: 12,
    day: 15,
    titleZh: '神户光之雕刻 (Luminarie) 圣诞灯光节',
    titleEn: 'Kobe Luminarie Festival of Light',
    city: '神户 (Kobe)',
    location: '旧居留地 & 东游园地',
    descriptionZh: '全球最壮丽的光之长廊！在数十万盏璀璨意大利拱门灯火与冬雪中见证真情告白。',
    descriptionEn: 'The world-famous Italian light arches. A magical winter night for confessions.',
    relatedCharIds: [CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.NAO, CharacterId.REI],
    isMajorFestival: true
  },
  {
    id: 'new_year_hatsumode',
    month: 1,
    day: 1,
    titleZh: '关西三大神社初诣 · 新年初参拜',
    titleEn: 'New Year Hatsumode Shrine Visit',
    city: '神户 / 京都',
    location: '生田神社 & 伏见稻荷大社',
    descriptionZh: '新年敲响除夜之钟，在生田神社求得第一张恋爱大吉签，西宫神社福男冲刺。',
    descriptionEn: 'Ring in the New Year! Draw romance fortunes at Ikuta Shrine and sprint with Sora.',
    relatedCharIds: [CharacterId.INARI, CharacterId.SORA, CharacterId.NAO],
    isMajorFestival: true
  },
  {
    id: 'valentines_shuraba',
    month: 2,
    day: 14,
    titleZh: '情人节 · 神户港 Mosaic 终极大决战 (修罗场)',
    titleEn: 'Valentine\'s Day Mosaic Climax (Shuraba)',
    city: '神户 (Kobe)',
    location: 'Harborland Mosaic 临海露台',
    descriptionZh: '全剧终极高潮！是专属真爱手作巧克力告白？还是多线恋爱被 8 位女主角当场抓包的史诗级大修罗场？！',
    descriptionEn: 'The ultimate climax! Genuine chocolate confessions OR an epic multi-romance Shuraba!',
    relatedCharIds: [CharacterId.ASUKA, CharacterId.HIKARI, CharacterId.REI, CharacterId.NAO, CharacterId.MIYUKI, CharacterId.INARI, CharacterId.SORA, CharacterId.MAKI],
    isMajorFestival: true
  }
];