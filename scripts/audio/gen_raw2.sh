# 第二批 Lyria 素材：第一批里钢片琴、钟琴、颤音琴、马林巴干净的单音太少，八音盒音域偏低
N=/c/Users/adm/node-portable/node-v24.19.0-win-x64/node
L=scripts/audio/lyria.mjs
VERY="very slow, exactly one single note every two seconds, complete silence between notes, each note decays fully before the next, no chords, no melody runs, no accompaniment, solo instrument only, studio recording, close mic, dry, C major pentatonic"
$N $L --id celesta2 --seed 31 --prompt "Solo celesta, high register, $VERY" &
$N $L --id celesta3 --seed 32 --prompt "Solo celesta, upper middle register, $VERY" &
$N $L --id glock2 --seed 33 --prompt "Solo glockenspiel, high register, soft mallets, $VERY" &
wait
$N $L --id glock3 --seed 34 --prompt "Solo glockenspiel, very high bright register, $VERY" &
$N $L --id vibes2 --seed 35 --prompt "Solo vibraphone, motor off, soft mallets, middle and high register, $VERY" &
$N $L --id vibes3 --seed 36 --prompt "Solo vibraphone, motor off, yarn mallets, high register, $VERY" &
wait
$N $L --id marimba2 --seed 37 --prompt "Solo marimba, soft yarn mallets, middle and high register, short notes, $VERY" &
$N $L --id marimba3 --seed 38 --prompt "Solo marimba, rubber mallets, high register, short bright notes, $VERY" &
$N $L --id musicbox2 --seed 39 --prompt "Solo tiny music box comb, very high register, $VERY, delicate sparkling plinks" &
wait
