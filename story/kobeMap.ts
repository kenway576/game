import { StoryFlags } from '../types';
import { MAP_LOCATIONS } from './mapLocations';
import { isLocationUnlocked } from './mapEvents';

// ---------------------------------------------------------
// 🧭 外公那张神户地图
//
// 房间软木板上钉着的那张。以前点它只出一句旁白，玩家要的是真能看的地图。
//
// 【为什么是手画的 SVG，不是生成图】
// 一是不用花钱生图；二是生成的图钉不上标记——这张图的意义在于
// "去过的地方会被打上钩"，它必须能随剧情长出东西来，那就只能是矢量的。
// 三是设定上它本来就是外公折了太多次的一张旧纸质地图，粗线条的手绘感
// 比一张精致的卫星图更像那张纸。
//
// 【坐标怎么定的】
// viewBox 是 1000×560，按神户的真实地理压扁成一条带子：
//   北边是六甲山，南边是大阪湾，中间那条又窄又长的市区就是神户本身。
//   西端须磨，往东经港区、三宫、灘，出了市界是甲子园、大阪、京都。
//   北野在山脚的坡上（所以叫北野坂），港岛是海上填出来的一块。
// 数字是照着这个关系摆的，不是精确投影——它是一张给人看的示意图。
//
// 【一个图钉盖好几个地点】
// 校内十一个房间在地图上是同一栋楼，三宫那一片九个店是同一个街区。
// 一个地点一个钉的话，四十五个点会在这条窄带子上糊成一片。
// 所以钉的是"地方"，covers 里列它盖住哪些 id，去过其中任何一个就算到过。
// ---------------------------------------------------------

export interface KobeSite {
  id: string;
  x: number; y: number;
  nameZh: string; nameEn: string; nameJp: string;
  // 名字标在钉子的哪一边，免得挤在一起
  side?: 'left' | 'right' | 'above' | 'below';
  covers: string[];
}

export const KOBE_SITES: KobeSite[] = [
  {
    id: 'suma', x: 152, y: 418, side: 'above',
    nameZh: '须磨', nameEn: 'Suma', nameJp: '須磨',
    covers: ['suma_beach', 'suma_fishing_pier']
  },
  {
    id: 'harborland', x: 448, y: 350, side: 'left',
    nameZh: '港湾乐园', nameEn: 'Harborland', nameJp: 'ハーバーランド',
    covers: ['kobe_harbor', 'mosaic_night']
  },
  {
    id: 'meriken', x: 494, y: 386, side: 'right',
    nameZh: '美利坚公园', nameEn: 'Meriken Park', nameJp: 'メリケンパーク',
    covers: ['meriken_park', 'tackle_shop']
  },
  {
    id: 'motomachi', x: 484, y: 320, side: 'left',
    nameZh: '元町 · 南京町', nameEn: 'Motomachi', nameJp: '元町・南京町',
    covers: ['nankinmachi', 'former_settlement_salon']
  },
  {
    id: 'portisland', x: 528, y: 438, side: 'below',
    nameZh: '港岛', nameEn: 'Port Island', nameJp: 'ポートアイランド',
    covers: ['portliner_platform']
  },
  {
    id: 'sannomiya', x: 548, y: 308, side: 'below',
    nameZh: '三宫', nameEn: 'Sannomiya', nameJp: '三宮',
    covers: [
      'sannomiya_station', 'sannomiya_arcade', 'pia_kobe_arcade', 'ramen_shop_interior',
      'junkudo_bookstore', 'hyakkin_store', 'ramen_rekishi', 'grill_ippei', 'kobe_beef_teppanyaki'
    ]
  },
  {
    id: 'ikuta', x: 528, y: 286, side: 'left',
    nameZh: '生田神社', nameEn: 'Ikuta Shrine', nameJp: '生田神社',
    covers: ['ikuta_shrine']
  },
  {
    id: 'kitano', x: 562, y: 250, side: 'above',
    nameZh: '北野', nameEn: 'Kitano', nameJp: '北野',
    covers: [
      'kitano_slope', 'convenience_store', 'kitano_lookout',
      'nishimura_coffee_salon', 'kitano_kazamidori_square', 'retro_kissaten'
    ]
  },
  {
    id: 'umikaze', x: 596, y: 262, side: 'right',
    nameZh: '海风庄', nameEn: 'Umikaze-so', nameJp: '海風荘',
    covers: ['umikaze_exterior']
  },
  {
    id: 'school', x: 622, y: 292, side: 'right',
    nameZh: '港见高校', nameEn: 'Minatomi High', nameJp: '港見高校',
    covers: [
      'classroom_morning', 'school_library', 'rooftop_sunset', 'school_terrace', 'gym',
      'courtyard_rain', 'music_room', 'art_room', 'school_infirmary',
      'school_science_lab', 'school_bicycle_parking'
    ]
  },
  {
    id: 'oji', x: 654, y: 268, side: 'above',
    nameZh: '王子动物园', nameEn: 'Oji Zoo', nameJp: '王子動物園',
    covers: ['oji_zoo']
  },
  {
    id: 'nada', x: 704, y: 306, side: 'below',
    nameZh: '滩', nameEn: 'Nada', nameJp: '灘',
    covers: ['nada_onsen']
  },
  {
    id: 'rokko', x: 674, y: 152, side: 'right',
    nameZh: '六甲山', nameEn: 'Mt Rokko', nameJp: '六甲山',
    covers: ['rokko_night']
  },
  {
    id: 'arima', x: 726, y: 66, side: 'right',
    nameZh: '有马温泉', nameEn: 'Arima Onsen', nameJp: '有馬温泉',
    covers: ['arima_onsen']
  },
  {
    id: 'koshien', x: 856, y: 316, side: 'below',
    nameZh: '甲子园', nameEn: 'Koshien', nameJp: '甲子園',
    covers: ['koshien']
  },
  {
    id: 'osaka', x: 944, y: 286, side: 'left',
    nameZh: '大阪 · 道顿堀', nameEn: 'Osaka', nameJp: '大阪・道頓堀',
    covers: ['dotonbori']
  },
  {
    id: 'kyoto', x: 926, y: 74, side: 'left',
    nameZh: '京都', nameEn: 'Kyoto', nameJp: '京都',
    covers: ['kyoto_torii', 'kiyomizu_stage']
  }
];

// 去过的地方在存档里记成 been_<地点id>。用 flag 而不是另开一个数组，
// 是因为存档的读写、云同步、旧档兼容都已经围着 storyFlags 转了。
export const beenFlag = (locationId: string) => `been_${locationId}`;

export const siteVisited = (site: KobeSite, flags: StoryFlags) =>
  site.covers.some(id => flags[beenFlag(id)]);

// 图钉什么时候出现在纸上：这一片里只要有一个地方解锁了就画出来。
// 没解锁的整片不画——外公圈的是他去过的地方，你还没走到那儿。
export const siteRevealed = (site: KobeSite, flags: StoryFlags) =>
  site.covers.some(id => {
    const loc = MAP_LOCATIONS.find(l => l.id === id);
    return loc ? isLocationUnlocked(loc, flags) : false;
  });

// 「去过 12 / 45」里的那两个数
export const visitTally = (flags: StoryFlags) => {
  const been = MAP_LOCATIONS.filter(l => flags[beenFlag(l.id)]).length;
  return { been, total: MAP_LOCATIONS.length };
};
