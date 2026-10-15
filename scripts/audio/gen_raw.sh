# Lyria 素材：真乐器的独奏，音与音之间留空，方便切出干净的单音
#   bash scripts/audio/gen_raw.sh     （需要先 source env.sh 和 key）
N=/c/Users/adm/node-portable/node-v24.19.0-win-x64/node
L=scripts/audio/lyria.mjs
SPARSE="slow tempo, sparse single notes with long silences between them, each note ringing out clearly and decaying naturally, no chords, no accompaniment, solo instrument only, studio recording, close mic, very little reverb, C major pentatonic"
$N $L --id celesta --seed 11 --prompt "Solo celesta, high register, $SPARSE, gentle and magical" &
$N $L --id musicbox --seed 12 --prompt "Solo antique music box, $SPARSE, delicate and nostalgic" &
$N $L --id harp --seed 13 --prompt "Solo concert harp, plucked single notes in the middle and high register, $SPARSE, warm and soft" &
wait
$N $L --id harpgliss --seed 14 --prompt "Solo concert harp playing short glissandos only: quick sweeping upward glissandos and downward glissandos, each one separated by two seconds of silence, C major, studio recording, close mic, no other instruments, no melody, no chords" &
$N $L --id glock --seed 15 --prompt "Solo glockenspiel, $SPARSE, bright and sparkling, soft mallets" &
$N $L --id marimba --seed 16 --prompt "Solo marimba with soft yarn mallets, short single notes, $SPARSE, round and wooden" &
wait
$N $L --id kalimba --seed 17 --prompt "Solo kalimba thumb piano, $SPARSE, soft and cute" &
$N $L --id chimes --seed 18 --prompt "Solo bell tree and mark tree chimes: short shimmering sweeps, each sweep separated by two seconds of silence, magical sparkle, studio recording, close mic, no other instruments" &
$N $L --id felt --seed 19 --prompt "Solo felt piano (soft muted piano), high register, $SPARSE, intimate and warm, the soft sound of felt on the hammers" &
wait
$N $L --id vibes --seed 20 --prompt "Solo vibraphone with motor off, soft mallets, $SPARSE, warm and airy" &
wait
