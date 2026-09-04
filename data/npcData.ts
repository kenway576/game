// ---------------------------------------------------------
// 👥 这座城市里的其他人
//
// 八个女主角之外，学校和街上还有二十个有名有姓的人。
// 他们不是背景板：食堂那个阿姨在便当菜单的描述里已经被提过一次，
// 渔具店那个老板"背对着你在修卷线器"也写过——只是一直没有脸。
//
// 【为什么值得给他们写名字】
// 一座城市之所以像城市，是因为你会在同一个地方反复看见同一个人。
// 第三次去百元店还是那个戴着眼镜的年轻店员，第五次去钓场还是那个
// 从来不说话的老头——认得出他们，这地方才算是你的地盘。
//
// 【他们只出现在自己的地方】
// 每个人绑死一个地点。食堂阿姨不会出现在游戏厅，
// 上班族只在三宫站。这条规矩是这套系统唯一的规矩。
// ---------------------------------------------------------

export interface Npc {
  id: string;
  sprite: string;
  nameJp: string; nameZh: string; nameEn: string;
  // 一句话：他是干什么的
  roleZh: string; roleEn: string;
  // 他属于哪儿。地点 id。
  home: string[];
}

const C = '/images/characters/';

export const NPCS: Npc[] = [
  // ---------------- 学校 ----------------
  {
    id: 'yamada', sprite: `${C}npc_yamada.webp`,
    nameJp: '山田さん', nameZh: '山田阿姨', nameEn: 'Mrs Yamada',
    roleZh: '食堂的阿姨。手里那把勺子比你的小臂还长。',
    roleEn: 'The cafeteria lady. The ladle in her hand is longer than your forearm.',
    home: ['school_terrace']
  },
  {
    id: 'sakamoto', sprite: `${C}npc_sakamoto.webp`,
    nameJp: '坂本先生', nameZh: '坂本老师', nameEn: 'Mr Sakamoto',
    roleZh: '体育老师。脖子上那个秒表据说比他工龄还长。',
    roleEn: 'PE teacher. The stopwatch round his neck is said to predate his employment.',
    home: ['gym', 'courtyard_rain']
  },
  {
    id: 'kanzaki', sprite: `${C}npc_kanzaki.webp`,
    nameJp: '神崎先生', nameZh: '神崎老师', nameEn: 'Mr Kanzaki',
    roleZh: '理科老师。白大褂口袋里永远插着三支不同颜色的笔。',
    roleEn: 'Science teacher. Three pens of different colours, permanently, in the coat pocket.',
    home: ['school_science_lab']
  },
  {
    id: 'saeki', sprite: `${C}npc_saeki.webp`,
    nameJp: '佐伯先生', nameZh: '佐伯老师', nameEn: 'Dr Saeki',
    roleZh: '保健室的校医。她那儿的床是全校最好睡的地方，全校都知道。',
    roleEn: 'The school nurse. Her bed is the best sleeping in the building and everyone knows it.',
    home: ['school_infirmary']
  },
  {
    id: 'fujiwara', sprite: `${C}npc_fujiwara.webp`,
    nameJp: '藤原先生', nameZh: '藤原老师', nameEn: 'Ms Fujiwara',
    roleZh: '教务处。你的每一份表格都经过她的手，而且她每一份都记得。',
    roleEn: 'The office. Every form you have filled in went through her, and she remembers all of them.',
    home: ['international_office', 'classroom_morning']
  },
  {
    id: 'ellen', sprite: `${C}npc_ellen.webp`,
    nameJp: 'エレン先生', nameZh: '艾伦老师', nameEn: 'Ms Ellen',
    roleZh: '英语外教。澳大利亚人，日语比你好，但会假装不好。',
    roleEn: 'The English teacher. Australian. Her Japanese is better than yours and she pretends otherwise.',
    home: ['international_office', 'classroom_morning']
  },
  {
    id: 'aoi', sprite: `${C}npc_aoi.webp`,
    nameJp: '葵', nameZh: '葵', nameEn: 'Aoi',
    roleZh: '同班。全班消息最灵通的人，而且乐于分享。',
    roleEn: 'Classmate. Best-informed person in the year, and generous with it.',
    home: ['classroom_morning', 'school_terrace']
  },
  {
    id: 'shiori', sprite: `${C}npc_shiori.webp`,
    nameJp: '詩織', nameZh: '诗织', nameEn: 'Shiori',
    roleZh: '图书委员。她管借还，也管在你超期时看你一眼。',
    roleEn: 'Library committee. She handles loans, and the look you get when yours is overdue.',
    home: ['school_library']
  },
  {
    id: 'hiroki', sprite: `${C}npc_hiroki.webp`,
    nameJp: '広樹', nameZh: '广树', nameEn: 'Hiroki',
    roleZh: '同班。数学永远第一，永远坐第一排。',
    roleEn: 'Classmate. Top of the year in maths, front row, always.',
    home: ['classroom_morning', 'school_library']
  },
  {
    id: 'kenta', sprite: `${C}npc_kenta.webp`,
    nameJp: '健太', nameZh: '健太', nameEn: 'Kenta',
    roleZh: '同班。运动部的，跟谁都能聊上，跟你也是。',
    roleEn: 'Classmate. Sports club. Can talk to anyone, including you.',
    home: ['gym', 'school_bicycle_parking', 'school_terrace']
  },

  // ---------------- 街上 ----------------
  {
    id: 'chen', sprite: `${C}npc_city_chen.webp`,
    nameJp: '陳さん', nameZh: '陈师傅', nameEn: 'Chef Chen',
    roleZh: '南京町的点心摊。蒸笼一掀，整条街都往这边看。',
    roleEn: 'The dim sum stall in Nankinmachi. When that steamer opens, the whole street turns round.',
    home: ['nankinmachi']
  },
  {
    id: 'matsumoto', sprite: `${C}npc_city_matsumoto.webp`,
    nameJp: '松本さん', nameZh: '松本老板', nameEn: 'Matsumoto',
    roleZh: '拉面店老板。T 恤上就一个「麺」字，别的什么都不用说。',
    roleEn: 'The ramen boss. One character on the T-shirt, and nothing else needs saying.',
    home: ['ramen_shop_interior', 'ramen_rekishi']
  },
  {
    id: 'munakata', sprite: `${C}npc_city_munakata.webp`,
    nameJp: '宗方さん', nameZh: '宗方老板', nameEn: 'Munakata',
    roleZh: '纯喫茶的老板。虹吸壶，手冲，一杯十二分钟，一句话不说。',
    roleEn: 'The kissaten master. Siphon, hand-poured, twelve minutes a cup, not one word.',
    home: ['retro_kissaten']
  },
  {
    id: 'mina', sprite: `${C}npc_city_mina.webp`,
    nameJp: '美奈さん', nameZh: '美奈', nameEn: 'Mina',
    roleZh: '西村咖啡的服务生。端盘子的时候手腕不动，盘子也不动。',
    roleEn: 'Waitress at Nishimura. She carries a tray without her wrist moving, or the tray.',
    home: ['nishimura_coffee_salon', 'former_settlement_salon']
  },
  {
    id: 'gensan', sprite: `${C}npc_city_gensan.webp`,
    nameJp: '源さん', nameZh: '源老爹', nameEn: 'Old Gen',
    roleZh: '钓场的常客。据说从这个堤防修好那天起就在这儿了。',
    roleEn: 'A fixture on the pier. Reportedly has been there since the day it was built.',
    home: ['suma_fishing_pier', 'tackle_shop', 'meriken_park']
  },
  {
    id: 'shizue', sprite: `${C}npc_city_shizue.webp`,
    nameJp: '静江さん', nameZh: '静江婆婆', nameEn: 'Shizue',
    roleZh: '澡堂的老板娘。手里那个脸盆上写着一个「ゆ」。',
    roleEn: 'The bathhouse owner. The basin in her hands has one character on it: hot water.',
    home: ['nada_onsen', 'arima_onsen']
  },
  {
    id: 'takahashi', sprite: `${C}npc_city_takahashi.webp`,
    nameJp: '高橋くん', nameZh: '高桥', nameEn: 'Takahashi',
    roleZh: '百元店的店员。扫码枪拿在手里像拿着一把枪。',
    roleEn: 'Hundred-yen shop staff. Holds the barcode scanner the way you would hold a pistol.',
    home: ['hyakkin_store', 'convenience_store']
  },
  {
    id: 'watanabe', sprite: `${C}npc_city_watanabe.webp`,
    nameJp: '渡辺さん', nameZh: '渡边', nameEn: 'Watanabe',
    roleZh: '三宫站的上班族。永远在看表，永远差两分钟。',
    roleEn: 'A salaryman at Sannomiya. Always checking his watch, always two minutes short.',
    home: ['sannomiya_station', 'portliner_platform']
  },
  {
    id: 'riko', sprite: `${C}npc_city_riko.webp`,
    nameJp: '莉子さん', nameZh: '莉子', nameEn: 'Riko',
    roleZh: '书店常客。每次都站在同一排，每次都不买。',
    roleEn: 'A regular at the bookshop. Same shelf every time, and never buys anything.',
    home: ['junkudo_bookstore', 'sannomiya_arcade']
  },
  {
    id: 'yuki', sprite: `${C}npc_city_yuki.webp`,
    nameJp: '由紀さん', nameZh: '由纪', nameEn: 'Yuki',
    roleZh: '拿着相机和地图的观光客。她比住在这儿的人更认真地看这座城市。',
    roleEn: 'A tourist with a camera and a map. She looks at this city harder than the people who live in it.',
    home: ['meriken_park', 'kitano_slope', 'kitano_kazamidori_square']
  }
];

export const findNpc = (id: string) => NPCS.find(n => n.id === id);
export const npcsAt = (locationId: string) => NPCS.filter(n => n.home.includes(locationId));
