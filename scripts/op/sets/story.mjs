// ---------------------------------------------------------
// 第④⑤段剧情里的那一个镜头（每段一个，8 秒，OP 同款画风）
//   node scripts/op/gen-op.mjs keys|videos|data --set story [--only asuka4,...]
//
// id = data/eventCgs.ts 里 anim('<id>') 的 key；装成 cg_ev_<id>.webp / .webm。
// outfits：这一镜穿的那套衣服（给 Gemini 看立绘）；校服那几位不写，角色卡上就是校服。
// 画风和帧数锚点在 shots.mjs，gen-op 自动接在每条提示词后面。
// ---------------------------------------------------------
export const SHOTS = [
  { id: 'asuka4', chars: ['asuka'],
    image: 'A Japanese high school library at sunset, warm orange light through tall windows. Asuka in her navy school blazer sits at a table by the window holding up a foreign-language textbook covered in red-pen annotations, reading aloud with determined concentration and a faint blush, a red pen between her fingers. Shelves of books behind her, dust motes in the light.',
    motion: 'She reads aloud, glances up at the camera with an embarrassed frown, spins the red pen once between her fingers, then hides her blushing face behind the textbook.' },
  { id: 'asuka5', chars: ['asuka'],
    image: 'An empty classroom at sunset, desks in rows, orange light. Asuka in her navy school blazer stands at the open window, slipping a red class-president armband off her upper arm, the wind blowing her very long crimson twin tails out sideways, curtains billowing.',
    motion: 'She pulls the armband off and holds it in her hand, the wind lifts her twin tails and the curtain, she turns back toward the camera and breaks into a small relieved smile.' },
  { id: 'hikari4', chars: ['hikari'], outfits: { hikari: 'casual' },
    image: 'Kobe harbour at dusk, an iron railing by the sea, a passenger plane climbing low over the water from the airport island in the distance, orange and violet sky. Hikari in her casual clothes stands at the railing waving hard at the plane with her whole arm, her long golden side ponytail flying, tears shining on her cheeks while she smiles.',
    motion: 'She waves her arm in big strong arcs at the departing plane, her side ponytail whipping in the sea wind, she sniffs, wipes one eye with her wrist and keeps waving with a wobbly smile.' },
  { id: 'hikari5', chars: ['hikari'], outfits: { hikari: 'casual' },
    image: 'Inside a Ferris wheel gondola at night at the top of the ride, the glittering night view of Kobe harbour and the red Port Tower spread out below through the glass. Hikari in her casual clothes presses one palm flat against the window, looking down at the city lights, her face lit by the glow.',
    motion: 'She presses her palm to the glass, looks down at the lights, then turns her head back toward the camera and laughs softly, leaning a little closer.' },
  { id: 'rei4', chars: ['rei'], outfits: { rei: 'winter' },
    image: 'A school rooftop late on a clear winter night, a sky full of stars over the fence, several bright meteors streaking across the sky. Rei in her navy winter coat and white scarf lies on a mat looking straight up, a small silver tally counter in her hand, the meteors reflected as thin streaks of light in her thin red rectangular glasses.',
    motion: 'Meteors streak across the sky one after another; she clicks the tally counter, her eyes follow a streak, the light glints across her lenses, and her lips part slightly in quiet wonder.' },
  { id: 'rei5', chars: ['rei'],
    image: 'The salon of an old Western-style house in Kobe\'s former foreign settlement, afternoon sunlight through tall windows, dust floating in the beams, antique furniture. Rei in her navy school blazer sits in an old chair by the window with a stack of nineteen worn notebooks beside her, closing the last notebook on her lap.',
    motion: 'She closes the notebook slowly, rests both hands on its cover, looks out of the window as the dust drifts in the sunlight, and the corner of her mouth lifts in a very small smile.' },
  { id: 'sora4', chars: ['sora'],
    image: 'A school gymnasium during a basketball game, bright ceiling lights, the scoreboard blurred in the background, players in motion. Sora in a navy basketball jersey and shorts leaps for a jump shot just outside the three-point line, ball leaving her fingertips, her short messy dark brown hair flying, fierce focused expression.',
    motion: 'She rises into the jump shot, releases the ball at the top of her jump with a snap of the wrist, hangs in the air watching the ball fly toward the hoop, then lands.' },
  { id: 'sora5', chars: ['sora'], outfits: { sora: 'summer' },
    image: 'Suma beach in Kobe at sunset, golden light on the waves, the Akashi Kaikyo bridge faint on the horizon. Sora in light summer training clothes sprints along the wet sand at the edge of the surf, spray kicking up around her ankles, short messy dark brown hair blowing, a huge grin.',
    motion: 'She sprints through the shallow surf toward the camera, water splashing up in bursts, then skids to a stop, turns back and punches her fist up into the sunset sky.' },
  { id: 'miyuki4', chars: ['miyuki'], outfits: { miyuki: 'cardigan' },
    image: 'Inside an aquarium, a whole wall of tall cylindrical jellyfish tanks glowing blue in the dark, hundreds of translucent jellyfish drifting. Miyuki in her cream cardigan stands in front of the glass with one hand resting on it, her soft silver-white hair lit blue, gazing at the jellyfish with a peaceful face.',
    motion: 'The jellyfish pulse slowly, she rests her palm on the glass watching them, then turns her head back toward the camera and gives a gentle, happy smile.' },
  { id: 'miyuki5', chars: ['miyuki'], outfits: { miyuki: 'cardigan' },
    image: 'A small cosy Japanese apartment in the evening, a kotatsu table, warm lamplight. Miyuki wrapped in a fluffy blanket over her cardigan, cheeks flushed with a fever, holds a bowl of steaming rice porridge in both hands; a second identical bowl sits on the table in front of her.',
    motion: 'Steam rises from the bowl, she blows on the spoon, takes a small bite, and her tired eyes curve into a warm, slightly embarrassed smile as she looks up at the camera.' },
  { id: 'nao4', chars: ['nao'], outfits: { nao: 'knit' },
    image: 'The steep Kitano-zaka slope in Kobe in the early evening, old Western-style houses, a warm sunset glow down the hill toward the sea, a few leaves drifting. Nao in her knit cardigan runs up the slope hugging a notebook to her chest, her long wavy chestnut side ponytail swinging.',
    motion: 'She runs a few steps up the slope, stops, spins round to face the camera with the notebook clutched to her chest, blinks once, then laughs, her ponytail swinging.' },
  { id: 'nao5', chars: ['nao'], outfits: { nao: 'knit' },
    image: 'In front of a Japanese high school gate in the late afternoon, an old cherry tree with spreading branches, a few leaves drifting down. Nao in her knit cardigan stands under the tree holding a sealed white envelope up against the sky with both hands, squinting at it in the light.',
    motion: 'She lifts the envelope toward the sky as if trying to see through it, leaves drift past, she lowers it, hugs it to her chest and smiles at the camera.' },
  { id: 'maki4', chars: ['maki'], outfits: { maki: 'punk' },
    image: 'A cramped old video arcade in an Osaka back street, rows of retro cabinets glowing in the dark, pink and cyan neon. Maki in her punk outfit stands at a fighting-game cabinet with one hand on the joystick and the other on the buttons (she holds no objects, no tools), her purple cat-ear headphones glowing, the screen light on her face. Cabinet marquees and signs are plain glowing panels with no readable words.',
    motion: 'She slams the buttons in a rapid combo, the screen flashes, she throws her head back in triumph and glances over her shoulder at the camera with a fanged, cheeky grin.' },
  { id: 'maki5', chars: ['maki'], outfits: { maki: 'punk' },
    image: 'A rhythm-game tournament on a small stage in a game arcade at night, coloured spotlights, a crowd in silhouette. Maki in her punk outfit plays a large rhythm-game cabinet, both hands blurring over the glowing buttons, sweat on her brow, purple cat-ear headphones round her neck, fierce concentration.',
    motion: 'Her hands strike the glowing buttons faster and faster, the lights pulse with the beat, she hits the final note, freezes in a pose with one arm raised, and lets out a breath.' },
  { id: 'inari4', chars: ['inari'], outfits: { inari: 'casual' },
    image: 'Inside a small white ropeway gondola descending the mountain above Kobe at sunset, the whole city and the golden sea spread out below through the windows. Inari in her casual clothes presses her face and hands against the glass, eyes wide, her nine fluffy golden fox tails puffed out and filling half the cabin.',
    motion: 'The gondola sways, her tails puff up even bigger, she gasps and presses closer to the glass, then her amazement melts into a soft, delighted laugh as she looks down at the city.' },
  { id: 'inari5', chars: ['inari'], outfits: { inari: 'knit' },
    image: 'The sacred forest behind Ikuta Shrine at dawn, morning mist between tall trees, wet stone paving, a vermilion torii faintly visible. Inari in her knit sweater kneels under a great tree with an old hand-bound ledger open on her knees, carefully tracing a name with a pencil; two small blue-white fox-fire wisps float beside her.',
    motion: 'She traces the characters stroke by stroke with the pencil, the fox-fire wisps drift and flicker, a leaf falls onto the page, she brushes it aside and looks up at the camera with a quiet smile.' }
];
