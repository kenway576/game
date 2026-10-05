// ---------------------------------------------------------
// 👗 立绘重制第二轮：每个角色的换装设计
//
// 校服之外的每一套衣服。原则（用户定的）：
//   · 衣服、动作、表情都要看得出是"她"——配饰、配色、鞋子款式、袜子颜色和长短，
//     八个人之间不重样，同一个人的各套之间也不重样
//   · 画风跟角色卡（public/images/character_cards/<角色>/*_remake.webp）完全一致
//   · 主题沿用旧图（游戏里的衣柜键名不变），设计按新画风重新做
//
// outfit：衣服本身（写全：上衣、下装、配饰、袜子颜色+长度、鞋）
// gesture：这套衣服的招牌动作。木偶要求：手离脸至少一只手的距离，不挡脖子和头发
// 表情列表按角色走（EMOTIONS），第一个是底图本身的表情
//
// scripts/remake/outfit-pipeline.mjs --char asuka --outfit casual 跑一套
// ---------------------------------------------------------

// 每个角色的表情词表：她会用的那几种脸。第一个 = 底图自带的表情
export const EMOTIONS = {
  asuka:  ['neutral', 'happy', 'angry', 'sad', 'shy', 'smug', 'surprised', 'pout'],
  hikari: ['neutral', 'happy', 'angry', 'sad', 'shy', 'smug', 'surprised'],
  rei:    ['neutral', 'smile', 'shy', 'thinking', 'lecturing', 'surprised', 'sad'],
  inari:  ['neutral', 'happy', 'sly', 'shy', 'jealous', 'angry', 'sad', 'surprised'],
  miyuki: ['neutral', 'happy', 'love', 'shy', 'sad', 'angry', 'thinking'],
  sora:   ['neutral', 'happy', 'cool', 'shy', 'love', 'angry', 'sad'],
  nao:    ['neutral', 'happy', 'curious', 'shy', 'love', 'angry', 'sad'],
  maki:   ['neutral', 'smug', 'laugh', 'pout', 'shy', 'angry', 'happy']
};

// 底图（neutral）那张脸的样子：带一点她的性格，但仍然是"平常的脸"
// 模型容易画偏的地方，单独强调。空：短发、运动、穿裤子的衣服，模型会直接画成男生
export const IDENTITY_EXTRA = {
  sora: 'IMPORTANT: Sora is a teenage GIRL, a sporty tomboy but unmistakably a girl. Draw a clearly feminine anime girl face exactly like the reference: large bright eyes with long lashes, soft rounded jaw and chin, small nose, soft lips. Slim, athletic FEMALE body: narrow waist, slightly wider hips, a modest but visible chest, slender limbs. She must never look like a boy, even in trousers or a T-shirt.'
};

export const NEUTRAL_FACE = {
  asuka:  'a composed, slightly proud neutral look: chin a little raised, eyebrows straight, mouth closed in a firm small line',
  hikari: 'a relaxed, friendly neutral look with a hint of a smile, eyes bright and open',
  rei:    'a calm, quiet neutral look: soft steady gaze, mouth closed, composed',
  inari:  'a calm, faintly amused neutral look: eyes relaxed, the corners of the mouth very slightly lifted',
  miyuki: 'a gentle, warm neutral look: soft kind eyes, a faint calm smile',
  sora:   'a relaxed, easygoing neutral look: eyes open and confident, mouth closed in a casual line',
  nao:    'a soft, sweet neutral look: round gentle eyes, mouth closed in a small relaxed smile',
  maki:   'a cheeky neutral look: eyes lively, a tiny confident smirk showing the small fang'
};

export const OUTFITS = {
  // ================= 飞鸟：红黑配色、利落、端庄里带傲气。招牌：黑发圈、腕表（守时的委员长） =================
  asuka: {
    casual: {
      outfit: 'Off-duty city outfit: a fitted black off-shoulder cable-knit sweater, a thin black velvet choker with a small red heart charm, a red-and-black tartan pleated mini skirt with a slim black leather belt and silver buckle, a small slim silver wristwatch on her left wrist. Legwear: sheer black thigh-high stockings ending a few centimetres below the skirt hem. Footwear: polished black lace-up ankle boots with a low chunky heel.',
      gesture: 'one hand on her hip, the other arm crossed loosely under the chest holding the opposite elbow, a proud stance'
    },
    gym: {
      outfit: 'School PE outfit: a crimson track jacket with white stripes down the sleeves, half-zipped over a white short-sleeve gym shirt with a small name patch reading "1-A", dark crimson bloomers-style gym shorts, a silver whistle on a red lanyard around her neck (she is the class representative), a white sweatband on her right wrist. Legwear: short white ankle socks with a thin red line. Footwear: white indoor gym shoes with red toe caps.',
      gesture: 'one hand on her hip, the other holding a clipboard against her side at waist height'
    },
    swim: {
      outfit: 'Swimwear: a red frilled bikini with a small black ribbon at the centre of the top, a sheer red-and-black floral sarong tied at the left hip, a thin black anklet. Legwear: none, bare legs. Footwear: red strappy flat sandals.',
      gesture: 'one hand on her hip, the other holding the knot of the sarong at her hip, standing confidently'
    },
    maid: {
      outfit: 'Classic Victorian maid uniform: black long-sleeved dress with white cuffs, a crisp white frilled apron with a heart-shaped bib, a white frilled maid headpiece, a small red ribbon bow at the collar. Legwear: white thigh-high stockings with a lace top and a small red ribbon. Footwear: black patent Mary-Jane shoes with a strap.',
      gesture: 'holding a small silver tray with a teacup in one hand at waist height, the other hand on her hip'
    },
    autumn: {
      outfit: 'Autumn outfit: a camel-brown double-breasted duffle coat with wooden toggles, open over a burgundy turtleneck sweater, a long red tartan scarf, a dark brown corduroy mini skirt. Legwear: black opaque tights. Footwear: chestnut-brown lace-up ankle boots with a low heel.',
      gesture: 'one hand holding the end of the scarf at chest height, the other hand in her coat pocket'
    },
    yukata: {
      outfit: 'Summer festival yukata: deep navy blue cotton yukata with a pattern of red camellias and small white fireworks, a red obi tied in a neat bow at the back with a small black obi cord, a red camellia hair ornament next to one hair tie. Legwear: none, bare feet. Footwear: black-lacquered geta with red thongs.',
      gesture: 'holding a round red uchiwa paper fan at waist height in one hand, the other hand resting on the obi'
    },
    winter: {
      outfit: 'Winter outfit: a navy-blue wool duffle coat with horn toggles buttoned up, a thick red tartan scarf, white fluffy earmuffs, red knit mittens, a short dark grey pleated skirt visible under the coat. Legwear: black knee-high wool socks with a small red stripe at the top. Footwear: dark brown leather lace-up boots with a fleece lining.',
      gesture: 'arms crossed in front of her chest with mittened hands, a proud, slightly cold stance'
    },
    sleep: {
      outfit: 'Sleepwear: a pale pink long-sleeved button-up pyjama set with a pattern of small yellow stars, white piping on the collar and cuffs, a small red ribbon tie at the collar, her twin tails loosened slightly. Legwear: none. Footwear: fluffy white bunny slippers.',
      gesture: 'hugging a white pillow against her body at waist height with both arms'
    },
    dress: {
      outfit: 'Gothic Lolita party dress: a black and deep red tiered dress with a black lace corset bodice, red satin ribbon lacing, puffed black lace short sleeves, a layered ruffled skirt with a red underskirt, a black lace choker with a red rose, black lace fingerless gloves. Legwear: black lace-top thigh-high stockings. Footwear: black platform lace-up knee-high boots.',
      gesture: 'one gloved hand lifting the side of her skirt slightly in a proud curtsy, the other hand on her hip'
    },
    kimono: {
      outfit: 'Formal New Year furisode: a crimson silk furisode with gold cranes and white plum blossoms, long swinging sleeves, a wide gold brocade obi with an elaborate bow, a red-and-gold obijime cord, a gold kanzashi with dangling red tassels beside one hair tie. Legwear: white tabi socks. Footwear: red-lacquered zori sandals with gold thongs.',
      gesture: 'both hands holding a small red drawstring kinchaku bag in front of her waist, standing elegantly'
    },
    sport: {
      outfit: 'Tennis club uniform: a white polo shirt with a red collar and red trim, a short red pleated tennis skirt with a white hem stripe, a red sweatband on each wrist, a white visor. Legwear: short white sports socks with a red pom-pom at the heel. Footwear: white tennis shoes with red accents.',
      gesture: 'resting a tennis racket on her shoulder with one hand, the other hand on her hip'
    },
    summer: {
      outfit: 'Summer outing: a red sleeveless sundress with a white hibiscus print and a fitted waist with a thin white belt, a wide-brimmed straw hat with a red ribbon band, a small white crossbody bag. Legwear: none, bare legs. Footwear: white strappy wedge sandals.',
      gesture: 'one hand holding the brim of the straw hat at its edge, well above and to the side of the face, the other hand on her hip'
    },
    fantasy: {
      outfit: 'Fantasy knight commander outfit: a crimson military coat with gold epaulettes, gold braided aiguillette and gold buttons, a white cravat with a ruby brooch, white fitted trousers, a black leather sword belt with a slim rapier in its scabbard at her left hip, white gloves. Legwear: hidden. Footwear: polished black knee-high riding boots.',
      gesture: 'one gloved hand resting on the hilt of the sheathed rapier at her hip, the other hand on her hip, a commanding stance'
    }
  },

  // ================= 光：暖黄/橙、运动感、太阳花。招牌：雏菊发夹、彩色手绳 =================
  hikari: {
    casual: {
      outfit: 'Casual street outfit: an oversized mustard-yellow hoodie with a small sunflower embroidery on the chest, light-wash denim cut-off shorts with frayed hems, a woven rainbow friendship bracelet on her right wrist, a beige baseball cap worn backwards. Legwear: black thigh-high socks with two thin yellow stripes at the top. Footwear: white high-top canvas sneakers with yellow laces.',
      gesture: 'one hand in the hoodie pocket, the other hand giving a cheerful thumbs-up at chest height'
    },
    gym: {
      outfit: 'School PE outfit: a white sleeveless gym top with orange trim, bright orange running shorts with white side stripes, an orange sweatband on her left wrist, a white towel around her neck. Legwear: short white ankle socks. Footwear: white running shoes with orange soles.',
      gesture: 'holding a water bottle at waist height in one hand, the other arm raised in a wave above shoulder height, well away from her head'
    },
    swim: {
      outfit: 'Swimwear: a sunny yellow halter bikini with white polka dots and a ruffle trim, an open short orange beach shirt tied at the waist, a sunflower clip in her hair beside the daisies. Legwear: none, bare legs. Footwear: orange flip-flops.',
      gesture: 'hugging a colourful striped beach ball against her hip with one arm, the other hand in a peace sign at shoulder height away from the face'
    },
    yukata: {
      outfit: 'Summer festival yukata: a cream-yellow yukata printed with orange goldfish and blue water ripples, a bright orange heko obi tied in a big fluffy bow, a sunflower hair ornament. Legwear: none. Footwear: natural wood geta with orange thongs.',
      gesture: 'holding a candied apple on a stick at chest height in one hand, the other holding a round blue uchiwa fan at her side'
    },
    autumn: {
      outfit: 'Autumn outfit: a short orange puffer jacket over a cream knit sweater, a long orange-and-brown striped knit scarf, rust-coloured corduroy overall shorts, an orange knit beanie with a pom-pom pushed back on her head. Legwear: brown ribbed knee-high socks. Footwear: tan lace-up hiking boots with red laces.',
      gesture: 'one hand holding a paper bag of roasted sweet potato at waist height, the other waving cheerfully at shoulder height'
    },
    maid: {
      outfit: 'Cafe maid uniform: a short black puff-sleeved dress with a yellow ribbon at the collar, a white frilled apron with a yellow daisy embroidery, a frilled white headpiece with a small yellow bow. Legwear: white over-the-knee socks with a yellow ribbon. Footwear: black round-toe strap shoes.',
      gesture: 'holding a tray with a slice of cake and a cup at waist height in one hand, the other making a V sign at shoulder height away from the face'
    },
    winter: {
      outfit: 'Winter outfit: a bright orange quilted down jacket with a fur-trimmed hood, a cream knit beanie with a big pom-pom, an orange-and-white knit scarf, white fluffy mittens, black leggings under a short denim skirt. Legwear: black thermal leggings with cream slouch leg warmers. Footwear: orange-and-white snow sneakers.',
      gesture: 'one mittened hand raised high in an excited wave above her shoulder, the other at her side'
    },
    sleep: {
      outfit: 'Sleepwear: a pale yellow fleece hoodie onesie-style pyjama with small bear ears on the hood (hood down), a bear face embroidered on the chest, matching pale yellow shorts. Legwear: none. Footwear: white fluffy bear-face slippers.',
      gesture: 'holding a small teddy bear by the arm at waist height, the other hand rubbing the hem of the hoodie'
    },
    sport: {
      outfit: 'Cheerleader uniform: a yellow and white sleeveless cheer top with an orange "K" letter, a short yellow pleated cheer skirt with white stripes, a big yellow ribbon on her side ponytail. Legwear: white crew socks with a yellow stripe. Footwear: white cheer sneakers.',
      gesture: 'one hand holding a big golden pom-pom raised high above her head, the other pom-pom at her hip'
    },
    dress: {
      outfit: 'Garden party dress: a light cream-yellow chiffon dress with a sweetheart neckline, a sunflower corsage at the waist, a layered knee-length tulle skirt with embroidered small flowers, a thin gold bracelet. Legwear: none, bare legs. Footwear: pale gold ballet flats with a small bow.',
      gesture: 'both hands lightly lifting the sides of the skirt in a cheerful curtsy'
    },
    kimono: {
      outfit: 'Formal New Year furisode: a vivid orange furisode with gold maple leaves and white chrysanthemums, a white fur stole around her shoulders, a gold-and-red obi with a large bow, an orange flower kanzashi. Legwear: white tabi socks. Footwear: black-lacquered zori with orange thongs.',
      gesture: 'holding an open golden folding fan at chest height to one side, the other hand at her waist'
    }
  },

  // ================= 玲：冷蓝/藏青/白、书卷气、简洁。招牌：红框眼镜、一本书或笔 =================
  rei: {
    casual: {
      outfit: 'Casual library outfit: a black slim turtleneck sweater, a long pleated beige midi skirt, a thin silver chain necklace with a small crescent moon pendant, a slim black leather wristwatch. Legwear: dark grey semi-sheer tights. Footwear: dark brown leather penny loafers.',
      gesture: 'holding an open hardcover book at waist height with both hands, reading posture but looking at the viewer'
    },
    lab: {
      outfit: 'Science club outfit: a crisp white lab coat open over the school shirt with a red ribbon, a dark green tartan pleated skirt, a mechanical pencil and a pen clipped in the coat breast pocket, a lanyard with a small ID badge. Legwear: black sheer tights. Footwear: brown leather loafers.',
      gesture: 'holding a clipboard against her chest-level with one arm, the other hand raised to the side at shoulder height with an index finger up as if explaining, well away from her face'
    },
    gym: {
      outfit: 'Tracksuit: a navy-blue zip-up track jacket with two white stripes on the sleeves, zipped up to the collar, matching navy track trousers with white stripes, her hair tied in a small low ponytail for exercise. Legwear: short white socks. Footwear: white sneakers with navy laces.',
      gesture: 'holding a small white towel in both hands in front of her at waist height'
    },
    swim: {
      outfit: 'School swimsuit: a navy-blue one-piece school swimsuit with a white name tag on the chest, a white swim cap held in one hand, a light blue zip-up rash guard jacket worn open over it. Legwear: none, bare legs. Footwear: blue pool sandals.',
      gesture: 'holding the white swim cap at waist height in one hand, the other arm hugging the rash guard closed shyly'
    },
    kimono: {
      outfit: 'Taisho-era student hakama: an indigo kimono with a white arrow-feather (yagasuri) pattern, a deep navy hakama skirt, a big red ribbon in her hair at the back, a cloth-wrapped stack of books. Legwear: hidden. Footwear: dark brown lace-up leather boots.',
      gesture: 'holding a stack of books wrapped in a purple furoshiki cloth against her side at waist height'
    },
    maid: {
      outfit: 'Long Victorian maid dress: a long black dress reaching the ankles, a long plain white apron, a white Peter Pan collar with a small navy ribbon, a simple white headband, sleeves with white cuffs. Legwear: black opaque stockings. Footwear: black lace-up ankle boots.',
      gesture: 'holding a leather-bound book against her chest at chest level with both hands, a quiet and proper stance'
    },
    winter: {
      outfit: 'Winter outfit: a navy wool duffle coat with white horn toggles, a thick cream cable-knit scarf, white fluffy earmuffs, a dark green tartan skirt peeking below the coat. Legwear: black thick wool tights. Footwear: brown leather ankle boots.',
      gesture: 'both hands holding a paper cup of hot tea at chest height, a little away from her face'
    },
    sleep: {
      outfit: 'Sleepwear: a long pale lavender cotton nightgown with a small round collar and a thin ribbon at the neck, three-quarter sleeves, glasses still on. Legwear: white-and-light-blue striped ankle socks. Footwear: none, just the socks.',
      gesture: 'holding a small book against her chest with one arm, the other hand loosely at her side'
    },
    dress: {
      outfit: 'Evening dress: an elegant midnight-navy off-shoulder long gown with a subtle starry glitter-thread pattern, a slim silver necklace with a single small sapphire, her bob neatly tucked with a silver star hairpin. Legwear: hidden. Footwear: navy satin low-heeled pumps.',
      gesture: 'both hands lightly clasped in front of her waist, a reserved elegant stance'
    },
    yukata: {
      outfit: 'Summer festival yukata: an indigo yukata with large white morning-glory flowers, a pale yellow obi, a small blue glass furin wind chime charm hanging from the obi, a morning-glory hair clip. Legwear: none. Footwear: dark wood geta with navy thongs.',
      gesture: 'holding a small round water-balloon yo-yo on its string at waist height in one hand, the other hand at her side'
    },
    autumn: {
      outfit: 'Autumn outing: a brown herringbone tweed blazer over a white blouse with a thin black ribbon tie, a dark green pleated skirt, a brown beret, a vintage film camera on a strap around her neck. Legwear: dark brown tights. Footwear: brown lace-up oxford shoes.',
      gesture: 'holding the film camera at chest height with both hands, a little below her face, as if about to take a photo'
    }
  },

  // ================= 稻荷：金橙/白/朱红、雍容古典。招牌：金色绳结发饰带青绿流苏、九尾、铃铛 =================
  inari: {
    casual: {
      outfit: 'Modern casual outfit: an oversized cream knit sweater tucked loosely into a camel tartan high-waisted pleated midi skirt with a brown leather belt, a small gold fox-head pendant necklace, a gold bell bracelet. Legwear: dark brown ribbed over-the-knee socks. Footwear: black leather loafers with gold horsebit buckles.',
      gesture: 'holding a small gold bell on a red cord at waist height in one hand, the other hand at her side'
    },
    swim: {
      outfit: 'Swimwear: a navy-and-white bikini with a Hokusai-style great-wave print, a long sheer navy kimono-style beach cover-up with wave patterns draped off her shoulders, a gold anklet with a tiny bell. Legwear: none, bare legs. Footwear: wooden geta-style sandals with white thongs.',
      gesture: 'one hand holding the edge of the sheer cover-up out to the side, the other hand on her hip'
    },
    home: {
      outfit: 'Relaxed home wear: a loose cream knit sweater with a small fox embroidery, beige cotton shorts, her long hair loosely braided over one shoulder. Legwear: none, bare legs. Footwear: fluffy orange fox-face slippers.',
      gesture: 'holding a steaming mug of tea at waist height in both hands'
    },
    knit: {
      outfit: 'Winter town outfit: a black oversized chunky knit sweater, a short beige pleated skirt, a gold fox-tail charm on a thin chain at her hip. Legwear: black semi-sheer tights. Footwear: grey suede ankle boots with fur trim.',
      gesture: 'one hand tucked into the long sweater sleeve at her side, the other hand on her hip'
    },
    gown: {
      outfit: 'Imperial evening gown: a deep navy velvet off-shoulder ball gown with gold cloud-and-wave embroidery, a hair arrangement with an elaborate gold kanzashi and long tassels, gold drop earrings. Legwear: hidden. Footwear: navy satin heels with gold heels.',
      gesture: 'holding a closed gold folding fan at chest height to one side, the other hand lifting the gown slightly'
    },
    summer: {
      outfit: 'Summer outfit: a white sleeveless sundress with a pale blue wave and cloud print, a thin brown braided belt, a woven straw bag, her hair in a long side braid. Legwear: none, bare legs. Footwear: tan leather gladiator sandals.',
      gesture: 'holding a glass of iced barley tea with a straw at waist height in one hand, the other holding the straw bag at her side'
    },
    miko: {
      outfit: 'Shrine maiden (miko) outfit: a white kosode with wide sleeves, scarlet hakama, a white-and-red mizuhiki hair ribbon, a thin red cord tied around her sleeves. Legwear: white tabi socks. Footwear: white-thonged zori sandals.',
      gesture: 'holding a kagura suzu (a cluster of gold shrine bells on a handle) raised out to the side at shoulder height, the other hand holding a folded gold fan at waist height'
    },
    goddess: {
      outfit: 'True goddess form: flowing white and gold ceremonial robes with layered red under-collars, long sheer white sleeves, a gold sun-disc crown with dangling gold ornaments, gold ribbon streamers, a gold jewelled sash. Legwear: white tabi socks. Footwear: tall black-lacquered okobo sandals with red thongs.',
      gesture: 'one hand raised out to the side at shoulder height holding a gold bell staff, the other hand open and extended gracefully at waist height'
    }
  },

  // ================= 深雪：柔和的米白/粉/薰衣草、温柔居家。招牌：侧编小辫、粉色花发夹、珍珠手链 =================
  miyuki: {
    summer: {
      outfit: 'Summer outing: a cream puff-sleeved midi dress with a delicate small pink rose print and a scalloped hem, a pearl bracelet, a woven straw clutch bag. Legwear: none, bare legs. Footwear: tan woven leather sandals with an ankle strap.',
      gesture: 'holding the straw clutch in front of her at waist height with both hands'
    },
    school: {
      outfit: 'Nostalgic sailor school uniform (from her own school days): a white short-sleeve sailor top with a navy collar and a navy scarf tie, a navy pleated skirt below the knee, a pearl bracelet. Legwear: white knee-high socks. Footwear: white canvas slip-on sneakers.',
      gesture: 'both hands lightly clasped behind her back, leaning forward very slightly with a shy smile'
    },
    sundress: {
      outfit: 'Seaside sundress: a long flowing ivory cotton sundress with thin straps, a lace trim at the hem, a thin pale green ribbon at the waist, a sea-glass bracelet, a straw sunhat held at her side. Legwear: none, bare legs. Footwear: white flat leather sandals.',
      gesture: 'one hand holding the straw sunhat at her side by its brim, the other tucking a strand of hair behind her ear, the hand well clear of the eyes'
    },
    gown: {
      outfit: 'Evening dress: a deep navy long-sleeved wrap dress with a high side slit, a thin silver belt, a single strand of pearls, small pearl earrings. Legwear: sheer nude stockings. Footwear: navy pointed-toe heels.',
      gesture: 'one hand resting lightly at her collarbone below the neck, the other hand at her side'
    },
    apron: {
      outfit: 'Home cooking outfit: a lavender knit sweater with sleeves pushed up, a pale pink frilled apron with a small heart pocket, a long lavender knit skirt, hair loosely tied back. Legwear: white crew socks. Footwear: soft pink room slippers.',
      gesture: 'holding a wooden spoon raised at shoulder height in one hand, the other holding a plate of cookies at waist height'
    },
    kimono: {
      outfit: 'Spring visiting kimono: a pale lavender houmongi kimono with a gradient to cream and white plum blossoms, a cream obi with a gold thread pattern, a pink plum blossom kanzashi. Hair stays silver-white. Legwear: white tabi socks. Footwear: cream-coloured zori.',
      gesture: 'holding a small folded handkerchief at chest height in front of her, below the chin, the other hand under it'
    }
  },

  // ================= 空：运动、深蓝/白/橙（篮球）、中性帅气。招牌：橙色篮球小挂件、运动手环 =================
  sora: {
    summer: {
      outfit: 'Sporty summer street outfit: a fitted white cropped T-shirt with a small orange basketball print (fitted enough to show her slim girlish figure and waist), high-waisted olive cargo shorts with a black belt, a black sports watch, an orange basketball keychain on her belt loop, a small orange star hair clip pinning one side of her bangs, a thin orange beaded bracelet. Legwear: white crew socks with an orange stripe. Footwear: white low-top canvas sneakers with orange laces and an orange rubber toe cap, plain, no logos',
      gesture: 'spinning a basketball on one raised fingertip at shoulder height, the other hand in her shorts pocket'
    },
    autumn: {
      outfit: 'Sporty autumn outfit: a fitted, slightly cropped navy cable-knit sweater that shows her slim girlish waist, a short olive cargo-style mini skirt with a black belt, a grey backpack with sports pin badges slung on one shoulder, small silver stud earrings, an orange hair clip in her bangs. Legwear: black opaque leggings under the skirt, with grey slouch socks. Footwear: brown lace-up leather ankle boots.',
      gesture: 'one hand holding the backpack strap at chest height, the other hand resting on her hip'
    },
    swim: {
      outfit: 'Sporty swimwear: a navy-and-orange sporty two-piece swimsuit (a racerback bikini top and boy-short bottoms) that clearly shows a slim, athletic girlish figure, an open white sleeveless hoodie, sunglasses pushed up on her head, an orange waterproof sports watch. Legwear: none, bare legs. Footwear: black slide sandals with an orange strap, plain, no logos.',
      gesture: 'one hand pushing the sunglasses up on her head (the hand above the head, not covering the face), the other holding a colourful straw beach tote at her side'
    },
    maid: {
      outfit: 'Maid cafe outfit (reluctantly worn): a black puff-sleeved maid dress with a short frilled skirt, a white apron, a white frilled headpiece, a small orange ribbon at the collar. Legwear: white thigh-high stockings. Footwear: black strap Mary-Jane shoes.',
      gesture: 'both hands making a heart shape in front of her chest, below the chin'
    },
    kimono: {
      outfit: 'Formal kimono: a dark navy furisode with gold cranes and red maple leaves, a black haori jacket with gold embroidery draped on her shoulders, a red and gold obi, a red-white flower kanzashi. Legwear: white tabi socks. Footwear: red-thonged zori.',
      gesture: 'holding an open folding fan with a pine pattern at chest height to one side, the other hand on the obi'
    },
    gown: {
      outfit: 'Evening gown: a sleek white satin off-shoulder gown with a high side slit, three-quarter sleeves, a small navy clutch bag, a thin silver anklet. Legwear: none, bare legs. Footwear: navy pointed heels.',
      gesture: 'one hand in a hidden side pocket of the gown, the other holding the navy clutch at her side, a cool stance'
    }
  },

  // ================= 奈绪：暖棕/奶油/粉、亲切的邻家感。招牌：右侧马尾、小记事本和铅笔、编织手链 =================
  nao: {
    knit: {
      outfit: 'Casual outfit: a cream cable-knit cardigan with wooden buttons over a pale pink T-shirt with small flowers, a dark denim pleated mini skirt, a brown woven bracelet, a small notebook with a pencil tucked in her cardigan pocket. Legwear: beige ribbed crew socks. Footwear: white canvas low-top sneakers.',
      gesture: 'one hand on her hip, the other playing with the end of her ponytail at shoulder height, the hand away from the face'
    },
    cat: {
      outfit: 'Casual outfit: a navy oversized sweater with a big cream cat face motif on the front, a pleated navy mini skirt, a brown woven bracelet. Legwear: beige crew socks. Footwear: white and black canvas sneakers.',
      gesture: 'holding a small spiral notepad and pencil at chest height as if taking a memo'
    },
    sleep: {
      outfit: 'Sleepwear: a pink long-sleeved button-up pyjama set with a pattern of small white cat faces, drawstring trousers, hair down loose with the ponytail untied. Legwear: none. Footwear: barefoot.',
      gesture: 'one hand scratching the side of her head above the ear sleepily, elbow out, the other holding a pillow at her side'
    },
    kimono: {
      outfit: 'Formal New Year furisode: a coral-orange furisode with green pines, gold cranes and cream plum blossoms, a navy and gold obi, a gold and coral kanzashi with dangling flowers in her ponytail. Legwear: white tabi socks. Footwear: black-lacquered zori with coral thongs.',
      gesture: 'one hand waving cheerfully at shoulder height, away from the face, the other at her obi'
    },
    swim: {
      outfit: 'Swimwear: a coral halter-neck one-piece with a cut-out back, wide cream culotte beach trousers with a tropical fish print, a straw beach bag. Legwear: none. Footwear: cream espadrilles.',
      gesture: 'holding a small notebook against her chest with both hands'
    },
    maid: {
      outfit: 'Classic cafe maid uniform with cat ears: a navy dress with a white collar and red ribbon, a white frilled apron, a white headpiece with small black cat ears. Legwear: black sheer tights. Footwear: brown leather loafers.',
      gesture: 'holding a cup of latte with latte art on a saucer at chest height'
    },
    gown: {
      outfit: 'Evening dress: a deep blue velvet dress with sheer long sleeves and a full long skirt with small sparkling star embroidery, a thin silver necklace. Legwear: hidden. Footwear: navy heeled pumps.',
      gesture: 'both hands clasped in front of her waist, a little nervous and elegant'
    },
    yukata: {
      outfit: 'Summer festival yukata: a red yukata with white goldfish and water ripple patterns, a yellow obi, a flower hair ornament in her ponytail. Legwear: none. Footwear: dark wood geta with red thongs.',
      gesture: 'holding a red candied apple on a stick at shoulder height to the side, the other hand waving at chest height'
    }
  },

  // ================= 真纪：粉/紫/黑、游戏玩家、潮。招牌：紫色猫耳耳机、彩虹星星发夹、小虎牙 =================
  maki: {
    cardigan: {
      outfit: 'School cardigan style: an oversized bright yellow knit cardigan with sleeves covering half her hands, over a white shirt with a navy bow, a navy pleated mini skirt. Legwear: black thigh-high socks. Footwear: pink-and-white sneakers.',
      gesture: 'both hands on her hips with the long cardigan sleeves, a cocky wide stance'
    },
    punk: {
      outfit: 'Gamer street outfit: an oversized black zip hoodie jacket covered in colourful retro game patches (pixel ghosts, stars, "1UP", a skull), a dark grey T-shirt, ripped denim shorts, the cat-ear gaming headphones glowing purple. Legwear: black thigh-high socks. Footwear: chunky pink-and-white high-top sneakers.',
      gesture: 'holding a pink game controller at chest height with both hands, leaning forward slightly'
    },
    kimono: {
      outfit: 'Formal kimono: a deep indigo furisode with pink and red cherry blossoms, a red-gold obi with a kokeshi doll charm, the cat-ear headphones around her neck. Legwear: white tabi socks. Footwear: red zori.',
      gesture: 'holding a small calligraphy brush at chest height in one hand, the other hand on her obi'
    },
    gown: {
      outfit: 'Evening dress: a white strapless corset ball gown with a long flowing skirt, a small rainbow star brooch, her pink hair in an elegant bun with a braid. Legwear: hidden. Footwear: silver strappy heels.',
      gesture: 'both hands on her hips, a cheeky confident pose even in a gown'
    },
    swim: {
      outfit: 'Swimwear: a white bikini with a pink star and pixel heart print, side-tie strings, a beaded friendship anklet, her pink hair in two buns. Legwear: none. Footwear: barefoot.',
      gesture: 'both hands on her hips, grinning'
    }
  }
};
