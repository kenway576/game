// 立绘重制项目共用的画风描述。gen-base-sprite / refine-sprite 都从这里取，
// 保证八个角色、每一步用的是同一份文字。
//
// 画风目标（用户定的）：人物干净、不加任何特效；精美体现在线条细密、细节丰富、上色细腻。
// 参考是用户给的几张白底精细线稿风人物图。只用文字描述风格特征，不把参考图喂进去。
// ⚠️ 不要往这里加 sparkle / glow / bloom / particles——用户明确否定过。
export const STYLE = `ART STYLE (this matters most):
A refined, highly detailed modern Japanese anime character illustration, the quality of a professional illustrator's finished character art.
Lineart: dense, fine and crisp. Many thin, confident lines with subtle variation in weight. Hair is drawn as many flowing locks, each with several fine inner strand lines, plus a few delicate loose strands. Fabric folds, seams, cuffs, collar edges and pleats are all drawn with clean detailed lines. Lines are dark and colour-aware (deep warm brown on skin, deep crimson on red hair, near-black navy on navy cloth), never thick or blobby.
Colouring: delicate and clean. Soft cel shading with clear shadow shapes, gently blended with subtle gradients inside them; one soft secondary shadow tone for depth; restrained, small, sharp highlights on hair and eyes. Natural, elegant, harmonious colours, rich but not neon and not oversaturated.
Eyes: detailed and expressive: defined upper lash line with fine individual lashes, a subtle eyeliner flick, an iris with a few layered tones, a darker pupil, one or two small clean highlights. Soft blush on the cheeks.
Hair: glossy but natural, a clean highlight band, a slight colour variation between locks.
Costume and accessories: intricate and precise: piping and trim, visible stitching, buttons with small metallic highlights, a finely drawn embroidered crest, crisp pleats, neat bow with folds and ribbon tails. Add tasteful small details that fit the outfit's design without changing it.
Clean, sharp, polished finish. NOT 3D, NOT photorealistic, NOT chibi, NOT sketchy, NOT blurry or airbrushed-smooth.
The character is completely clean: NO sparkles, NO glitter, NO glow, NO bloom, NO light particles, NO lens flare, NO coloured light effects, NO motion lines.`;

export const BACKGROUND = `BACKGROUND: a plain, flat, light neutral grey (#E6E6E6) studio backdrop, evenly lit, no gradient, no floor line, no cast shadow, no props, no text, no effects. The background must not tint the character in any way.`;
