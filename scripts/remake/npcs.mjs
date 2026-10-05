// ---------------------------------------------------------
// 🧑‍🤝‍🧑 剧情里有名牌、但一直没有立绘的人（立绘重制第二轮补上）
//
// 每人一张全身立绘，画风跟主角们的角色卡一致（gen-npc.mjs 把角色卡当画风参考）。
// id → public/images/characters/npc_<id>.webp
// look：长相 + 衣服 + 鞋袜 + 手上拿的东西（场景里提到的小道具要画出来）
// ---------------------------------------------------------
export const NPCS = [
  // ---------- 百元店 ----------
  { id: 'hk_obaa', name: '百元店的老奶奶',
    look: 'A small, cheerful Kansai grandmother in her late seventies, slightly stooped. Short tightly permed grey hair with a faint lavender rinse, round gold-rimmed reading glasses pushed down her nose, kind wrinkled smiling face. A beige quilted vest over a mustard-yellow knit top, a dark brown pleated mid-calf skirt, a small coin purse on a cord. Legwear: skin-tone knee-high stockings. Footwear: comfortable black velcro walking shoes.',
    pose: 'holding a small clear plastic storage box up close to her face to read the price label underneath, squinting, the box at chin height but not covering her face' },
  { id: 'hk_mother', name: '百元店的妈妈',
    look: 'A young mother in her early thirties, practical and a little tired but warm. Dark brown hair in a low messy bun with a claw clip, light makeup. A loose oatmeal sweatshirt, olive wide-leg chino trousers, a canvas tote bag on her shoulder with a shopping list sticking out, a 100-yen shop basket on her arm. Legwear: white ankle socks. Footwear: white slip-on sneakers.',
    pose: 'one hand on her hip, the other hand beckoning toward someone below and to the side, a patient "come on, let\'s go" expression' },
  { id: 'hk_boy', name: '挑恐龙的小男孩',
    look: 'A little Japanese boy about five years old, chubby cheeks, short black bowl-cut hair, very serious concentrating face. A green T-shirt with a cartoon dinosaur print, navy shorts, a small yellow kindergarten-style crossbody bag. Legwear: short white socks with a dinosaur pattern. Footwear: blue velcro kids\' sneakers with light-up soles.',
    pose: 'standing with feet apart, holding a plastic toy dinosaur in each hand out in front of him at chest height (a small green T-rex and a purple triceratops), comparing them seriously' },

  // ---------- 药妆店 ----------
  { id: 'dr_schoolgirl', name: '药妆店的女高中生',
    look: 'A Kansai high-school girl, about 16, friendly and a little shy. Medium-length straight dark brown hair with a pastel blue hairpin, light brown eyes. A different school\'s uniform: a white short-sleeve sailor top with a sky-blue collar and a white scarf tie, a sky-blue pleated skirt, a beige school cardigan tied around her waist. Legwear: navy knee-high socks. Footwear: brown loafers.',
    pose: 'holding a tube of face wash at chest height in one hand, the other hand holding the strap of her school bag, a small amused smile as if humming' },
  { id: 'dr_pharmacist', name: '药剂师',
    look: 'A calm, reassuring pharmacist woman in her forties. Neat shoulder-length black hair tucked behind her ears, thin silver rectangular glasses, gentle eyes. A crisp white pharmacist\'s coat over a pale blue blouse, a name badge on the chest, a pen in the breast pocket, dark grey slacks. Legwear: hidden. Footwear: white nurse-style clogs.',
    pose: 'holding a small medicine box out in front of her at chest height with both hands, as if handing it over politely' },
  { id: 'dr_cashier', name: '语速飞快的收银员',
    look: 'A young drugstore cashier man in his early twenties, energetic, slightly spiky light brown hair, a quick professional smile. A store uniform: a bright blue polo shirt under a short navy apron with a name tag, black work trousers. Legwear: hidden. Footwear: black non-slip work shoes.',
    pose: 'one hand holding up a folded plastic carrier bag at shoulder height to the side, the other hand open palm presenting, mid-question' },

  // ---------- 骏河屋 ----------
  { id: 'sg_otaku_a', name: '格子衬衫 A',
    look: 'A plump otaku university student, about 20, round face, black hair a little too long, square black-framed glasses, very earnest expression. A red-and-navy check flannel shirt tucked into beige chinos with a black belt, a black backpack covered with anime pin badges, a figure box in a plastic shop bag. Legwear: hidden. Footwear: grey running shoes.',
    pose: 'pointing with one index finger at the corner of a boxed figure he holds in the other hand at chest height, explaining passionately' },
  { id: 'sg_otaku_b', name: '格子衬衫 B',
    look: 'A tall, thin otaku university student, about 20, sleepy half-lidded eyes, messy dark hair under a grey knit beanie, a sceptical deadpan face. A green-and-black check flannel shirt worn open over a grey T-shirt with a pixel game controller print, slim black jeans, a canvas messenger bag. Legwear: hidden. Footwear: black canvas high-tops.',
    pose: 'arms crossed over his chest, head tilted slightly, unconvinced' },
  { id: 'sg_gacha_girl', name: '扭蛋的女生',
    look: 'A lively high-school girl, about 15, short wavy honey-brown bob with a small star clip, bright eyes. A navy blazer school uniform from another school with a green ribbon tie, a grey plaid skirt, many small mascot keychains hanging from her school bag. Legwear: white loose socks scrunched at the ankle. Footwear: brown loafers.',
    pose: 'holding up a tiny gacha keychain charm (a little round white cat mascot) between her fingers at shoulder height to the side, beaming with triumph, the other hand holding an opened plastic capsule at waist height' },

  // ---------- 优衣库 ----------
  { id: 'uq_customer', name: '试衣间的客人',
    look: 'A young office-worker woman in her mid-twenties, polite, straight black hair to the shoulders, small pearl stud earrings. A simple beige trench coat over a white knit, grey tapered trousers, a black leather shoulder bag. Legwear: skin-tone stockings. Footwear: black low pumps.',
    pose: 'holding a neatly folded navy sweater out in front of her at waist height with both hands, a slightly apologetic smile' },

  // ---------- 序章 ----------
  { id: 'pro_mother', name: '三宫站的年轻母亲',
    look: 'A young mother in her late twenties with a kind, flustered smile, chestnut hair in a low side ponytail, a light pink cardigan over a white blouse, a long mustard pleated skirt, several shopping bags (a paper bakery bag and a tote) hanging from one arm, and a small toddler boy in a yellow raincoat-style jacket and a little hat holding her other hand. Legwear: hidden. Footwear: beige flat shoes; the toddler wears red rain boots.',
    pose: 'bowing slightly and gratefully toward the viewer, shopping bags on one arm, the other hand holding the toddler\'s hand beside her' },

  // ---------- 夜里的展望台（彩蛋） ----------
  { id: 'egg_silver_girl', name: '银发的女生',
    look: 'A cool, mysterious young woman around 20, slim. A sleek silver-white bob with uneven bangs and the ends dyed pink and teal, sharp grey eyes with a little red eyeliner, a faint smile. A cropped white high-collar jacket with black panels over a black bodysuit, black shorts, a thin black choker. Legwear: sheer black tights. Footwear: white chunky platform boots.',
    pose: 'standing with weight on one leg, one hand in her jacket pocket, the other hand holding a folded paper flyer at waist height, looking up as if at the moon' },
  { id: 'egg_yellow_jacket', name: '穿黄夹克的男生',
    look: 'A wiry teenage boy about 17, messy short black hair with an undercut, bright determined eyes, a small sticking plaster on his cheek. An oversized bright yellow bomber jacket with fluorescent green trim and patches, a black T-shirt, black cargo trousers. Legwear: hidden. Footwear: white sneakers with neon green laces.',
    pose: 'hands shoved in the pockets of the big yellow jacket, leaning forward slightly with a cocky grin' },

  // ---------- 便利店、补习班 ----------
  { id: 'konbini_nishimura', name: '便利店的西村店长',
    look: 'A quiet, dependable convenience-store manager in his late forties, slightly heavy-set, short greying hair, sleepy but kind eyes, a few days\' stubble. A generic convenience-store uniform: a blue-and-white striped short-sleeve shirt with a name badge reading "西村 店長", dark trousers, a small towel over his shoulder. Legwear: hidden. Footwear: black work shoes.',
    pose: 'holding a can of hot coffee in one hand at chest height, as if about to set it down, the other hand on his hip' },
  { id: 'juku_teacher', name: '补习班的老师',
    look: 'A patient cram-school teacher in his early thirties, tall, neat short black hair, thin black round glasses, a slightly tired but encouraging smile. A light blue dress shirt with rolled-up sleeves, a navy knit tie, grey trousers, a red marker pen in his shirt pocket. Legwear: hidden. Footwear: brown leather shoes.',
    pose: 'holding a thick printed handout at chest height in one hand, the other hand raised to the side at shoulder height holding a red marker as if circling something on a whiteboard' }
];
