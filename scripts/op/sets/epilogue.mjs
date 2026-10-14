// ---------------------------------------------------------
// 后日谈的一分钟：每人 8 个镜头 × 8 秒（Veo 单次最长 8 秒）
//   node scripts/op/gen-op.mjs keys|videos|data --set epilogue [--only asuka,...]   (--only 可以写人名，整组都跑)
//
// 前 6 镜：一年后的日子（蒙太奇）。第 7 镜：她察觉到镜头。第 8 镜：她正对着镜头——第四面墙。
// 字幕（她对屏幕前的你说的话）在 story/epilogue.ts，叠在第 7、8 镜上。
// 主角只露手、背影或剪影，不露脸（玩家就是镜头）。
// ---------------------------------------------------------
export const MUSIC = {
  asuka: '/audio/bgm/The_Unfinished_Page.mp3',
  hikari: '/audio/bgm/The_Pier_at_Daybreak.mp3',
  rei: '/audio/bgm/Silver_Rails_at_Midnight.mp3',
  sora: '/audio/bgm/Beyond_the_Buzzer.mp3',
  miyuki: '/audio/bgm/Before_the_Porch_Lights_Go_Out.mp3',
  nao: '/audio/bgm/Plum_Blossom_and_Pavement.mp3',
  maki: '/audio/bgm/Arcade_High_Score.mp3',
  inari: '/audio/bgm/Rain_at_the_Stone_Fox.mp3'
};

// 第 7、8 镜的共同要求：她看向镜头 = 看向屏幕外的玩家
const NOTICE = 'She suddenly stops, turns her head and looks straight into the camera lens, as if she has just noticed someone watching from outside the screen.';
const FACE = 'Close-up, she faces the camera directly and speaks to the viewer through the screen, eye contact with the lens, breaking the fourth wall.';

const g = (group, rows) => rows.map(([image, motion, outfit], i) => ({
  id: `ep_${group}_${i + 1}`, group, chars: [group], ...(outfit ? { outfits: { [group]: outfit } } : {}), image, motion
}));

export const SHOTS = [
  ...g('asuka', [
    ['A Japanese high school gate in spring, cherry blossoms in full bloom, new students arriving. Asuka in her navy school blazer walks through the gate with no armband on her arm, her very long crimson twin tails swaying, a relaxed confident face.', 'She walks through the gate, petals swirling, glances at her bare upper arm where the armband used to be, and smiles to herself.'],
    ['A library table by a window in warm afternoon light: two notebooks lie open covered in red-pen corrections, two red pens side by side. Asuka in her school blazer sits on one side correcting a notebook with a red pen; only a hand holding the other red pen is visible at the edge of the frame.', 'She circles a mistake with her red pen, frowns, then laughs as the other hand at the edge of the frame circles something in her notebook too.'],
    ['A girl\'s bedroom at night, a desk lamp, a clock showing two o\'clock. Asuka in pyjamas sits at her desk holding up her phone for a video call, a foreign-language notebook open in front of her, sleepy but smiling.', 'She stifles a yawn, holds the notebook up to the phone camera to show her work, and grins proudly.', 'sleep'],
    ['A school corridor with exam results posted on a noticeboard, students crowding. Asuka in her school blazer looks at the list where her name is in second place. Every name on the list is an unreadable scribbled mark: no letters, no words, no real names.', 'She finds her name in second place, raises her eyebrows, then shrugs and smiles easily before walking away.'],
    ['The Kitano-zaka slope in Kobe in the early evening, old Western-style houses. Asuka in her school blazer walks down the slope eating a crêpe, a little cream on the tip of her nose.', 'She takes a big bite of the crêpe, notices the cream on her nose, goes red and laughs.'],
    ['An empty classroom at sunset, orange light across the desks. Asuka in her school blazer sits on a desk swinging her legs, looking out of the window at the sea.', 'She swings her legs, hums, and the wind through the window lifts her twin tails.'],
    ['The same sunset classroom. Asuka in her school blazer, packing her bag at her desk.', `${NOTICE} She frowns suspiciously at the lens, hands on hips.`],
    ['Close-up of Asuka in her navy school blazer in the sunset classroom, holding a red pen and pointing it straight at the camera, cheeks flushed, a scolding but fond expression.', `${FACE} She jabs the red pen toward the lens, scolds, then her expression softens into an embarrassed smile.`]
  ]),
  ...g('hikari', [
    ['An airport departure gate in March, large windows with planes outside. Hikari in her casual clothes, a suitcase beside her, turns back toward the camera at the gate.', 'She turns back, opens her mouth to call out, hesitates, then puts her hand on her heart and smiles instead of waving.', 'casual'],
    ['A small bedroom in another country, a desk covered in study books for a teaching certificate, a corkboard pinned with photos of Kobe harbour. Hikari studies at the desk late at night.', 'She writes notes, stretches her arms, looks up at the photos of Kobe on the board and smiles.', 'casual'],
    ['A phone screen held in someone\'s hand showing a video call: Hikari on the screen laughing and waving, golden side ponytail bouncing.', 'On the phone screen she laughs, waves, and holds up a certificate letter to show off.', 'casual'],
    ['The arrivals hall of Kobe Airport in summer, automatic doors opening. Hikari in her casual clothes bursts through dragging a suitcase, running.', 'She runs out through the opening doors, suitcase rattling behind her, a huge grin on her face.', 'casual'],
    ['Kobe harbour at sunset, the iron railing, the red Port Tower. From behind: Hikari in her casual clothes and the silhouette of another person stand side by side at the railing.', 'The sea wind blows, she leans her shoulder against the silhouette beside her, her ponytail flutters.', 'casual'],
    ['The Mosaic Ferris wheel lit up at night over Kobe harbour, a gondola at the top. Hikari in her casual clothes inside the gondola, palm on the window.', 'The wheel turns, the lights change colour, she presses her palm to the glass and laughs.', 'casual'],
    ['Kobe harbour railing at dusk. Hikari in her casual clothes leans on the railing looking at the sea.', `${NOTICE} Her eyes go wide with surprise.`, 'casual'],
    ['Close-up of Hikari in her casual clothes at the harbour at dusk, the sea behind her, the wind in her golden side ponytail.', `${FACE} She raises her hand halfway as if to wave, stops and waits with a hopeful smile, then finally waves gently.`, 'casual']
  ]),
  ...g('rei', [
    ['A quiet city archive reading room, wooden shelves. On a shelf, a row of nineteen worn handwritten notebooks with a small catalogue label. Rei in her navy school blazer stands looking at them.', 'She reaches out and touches the spines of the notebooks one by one, then lowers her hand with a calm, satisfied expression.'],
    ['A school rooftop at night under a sky full of stars, a telescope on a tripod. Rei in her navy winter coat and white scarf writes in a logbook by the light of a small red torch.', 'She looks through the telescope, writes a line in the logbook, looks up again; a meteor crosses the sky.', 'winter'],
    ['The exterior of an old Western-style house in Kobe\'s former settlement in gentle rain. Rei in her navy school blazer holds an umbrella, looking up at the building.', 'Rain drips from the umbrella, she looks up at the old brick facade and nods slightly, as if greeting it.'],
    ['Inside a small planetarium dome, stars projected overhead, a row of children looking up. Rei in her navy school blazer stands at the front pointing up at a constellation, explaining.', 'She traces a constellation with her pointer, the children gasp, and she gives a small, shy smile.'],
    ['The Kikuseidai lookout on Mount Rokko at night, the vast glittering night view of Kobe below. From behind: Rei in her navy winter coat and the silhouette of another person sit side by side, a logbook between them.', 'City lights twinkle, she turns the logbook so the person beside her can see it, and leans in close.', 'winter'],
    ['A desk lamp in a dark room, a logbook open to its last page. Rei in her navy school blazer writes slowly and carefully.', 'Her pen moves in small neat strokes, she pauses, reads what she wrote, and touches the page.'],
    ['A school rooftop at night under the stars. Rei in her navy winter coat writes in a logbook.', `${NOTICE} She pushes her thin red glasses up and the lenses glint.`, 'winter'],
    ['Close-up of Rei in her navy winter coat and white scarf on the rooftop at night, stars behind her, holding an open logbook toward the camera.', `${FACE} She holds out the logbook and a pen toward the lens, as if asking for a signature, with a calm faint smile.`, 'winter']
  ]),
  ...g('sora', [
    ['A large gymnasium during a prefectural basketball tournament, crowded stands. Sora in a plain navy basketball jersey with only the number 7 on it (no team name, no letters) stands on court, spinning a ball on one finger before tip-off.', 'She spins the ball on her finger, grins at her teammates and claps her hands together.'],
    ['Inside a train in the morning. Sora in her navy school blazer sits holding English vocabulary flashcards, lips moving as she memorises.', 'She flips the flashcards, mouths the words, gets one wrong, scrunches her face, and tries again.'],
    ['A basketball backboard with a strip of tape marked on it in a gym. Sora in a navy basketball jersey leaps and slaps the board high above the tape.', 'She jumps, her hand slaps the board clearly above the tape mark, she lands and pumps her fist.'],
    ['A tense moment in a basketball game, bright lights. Sora in a navy basketball jersey drives hard to the basket past a defender.', 'She cuts past the defender, rises for a lay-up and the ball rolls in, the crowd explodes.'],
    ['A gymnasium exit after a game. Sora in a plain navy basketball jersey with only the number 7 on it (no team name, no letters), sweaty and beaming, runs toward the camera.', 'She runs toward the camera, slows, and stops right in front of it, grinning and out of breath.'],
    ['The school rooftop at sunset, the city and sea glowing orange. Sora in her navy school blazer sits on the edge of a bench with a basketball under her arm.', 'She tosses the ball up and catches it, looking out at the sunset, content.'],
    ['An empty gymnasium after a game. Sora in a navy basketball jersey walks off the court spinning a ball on one finger.', `${NOTICE} She squints toward the very back, past the stands.`],
    ['Close-up of Sora in a navy basketball jersey in the gym, holding a basketball out toward the camera with one hand.', `${FACE} She points at the lens with her free hand, grins wide, and holds the ball out as if passing it to the viewer.`]
  ]),
  ...g('miyuki', [
    ['A small old apartment building on a hillside in Kobe in the evening, warm lights in the windows, the harbour below.', 'The windows glow one by one, a breeze moves the balcony plants.'],
    ['A small apartment balcony with planters of lush basil and purple lavender, evening light, the sea beyond. Miyuki in her cream cardigan waters the plants.', 'She waters the herbs, picks a basil leaf, smells it and smiles.', 'cardigan'],
    ['A cosy small kitchen in the evening, a big pot simmering. Miyuki in her cream cardigan stands beside the stove watching; only the hands of another person stirring the pot are visible.', 'The other hands stir the pot, she leans in, tastes from a spoon, and nods happily.', 'cardigan'],
    ['Close-up on a key ring with a blue jellyfish charm and a pink jellyfish charm hanging side by side from a door key, the door of room 202 behind.', 'The jellyfish charms swing gently and catch the light.'],
    ['Inside an aquarium, a wall of glowing blue jellyfish tanks. Miyuki in her cream cardigan stands in front of the glass looking up at the jellyfish.', 'She tilts her head to follow a drifting jellyfish, then glances back toward the camera with a soft smile.', 'cardigan'],
    ['A kotatsu table in the evening with two bowls of food steaming, chopsticks for two. Miyuki in her cream cardigan sits at the table with her hands together.', 'Steam rises from both bowls, she brings her hands together and says itadakimasu with a gentle smile.', 'cardigan'],
    ['A small kitchen sink in the evening. Miyuki in her cream cardigan washes two bowls.', `${NOTICE} She turns off the tap and tilts her head curiously.`, 'cardigan'],
    ['Close-up of Miyuki in her cream cardigan in her warm kitchen, holding a bowl of food out toward the camera with both hands.', `${FACE} She offers the bowl toward the lens with a warm, motherly, slightly shy smile.`, 'cardigan']
  ]),
  ...g('nao', [
    ['A bookshelf in a girl\'s room, a row of nine notebooks of the same kind, and on the top shelf an older faded notebook by itself.', 'The light shifts across the spines, a hand slides a new notebook in at the end of the row.'],
    ['The Kitano-zaka slope in Kobe on a bright afternoon. Nao in her knit cardigan walks half a step ahead of someone whose shoulder is just visible at the frame edge.', 'She walks ahead, turns to say something over her shoulder, and laughs.', 'knit'],
    ['A café table by a window, a notebook open, a cup of coffee. Nao in her knit cardigan writes in the notebook, concentrating.', 'She writes, pauses to think, taps the pen on her lip, then writes again and smiles.', 'knit'],
    ['A Japanese high school gate in the afternoon, an old cherry tree. Nao in her knit cardigan stands under the tree touching its trunk.', 'She lays her palm on the bark, looks up into the branches, and smiles as if remembering a promise.', 'knit'],
    ['A crowded street in Sannomiya at dusk. Nao in her knit cardigan walks holding a notebook to her chest, weaving through people. Shop signs show only abstract shapes and colours: no real brand logos, no convenience-store logos, no readable text.', 'She weaves through the crowd, looks back over her shoulder to make sure someone is following, and waves them on.', 'knit'],
    ['A park bench at sunset. Nao in her knit cardigan reads a page in her notebook, a soft smile.', 'She turns a page, reads, covers her smile with the notebook.', 'knit'],
    ['The Kitano-zaka slope at dusk. Nao in her knit cardigan stops walking, notebook in hand.', `${NOTICE} She blinks once in surprise.`, 'knit'],
    ['Close-up of Nao in her knit cardigan on the slope at dusk, holding her open notebook up toward the camera with a pen in her other hand.', `${FACE} She shows the page to the lens, then starts writing something new while glancing up at the viewer with a warm grin.`, 'knit']
  ]),
  ...g('maki', [
    ['A game arcade in Sannomiya at night, a shelf with a small silver runner-up trophy. Maki in her punk outfit polishes the trophy with her sleeve.', 'She breathes on the trophy, polishes it, and grins at her reflection in it.', 'punk'],
    ['An old arcade in Osaka, a cabinet showing a high score table with a name entry. Maki in her punk outfit points at the screen proudly.', 'She points at the score table, turns to the camera with a fanged grin and gives a peace sign.', 'punk'],
    ['A rhythm-game tournament stage with spotlights. Maki in her punk outfit hands her purple cat-ear headphones toward someone off-screen; only a hand reaching to take them is visible.', 'She holds out the headphones, the other hand takes them, she gives a determined nod.', 'punk'],
    ['A rhythm-game cabinet under stage lights, notes pouring down the screen. Maki in her punk outfit plays furiously, hands a blur.', 'Her hands hammer the buttons in a frenzy, she hits the last note and throws both arms up in victory.', 'punk'],
    ['After a tournament, a crowded arcade. Maki in her punk outfit jumps off the stage and runs toward the camera, arms open.', 'She leaps down and runs straight at the camera, shouting happily, cheeks red.', 'punk'],
    ['A late-night train carriage, city lights passing outside. Maki in her punk outfit sleeps leaning on the shoulder of someone whose arm is just visible.', 'The carriage sways, she shifts in her sleep, snuggles closer and smiles.', 'punk'],
    ['An arcade cabinet name-entry screen glowing in the dark. Maki in her punk outfit enters letters with the joystick.', `${NOTICE} She stares past her own reflection in the screen.`, 'punk'],
    ['Close-up of Maki in her punk outfit in the neon-lit arcade, purple cat-ear headphones on, pointing straight at the camera. The cabinets behind her have plain glowing marquees: no logos, no game titles, no readable words.', `${FACE} She points at the lens with a cheeky fanged grin, then lowers her hand and gives a rare, honest, gentle smile.`, 'punk']
  ]),
  ...g('inari', [
    ['Ikuta Shrine in Kobe in spring, a vermilion torii and lanterns. Inari in her knit sweater stands under the torii with an old hand-bound ledger tucked under her arm, nine golden fox tails swaying.', 'She looks up at the torii, the wind moves her tails, petals drift past.', 'knit'],
    ['Inside a white ropeway gondola above Kobe, the city below. Inari in her casual clothes sits by the window, much calmer than before, tails relaxed.', 'She looks down at the city with a knowing smile, points at something far below and laughs.', 'casual'],
    ['The busy Sannomiya scramble crossing in Kobe. Inari in her casual clothes stands in the middle of the crowd, her fox ears and tails visible but no one noticing.', 'People stream around her, she turns slowly in the middle of the crossing, taking in the human bustle with delight.', 'casual'],
    ['Close-up of Inari’s hands holding an old hand-bound ledger open on her knees; her thumb rests over the top of the page, covering where the names are written, so no writing is visible except rows of small tally marks counting days. Soft morning light, her knit sleeves, the tips of fox tails at the edge of the frame. Absolutely no letters, words or readable characters anywhere.', 'Her thumb strokes the page gently, then taps the tally marks one by one as if counting.'],
    ['A small café by a window. Inari in her casual clothes counts on her fingers with great seriousness, a cup of tea in front of her.', 'She counts on her fingers, loses track, frowns, starts again, and laughs at herself.', 'casual'],
    ['Ikuta Shrine at dawn with the first snow falling, the stone path white. Inari in her knit sweater kneels under a great tree with the ledger open on her knees.', 'Snowflakes fall onto the ledger, she brushes them away and traces a name.', 'knit'],
    ['The snowy shrine grove at dawn. Inari in her knit sweater kneels with the ledger.', `${NOTICE} Her fox ears prick up and swivel toward the lens.`, 'knit'],
    ['Close-up of Inari in her knit sweater in the snowy shrine grove at dawn, fox-fire wisps floating, holding out a pencil toward the camera.', `${FACE} She holds the pencil out toward the lens with a gentle, knowing, ancient smile, her ears flicking.`, 'knit']
  ])
];
