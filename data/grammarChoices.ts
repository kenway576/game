// 自动生成：node scripts/grammar/gen-variants.mjs（或 write-variants.mjs）—— 别手改（要改就改 .generated/grammar/variants.json 再重写）
// 剧情选项的日语原句 → 两个说错的版本 + 错在哪。用法见 components/StoryScreen.tsx 的「日语作答」。
// 没收进来的句子照旧直接显示日语原句（不走作答）。
export interface GrammarVariant { minor: string; minorZh: string; minorEn: string; major: string; majorZh: string; majorEn: string }
export const GRAMMAR_VARIANTS: Record<string, GrammarVariant> = {
 "丼が三つ。……何の修行？": {
  "minor": "丼が三枚。……何の修行？",
  "minorZh": "碗的量词错了，应为「つ」，而不是用于扁平物体的「枚」。",
  "minorEn": "Wrong counter for bowls; should be つ, not 枚 (which is for flat things).",
  "major": "丼を三つ食べる。……何の修行？",
  "majorZh": "意思变成了“吃三碗”，而不是“有三碗”。",
  "majorEn": "This means \"(I) eat three bowls,\" not \"There are three bowls.\""
 },
 "一杯ください。麺、大盛りで。": {
  "minor": "一杯ください。麺、大盛りに。",
  "minorZh": "点餐时用「で」表示规格更自然；「に」暗示一个变化结果，听起来有点奇怪。",
  "minorEn": "で, indicating condition, is more natural for ordering; に suggests a change of state and sounds slightly off.",
  "major": "一杯あげます。麺、大盛りで。",
  "majorZh": "意思反了，变成了“我给你一碗”，而不是“请给我一碗”。",
  "majorEn": "The meaning is reversed; it means \"I will give you a bowl,\" not \"Please give me one.\""
 },
 "そのページ、四十分見てる。": {
  "minor": "そのページに、四十分見てる。",
  "minorZh": "看的目标是宾语，应该用助词「を」，而不是「に」。",
  "minorEn": "The object of the verb \"to see\" should take the particle を, not に.",
  "major": "そのページ、四十分見た。",
  "majorZh": "变成了过去式，意为“（你）看了四十分钟（然后不看了）”，而不是“（你）已经看了四十分钟了（还在看）”。",
  "majorEn": "This is past tense, meaning \"(you) looked for 40 minutes (and stopped),\" not \"(you) have been looking for 40 minutes.\""
 },
 "人間を観察してるんでしょ。前にも聞いたけど。": {
  "minor": "人間が観察してるんでしょ。前にも聞いたけど。",
  "minorZh": "主语和宾语反了，这句话的意思是“是人类在观察”。",
  "minorEn": "The subject and object are reversed; this means \"Humans are the ones observing.\"",
  "major": "人間を観察させてるんでしょ。前にも聞いたけど。",
  "majorZh": "变成了使役态，意思是“你在让（别人）观察人类吧”。",
  "majorEn": "This is the causative form, meaning \"You are making/letting (someone) observe humans.\""
 },
 "自分の記録を追ってるんだ。": {
  "minor": "自分の記録が追ってるんだ。",
  "minorZh": "主语和宾语反了，这句话的意思是“是自己的记录在追”。",
  "minorEn": "The subject and object are reversed; this means \"My own record is the one doing the chasing.\"",
  "major": "自分の記録に追われてるんだ。",
  "majorZh": "变成了被动语态，意思是“我被自己的记录追赶”，表达一种压力感，而不是主动挑战。",
  "majorEn": "This is the passive voice, meaning \"I'm being chased by my own record,\" implying pressure rather than an active challenge."
 },
 "一回やる。教えて。": {
  "minor": "一回します。教えて。",
  "minorZh": "敬体（します）和简体（教えて）混用，听起来不自然。",
  "minorEn": "Mixes polite form (shimasu) and plain form (oshiete), which sounds unnatural.",
  "major": "一回やる。教える。",
  "majorZh": "意思反了，后半句变成了“我来教你”，而不是“你教我”。",
  "majorEn": "The second part's meaning is reversed; it says \"I will teach you,\" not \"Teach me.\""
 },
 "MAKI。……そのつづり、自分で選んだでしょ。": {
  "minor": "MAKI。……そのつづり、自分に選んだでしょ。",
  "minorZh": "表示“亲自”或“靠自己”时，应该用助词「で」而不是「に」。",
  "minorEn": "The particle for indicating agency \"by oneself\" should be で, not に.",
  "major": "MAKI。……そのつづり、自分で選ばされたでしょ。",
  "majorZh": "变成了使役被动态，意思是“你是被迫选的这个拼法吧”，与主动选择的意思相反。",
  "majorEn": "This is the causative-passive form, meaning \"You were forced to choose that spelling,\" the opposite of choosing it yourself."
 },
 "どうして、いつもここに来るの。": {
  "minor": "どうして、いつもここで来るの。",
  "minorZh": "表示移动目的地的“这里”应该用「に」，而不是表示动作发生地的「で」。",
  "minorEn": "The destination particle should be に for the verb 来る (to come), not で, which indicates the location of an action.",
  "major": "どうして、いつもここから来るの。",
  "majorZh": "意思变了，成了“你为什么总是从这里来？",
  "majorEn": "The meaning is changed to \"Why do you always come from here?\""
 },
 "待って。……採点の基準を先に決めよう。": {
  "minor": "待って。……採点の基準を先に決める。",
  "minorZh": "这里应该用表示提议的意志形「決めよう」，而不是陈述性的「決める」。",
  "minorEn": "Should use the volitional form `決めよう` (\"let's decide\") for a suggestion, not the declarative `決める` (\"will decide\").",
  "major": "待って。……採点の基準を先に守ろう。",
  "majorZh": "动词用错了，「守ろう」的意思是“遵守”，但标准还没定，所以不合逻辑。",
  "majorEn": "Wrong verb; `守ろう` means \"let's follow/abide by,\" which is illogical if the criteria have not yet been decided."
 },
 "なんで、入ったことないって分かるの。": {
  "minor": "なんで、入らないって分かるの。",
  "minorZh": "时态错了，「入らない」表示“不进去”，而“没进去过”的经历应该用「入ったことがない」。",
  "minorEn": "Wrong tense; `入らない` means \"don't/won't enter,\" while lack of experience \"have never entered\" is `入ったことがない`.",
  "major": "なんで、入ったことあるって分かるの。",
  "majorZh": "意思完全相反，变成了“你怎么知道我进去过”。",
  "majorEn": "The meaning is the opposite; it asks \"How do you know that I have been in?\""
 },
 "連れてって。": {
  "minor": "連れてきて。",
  "minorZh": "动词方向错了，「連れてきて」是“带过来”，而「連れてって」是“带过去”。",
  "minorEn": "Wrong verb direction; `連れてきて` means \"bring (someone) here,\" while `連れてって` means \"take (someone) there.\"",
  "major": "連れてく。",
  "majorZh": "这不是请求，而是陈述「連れていく」（我带你去），改变了说话者的角色。",
  "majorEn": "This is a statement of intent `連れていく` (\"I'll take you\"), not a request."
 },
 "それ、何の本ですか。": {
  "minor": "それ、何の本のですか。",
  "minorZh": "「本」后面的「の」是多余的，不符合语法。",
  "minorEn": "The `の` after `本` is redundant and grammatically incorrect.",
  "major": "それ、誰の本ですか。",
  "majorZh": "疑问词用错了，「誰」是问“谁的”，而不是“什么”。",
  "majorEn": "Wrong question word; `誰` (whose) is used instead of `何` (what)."
 },
 "あの人が飲んでるの、何ですか。": {
  "minor": "あの人が飲んだの、何ですか。",
  "minorZh": "时态错了，变成了“那个人喝过了的（东西）是什么？”，而不是“正在喝的”。",
  "minorEn": "Wrong tense; this asks about what the person \"drank\" (past), not what they \"are drinking\" (present continuous).",
  "major": "あの人が飲んでる、何ですか。",
  "majorZh": "句子结构不完整，动词「飲んでる」后面需要名词化的「の」才能构成一个名词短语。",
  "majorEn": "The sentence structure is broken; it's missing the nominalizer `の` after `飲んでる` to make the clause a noun."
 },
 "最近？　……1868 年ですけど。": {
  "minor": "最近？　……1868 年です。",
  "minorZh": "省略了「けど」会使语气过于强硬和直接，在表达带有轻微反驳的语境下不那么自然。",
  "minorEn": "Omitting `けど` makes the tone more blunt and less natural for expressing a soft contradiction.",
  "major": "最近？　……1868 年になりますけど。",
  "majorZh": "动词用错，「になります」表示“将会变成”，用来描述一个过去的年份是错误的。",
  "majorEn": "Wrong verb; `になります` (\"it becomes\") makes no sense when stating a past year."
 },
 "そんなに長く生きて、飽きませんか。": {
  "minor": "そんなに長く生きて、飽きないですか。",
  "minorZh": "「〜ないですか」在这里不如「〜ませんか」自然，「〜ませんか」是更客气、更常见的提问方式。",
  "minorEn": "`〜ないですか` is slightly less natural here; `〜ませんか` is a more polite and common way to ask this type of negative question.",
  "major": "そんなに長く生きて、飽きさせませんか。",
  "majorZh": "变成了使役态，意思是“你不会让（别人）感到厌烦吗？”，而不是问自己是否厌烦。",
  "majorEn": "This is the causative form, asking \"Don't you make (others) bored?\" instead of asking if the person themself gets bored."
 },
 "前は、いつ？": {
  "minor": "前は、何？",
  "minorZh": "疑问词用错了，「何」是“什么”，问时间应该用「いつ」。",
  "minorEn": "Wrong question word; `何` means \"what,\" but the question is about time, which requires `いつ` (when).",
  "major": "後は、いつ？",
  "majorZh": "词用错了，「後」是“之后”，把问题变成了“下一次是什么时候？”，意思相反。",
  "majorEn": "Wrong word; `後` (ato) means \"next/after,\" changing the question to \"When is the next time?\" which is the opposite."
 },
 "その人……地図を描いてませんでしたか。": {
  "minor": "その人……地図を描きませんでしたか。",
  "minorZh": "动词时态错了，成了“没画地图吗？”（��问是否完成过），而不是“不是在画地图吗？”（询问当时是否正在进行）。",
  "minorEn": "Wrong verb aspect; this asks \"didn't they draw?\" (a completed action), not \"weren't they drawing?\" (an action in progress).",
  "major": "その人……地図を描かせてませんでしたか。",
  "majorZh": "变成了使役态，意思是“他不是在让别人画地图吗？”，改变了原句的主体。",
  "majorEn": "This is the causative form, asking \"Weren't they making (someone) draw a map?\", which changes the subject's role."
 },
 "……やっぱりいい。聞きたくない。": {
  "minor": "……やっぱりいい。聞かない。",
  "minorZh": "没能表达出“不想”的心情，「聞かない」是“不听”，而「聞きたくない」是“不想听”。",
  "minorEn": "Lacks nuance; `聞かない` (\"I won't listen\") is a statement of action, whereas `聞きたくない` (\"I don't want to listen\") expresses desire.",
  "major": "……やっぱりいい。言いたくない。",
  "majorZh": "动词用错了，「言いたくない」是“不想说”，和“不想听”是对话中完全相反的角色。",
  "majorEn": "Wrong verb; `言いたくない` means \"I don't want to say,\" which is the opposite conversational role from \"I don't want to hear.\""
 },
 "一緒に行こう。駅まで送る。": {
  "minor": "一緒に行こう。駅に送る。",
  "minorZh": "助词「に」虽然也能用，但「まで」更能清晰地表达“送到车站为止”这个终点，更自然。",
  "minorEn": "While `に` can be used, `まで` (\"up to/as far as\") is more natural for specifying the destination for the action `送る`.",
  "major": "一緒に行こう。駅まで送って。",
  "majorZh": "角色反了，「送って」是请求对方“你送我”，而不是主动提出“我送你”。",
  "majorEn": "The roles are reversed; `送って` is a request (\"walk me\"), changing the offer into a demand."
 },
 "よし、やろう。": {
  "minor": "よし、やる。",
  "minorZh": "语气稍有不同，「やる」是“我来做”，而「やろう」是“来吧！/我们上吧！”，更具号召或自我鼓动的意味。",
  "minorEn": "`やる` is a simple declaration \"I'll do it,\" whereas the volitional `やろう` (\"Let's do it\") has a stronger nuance of starting an activity together or with gusto.",
  "major": "よし、やめる。",
  "majorZh": "意思完全相反，「やめる」是“不干了”或“停止”。",
  "majorEn": "The meaning is the opposite; `やめる` means \"I'll stop\" or \"I quit.\""
 },
 "今日はやめとく。": {
  "minor": "今日はやめ��。",
  "minorZh": "语气不同，「やめる」是“不干了”，比较绝对；「やめとく」是“今天就算了”，暗示以后可能还会做。",
  "minorEn": "Lacks nuance; `やめる` is a more final \"I quit,\" whereas `やめとく` implies \"I'll pass for today\" or \"I'll refrain for now.\"",
  "major": "今日はやる。",
  "majorZh": "意思完全相反，「やる」是“干”或“做”。",
  "majorEn": "The meaning is the opposite; `やる` means \"I'll do it.\""
 },
 "受けて立つ。": {
  "minor": "受けて立ちます。",
  "minorZh": "在非正式的挑战场景中，使用敬体「〜ます」可能会显得过于正式或生硬。",
  "minorEn": "Using the polite `~masu` form can sound too formal or stiff in a casual challenge context.",
  "major": "受けて座る。",
  "majorZh": "动词用错，「座る」是“坐下”，与「立つ」（站立）所传达的“迎战”姿态正好相反，破坏了惯用语。",
  "majorEn": "Wrong verb; `座る` means \"to sit down,\" which is the opposite of the \"ready-to-fight\" posture of `立つ` (to stand) and breaks the idiom."
 },
 "どうやって飲むの？": {
  "minor": "どうやって飲みますか。",
  "minorZh": "敬��和简体的选择错误，如果和同辈说话，用「〜ますか」会显得有些生分。",
  "minorEn": "Register mismatch; using the polite `~masuka` form can sound a bit distant when speaking to a peer.",
  "major": "なぜ飲むの？",
  "majorZh": "疑问词用错了，「なぜ」是问“为什么喝”，而不是“怎么喝”。",
  "majorEn": "Wrong question word; `なぜ` (why) changes the question from \"how to drink\" to \"why drink.\""
 },
 "……あの、足が。": {
  "minor": "……あの、足は。",
  "minorZh": "助词选择的语感差异，用「は」听起来像是在转换话题到“腿”，而不是「が」所表达的“（我的）腿（出问题了）”的突发状况。",
  "minorEn": "The nuance is off; `は` introduces \"legs\" as a topic, whereas `が` is more natural for presenting a new, specific problem or state.",
  "major": "……あの、足で。",
  "majorZh": "助词用错了，「で」表示方式或地点，在这里不成句子。",
  "majorEn": "Wrong particle; `で` indicates means or location, making the fragment nonsensical in this context."
 },
 "いただきます。": {
  "minor": "いただきました。",
  "minorZh": "时态错了，「いただきました」是吃完后说的。",
  "minorEn": "Wrong tense; `いただきました` is the past tense, used after finishing a meal, not before.",
  "major": "ごちそうさまでした。",
  "majorZh": "惯用语用错了，「ごちそうさまでした」是吃完饭后说的“我吃好了，谢谢款待”。",
  "majorEn": "Wrong set phrase; `ごちそうさまでした` is said after a meal to express thanks, not before."
 },
 "この付箋、何て書いてあったの？": {
  "minor": "この付箋、何て書いたの？",
  "minorZh": "書いた是单纯的过去式，而書いてあった描述的是“写着”这个状态，在这里更自然。",
  "minorEn": "書いた is simple past, but 書いてあった describes the state of something being written, which is more natural here.",
  "major": "この付箋、何て書いてあるつもりだったの？",
  "majorZh": "～つもりだった表示“打算”，所以这句的意思是“你本打算在这张便签上写什么？”，改变了原意。",
  "majorEn": "～つもりだった means \"intended to,\" so this asks \"What did you intend to have written on the sticky note?\", which is a different question."
 },
 "笑わないよ。絶対似合う。": {
  "minor": "笑いませんよ。絶対似合う。",
  "minorZh": "在同一句话里混用敬体（笑いません）和简体（似合う）听起来不自然。",
  "minorEn": "Using polite form (笑いません) with plain form (似合う) in the same utterance sounds unnatural.",
  "major": "笑わせないよ。絶対似合う。",
  "majorZh": "笑わせない是使役形的否定，意思是“我不会逗（人）笑”，改变了“（大家）不会笑你”的原意。",
  "majorEn": "笑わせない is the causative negative (\"I won't make someone laugh\"), changing the meaning from \"I/people won't laugh.\""
 },
 "俺だけの秘密にする。": {
  "minor": "俺だけの秘密をする。",
  "minorZh": "这里应该用にする，表示“决定”或“让它成为”，而不是をする。",
  "minorEn": "をする is incorrect; にする is used to mean \"to decide on\" or \"to make something into.\"",
  "major": "俺だけの秘密になる。",
  "majorZh": "になる的意思是“变成”，这消除了说话者的主动性。原句的にする表示“我决定让它成为”一个秘密。",
  "majorEn": "になる means \"to become,\" which removes the speaker's agency. The original にする means \"I will make it\" a secret."
 },
 "試着だけしてみたら？": {
  "minor": "試着だけしてみる？",
  "minorZh": "～てみる？是个单纯的问题（“你要试试吗？”），而～てみたら？是更常用的建议句式（“要不试试看？”）。",
  "minorEn": "～てみる？ is a simple question (\"Will you try?\"), while ～てみたら？ is a common way to make a suggestion (\"Why don't you try?\").",
  "major": "試着だけしてみなければならない？",
  "majorZh": "～なければならない的意思是“必须做”，把一个友好的建议变成了一个关于义务的质问。",
  "majorEn": "～なければならない means \"must do,\" changing the friendly suggestion into a question about obligation."
 },
 "俺も描いていい？": {
  "minor": "俺も描くいい？",
  "minorZh": "在请求许可的句型（～ていい）中，动词必须使用て形（描いて）。",
  "minorEn": "The verb must be in the te-form (描いて) before いい to ask for permission.",
  "major": "俺も描いてあげる？",
  "majorZh": "～てあげる表示“为别人做某事”，所以这句话的意思是“我也帮你画好吗？”，而不是“我也可以画吗？”。",
  "majorEn": "～てあげる means \"to do something for someone,\" so this means \"Shall I paint for you too?\", not \"Can I paint too?\"."
 },
 "顔に絵の具ついてるよ。": {
  "minor": "顔で絵の具ついてるよ。",
  "minorZh": "表示某物存在或附着的地点时应用助词に，而不是表示动作发生地点的で。",
  "minorEn": "Use particle に for the location where something exists or is attached, not で, which indicates the location of an action.",
  "major": "顔に絵の具つけてるよ。",
  "majorZh": "つけてる是及物动词“涂上”，所以这句话的意思是“（你）正在往脸上涂颜料”，而不是颜料已经在那了。正确的动词应该是不及物动词ついてる。",
  "majorEn": "つけてる is the transitive verb \"to attach,\" so this means \"(You) are putting paint on your face,\" not that it's already there. The correct verb is the intransitive ついてる."
 },
 "あの時、すごく助かった。": {
  "minor": "あの時、すごく助かりました。",
  "minorZh": "这句话可能发生在非正式对话中，使用敬体（助かりました）会显得有些过于正式或有距离感。",
  "minorEn": "The sentence likely occurs in a casual conversation, so using the polite form (助かりました) can sound a bit too formal or distant.",
  "major": "あの時、すごく助けた。",
  "majorZh": "助けた是及物动词“帮助/拯救别人”，所以这句话的意思是“我帮了大忙”，而不是“你帮了我大忙”。",
  "majorEn": "助けた is the transitive verb \"to help/save someone,\" so this means \"I helped a lot,\" not \"I was helped a lot.\""
 },
 "俺もバディやる。": {
  "minor": "俺もバディをする。",
  "minorZh": "虽然语法正确，但在这种非常口语化的语境中，使用更标准的をする比やる听起来要稍微正式或书面化一些。",
  "minorEn": "While grammatically correct, using the more standard をする sounds slightly more formal or textbook-like than the very casual やる in this context.",
  "major": "俺もバディをさせる。",
  "majorZh": "させる是使役形，意思是“让别人做”。所以这句话的意思是“我也要让别人当搭档”，而不是“我也要当搭档”。",
  "majorEn": "させる is the causative form, meaning \"to make someone do.\" This sentence means \"I will make someone be a buddy too,\" not \"I will be a buddy.\""
 },
 "逆さまじゃなかった……たぶん。": {
  "minor": "逆さまじゃありませんでした……たぶん。",
  "minorZh": "这句话很可能是自言自语或非正式对话，混入了敬体（じゃありませんでした）会不自然。正确的简体是じゃなかった。",
  "minorEn": "This mixes polite form (じゃありませんでした) into what is likely a plain-form internal thought or casual comment. じゃなかった is the correct plain form.",
  "major": "逆さまだった……たぶん。",
  "majorZh": "这是肯定形式，意思是“是倒的”，与原句“不是倒的”意思相反。",
  "majorEn": "This is the positive form, meaning \"It was upside down,\" which is the opposite of the original sentence."
 },
 "聞こえてもいいよ。": {
  "minor": "聞いてもいいよ。",
  "minorZh": "聞く是主动“听”，而聞こえる是“能听见/听得到”的被动或可能义。原句指的是后者。",
  "minorEn": "聞く means \"to listen\" actively, while 聞こえる means \"to be audible/to hear\" passively. The original implies passive hearing.",
  "major": "聞こえるはずがないよ。",
  "majorZh": "～はずがない表示“不可能…”，完全颠倒了原意，变成了“不可能听得见”。",
  "majorEn": "～はずがない means \"it's impossible that...\" or \"there's no way that...\", completely reversing the meaning to \"There's no way I can hear it.\""
 },
 "俺の心臓も、うるさいよ。": {
  "minor": "俺の心臓が、うるさいよ。",
  "minorZh": "使用が代替も，就失去了“也”的意思，而这个“也”在与他人比较的语境中很重要。",
  "minorEn": "Using が instead of も loses the meaning of \"too\" or \"also,\" which is important in this context of comparing with someone else.",
  "major": "俺の心臓も、うるさがってるよ。",
  "majorZh": "后缀～がる用于描述观察到的他人感受的样子，不能和うるさい这样的形容词一起用，也不能用于描述自己的事物。",
  "majorEn": "The ～がる suffix is used to describe the observable signs of someone else's feelings, and cannot be used with an adjective like うるさい or for one's own things."
 },
 "どうして五回も？": {
  "minor": "どうして五回だけ？",
  "minorZh": "だけ的意思是“只有”，把原句“竟然五次之多”（暗示次数多）的语气，变成了“为什么只有五次”（暗示次数少）。",
  "minorEn": "だけ means \"only,\" changing the nuance from \"as many as five times\" (implying it's a lot) to \"only five times\" (implying it's not enough).",
  "major": "どうして五人も？",
  "majorZh": "人（にん）是数人的量词，而不是数次数的量词。数次数应该用回（かい）。",
  "majorEn": "人 (にん) is the counter for people, not for times/occurrences, which is 回 (かい)."
 },
 "次は俺が測る。": {
  "minor": "次に俺が測る。",
  "minorZh": "用に代替は改变了语感。次は把“下一个”作为主题（暗示轮流），而次に只表示顺序上的“接下来”。",
  "minorEn": "Using に instead of は changes the nuance. 次は sets \"the next one\" as the topic (implying turns), while 次に just means \"next\" in sequence.",
  "major": "次は俺が測られる。",
  "majorZh": "測られる是被动态，意思是“被测量/被计时”。这把原意“我来计时”翻转成了“下一个轮到我被计时”。",
  "majorEn": "測られる is the passive form, meaning \"to be measured/timed.\" This flips the meaning to \"Next, I will be the one who is timed.\""
 },
 "俺も、隣の一人しか見てない。": {
  "minor": "俺も、隣の一人だけ見てる。",
  "minorZh": "だけ～肯定形和しか～否定形都表示“只”，但しか有更强烈的、更主观的语感，更适合这里。用だけ是一种常见的简化。",
  "minorEn": "だけ～肯定形 and しか～否定形 both mean \"only,\" but しか has a stronger, more subjective nuance that fits better here. Using だけ is a common simplification.",
  "major": "俺も、隣の一人しか見てる。",
  "majorZh": "语法点しか（“只”）必须与否定动词（如見てない）连用。与肯定动词连用是错误的。",
  "majorEn": "The grammar pattern しか (\"only\") must always be used with a negative verb (e.g., 見てない). Using it with a positive verb is incorrect."
 },
 "それで、どうなったの？": {
  "minor": "それで、どうしたの？",
  "minorZh": "どうしたの？问的是“（你/某人）做了什么？”，关注的是行为。どうなったの？问的是“怎么样了？”或“结果如何？”，关注的是结果。",
  "minorEn": "どうしたの？ asks \"What did (you/someone) do?\", focusing on an action. どうなったの？ asks \"What happened?\" or \"What was the result?\", focusing on the outcome.",
  "major": "それで、どうするの？",
  "majorZh": "どうするの？问的是“你打算怎么办？”，是关于未来的计划，而不是过去发生的事。",
  "majorEn": "どうするの？ asks \"What are you going to do?\", which is about future plans, not what happened in the past."
 },
 "……見てたの？": {
  "minor": "……見えたの？",
  "minorZh": "見えた的意思是“能��见”或“看得见”，与見てた（“（你）在看”）的语意不同。",
  "minorEn": "見えた means \"was visible\" or \"could be seen,\" which is different from 見てた, which means \"(you) were watching.\"",
  "major": "……見せてたの？",
  "majorZh": "見せてた的意思是“正在给（别人）看”，把问题从“你在看吗？”变成了“你在给别人看吗？”。",
  "majorEn": "見せてた means \"were showing,\" changing the question from \"Were you watching?\" to \"Were you showing it to someone?\"."
 },
 "お供えです。": {
  "minor": "お供えをです。",
  "minorZh": "在系动词です前添加助词を是错误的语法。",
  "minorEn": "Adding the particle を before the copula です is grammatically incorrect.",
  "major": "お供えします。",
  "majorZh": "お供えします是一个动词短语，意思是“我来供奉”。而原句お供えです只是在说明物体：“这是供品。”",
  "majorEn": "お供えします is a verb phrase meaning \"I will make an offering.\" The original sentence, お供えです, simply identifies the object as \"It is an offering.\""
 },
 "聞かせて。": {
  "minor": "聞かして。",
  "minorZh": "聞かして是正确的使役て形聞かせて的一种常见口语变体，但非标准���",
  "minorEn": "聞かして is a common colloquial corruption of the correct causative te-form, 聞かせて.",
  "major": "聞いて。",
  "majorZh": "聞いて是要求对方“听”或“问”。而聞かせて是要求“让我听”，即“告诉我”。",
  "majorEn": "聞いて is a request for the listener \"to listen\" or \"to ask.\" 聞かせて is a request \"to be allowed to hear,\" meaning \"Tell me.\""
 },
 "一緒に書こう。": {
  "minor": "一緒で書こう。",
  "minorZh": "副词形式应为一緒に（一起），而不是一緒で。",
  "minorEn": "The adverbial form is 一緒に (together), not 一緒で.",
  "major": "一緒に書きたい。",
  "majorZh": "書きたい的意思是“我想写”，这是在陈述自己的愿望，而不是像意志形書こう（“我们写吧”）那样邀请对方一起行动。",
  "majorEn": "書きたい means \"I want to write,\" which is a statement of one's own desire, not an invitation to do something together like the volitional form 書こう (\"Let's write\")."
 },
 "手伝います。": {
  "minor": "手伝っています。",
  "minorZh": "进行时手伝っています的���思是“我正在帮忙”，在刚要提议帮忙时使用是不正确的。手伝います才是正确的提议形式。",
  "minorEn": "The progressive form 手伝っています means \"I am helping,\" which is incorrect when you are just offering to start helping. 手伝います is the correct form for the offer.",
  "major": "手伝ってもらいます。",
  "majorZh": "手伝ってもらいます的意思是“我将接受你的帮助”，与原意“我来帮你”正好相反。",
  "majorEn": "手伝ってもらいます means \"I will receive the favor of your help,\" which is the opposite of the intended \"I will help you.\""
 },
 "すみません、ありがとうございます。": {
  "minor": "ごめんなさい、ありがとうございます。",
  "minorZh": "ごめんなさい是更直接的道歉，而すみません也可用作“不好意思，麻烦你了”，和感谢的话搭配在一起更合适。",
  "minorEn": "ごめんなさい is a more direct apology, while すみません can also mean \"excuse me\" or \"sorry for the trouble,\" making it more suitable when paired with thanks.",
  "major": "すみません、ありがとうでした。",
  "majorZh": "ありがたい的过去式是ありがとうございました。ありがとうでした是错误的语法。",
  "majorEn": "The past tense of ありがたい is ありがとうございました. ありがとうでした is grammatically incorrect."
 },
 "どうして戻したの？": {
  "minor": "どうして戻ったの？",
  "minorZh": "戻った是不及物动词，意思是“（自己）回去”，问的是人为什么回去。而这里应该用及物动词戻した，意思是“把东西放回去”。",
  "minorEn": "戻った is the intransitive verb \"to return (oneself),\" asking why the person went back. The correct transitive verb is 戻した, \"to put something back.\"",
  "major": "どうして戻さなかった��？",
  "majorZh": "这是否定形式，问的是“为什么你没把它放回去？”，与原问题意思相反。",
  "majorEn": "This is the negative form, asking \"Why didn't you put it back?\", which is the opposite of the original question."
 },
 "真似でも、俺が知ってる深雪さんは本物だよ。": {
  "minor": "真似でも、俺の知ってる深雪さんは本物だよ。",
  "minorZh": "在定语从句中，が用来标记主语（俺が知ってる）。虽然口语中可用の，但が更标准，学习者常会混淆二者。",
  "minorEn": "In a relative clause, が is used to mark the subject (俺が知ってる). While の can be used in casual speech, が is more standard and learners often confuse them.",
  "major": "真似だから、俺が知ってる深雪さんは本物だよ。",
  "majorZh": "だから的意思是“因为”，这让句子变成了不合逻辑的“因为她是模仿的，所以我认识的深雪才是真的”。正确的词是でも（“即使”）。",
  "majorEn": "だから means \"because,\" changing the sentence to the illogical \"Because she is a copy, the Miyuki I know is real.\" The correct word is でも (\"even if\")."
 },
 "おばあさんのこと、もっと聞かせて。": {
  "minor": "おばあさんのこと、もっと聞いて。",
  "minorZh": "聞いて的意思是“听！”或“问！”，是对对方的命令。正确的形式是聞かせて，意思是“让我听听”或“告诉我”。",
  "minorEn": "聞いて means \"Listen!\" or \"Ask!\", which is a command to the other person. The correct form is 聞かせて, \"Let me hear\" or \"Tell me.\"",
  "major": "おばあさんのこと、もっと聞かせてあげる。",
  "majorZh": "～てあげる的意思是“为对方做某事”。这句话颠倒了角色，变成了“我大发慈悲再多告诉你一些关于祖母的事吧”。",
  "majorEn": "～てあげる means \"to do someone a favor.\" This sentence reverses the roles, meaning \"I'll do you the favor of telling you more about the grandmother.\""
 },
 "なんでそんなに練習するの？": {
  "minor": "なんでそんな練習するの？",
  "minorZh": "そんなに的意思是“那么地”或“到那种程度”。省略助词に在语法上不够准确，因为そんな本身是连体词（“那样的”）。",
  "minorEn": "そんなに means \"so much\" or \"to that extent.\" Dropping the particle に makes it less grammatically precise, as そんな alone is a determiner (\"that kind of\").",
  "major": "なんでそんなに練習させるの？",
  "majorZh": "させる是使役形（“让别人做”）。这把问题变成了“你为什么要让（别人）练习那么多？”。",
  "majorEn": "させる is the causative form (\"to make someone do\"). This changes the question to \"Why do you make (someone) practice so much?\"."
 },
 "一本だけ投げていい？": {
  "minor": "一本だけ投げっていい？",
  "minorZh": "动词 te-form 错误。投げる的 te-form 是投げて，不是投げって。",
  "minorEn": "Incorrect te-form. The te-form of 投げる is 投げて, not 投げって.",
  "major": "一本だけ投げてもらう？",
  "majorZh": "意思反了。这句话的意思是“能请你来投一次吗？”，把动作的发出者搞反了。",
  "majorEn": "Reversed meaning. This means \"Can I have you throw one?\", reversing who performs the action."
 },
 "いつもの店。最初に一緒に行ったから。": {
  "minor": "いつもの店。最初が一緒に行ったから。",
  "minorZh": "助词错误。这里应该用表示时间点的“に”，而不是主格��词“が”。",
  "minorEn": "Wrong particle. It should be the time marker に, not the subject marker が.",
  "major": "いつもの店。最初に一緒に行かせるから。",
  "majorZh": "意思完全不同。这句话用了使役态，意思是“因为我会先让你一起去”，这不符合逻辑。",
  "majorEn": "Completely different meaning. This uses the causative form and means \"Because I will make you go with me first,\" which doesn't make sense here."
 },
 "こっち。スープが深い。": {
  "minor": "こっち。スープは深い。",
  "minorZh": "助词错误。这里在介绍“汤”这个新信息，用“が”比用“は”更自然。",
  "minorEn": "Wrong particle. が is more natural than は here for introducing new information about the soup.",
  "major": "こっち。スープが低い。",
  "majorZh": "形容词错误。这句话的意思是“汤很低”，没有意义。",
  "majorEn": "Wrong adjective. This means \"The broth is low/short,\" which is nonsensical."
 },
 "次の試合の帰りも、送る。": {
  "minor": "次の試合の帰りを、送る。",
  "minorZh": "助词错误。用“を”会丢失原文“也”的含义，原文的“も”表示“这次也”送你。",
  "minorEn": "Wrong particle. Using を loses the meaning of \"too\" or \"as well\" which is conveyed by も.",
  "major": "次の試合の帰りも、送ってもらう。",
  "majorZh": "意思反了。这句话的意思是“下次比赛回去时，我也要让你送”，把送人的一方搞反了。",
  "majorEn": "Reversed meaning. This means \"I'll have you walk me home after the next match too,\" reversing who is doing the sending."
 },
 "その鞄、持つよ。": {
  "minor": "その鞄、持てるよ。",
  "minorZh": "动词形态错误。这里是提议帮忙，应该用“持つよ”，而不是可能形“持てるよ”（我能拿）。",
  "minorEn": "Wrong verb form. This is an offer to help, so 持つよ is correct, not the potential form 持てるよ (I can carry it).",
  "major": "その鞄、持たせるよ。",
  "majorZh": "意思反了。这句话的意思是“我让你拿那个包”，完全与帮忙的初衷相反。",
  "majorEn": "Reversed meaning. This means \"I'll make you carry that bag,\" the opposite of the intended offer to help."
 },
 "今度は、ここを指してる。": {
  "minor": "今度は、ここが指してる。",
  "minorZh": "助词错误。“指す”是及物动词，宾语“ここ”后面应该用“を”而不是“が”。",
  "minorEn": "Wrong particle. 指す is a transitive verb, so its object ここ should be marked with ���, not が.",
  "major": "今度は、ここを指させてる。",
  "majorZh": "动词形态错误。这句话用了使役态，意思是“这次，它让（别人）指着这里”，改变了句子的主语和意思。",
  "majorEn": "Wrong verb form. This uses the causative form and means \"This time, it's making (someone) point here,\" changing the subject and meaning."
 },
 "ちゃんとさよなら言えなくてごめん。": {
  "minor": "ちゃんとさよなら言わなくてごめん。",
  "minorZh": "动词形态错误。这句话的意思是“对不起我没好好说再见”，而原文“言えなくて”强调的是“没能说出口”。",
  "minorEn": "Wrong verb form. This means \"Sorry for not saying goodbye properly,\" while the original 言えなくて emphasizes \"couldn't say it.\"",
  "major": "ちゃんとさよなら言えてよかった。",
  "majorZh": "意思完全相反。这句话的意思是“能好好地道别真是太好了”，与道歉的语境相反。",
  "majorEn": "Completely opposite meaning. This means \"I'm glad I was able to say goodbye properly,\" which is the opposite of an apology."
 },
 "俺が漕ぐ。後ろ乗って。": {
  "minor": "俺は漕ぐ。後ろ乗って。",
  "minorZh": "助词错误。这里为了强调“由我来蹬”，用“が”比用“は”更合适��",
  "minorEn": "Wrong particle. が is better than は here to emphasize that \"I\" am the one who will do the pedaling.",
  "major": "俺が乗る。後ろ漕いで。",
  "majorZh": "意思反了。这句话的意思是“我来坐。你在后面蹬”，把两个人的分工完全搞反了。",
  "majorEn": "Reversed meaning. This says \"I'll get on. You pedal in the back,\" completely reversing the roles."
 },
 "今度は、必ず帰ってくる。": {
  "minor": "今度は、必ず戻ってくる。",
  "minorZh": "近义词使用不当。虽然“戻る”也是回来，但“帰る”有“回到归属之地”的语感，在这里更合适。",
  "minorEn": "Wrong near-synonym. While 戻る also means to return, 帰る has a stronger nuance of returning to one's home or place of belonging, which is more appropriate here.",
  "major": "今度は、必ず帰ってこない。",
  "majorZh": "意思完全相反。这句话的意思是“这次，我绝对不会回来了”。",
  "majorEn": "Completely opposite meaning. This means \"This time, I will definitely not come back.\""
 },
 "待たなくていい。一緒に来てほしい。": {
  "minor": "待たないでいい。一緒に来てほしい。",
  "minorZh": "语法结构错误。“不用做某事”的正确说法是“～なくてもいい”���“待たないでいい”是一种不标准的混合用法。",
  "minorEn": "Incorrect grammar pattern. The correct way to say \"don't have to do\" is ～なくてもいい. 待たないでいい is a non-standard blend.",
  "major": "待ってほしい。一緒に来なくていい。",
  "majorZh": "意思完全相反。这句话的意思是“我希望你等着。你不用一起来”，与原文的意图正好相反。",
  "majorEn": "Completely opposite meaning. This means \"I want you to wait. You don't have to come with me,\" the exact opposite of the original intent."
 },
 "真希、いける！": {
  "minor": "真希、いけ！",
  "minorZh": "语气错误。这是命令形，意思是“真希，上！”，语气比表示鼓励的“いける！”（你能行！）要强硬得多。",
  "minorEn": "Wrong tone. This is the imperative form, meaning \"Maki, go!\", which is much harsher than the encouraging いける！ (You can do it!).",
  "major": "真希、いけない！",
  "majorZh": "意思完全相反。这句话的意思是“真希，不行！”，是在阻止或否定她。",
  "majorEn": "Completely opposite meaning. This means \"Maki, you can't! / It's no good!\", which is discouraging or prohibitive."
 },
 "一曲目、どうぞ。": {
  "minor": "一つ目、どうぞ。",
  "minorZh": "量词错误。歌曲的量词是“曲”，用泛用的“つ”虽然能懂，但不地道。",
  "minorEn": "Wrong counter. The counter for songs is 曲. Using the generic counter つ is understandable but unnatural.",
  "major": "一曲目、します。",
  "majorZh": "意思反了。这句话的意思是“第一首歌，我来唱/演奏”，而不是请对方表演。",
  "majorEn": "Reversed meaning. This means \"I will do/perform the first song,\" instead of asking the other person to perform."
 },
 "どっちの真希も、好きだよ。": {
  "minor": "どっちの真希が、好きだよ。",
  "minorZh": "助词错误。用“が”会使句子听起来像在问“我喜欢的是哪个真希？”，而原文用“も”表示“两个都喜欢”。",
  "minorEn": "Wrong particle. Using が makes the sentence sound like \"Which Maki is it that I like?\", whereas the original も means \"I like both\".",
  "major": "どっちの真希でも、好きじゃない。",
  "majorZh": "意思完全相反。这句话的意思是“不管是哪个真希，我都不喜欢”。",
  "majorEn": "Completely opposite meaning. This means \"I don't like either Maki.\""
 },
 "もっと案内して。全部見たい。": {
  "minor": "もっと案内する。全部見たい。",
  "minorZh": "动词形态错误。“案内する”是原形，意思是“我来带你转转”，而不是请求对方带路的“案内して”。",
  "minorEn": "Wrong verb form. 案内する is the dictionary form, meaning \"I will show you around,\" not the te-form request 案内して (Show me around).",
  "major": "もっと案内して。全部見たくない。",
  "majorZh": "意思完全相反。这句话的后半句是“我不想看全部”，与原文的意愿相反。",
  "majorEn": "Completely opposite meaning. The second part means \"I don't want to see all of it,\" which is the opposite of the original desire."
 },
 "……はい。三十八ページ。": {
  "minor": "……はい。三十八枚。",
  "minorZh": "量词错误。书页的量词是“ページ”，不是用于纸张等薄物的“枚”。",
  "minorEn": "Wrong counter. The counter for book pages is ページ, not 枚, which is for flat objects like sheets of paper.",
  "major": "……はい。三十八ページ、ください。",
  "majorZh": "语法错误。在课堂上念课文时说“请给我第38页”是毫无意义的。",
  "majorEn": "Grammatically nonsensical. Saying \"Page 38, please\" as if asking someone to give it to you makes no sense in a classroom reading context."
 },
 "ありがと。": {
  "minor": "ありがとうございます。",
  "minorZh": "语体错误。在随意的场合下，用“ありがとうございます”显得过于正式和生硬。",
  "minorEn": "Wrong register. In a casual situation, using ありがとうございます is too formal and sounds stiff.",
  "major": "ごめ���。",
  "majorZh": "词语错误。这句话的意思是“对不起”，而不是“谢谢”。",
  "majorEn": "Wrong word. This means \"Sorry,\" not \"Thank you.\""
 },
 "これ……教科書が間違ってるって意味？": {
  "minor": "これ……教科書は間違ってるって意味？",
  "minorZh": "助词错误。这里用“が”来特指“教科书”是错误的，比用“は”更自然。",
  "minorEn": "Wrong particle. が is more natural here to specify that \"the textbook\" is the thing that is wrong, as opposed to は.",
  "major": "これ……教科書が間違ってると思う？",
  "majorZh": "意思不同。这句话的意思是“你觉得是教科书错了吗？”，是在询问对方的看法，而不是像原文那样推测“这”的含义。",
  "majorEn": "Different meaning. This means \"Do you think the textbook is wrong?\", asking for the listener's opinion rather than clarifying the meaning of \"this.\""
 },
 "……俺？": {
  "minor": "……私？",
  "minorZh": "人��代词错误。如果角色平时用“俺”，在这里突然用“私”会显得不符合人设，过于正式。",
  "minorEn": "Wrong pronoun. If the character normally uses 俺, switching to 私 sounds out of character and overly formal.",
  "major": "……誰？",
  "majorZh": "词语错误。这句话的意思是“……谁？”，表示完全没意识到是在叫自己。",
  "majorEn": "Wrong word. This means \"...Who?\", implying the character didn't realize they were the one being referred to at all."
 },
 "上、やろうか？": {
  "minor": "上、できるか？",
  "minorZh": "动词形态错误。这里是主动提议帮忙，应该用意志形“やろうか”，而不是询问自己能力的可能形“できるか”（我能做吗？）。",
  "minorEn": "Wrong verb form. This is an offer to help, which uses the volitional やろうか, not the potential form できるか (Can I do it?), which questions one's own ability.",
  "major": "上、やめるか？",
  "majorZh": "词语错误。这句话的意思是“上面那部分，我们不做了吧？”，和帮忙的意图完全相反。",
  "majorEn": "Wrong word. This means \"Shall we stop doing the top part?\", the opposite of offering to do it."
 },
 "空、高いね。": {
  "minor": "空、広いね。",
  "minorZh": "近义词错误。虽然“広い”（宽广）也能形容天空，但这改变了原文“高い”（高远）的意境。",
  "minorEn": "Wrong near-synonym. While 広い (wide/vast) can also describe the sky, it changes the original meaning of 高い (high).",
  "major": "空、安いね��",
  "majorZh": "形容词错误。这句话的意思是“天空好便宜啊”，毫无意义。",
  "majorEn": "Wrong adjective. This means \"The sky is cheap, isn't it,\" which is nonsensical."
 },
 "紫だと思う。": {
  "minor": "紫です。",
  "minorZh": "语法错误。这句话直接断言“是紫色”，丢失了原文“我想是……”（と思う）的不确定语气。",
  "minorEn": "Grammatical error. This states definitively \"It is purple,\" losing the nuance of uncertainty from the original と思う (I think...).",
  "major": "紫になりたい。",
  "majorZh": "语法错误。这句话的意思是“我想变成紫色”，这在猜颜色的情景下完全不合逻辑。",
  "majorEn": "Grammatical error. This means \"I want to become purple,\" which is completely illogical in the context of guessing a color."
 },
 "教えて。": {
  "minor": "習って。",
  "minorZh": "动词错误。“習う”是“学习”，这句���变成了命令对方“你去学！”，而不是请求对方“教我”。",
  "minorEn": "Wrong verb. 習う means \"to learn,\" so this becomes a command for the other person to \"Learn!\", not a request to be taught.",
  "major": "教えさせて。",
  "majorZh": "动词形态错误。这句话用了使役态，意思是“让我来教”，与请求对方教自己的意图正好相反。",
  "majorEn": "Wrong verb form. This uses the causative form and means \"Let me teach,\" the opposite of asking to be taught."
 },
 "入ったら、ジュースおごって。": {
  "minor": "入れたら、ジュースおごって。",
  "minorZh": "动词错误。“入れたら”是“如果我把它弄进去了”，强调的是自己的行为，而原文“入ったら”（如果它进去了）更像是赌它自己能否成功。",
  "minorEn": "Wrong verb. 入れたら means \"If I put it in,\" emphasizing one's own action, while the original 入ったら (\"If it goes in\") is more about the outcome of the object itself.",
  "major": "入ったら、ジュースおごるよ。",
  "majorZh": "意思反了。这句话的意思是“如果球进了，我请你喝果汁”，把打赌的输赢方搞反了。",
  "majorEn": "Reversed meaning. This means \"If it goes in, I'll buy you a juice,\" reversing who pays in the bet."
 },
 "一緒にやろう。": {
  "minor": "一緒にやって。",
  "minorZh": "动词形态错误。“やって”是请求，意思是“请和我一起做”，而“やろう”是提议，“我们一起做吧”，语气更对等。",
  "minorEn": "Wrong verb form. やって is a request (\"Please do it with me\"), while やろう is a suggestion (\"Let's do it together\"), which is more reciprocal.",
  "major": "一人でやる。",
  "majorZh": "意思完全相反。这句话的意思是“我一个人来”，与“一起做”的提议正好相反。",
  "majorEn": "Completely opposite meaning. This means \"I'll do it by myself,\" the opposite of the suggestion to do it together."
 },
 "プリ、撮ろうよ。": {
  "minor": "プリ、撮るよ。",
  "minorZh": "动词形态错误。“撮るよ”是陈述，“我要去拍了”，而不是像“撮ろうよ”那样邀请对方“我们去拍吧”。",
  "minorEn": "Wrong verb form. 撮るよ is a statement, \"I'm going to take them,\" not an invitation like 撮ろうよ (\"Let's take them\").",
  "major": "プリ、売ろうよ。",
  "majorZh": "词语错误。这句话的意思是“我们来卖大头贴吧”，这和去拍照的语境完全不符。",
  "majorEn": "Wrong word. This means \"Let's sell purikura,\" which makes no sense in the context of going to a photo booth."
 },
 "ブレンドを二つ、お願いします。": {
  "minor": "ブレンドを二人、お願いします。",
  "minorZh": "“二人”是用来数人的，不是杯子；应该用“二つ”。",
  "minorEn": "二人 is the counter for people, not cups; it should be 二つ.",
  "major": "ブレンドを二つ、作ります。",
  "majorZh": "“作ります”是“我来做”的意思，跟点单的意思正好相反。",
  "majorEn": "作ります means \"I will make it,\" which is the opposite of ordering."
 },
 "同じのを。": {
  "minor": "同じを。",
  "minorZh": "を是宾格助词，但这里需要用の把形容词“同じ”名词化，变成“一样的（那个东西）”。",
  "minorEn": "を is the direct object marker, but here you need the nominalizer の to turn the adjective 同じ into a noun.",
  "major": "同じです。",
  "majorZh": "“同じです”是陈述句“（这个）是一样的”，而不是点单。",
  "majorEn": "同じです is a statement (\"It is the same\"), not a request to order."
 },
 "おすすめは？": {
  "minor": "おすすめが？",
  "minorZh": "用が代替は，会使问题听起来不那么自然，因为は更适合引出话题。",
  "minorEn": "Using が instead of は makes the question slightly less natural, as は is better for introducing a general topic.",
  "major": "おすすめされますか？",
  "majorZh": "“おすすめされますか？”的意思是“你被推荐吗？”，在这里没有意义。",
  "majorEn": "おすすめされますか？ uses the passive voice, meaning \"Are you recommended?\", which is nonsensical here."
 },
 "半分こしよう。": {
  "minor": "半分こします。",
  "minorZh": "“します”是陈述“我会做”，而不是“我们一起做吧”的邀请，后者应该用しよう。",
  "minorEn": "します is a statement (\"I will do it\"), not an invitation (\"Let's do it\"), which should be しよう.",
  "major": "半分にさせよう。",
  "majorZh": "“半分にさせよう”是使役形，意思是“让别人分一半”，而��是“我们分着吃”。",
  "majorEn": "半分にさせよう is the causative form, meaning \"Let's make someone do half,\" not \"Let's share.\""
 },
 "デュエット、しない？": {
  "minor": "デュエット、しませんか？",
  "minorZh": "“しませんか”比“しない？”更正式，在这种轻松的场合下可能会听起来有些疏远或拘谨。",
  "minorEn": "しませんか is more formal than しない？ and might sound a bit distant or stiff in this casual situation.",
  "major": "デュエット、ならない？",
  "majorZh": "“ならない？”的意思是“不变成……吗？”，和“デュエット”（二重唱）连用不通；正确的动词是する。",
  "majorEn": "ならない？ means \"Won't you become...?\", which doesn't make sense with \"duet\"; the correct verb is する."
 },
 "もっと聴きたい。": {
  "minor": "もっと聴ける。",
  "minorZh": "“聴ける”是可能形（“能听”），而不是愿望形（“想听”），后者应该是聴きたい。",
  "minorEn": "聴ける is the potential form (\"can hear\"), not the desiderative form (\"want to hear\"), which is 聴きたい.",
  "major": "もっと聴かせたい。",
  "majorZh": "“聴かせたい”是使役形，意思是“我想让���人听”，而不是“我想听”。",
  "majorEn": "聴かせたい is the causative form, meaning \"I want to make someone listen,\" not \"I want to listen.\""
 },
 "詰めれば二人座れるよ。": {
  "minor": "詰めれば二人座るよ。",
  "minorZh": "“座る”只是“坐”，而“座れる”是可能形“能坐”，更符合句意。",
  "minorEn": "座る just means \"to sit,\" while 座れる is the potential form \"can sit,\" which fits the meaning of the sentence better.",
  "major": "詰めれば二人作るよ。",
  "majorZh": "“作る”是“制作”的意思，所以“二人作る”的意思是“我们会做出两个人来”，这不合逻辑。",
  "majorEn": "作る means \"to make,\" so 二人作る nonsensically means \"we will make two people.\""
 },
 "あそこ、うちの近く。": {
  "minor": "あそこ、うちと近く。",
  "minorZh": "这里的助词と（“和”）是错的；应该用の（“的”）来表示所属关系。",
  "minorEn": "The particle と (\"with\") is incorrect here; it should be の (\"of\") to show possession/relation.",
  "major": "あそこ、うちの中。",
  "majorZh": "“うちの中”的意思是“在我家里面”，而不是“在我家附近”。",
  "majorEn": "うちの中 means \"inside my house,\" not \"near my house.\""
 },
 "もうちょっとここにいよう。": {
  "minor": "もうちょっとここでいよう。",
  "minorZh": "动词いる（指有生命物体的“在”）表示地点时使用助词に，而不是で。",
  "minorEn": "The verb いる (\"to be,\" for animate objects) uses the particle に to mark location, not で.",
  "major": "もうちょっとここにあろう。",
  "majorZh": "“あろう”是ある的意志形，而ある用于无生命物体，不用于人。",
  "majorEn": "あろう is the volitional form of ある, which is used for inanimate objects, not people."
 },
 "おみくじ、引こうよ。": {
  "minor": "おみくじ、引くよ。",
  "minorZh": "“引くよ”是宣告“我要抽了”，而“引こうよ”是邀请“我们一起抽吧”。",
  "minorEn": "引くよ is a declaration (\"I'm going to do it\"), while 引こうよ is an invitation (\"Let's do it together\").",
  "major": "おみくじ、あげようよ。",
  "majorZh": "“あげようよ”的意思是“我们给吧……”，和抽签的意思正好相反。",
  "majorEn": "あげようよ means \"Let's give...\", which is the opposite of drawing or receiving a fortune."
 },
 "はぐれないように。": {
  "minor": "はぐれられないように。",
  "minorZh": "“はぐれられない”（“不能走散”）是可能形，但在这里用简单的否定形“はぐれない”（“不走散”）更自然。",
  "minorEn": "はぐれられない (\"can't get separated\") is potential, but the simple negative はぐれない (\"don't get separated\") is more natural here.",
  "major": "はぐれるように。",
  "majorZh": "“はぐれるように”的意思是“为了走散”，与想表达的意思正好相反。",
  "majorEn": "はぐれるように means \"in order to get separated,\" which is the exact opposite of the intended meaning."
 },
 "お注ぎしましょうか。": {
  "minor": "お注ぎしようか。",
  "minorZh": "“しようか”是普通意志形，太不正式了；“しましょうか”是正确的礼貌邀请。",
  "minorEn": "しようか is the plain volitional form, which is too informal; しましょうか is the correct polite invitation.",
  "major": "お注ぎいただきましょうか。",
  "majorZh": "“いただきましょうか”是“我能领受吗”的谦逊说法，把意思完全反了过来，变成了“可以请您为我倒上吗？”。",
  "majorEn": "いただきましょうか is a humble way of saying \"shall I receive?\", which flips the meaning to \"Shall I have you pour for me?\"."
 },
 "わからない。でも、好きだった。": {
  "minor": "わからない。でも、好きです。",
  "minorZh": "“好きです”是现在时（“我喜欢”），但语境暗示的是过去的感受，应该用过去时好きだった。",
  "minorEn": "好きです is present tense (\"I like it\"), but the context implies a past feeling, which should be 好きだった.",
  "major": "わからない。だから、好きだった。",
  "majorZh": "“だから”的意思是“所以”，在“不知道”和“喜欢过”之间建立了一种不合逻辑的因果关系。",
  "majorEn": "だから means \"therefore,\" creating an illogical cause-and-effect relationship between \"not knowing\" and \"liking.\""
 },
 "親子丼にしよう。": {
  "minor": "親子丼をしよう。",
  "minorZh": "“决定要……”的表达是“～にする”，所以助词应该是に，而不是を。",
  "minorEn": "The expression for \"to decide on\" something is ～にする, so the particle should be に, not を.",
  "major": "親子丼になろう。",
  "majorZh": "“なろう”是なる（“变成”）的意志形，所以“親子丼になろう”的意思是“我们变成亲子丼吧”，这不合逻辑。",
  "majorEn": "なろう is the volitional form of なる (\"to become\"), so 親子丼になろう nonsensically means \"Let's become oyakodon.\""
 },
 "得意料理、教えて。": {
  "minor": "得意料理、習って。",
  "minorZh": "“習って”是“学习”，这是说话人自己想做的事；对听话人的请求应该是“教”，即教えて。",
  "minorEn": "習って means \"learn,\" which is what the speaker wants to do; the request to the listener should be \"teach,\" which is 教えて.",
  "major": "得意料理、教えてあげる。",
  "majorZh": "“教えてあげる”的意思是“我来教你”，把教和学的角色颠倒了。",
  "majorEn": "教えてあげる means \"I will teach you,\" which reverses the roles of who is teaching whom."
 },
 "最後まで観よう。": {
  "minor": "最後まで観ろう。",
  "minorZh": "観る是一段动词，其意志形是観よう，而不是観ろう。",
  "minorEn": "観る is an ichidan (ru-verb), so its volitional form is 観よう, not 観ろう.",
  "major": "最後まで寝よう。",
  "majorZh": "“寝よう”的意思是“我们睡吧”，和叫醒别人一起看东西的意思正好相反。",
  "majorEn": "寝よう means \"Let's sleep,\" which is the opposite of waking someone up to watch something."
 },
 "掬えた。": {
  "minor": "掬った。",
  "minorZh": "“掬った”是单纯的过去时（“我捧了”），而“掬えた”是可能形（“我捧到了”）。",
  "minorEn": "掬った is simple past tense (\"I scooped\"), whereas 掬えた is potential (\"I was able to scoop\").",
  "major": "救えた。",
  "majorZh": "“救えた”的意思是“我救到了”，和“捧起”的意思完全不同。",
  "majorEn": "救えた means \"I was able to save/rescue,\" which is a completely different meaning from \"scoop.\""
 },
 "来年も、ここに来たい。": {
  "minor": "来年も、ここで来たい。",
  "minorZh": "动词来る（“来”）表示目的地时用助词に或へ，而不是表示动作发生地的で。",
  "minorEn": "The verb 来る (\"to come\") uses に or へ to mark the destination, not で, which marks the location of an action.",
  "major": "来年も、ここに来させる。",
  "majorZh": "“来させる”是使役形，意思是“让别人来”，而不是“我想来”。",
  "majorEn": "来させる is the causative form, meaning \"to make someone come,\" not \"I want to come.\""
 },
 "もうちょっとだけ。": {
  "minor": "もうちょっとだけは。",
  "minorZh": "加上は是多余的，把“だけ”错误地当作话题，使句子听起来不自然。",
  "minorEn": "Adding は is unnecessary and makes the phrase sound unnatural by incorrectly marking だけ as the topic.",
  "major": "もうちょっとだけじ��ない。",
  "majorZh": "“じゃない”是否定，将短语变成了“不止一点点”，与原意相反。",
  "majorEn": "じゃない is a negation, turning the phrase into \"It's not just a little bit,\" which is the opposite of the intended meaning."
 },
 "来年も一緒に見よう。": {
  "minor": "来年も一緒に見る。",
  "minorZh": "“見る”是对未来的陈述，而“見よう”是意志形邀请（“我们一起看吧”）。",
  "minorEn": "見る is a statement about the future, while 見よう is a volitional invitation (\"Let's watch\").",
  "major": "来年も一緒に会おう。",
  "majorZh": "“会おう”是“我们见面吧”，把原定的“一起观赏”活动变成了“彼此见面”。",
  "majorEn": "会おう means \"Let's meet,\" which changes the intended activity from watching something together to meeting each other."
 },
 "この肉について、教えてください。": {
  "minor": "この肉を教えてください。",
  "minorZh": "“肉を教えて”字面意思是“请教我肉”，但询问“关于”肉的信息需要用“肉について教えて”。",
  "minorEn": "肉を教えて literally means \"teach me the meat,\" but to ask for information \"about\" it, you need 肉について教えて.",
  "major": "この肉について、教えろ。",
  "majorZh": "“教えろ”是命令形，非常粗鲁，完全不适用于当前场合。",
  "majorEn": "教えろ is the imperative (command) form, which is extremely rude and completely inappropriate in this situation."
 },
 "マンバ・メンタリティってやつ、見せてあげる。": {
  "minor": "マンバ・メンタリティってやつ、見せてくれる。",
  "minorZh": "くれる用于别人为自己做某事，所以“見せてくれる”是“你给我看”的意思，与说话者的意图相反。",
  "minorEn": "くれる is used when someone does something for the speaker, so 見せてくれる means \"(You will) show me,\" the opposite of the speaker's intent.",
  "major": "マンバ・メンタリティってやつ、見せられる。",
  "majorZh": "“見せられる”是被动形或可能形，意思是“被展示”或“能被看见”，而不是“我给你看”。",
  "majorEn": "見せられる is the passive or potential form, meaning \"to be shown\" or \"can be seen,\" not \"I will show you.\""
 },
 "転校生、放課後、誰もいない体育館……この展開、どこかで見たな。": {
  "minor": "転校生、放課後、誰もいない体育館……この展開、どこかで見てるな。",
  "minorZh": "“見てる”是“正在看”的意思，暗示当下的、持续的动作，而不是像“見た”那样的过去经历。",
  "minorEn": "見てる means \"I am watching,\" implying a continuous, present action, not a past experience like 見た.",
  "major": "転校生、放課後、誰もいない体育館……この展開、どこかで忘れたな。",
  "majorZh": "“忘れた”是“我忘了”的意思，与辨认或记得看过相似情节的意思正好相反。",
  "majorEn": "忘れた means \"I forgot,\" which is the opposite of recognizing or remembering having seen something similar."
 },
 "……一本だけなら。でも、下手だよ。": {
  "minor": "……一つだけなら。でも、下手だよ。",
  "minorZh": "虽然一つ是通用量词，但一本是更具体、更自然的用于比赛或局数的量词。",
  "minorEn": "While 一つ is a general counter, 一本 is the more specific and natural counter for games or matches.",
  "major": "……一本だけから。でも、下手だよ。",
  "majorZh": "“から”的意思是“因为”，把句子变成了“因为只有一局”，这是一个理由，而不是基于条件的勉强同意。",
  "majorEn": "から means \"because,\" making the phrase \"Because it's just one game,\" which is a reason, not a reluctant agreement based on a condition."
 },
 "……もしかして、宇宙人が作った観測用の端末だったりする？": {
  "minor": "……もしかして、宇宙人が作った観測用で端末だったりする？",
  "minorZh": "这里需要用助词の来连接“観測用”（观测用的）和“端末”（终端）；用で是错误的。",
  "minorEn": "The particle の is needed to connect 観測用 (for observation) to 端末 (terminal); で is incorrect.",
  "major": "……もしかして、端末が作った宇宙人だったりする？",
  "majorZh": "这句话颠倒了主语和宾语，问的是“你该不是终端制造出来的外星人吧？”，和原意正好相反。",
  "majorEn": "This sentence flips the subject and object, asking \"Are you an alien that was made by the terminal?\", which is the reverse of the original meaning."
 },
 "この数字……一棟ずつ数えたの？": {
  "minor": "この数字……一棟ずつ数えったの？",
  "minorZh": "数える的过去式是数えた，不是数えった。",
  "minorEn": "The past tense of 数える is 数えた, not 数えった.",
  "major": "この数字……一棟ずつ数えさせられたの？",
  "majorZh": "这句话的意思是“你是被强迫数的吗？”，而不是“是你数的吗？”。",
  "majorEn": "This means \"Were you forced to count them?\" instead of \"Did you count them?\"."
 },
 "待って——生意気な関西弁の後輩。このキャラ、よく知ってる。": {
  "minor": "待って——生意気な関西弁の後輩。このキャラ、よくわかってる。",
  "minorZh": "这里应该用表示“知道，认识”的知ってる，而不是表示“理解”的わかってる。",
  "minorEn": "Should use 知ってる (\"to know of\") for familiarity with a concept, not わかってる (\"to understand\").",
  "major": "待って——生意気な関西弁の後輩。このキャラ、よく知られている。",
  "majorZh": "这句话变成了被动语态，“这人设广为人知”，而不是“我”知道。",
  "majorEn": "This changes to the passive voice, \"This character type is well-known,\" not that \"I\" know it."
 },
 "読めません。教えてください。": {
  "minor": "読みません。教えてください。",
  "minorZh": "読みません表示“不读”（主观意愿），而読めません表示“读不了”（能力）。",
  "minorEn": "読みません means \"I will not read\" (a refusal), not 読めません, \"I cannot read\" (inability).",
  "major": "読めません。教えてあげます。",
  "majorZh": "这句话的意思是“我来教你吧”，完全说反了。",
  "majorEn": "This means \"I will teach you,\" which is the opposite of the intended request."
 },
 "……わかった。こういうのが出てくる話なんだな、これ。": {
  "minor": "……わかった。こういうのを出てくる話なんだな、これ。",
  "minorZh": "出てくる是自动词，主语应该用が，而���是を。",
  "minorEn": "出てくる is an intransitive verb, so its subject takes が, not を.",
  "major": "……わかった。こういうのが出てくるはずなんだな、これ。",
  "majorZh": "はずだ表示“理应如此”，和んだ（んだな）表示发现或确认，两者语境不同。",
  "majorEn": "はずだ means \"it's supposed to be,\" which implies expectation, while んだ expresses a realization or explanation."
 },
 "このあたりに、何か謂れでもあるんですか。": {
  "minor": "このあたりで、何か謂れでもあるんですか。",
  "minorZh": "表示存在的地点时用助词に，而不是表示动作发生地的で。",
  "minorEn": "The particle に is used to mark a location of existence, not で, which marks a location of action.",
  "major": "このあたりに、何か謂れでもするんですか。",
  "majorZh": "する是“做”，和名词“謂れ”（典故）无法搭配，句子不成立。",
  "majorEn": "する means \"to do\" and cannot be combined with the noun 謂れ (\"history/origin\"); the sentence is nonsensical."
 },
 "……あのさ。その立ち位置、アニメだと幼馴染っていうんだけど。": {
  "minor": "……あのさ。その立ち位置、アニメで幼馴染っていうんだけど。",
  "minorZh": "在这里用だと来设定“在动画里”这个前提和���境，比で更自然。",
  "minorEn": "だと is more natural here for setting the context \"in the case of anime\" than で is.",
  "major": "……あのさ。その立ち位置、アニメだと幼馴染になれるんだけど。",
  "majorZh": "这句话的意思是“在动画里可以成为幼驯染”，而不是“被称为幼驯染”。",
  "majorEn": "This means \"in anime, you can become a childhood friend,\" not \"it is called childhood friend.\""
 },
 "……ありがとう。助かった。": {
  "minor": "……ありがとう。助けた。",
  "minorZh": "助けた是“我帮助了（别人）”，而这里应该用表示“我得救了”的助かった。",
  "minorEn": "助けた means \"I helped (someone else),\" but the correct verb is 助かった, \"I was helped/saved.\"",
  "major": "……ありがとう。助けて。",
  "majorZh": "助けて是“救命啊！”的呼救，而不是表示感谢。",
  "majorEn": "助けて is a command meaning \"Help me!\", not an expression of gratitude."
 },
 "レシート、ちょうだい。": {
  "minor": "レシート、もらう。",
  "minorZh": "もらう是“我收下”，更像一种单方面的宣告，而ちょうだい是直接的请求。",
  "minorEn": "もらう means \"I'll take it,\" which is more of a declaration, whereas ちょうだい is a direct request.",
  "major": "レシート、あげる。",
  "majorZh": "あげる是“我给你”，意思完全相反。",
  "majorEn": "あげる means \"I'll give it to you,\" which is the opposite of the intended meaning."
 },
 "ちょお待って。この展開知ってんねん。ここで指切って、絆創膏出てくるやつやろ。": {
  "minor": "ちょお待って。この展開知ってんねん。ここで指切れて、絆創膏出てくるやつやろ。",
  "minorZh": "切れる是自动词，意为“（意外地）断了/划破了”，而这里是主动切到手指，应该用他动词切る的て形，切って。",
  "minorEn": "切れる is intransitive, \"to get cut,\" but the context implies actively cutting one's finger, which requires the transitive verb 切る in its te-form, 切って.",
  "major": "ちょお待って。この展開知ってんねん。ここで指切らせて、絆創膏出てくるやつやろ。",
  "majorZh": "切らせて是使役形，意思是“让我让你切到手”，这完全改变了场景的性质。",
  "majorEn": "切らせて is the causative form, meaning \"make you cut your finger,\" which completely changes the nature of the scene."
 },
 "あの、すみません。学校へは、どっちが近いですか。": {
  "minor": "あの、すみません。学校では、どっちが近いですか。",
  "minorZh": "询问路线时，目���地用助词へ（或に）更合适，而で表示动作发生的场所。",
  "minorEn": "When asking for directions, the destination is marked with へ (or に), while で marks the location of an action.",
  "major": "あの、すみません。学校へは、どっちに行きますか。",
  "majorZh": "这句话是在问“您要去哪边？”，而不是问路。",
  "majorEn": "This asks \"Which way are you going?\", not \"Which way should I go?\"."
 },
 "それ、下まで持っていきましょうか。": {
  "minor": "それ、下まで持っていきますか。",
  "minorZh": "～ましょうか是主动提议“我来……吧？”，而～ますか只是一个普通的疑问句“您要……吗？”。",
  "minorEn": "～ましょうか is used to offer help (\"Shall I...?\"), while ～ますか is just a simple question (\"Will you...?\").",
  "major": "それ、下まで持っていってもらいましょうか。",
  "majorZh": "～てもらいましょうか是“能请你帮我……吗？”，完全颠倒了帮助的方向。",
  "majorEn": "～てもらいましょうか means \"Could I have you do this for me?\", which reverses the direction of help."
 },
 "半年の大先輩が同じ船にいてくれるなら、心強いですね。": {
  "minor": "半年の大先輩が同じ船にいるなら、心強いですね。",
  "minorZh": "いてくれる带有“为我而在”的感谢语气，只用いる则没有这层含义，听起来比较平淡。",
  "minorEn": "いてくれる implies gratitude (\"for my benefit\"), while いる is neutral and just states existence, lacking the positive nuance.",
  "major": "半年の大先輩が同じ船にいてくれるなら、心配ですね。",
  "majorZh": "心配是“担心”，和心強い（安心，有底气）的意思正好相反。",
  "majorEn": "心配 means \"worried,\" which is the opposite of 心強い (\"reassured\")."
 },
 "仲間なら、これから神戸のことで困ったら、全部ヒカリに聞きに来ますよ？": {
  "minor": "仲間なら、これから神戸のことで困ったら、全部ヒカリが聞きに来ますよ？",
  "minorZh": "这里的聞きに（问）是“我”做的动作，对象是ヒカリ，所以应该用助词に，が会把ヒカリ变成主语。",
  "minorEn": "The action 聞きに is done by \"I\" towards Hikari, so Hikari should be marked with the particle に (target), not が (subject).",
  "major": "仲間なら、これから神戸のことで困ったら、全部ヒカリに教えに来ますよ？",
  "majorZh": "教える是“教”，而不是“问”，意思完全相反。",
  "majorEn": "教える means \"to teach,\" not \"to ask,\" which is the opposite of what's intended."
 },
 "その船に……浮き輪はありますか。": {
  "minor": "その船に……浮き輪は一���ありますか。",
  "minorZh": "浮き輪的量词不是枚（用于扁平物体），一般用个（こ）或不加量词。",
  "minorEn": "The counter for 浮き輪 is not 枚 (for flat objects); one would typically use 個 or no counter at all.",
  "major": "その船に……浮き輪を持ちますか。",
  "majorZh": "持ちますか是问“（你）带着吗？”，而不是问船上“有吗？”。",
  "majorEn": "持ちますか asks \"Are you carrying it?\", not \"Is it equipped on the boat?\"."
 },
 "同じ船に乗ってるなら、名前ぐらい知っておきたいです。": {
  "minor": "同じ船に乗ってるなら、名前だけ知っておきたいです。",
  "minorZh": "だけ是“只，仅”，而ぐらい是“至少”，后者更符合“好歹也得知晓姓名”的语境。",
  "minorEn": "だけ means \"only,\" while ぐらい means \"at least,\" and the latter better fits the nuance of \"I'd like to at least know the names.\"",
  "major": "同じ船に乗ってるなら、名前ぐらい知らせておきたいです。",
  "majorZh": "知らせる是“告知（别人）”，而知る是“自己知道”，意思完全相反。",
  "majorEn": "知らせる means \"to inform (others),\" while 知る means \"to know (for oneself),\" which is the opposite meaning."
 },
 "君も留学生？　こっちに来て、どれくらい？": {
  "minor": "君も留学生？　こっちで来て、どれくらい？",
  "minorZh": "表示到达的地点时用助词に，而不是表示动作发生地的で。",
  "minorEn": "The particle に is used for the destination of 来る (to come), not で, which marks the location of an action.",
  "major": "君も留学生？　こっちに来て、どうして？",
  "majorZh": "どうして是问“为什么”，而不是どれくらい（多久了），这改变了问题的性质。",
  "majorEn": "どうして asks \"why,\" not どれくらい (\"how long\"), changing the question from a casual inquiry to a more personal one."
 },
 "……すみません。実は今朝、この場面を予言したばかりで。": {
  "minor": "……すみません。実は今朝、この場面を予言したところで。",
  "minorZh": "～たばかり表示动作完成不久，而～たところ强调动作刚完成的那个瞬间，语感不同。",
  "minorEn": "～たばかり means \"just recently finished,\" while ～たところ emphasizes the exact moment of completion. ばかり is correct here.",
  "major": "……すみません。実は今朝、この場面を約束したばかりで。",
  "majorZh": "約束是“约定”，不是“预言”，意思完全不符。",
  "majorEn": "約束 means \"to promise,\" not \"to predict.\" The meaning is completely wrong."
 },
 "ごめん。……でも、そっちも走ってたよね。": {
  "minor": "ごめん。……でも、そっちも走りましたよね。",
  "minorZh": "ごめん和そっち都是简体，和敬体的走りました在风格上不统一，听起来很别扭。",
  "minorEn": "ごめん and そっち are casual/plain forms, which clash with the polite form 走りました, making it sound stylistically inconsistent.",
  "major": "ごめん。……でも、そっちも走らされてたよね。",
  "majorZh": "走らされてた是使役被动态，“被迫跑步”，完全改变了句子的意思。",
  "majorEn": "走らされてた is the causative-passive, \"was forced to run,\" which completely changes the sentence's meaning."
 },
 "よろしゅう　おたのもうします。": {
  "minor": "よろしく　おたのもうします。",
  "minorZh": "这是关西腔和标准语的混用，关西腔里よろしゅう对应标准语的よろしく。",
  "minorEn": "This is a mix of Kansai dialect and standard Japanese; the dialect's よろしゅう corresponds to the standard よろしく.",
  "major": "よろしい　おたのみます。",
  "majorZh": "这句话混合了错误的词（よろしい）和错误的动词变位（おたのみます），不成句子。",
  "majorEn": "This sentence mixes the wrong word (よろしい) with an incorrect verb conjugation (おたのみます), making it nonsensical."
 },
 "はじめまして。今日からお世話になります。よろしくお願いします。": {
  "minor": "はじめまして。今日からお世話になりました。よろしくお願いします。",
  "minorZh": "お世話になりました用于分别或事情结束时，初次见面应该用表示“今后将要”的お世話になります。",
  "minorEn": "お世話になりました is used when leaving or at the end of something. For a first meeting, you should use お世話になります, which expresses future intent.",
  "major": "はじめまして。今日からお世話をします。よろしくお願いします。",
  "majorZh": "お世話をします是“我来照顾你”，而不是“我将承蒙你照顾”，完全颠倒了双方的立场。",
  "majorEn": "お世話をします means \"I will take care of you,\" not \"I will be in your care,\" which completely reverses the roles."
 },
 "はじめまして。……えっと、その、": {
  "minor": "はじめてまして。……えっと、その、",
  "minorZh": "正确的寒暄语是はじめまして，不是はじめてまして。",
  "minorEn": "The correct greeting is はじめまして, not はじめてまして.",
  "major": "お久しぶりです。……えっと、その、",
  "majorZh": "お久しぶりです是“好久不见”，用于和认识的人打招呼，与初次见面的情景相反。",
  "majorEn": "お久しぶりです means \"long time no see,\" which is used for people you already know, the opposite of a first meeting."
 },
 "すみません、もう一度……ゆっくり、お願いします。": {
  "minor": "すみません、もう一度……遅く、お願いします。",
  "minorZh": "请求对方“慢慢地”说时，用ゆっくり更自然，而遅く更多指物理速度上的“慢”。",
  "minorEn": "When asking someone to speak \"slowly,\" ゆっくり is more natural. 遅く usually refers to physical speed.",
  "major": "すみません、もう一度……ゆっくり、します。",
  "majorZh": "します是“我做”，而不是お願いします（拜托了），这句话变成了陈述句“我来慢慢地做”。",
  "majorEn": "します means \"I will do,\" not お願いします (\"please\"). This changes the request into a statement: \"I will do it slowly.\""
 },
 "大丈夫。自分で食べて。": {
  "minor": "大丈夫。自分で食べる。",
  "minorZh": "在口语中提出随意的请求或命令时用て形（食べて），而用原形（食べる）听起来像陈述或自言自语，不够自然。",
  "minorEn": "In casual speech, the te-form (食べて) is used for requests/commands. The dictionary form (食べる) sounds like a statement or talking to oneself.",
  "major": "大丈夫。自分で食べさせて。",
  "majorZh": "食べさせて是“让我吃”或者“喂我吃”，和“你自己吃”的意思正好相反。",
  "majorEn": "食べさせて means \"let me eat\" or \"feed me,\" which is the opposite of \"you eat it yourself.\""
 },
 "……ありがとう。いただきます。": {
  "minor": "……ありがとう。もらいます。",
  "minorZh": "接受食物或来自长辈/上级的恩惠时，用谦语いただきます比もらいます更礼貌、更地道。",
  "minorEn": "When receiving food or a favor from a superior, the humble verb いただきます is more polite and natural than もらいます.",
  "major": "……ありがとう。あげます。",
  "majorZh": "あげます是“我给（你）”，而不是“我收下”，意思完全相反。",
  "majorEn": "あげます means \"I will give (it to you),\" not \"I will receive it.\" The meaning is the opposite."
 },
 "じゃあ、明日返す。同じやつ。": {
  "minor": "じゃあ、明日返る。同じやつ。",
  "minorZh": "返す是他动词“归还（物品）”，而返る���自动词“返回（某地）”，这里应该用前者。",
  "minorEn": "返す is the transitive verb \"to return (an object),\" while 返る is intransitive, \"to return (to a place).\" The former should be used here.",
  "major": "じゃあ、明日直す。同じやつ。",
  "majorZh": "直す是“修理”，而不是“归还”，意思完全不同。",
  "majorEn": "直す means \"to fix/repair,\" not \"to return.\" The meaning is completely different."
 },
 "……そっちは？　どうして神戸に。": {
  "minor": "……そっちは？　どうして神戸で。",
  "minorZh": "表示目的地时应该用助词「に」，而不是表示动作发生地的「で」。",
  "minorEn": "The particle に should be used for a destination, not で, which indicates the location of an action.",
  "major": "……そっちは？　どうして神戸だから。",
  "majorZh": "「だから」表示“因为”，用于回答而不是提问，整句话变成了“因为为什么是神户。”，不合逻辑。",
  "majorEn": "だから means \"because,\" which is used in an answer, not a question, making the sentence nonsensical."
 },
 "好きなものは、人が分けてくれたパンです。": {
  "minor": "好きなものは、人が分けてあげたパンです。",
  "minorZh": "「あげた」指“给别人”，而这里是“别人给我”，应该用「くれた」。",
  "minorEn": "あげた is for giving to others; くれた should be used for when someone gives to the speaker.",
  "major": "好きなものは、人に分けさせられたパンです。",
  "majorZh": "「分けさせられた」是使役被动形，意思是“被强迫分享”，与“别人分给我”的意思完全相反。",
  "majorEn": "分けさせられた is the causative-passive form, meaning \"was forced to share,\" which is the opposite of receiving something."
 },
 "ちょお待って、どこ行くん。": {
  "minor": "ちょお待つ、どこ行くん。",
  "minorZh": "「待つ」是原形，用在这里像一个陈述句；表示请求或连接动作时应该用て形「待って」。",
  "minorEn": "待つ is the dictionary form; the te-form 待って should be used for a request or to connect clauses.",
  "major": "ちょお待って、どこ行かせるん。",
  "majorZh": "「行かせる」是使役形，意思是“让（别人）去”，在这里不合逻辑。",
  "majorEn": "行かせる is the causative form, meaning \"to make someone go,\" which makes no sense here."
 },
 "……三ヶ月下やろ、あんた。": {
  "minor": "……三ヶ月下です、あんた。",
  "minorZh": "「です」是敬体，而「あんた」是非常随意的称呼，两者混用很不自然。",
  "minorEn": "です is the polite form, which clashes with the very informal pronoun あんた.",
  "major": "……三ヶ月上やろ、あんた。",
  "majorZh": "「上」的意思是“年纪大”，与表示“年纪小”的「下」意思完全相反。",
  "majorEn": "上 (ue) means \"older,\" which is the opposite of 下 (shita), meaning \"younger.\""
 },
 "この味は……嘘をついてる味やな。": {
  "minor": "この味は……嘘がついてる味やな。",
  "minorZh": "固定搭配“说谎”是「嘘をつく」，应该用助词「を」而不是「が」。",
  "minorEn": "The fixed phrase for \"to tell a lie\" is 嘘をつく, which uses the particle を, not が.",
  "major": "この味は……嘘をつかれてる味やな。",
  "majorZh": "「つかれてる」是被动形，意思是“被骗的味道”，把焦点从说谎者转移到了被骗者身上。",
  "majorEn": "つかれてる is the passive form, meaning \"the taste of being lied to,\" which shifts the focus from the liar to the one being deceived."
 },
 "一番コスパ良さそうな、この五個入りにしとく。": {
  "minor": "一番コスパ良いそうな、この��個入りにしとく。",
  "minorZh": "「良いそう」的意思是“听说很好”，而“看起来很好”应该用「良さそう」。",
  "minorEn": "良いそう means \"I hear that it's good,\" not \"it looks good,\" which should be 良さそう.",
  "major": "一番コスパ悪そうな、この五個入りにしとく。",
  "majorZh": "「悪そう」的意思是“看起来很差”，与「良さそう」（看起来很好）的意思完全相反。",
  "majorEn": "悪そう (warusou) means \"looks bad,\" the opposite of 良さそう (yosasou), completely changing the meaning."
 },
 "……この猫の形のやつ、めっちゃ可愛くない？": {
  "minor": "……この猫の形のやつ、めっちゃ可愛くないですか？",
  "minorZh": "「めっちゃ」是非常口语化的副词，和敬体的「ですか」搭配在一起很不自然。",
  "minorEn": "Mixing the very informal adverb めっちゃ with the polite question form ですか sounds unnatural.",
  "major": "……この猫の形のやつ、めっちゃ可愛そうじゃない？",
  "majorZh": "「可愛そう」的意思是“可怜”，而不是“可爱”（可愛い）。",
  "majorEn": "可愛そう (kawaisou) means \"pitiful,\" not \"cute\" (可愛い, kawaii)."
 },
 "大変勉強になりました、奈緒先生。": {
  "minor": "大変��強をしました、奈緒先生。",
  "minorZh": "「勉強をしました」指“我学习了”，而固定句式「勉強になりました」才表示“（对我来说）是很好的学习经验”。",
  "minorEn": "勉強をしました means \"I studied,\" but the set phrase is 勉強になりました, meaning \"It was a great learning experience.\"",
  "major": "大変勉強させました、奈緒先生。",
  "majorZh": "「させました」是使役形，意思是“我让（别人）学习了”，非常无礼且不合逻辑。",
  "majorEn": "させました is the causative form, meaning \"I made (someone) study,\" which is rude and nonsensical."
 },
 "……この一年、一人でよう頑張ったな、奈緒。": {
  "minor": "……この一年、一人でよう頑張ってな、奈緒。",
  "minorZh": "「頑張ってな」是请求或命令（“要加油啊”），而不是对过去的赞扬（「頑張ったな」，“你很努力了啊”）。",
  "minorEn": "頑張ってな is a request (\"keep trying hard\"), not a statement of past praise (頑張ったな, \"you tried hard\").",
  "major": "……この一年、一人でよう頑張らなかったな、奈緒。",
  "majorZh": "「頑張らなかった」是“没有努力”的否定过去式，与原文的赞扬意思完全相反，是���种指责。",
  "majorEn": "頑張らなかった is the negative past, meaning \"you did not try hard,\" which is an insult and the opposite of praise."
 },
 "その棒、竹やんな。": {
  "minor": "その棒、竹ですね。",
  "minorZh": "「ですね」是标准日语的敬体，在一句关西腔中使用会显得不自然，是一种语码转换错误。",
  "minorEn": "ですね is standard polite Japanese; it's an unnatural code-switch in a sentence that otherwise uses Kansai dialect.",
  "major": "その棒、竹になった。",
  "majorZh": "「～になった」的意思是“变成了”，暗示这根杆子经历了变成竹子的过程，这不合常理。",
  "majorEn": "～になった means \"became,\" implying a bizarre transformation rather than stating what the pole is."
 },
 "……実験、どうっすか。": {
  "minor": "……実験、どうでしたか。",
  "minorZh": "「どうでしたか」是过去时（“怎么样了？”），而语境是询问正在进行的事情的进展（“怎么样？”）。",
  "minorEn": "どうでしたか is past tense (\"How was it?\"), but the context implies asking about the current progress (\"How is it going?\").",
  "major": "……実験、しますか。",
  "majorZh": "「しますか」的意思是“要做吗？”，把问题从“进展如何”变成了“要不要做”。",
  "majorEn": "しますか means \"will you do it?,\" changing the question from \"how is it going\" to \"are you going to do it.\""
 },
 "あの、前にどこかで会いました？": {
  "minor": "あの、前にどこかで会いますか？",
  "minorZh": "「会いますか」是非过去时，暗示习惯性行为（“我们（经常）见面吗？”），而询问过去是否见过应该用过去时「会いましたか」。",
  "minorEn": "会いますか is non-past tense, implying a habitual action (\"Do we meet?\"), not a past event (\"Have we met?\").",
  "major": "あの、前にどこかで会ってくれました？",
  "majorZh": "「会ってくれました」是请求别人为自己做某事并得到许可后的说法，意思是“你为我而见了我吗？”，非常别扭和夸张。",
  "majorEn": "会ってくれました uses the \"receiving a favor\" form, making it sound awkwardly like \"Did you do me the favor of meeting me?\""
 },
 "これ、ください。": {
  "minor": "これ、くださいです。",
  "minorZh": "「ください」本身就是礼貌的请求，在后面加上「です」是语法错误。",
  "minorEn": "ください is already a polite request form; adding です is grammatically incorrect.",
  "major": "これ、あげます。",
  "majorZh": "「あげます」的意思是“我给你”，和买东西的意思正好相反。",
  "majorEn": "あげます means \"I will give (this to you),\" which is the opposite of buying something."
 },
 "……あるんじゃない？聞いてくるくらいだし。": {
  "minor": "……あるんじゃない？聞くくらいだし。",
  "minorZh": "「聞く」缺少了表示朝向说话者的动词「くる」，失去了“（它）来问我”的语感。",
  "minorEn": "聞く lacks the directional verb くる, losing the nuance that the \"asking\" is directed towards the speaker.",
  "major": "……あるはずがない？聞いてくるくらいだし。",
  "majorZh": "「あるはずがない」是“不可能有”，与后面的理由“因为它都来问了”自相矛盾。",
  "majorEn": "あるはずがない means \"it's impossible that it exists,\" which contradicts the reason given (聞いてくるくらいだし, \"since it's asking\")."
 },
 "いらっしゃいませ。何名様ですか。": {
  "minor": "いらっしゃいませ。何人ですか。",
  "minorZh": "「何人ですか」不如「何名様ですか」礼貌，后者是服务业对待客人时使用的标准敬语。",
  "minorEn": "何人ですか is less polite than 何名様ですか, which is the standard honorific language for service staff.",
  "major": "いらっしゃいませ。何様ですか。",
  "majorZh": "「何様ですか」是一句非常无礼的话，意思是“你以为你是谁？”。",
  "majorEn": "何様ですか is a very rude phrase meaning \"Who do you think you are?\"."
 },
 "メイド喫茶、いかがですか！": {
  "minor": "メイド喫茶、いかがでしたか！",
  "minorZh": "「いかがでしたか」是过去时（“（体验）如何？”），用于邀请还没去过的人是不对的。",
  "minorEn": "いかがでしたか is past tense (\"How was it?\"), which is incorrect when inviting people who haven't visited yet.",
  "major": "メイド喫茶、いけませんか！",
  "majorZh": "「いけませんか」意思是“你去不了吗？”，听起来像在质问，没有礼貌邀请的意味。",
  "majorEn": "いけませんか means \"Can't you go?\", which sounds aggressive and pushy, not like a polite invitation."
 },
 "二人とも、ちょっと落ち着いて。": {
  "minor": "二人とも、ちょっと落ち着く。",
  "minorZh": "「落ち着く」是原形，使句子变成陈述句（“……会冷静下来”），而不是请求（“冷静一下”）。",
  "minorEn": "落ち着く is the dictionary form, making it a statement (\"...will calm down\") rather than a request (\"calm down\").",
  "major": "二人とも、ちょっと落ち着かせて。",
  "majorZh": "「落ち着かせて」是使役形，意思是“让我冷静一下”，把需要冷静的人搞反了。",
  "majorEn": "落ち着かせて is the causative form, meaning \"let me calm down,\" reversing the subject of the request."
 },
 "おごる。負けたほうが皿洗い。": {
  "minor": "おごって。負けたほうが皿洗い。",
  "minorZh": "「おごって」是请求（“请我客！”）或未说完的句子，而不是宣布“我请客”（おごる）。",
  "minorEn": "おごって is a request (\"Treat me!\") or an unfinished phrase, not a declaration (\"I'll treat\").",
  "major": "おごってくれる。負けたほうが皿洗い。",
  "majorZh": "「おごってくれる」的意思是“（某人）会请我”，与说话人主动请客的意思正好相反。",
  "majorEn": "おごってくれる means \"(someone) will treat me,\" which is the opposite of the speaker offering to pay."
 },
 "今撮ろう。暗くなったら、それはそれで。": {
  "minor": "今撮れる。暗くなったら、それはそれで。",
  "minorZh": "「撮れる」是可能形（“能拍”），���达的是一种能力，而不是提议（「撮ろう」，“我们拍吧”）。",
  "minorEn": "撮れる is the potential form (\"can take a picture\"), which states an ability rather than making a suggestion (\"let's take a picture\").",
  "major": "今撮られよう。暗くなったら、それはそれで。",
  "majorZh": "「撮られよう」是被动形的意志形，意思是“让我们被拍吧”，把角色从拍摄者变成了被拍摄对象。",
  "majorEn": "撮られよう is the volitional of the passive form, meaning \"let's be photographed,\" shifting the role from photographer to subject."
 },
 "あったかいの買ってくる。二十七分、立ってると冷える。": {
  "minor": "あったかいの買ってくる。二十七分、立ってるから冷える。",
  "minorZh": "「から」表示原因（“因为站着”），而「と」表示自然结果（“站着的话就会……”），两者逻辑不同。",
  "minorEn": "から gives a reason (\"because I'm standing\"), whereas と indicates a natural consequence (\"when/if you stand...\").",
  "major": "あったかいの買ってくる。二十七分、立ってると冷やす。",
  "majorZh": "「冷やす」是及物动词“把……弄冷”，不合逻辑；正确的自动词是「冷える」“变冷”。",
  "majorEn": "冷やす is a transitive verb meaning \"to cool something down\"; the correct intransitive verb is 冷える, \"to get cold.\""
 },
 "三人とも、人を待った最長記録って、どれくらい？": {
  "minor": "三人とも、人が待った最長記録って、どれくらい？",
  "minorZh": "「人が待った」的意思是“某个人等了”，而原文是“（你）等某个人”，应该用「人を待った」。",
  "minorEn": "人が待った means \"a person waited\"; the correct particle is を (人を待った) to mean \"(you) waited for a person.\"",
  "major": "三人とも、人に待たれた最長記録って、どれくらい？",
  "majorZh": "「待たれた」是被动形，把意思从“等别人”变成了“被别人等”。",
  "majorEn": "待たれた is the passive form, changing the meaning from \"waiting for someone\" to \"being waited for by someone.\""
 },
 "ライト、色が変わる。あっち見て。": {
  "minor": "ライト、色を変える。あっち見て。",
  "minorZh": "「変える」是及物动词（“改变……”）；对于自己变化的东西，用自动词「変わる」更自然。",
  "minorEn": "変える is the transitive verb (\"to change something\"); the intransitive 変わる is more natural for something that changes on its own.",
  "major": "ライト、色が変わらない。あっち見て。",
  "majorZh": "「変わらない」是否定形，意思��“不变化”，与原意完全相反。",
  "majorEn": "変わらない is the negative form, meaning \"is not changing,\" which is the opposite of the original statement."
 },
 "右から四つ目も点いてる。あれ、うち。": {
  "minor": "右から四つ目も点けてる。あれ、うち。",
  "minorZh": "「点けてる」是及物动词（“点亮着”），把重点从“亮着”的状态微妙地转移到了某人点亮它的动作上。",
  "minorEn": "点けてる is the transitive form (\"is turning on\"), subtly shifting focus from the state of the light to the action of turning it on.",
  "major": "右から四つ目も消えてる。あれ、うち。",
  "majorZh": "「消えてる」的意思是“熄灭了”，与「点いてる」（亮着）的意思正好相反。",
  "majorEn": "消えてる (kieteru) means \"is off,\" the opposite of 点いてる (tsuiteru), \"is on.\""
 },
 "なんで、俺だったんですか。": {
  "minor": "なんで、俺なんですか。",
  "minorZh": "「なんですか」是现在时（“为什么是我？”），而「だったんですか」是过去时（“为什么当初是我？”），更符合询问一个过去的选择。",
  "minorEn": "なんですか is present tense (\"Why is it me?\"), while だったんですか is past tense (\"Why was it me?\"), fitting a past choice better.",
  "major": "なんで、俺にさせたんですか。",
  "majorZh": "「させたんですか」是使役形（“为什么你逼我做？”），完全改变了问题，从关于身份变为关于被强迫的行动。",
  "majorEn": "させたんですか is causative (\"Why did you make me do it?\"), completely changing the question from identity to a forced action."
 },
 "委員長って、毎週これやってるんですか。": {
  "minor": "委員長って、毎週これやるんですか。",
  "minorZh": "对于习惯性、持续性的动作，「やってるんですか」比「やるんですか」更自然，后者听起来有些突兀。",
  "minorEn": "やるんですか is less natural than やってるんですか for a habitual, ongoing action; it sounds abrupt.",
  "major": "委員長って、毎週これやられてるんですか。",
  "majorZh": "「やられてるんですか」是被动形，把意思从“你在做这个吗？”变成了“你每周都被人这么对待吗？”。",
  "majorEn": "やられてるんですか is the passive form, changing the meaning from \"Are you doing this?\" to \"Is this being done to you?\"."
 },
 "ありがとう。ずっと、これのおかげで読めてた。": {
  "minor": "ありがとう。ずっと、これのおかげで読んでた。",
  "minorZh": "动词形态错误；「読んでた」是「正在读」，但这里想表达「能够读」，应该用可能态「読めてた」。",
  "minorEn": "Wrong verb form; 「読んでた」 means \"was reading\", but to express \"was able to read\", the potential form 「読めてた」 is needed.",
  "major": "ありがとう。ずっと、これのせいで読まされてた。",
  "majorZh": "意思完全相反；这句话的意思是「我一直被迫在读，都怪这个」，将感谢变成了抱怨。",
  "majorEn": "The meaning is flipped; this sentence means \"I was forced to read all this time because of this\", changing gratitude to a complaint."
 },
 "じゃあ、ついでにこの字も教えてください。": {
  "minor": "じゃあ、ついでにこの字を教えてください。",
  "minorZh": "助词不完全贴切；用「を」也可以，但因为有「ついでに」（顺便），用「も」（也）来表示追加更为自然。",
  "minorEn": "The particle isn't the best fit; while 「を」 is okay, 「も」 (\"also\") is more natural with 「ついでに」 (\"while you're at it\").",
  "major": "じゃあ、ついでにこの字も教えてあげます。",
  "majorZh": "授受关系颠倒；这句变成了「那我顺便教你这个字吧」，将请求变成了自上而下的施予，非常不礼貌。",
  "majorEn": "The giving/receiving is reversed; this becomes \"Then I'll do you the favor of teaching you this character,\" changing a request into a condescending offer."
 },
 "あの一ヶ月、俺も居たよ。あんたは別の誰かになってなかった。": {
  "minor": "あの一ヶ月、俺も有ったよ。あんたは別の誰かになってなかった。",
  "minorZh": "动词使用错误；「有った」用于无生命物体，表示人的“在”应该用「居た」。",
  "minorEn": "Wrong verb; 「有った」 is used for inanimate objects, while 「居た」 should be used for a person \"being\" somewhere.",
  "major": "あの一ヶ月、俺も居たよ。あんたは別の誰かになってた。",
  "majorZh": "��思完全相反；后半句变成了「你变成了别人」，与原意「你没有变成别人」正好相反。",
  "majorEn": "The meaning is flipped; the second sentence now means \"you had turned into someone else,\" the opposite of the original intent."
 },
 "おめでとう。まずはそれを言わせて。": {
  "minor": "おめでとう。まずはそれを言って。",
  "minorZh": "动词形态错误；「言って」是命令对方「说」，而「言わせて」是请求「让我说」。",
  "minorEn": "Wrong verb form; 「言って」 is a command (\"Say it\"), while 「言わせて」 is a request (\"Let me say it\").",
  "major": "おめでとう。まずはそれを聞かせて。",
  "majorZh": "动词使用错误；这句话的意思是「先让我听听那个」，把说话的动作从自己转移到了对方。",
  "majorEn": "Wrong verb; this sentence means \"First, let me hear that,\" changing the action from the speaker saying something to the speaker hearing something."
 },
 "じゃあ、一番やめてみたら。": {
  "minor": "じゃあ、一番をやめてみたら。",
  "minorZh": "助词使用不自然；虽然「を」在语法上可行，但在“放弃（当）第一”这种语境下，省略助词「を」更自然。",
  "minorEn": "Unnatural particle use; while 「を」 is grammatically possible, it's more natural to omit it when talking about quitting a role like \"being number one\".",
  "major": "じゃあ、一番始めてみたら。",
  "majorZh": "意思完全相反；这句话的意思是「那就试着开始当第一吧」，与原意「那就别当第一了」正好相反。",
  "majorEn": "The meaning is flipped; this sentence means \"Then, how about trying to start being number one?\", the opposite of the original suggestion."
 },
 "教えようか。": {
  "minor": "教えるか。",
  "minorZh": "语气错误；「教えるか」听起来像粗鲁的反问（“我教你？”），而不是「教えようか」所表达的温和提议（“要我教你吗？”）。",
  "minorEn": "Wrong tone; 「教えるか」 sounds like a blunt, rhetorical question (\"Teach you, huh?\"), not a gentle offer like the volitional 「教えようか」 (\"Shall I teach you?\").",
  "major": "教わろうか。",
  "majorZh": "动词使用错误；「教わろうか」的意思是「要我向你请教吗？」，将“教”和“学”的对象颠倒了。",
  "majorEn": "Wrong verb; 「教わろうか」 means \"Shall I learn (from you)?\", reversing the roles of teacher and student."
 },
 "なんで、急に？": {
  "minor": "なんで、急いで？",
  "minorZh": "词语使用错误；「急いで」的意思是“赶紧、匆忙地”，而「急に」是“突然”。",
  "minorEn": "Wrong word; 「急いで」 means \"in a hurry,\" while 「急に」 means \"suddenly.\"",
  "major": "どうやって、急に？",
  "majorZh": "问法不合逻辑；这句话问的是「怎么会，突然？」，用「どうやって」（如何）来问原因不合逻辑，应该用「なんで」（为什么）。",
  "majorEn": "The question is illogical; it asks \"How, all of a sudden?\" using 「どうやって」 (how), which doesn't make sense. The logical question is \"Why?\" (なんで)."
 },
 "……発音、まだ甘い。": {
  "minor": "……発音、まだ弱い。",
  "minorZh": "表达不够地道；虽然「弱い」（弱）可以理解，但形容发音不标准、需要改进时，更地道的说法是「甘い」（天真、不严格）。",
  "minorEn": "Not idiomatic; while 「弱い」 (weak) is understandable, 「甘い」 (lit. sweet, meaning lenient/not strict) is the idiomatic way to say pronunciation needs work.",
  "major": "……発音、まだ美味しい。",
  "majorZh": "词语使用错误；这句话的意思是「……发音，还很好吃」，是无意义的。",
  "majorEn": "Wrong word; this nonsensically means \"...The pronunciation is still delicious.\""
 },
 "じゃあ今日、何もしない放課後、やってみる？": {
  "minor": "じゃあ今日、何もしない放課後を、やってみる？",
  "minorZh": "助词使用不自然；在口语中，这里的宾格助词「を」通常会被省略，加上会显得有些生硬。",
  "minorEn": "Unnatural particle use; in casual speech, the object particle 「を」 is often omitted here, so including it sounds a bit stiff.",
  "major": "じゃあ今日、何もしない放課後、やめてみる？",
  "majorZh": "意思完全相反；这句话的意思是「那我们今天别搞『什么都不做的放学后』了吧？」，与原意「要不要试试」正好相反。",
  "majorEn": "The meaning is flipped; this means \"Then shall we try stopping the do-nothing after-school today?\", the opposite of the intended suggestion."
 },
 "委員長じゃなくても、たぶん同じくらいうるさいと思う。": {
  "minor": "委員長じゃなくても、たぶん同じくらいにうるさいと思う。",
  "minorZh": "助词使用错误；「同じくらい」本身就是副词，后面不需要再加「に」。",
  "minorEn": "Wrong particle; 「同じくらい」 already functions as an adverb, so adding 「に」 after it is unnecessary and incorrect.",
  "major": "委員長じゃなくても、たぶん同じくらい静かだと思う。",
  "majorZh": "意思完全相反；这句话用了「静か」（安静），意思变成了「就算不是委员长，你大概也一样安静」。",
  "majorEn": "The meaning is flipped; by using 「静か」 (quiet) instead of 「うるさい」 (loud), it means \"you'll probably be just as quiet.\""
 },
 "来年、副委員長に立候補してみようかな。": {
  "minor": "来年、副委員長を立候補してみようかな。",
  "minorZh": "助词使用错误；竞选某个职位时，动词「立候補する」前面应该用助词「に」，而不是「を」。",
  "minorEn": "Wrong particle; the verb 「立候補する」 (to be a candidate) uses the particle 「に」 to mark the position, not 「を」.",
  "major": "来年、副委員長を応援してみようかな。",
  "majorZh": "动词使用错误；这句话的意思是「明年要不要去给副委员长加油呢」，把“自己参选”变成了“支持别人”。",
  "majorEn": "Wrong verb; this changes the meaning from \"I'll run for vice-president\" to \"I'll cheer for the vice-president.\""
 },
 "その一週間、しんどかっただろ。": {
  "minor": "その一週間、しんどいだろ。",
  "minorZh": "时态错误；因为说的是「那一周」的过去，形容词应该用过去式「しんどかった���，而不是现在时「しんどい」。",
  "minorEn": "Wrong tense; since \"that one week\" is in the past, the adjective should be in the past tense, 「しんどかった」, not the present tense, 「しんどい」.",
  "major": "その一週間、楽しかっただろ。",
  "majorZh": "意思完全相反；这句话用了「楽しかった」（很开心），意思变成了「那一周，很开心吧」，与原意正好相反。",
  "majorEn": "The meaning is flipped; this uses 「楽しかった」 (was fun), changing the meaning to \"That one week must have been fun, right?\"."
 },
 "じゃあ、俺のほうも調べてくれよ。": {
  "minor": "じゃあ、俺のほうは調べてくれよ。",
  "minorZh": "助词不完全贴切；用「は」有种转换话题的感觉，而用「も」（也）更能承接上文，表示“也帮我查一下”，语气更自然。",
  "minorEn": "The particle isn't the best fit; 「は」 feels like a topic shift (\"As for mine...\"), while 「も」 (\"also/too\") connects it to the previous action and sounds more natural.",
  "major": "じゃあ、俺のほうも調べてやるよ。",
  "majorZh": "授受关系颠倒；这句话变成了「那我也帮你查一下吧」，将“请求对方”变成了“自己要帮对方”，意思完全反了。",
  "majorEn": "The giving/receiving is reversed; this changes the sentence from a request (\"look it up for me\") to a condescending offer (\"I'll look it up for you\")."
 },
 "あのジェスチャー、光に教わったやつだよ。": {
  "minor": "あのジェスチャー、光を教わったやつだよ。",
  "minorZh": "助词使用错误；表示“向谁学习”时，对象后面应该用助词「に」或「から」，而不是「を」。",
  "minorEn": "Wrong particle; you use 「に」 or 「から」 to mark the person you learned from, not 「を」.",
  "major": "あのジェスチャー、光に教えたやつだよ。",
  "majorZh": "意思完全相反；这句话的意思是「那些手势，是我教给光的」，把“向光学习”变成了“教给光”。",
  "majorEn": "The meaning is flipped; this sentence means \"Those are the gestures I taught to Hikari,\" reversing the roles of teacher and student."
 },
 "今日、笑いすぎ。": {
  "minor": "今日、笑うすぎ。",
  "minorZh": "语法错误；「～すぎ」（太过）这个句型应该接在动词的ます形（词干）后面，所以是「笑いすぎ」，不是「笑うすぎ」。",
  "minorEn": "Wrong grammar; the 「～すぎ」 (too much) pattern attaches to the verb stem (masu-stem), so it should be 「笑いすぎ」, not 「笑うすぎ」.",
  "major": "今日、泣きすぎ。",
  "majorZh": "意思完全相反；这句话的意思是「你今天哭太多了」，与原意「笑太多了」正好相反。",
  "majorEn": "The meaning is flipped; this sentence means \"You have been crying too much today,\" the opposite of the original."
 },
 "今日は、こっちが探しに行ったんだけど。": {
  "minor": "今日は、こっちは探しに行ったんだけど。",
  "minorZh": "助词使用不当；这里用「が」是为了强调主语「こっち」（我），表达“是我去找你的”，而用「は」则失去了这层强调的意味。",
  "minorEn": "Incorrect particle; 「が」 is used here to emphasize \"I\" as the one doing the action, whereas 「は」 just marks \"me\" as the topic, losing the nuance.",
  "major": "今日は、こっちが探されに行ったんだけど。",
  "majorZh": "语法和意思错误；这句话用了被动态「探されに」，变成了「今天我为了被别人找而去了」，逻辑不通且意思颠倒。",
  "majorEn": "Grammatically wrong and meaning is flipped; this uses the passive form 「探されに」, creating the nonsensical meaning \"Today, I went in order to be searched for.\""
 },
 "疲れへんの。毎日それ。": {
  "minor": "疲れないの。毎日それ。",
  "minorZh": "方言使用不一致；「疲れないの」是标准日语的说法，如果角色在说关西腔，这里应该用「疲れへんの」。",
  "minorEn": "Inconsistent dialect; 「疲れないの」 is standard Japanese. If the character is speaking Kansai dialect, the correct form would be 「疲れへんの」.",
  "major": "疲れさせるの。毎日それ。",
  "majorZh": "意思完全错误；这句话用了使役态「疲れさせる」，意思变成了「你是要让别人累吗？」，而不是「你自己不累吗？」。",
  "majorEn": "The meaning is completely wrong; this uses the causative form 「疲れさせる」, changing the question from \"Don't you get tired?\" to \"Do you make (someone) tired?\"."
 },
 "いつ決まったん、それ。": {
  "minor": "いつ決めたん、それ。",
  "minorZh": "动词使用错误；「決めた」是及物动词，意思是“（某人）决定了”，而「決まった」是不及物动词，意思是“（事情）被决定了”。",
  "minorEn": "Wrong verb; this uses the transitive verb 「決めた」 (\"(someone) decided\"), changing the meaning from the intransitive 「決まった」 (\"it was decided\").",
  "major": "いつ決まるん、それ。",
  "majorZh": "时态错误；这句话问的是「什么时候会定下来？」，将问题从过去时（“什么时候定的”）变成了将来时。",
  "majorEn": "Wrong tense; this changes the question from the past (\"When was it decided?\") to the future (\"When will it be decided?\")."
 },
 "こっちもまだ決めてへん。": {
  "minor": "こっちもまだ決まってへん。",
  "minorZh": "动词使用错误；「決まってへん」是不及物动词，意为“（事情）还没定”，而「決めてへん」是及物动词，意为“（我）还没决定”。",
  "minorEn": "Wrong verb; this uses the intransitive verb 「決まってへん」 (\"it is not decided\"), but the context requires the transitive 「決めてへん」 (\"I have not decided\").",
  "major": "こっちももう決めた。",
  "majorZh": "意思完全相反；这句话的意思是「我也已经决定了」，与原意「我也还没决定」正好相反。",
  "majorEn": "The meaning is flipped; this sentence means \"I have already decided, too,\" the opposite of the original \"I haven't decided yet.\""
 },
 "光は、どう書いてほしい。": {
  "minor": "光は、どう書きたい。",
  "minorZh": "语法使用错误；「書きたい」是表达自己“想写”，而「書いてほしい」是询问对方“希望（我）怎么写”。",
  "minorEn": "Wrong grammar; 「書きたい」 expresses the speaker's own desire (\"I want to write\"), while 「書いてほしい」 asks about the listener's desire (\"want me to write\").",
  "major": "光は、どう書いてあげる。",
  "majorZh": "句式和语气错误；这句话变成了「我该怎么帮你写呢」，将询问对方意愿变成了自上而下的施予，语气傲慢。",
  "majorEn": "Wrong sentence structure and tone; this changes from asking for the listener's preference to a condescending offer (\"How shall I do you the favor of writing it?\")."
 },
 "じゃあ、こっちも勉強する。光が先生になる頃に、間に合わせる。": {
  "minor": "じゃあ、こっちも勉強する。光が先生になる頃に、間に合う。",
  "minorZh": "动词使用错误；「間に合う」是不及物动词，意为“赶得上”，而「間に合わせる」是及物动词，意为“使……赶上”，更能体现说话者的意志。",
  "minorEn": "Wrong verb; this uses the intransitive verb 「間に合う」 (\"to be on time\"), but the transitive verb 「間に合わせる」 (\"to make it in time\") better expresses the speaker's intent to meet a deadline.",
  "major": "じゃあ、こっちも勉強する。光が先生になる頃に、遅れる。",
  "majorZh": "意思完全相反；后半句的意思是「等你当老师的时候，我会迟到的」，与原意「我会赶上的」正好相反。",
  "majorEn": "The meaning is flipped; the second sentence now means \"I will be late for when you become a teacher,\" the opposite of the original intent."
 },
 "光の七日目は。あの日、誰かおったん？": {
  "minor": "光の七日目は。あの日、誰かいたん？",
  "minorZh": "方言使用不一致；「いたん？」是标准日语的说法，如果角色在说关西腔，这里应该用「おったん？」。",
  "minorEn": "Inconsistent dialect; 「いたん？」 is standard Japanese for \"was someone there?\". If the character speaks Kansai dialect, the correct form would be 「おったん？」.",
  "major": "光の七日目は。あの日、誰もいなかったん？",
  "majorZh": "意思完全相反；这句话问的是「那天，谁都不在吗？」，与原意「那天，有谁在吗？」正好相反。",
  "majorEn": "The meaning is flipped; this asks \"Wasn't there anyone there that day?\", the opposite of the original question \"Was there someone?\"."
 },
 "延長する。光のために残る。": {
  "minor": "延長する。光のために残す。",
  "minorZh": "动词使用错误；「残す」是及物动词，意为“留下（某物）”，而这里需要的是不及物动词「残る」，意为“（人）留下来”。",
  "minorEn": "Wrong verb; this uses the transitive verb 「残す」 (\"to leave something behind\"), while the intransitive verb 「残る」 (\"to remain/stay behind\") is required.",
  "major": "延長する。光のために帰る。",
  "majorZh": "意思完全相反；后半句的意思是「为了你而回去」，与原意「为了你留下来」正好相反。",
  "majorEn": "The meaning is flipped; the second sentence means \"I will go home for you,\" the opposite of the original intent to stay."
 },
 "行ってきます、がいいと思う。": {
  "minor": "行ってきます、はいいと思う。",
  "minorZh": "助词不完全贴切；「がいい」有“在选项中这个最好”的含义，而「はいい」只是作为一般评价“这个不错”，前者更符合选择的语境。",
  "minorEn": "The particle isn't the best fit; 「がいい」 implies \"this one is the best choice among options,\" while 「はいい」 is more of a general statement (\"this one is good\"). The former fits the context of choosing better.",
  "major": "ただいま、がいいと思う。",
  "majorZh": "词语使用错误；这句话把出门时说的「行ってきます」（我走了）换成了回家时说的「ただいま」（我回来了）。",
  "majorEn": "Wrong word; this replaces the phrase for leaving, 「行ってきます」 (\"I'm off\"), with the phrase for returning, 「ただいま」 (\"I'm home\")."
 },
 "何も言わなくても、伝わると思う。": {
  "minor": "何も言わなくても、伝えると思う。",
  "minorZh": "动词使用错误；「伝える」是及物动词，意为“传达”，需要主语。而「伝わる」是不及物动词，意为“传达到、被理解”，更符合“心意自然而然地传达到”的语境。",
  "minorEn": "Wrong verb; this uses the transitive verb 「伝える」 (\"to convey\"), which implies an active agent. The intransitive 「伝わる」 (\"to get across\") is better, suggesting the meaning gets through on its own.",
  "major": "何か言わないと、伝わらないと思う。",
  "majorZh": "意思完全相反；这句话的意思是「我觉得要是不说点什么，心意就传达不到」，与原意「就算什么都不说，也能传达到」正好相反。",
  "majorEn": "The meaning is flipped; this sentence means \"I think it won't get across unless you say something,\" the opposite of the original idea."
 },
 "先に手を振ってもいいんだよ、今度は。": {
  "minor": "先に手が振ってもいいんだよ、今度は。",
  "minorZh": "助词错误。を标记直接宾语，手を振る是“挥手”。",
  "minorEn": "The particle を marks the direct object. 手を振る means \"to wave a hand\".",
  "major": "先に手を振ってはいけないんだよ、今度は。",
  "majorZh": "意思相反。～てはいけない的意思是“不可以做～”。",
  "majorEn": "The meaning is flipped. ～てはいけない means \"you must not do~\"."
 },
 "うん。毎日、ちょっとずつ。": {
  "minor": "うん。毎日、ちょっとだけ。",
  "minorZh": "近义词错误。だけ是“只有”，而ずつ是“一点一点地”，含有循序渐进���语感。",
  "minorEn": "だけ means \"only\", while ずつ means \"a little at a time\", which fits the nuance of gradual progress better.",
  "major": "うん。毎日、ちょっとごろ。",
  "majorZh": "后缀错误。ごろ用于大概的时间，如「三時ごろ」（三点左右）。",
  "majorEn": "ごろ is used for approximate points in time, like in 三時ごろ (around 3 o'clock), not for quantities."
 },
 "もう、ずっとそうしてたつもりだけど。": {
  "minor": "もう、ずっとそうしてるつもりだけど。",
  "minorZh": "时态错误。〜たつもり指过去的想法，而〜てるつもり指现在的想法。",
  "minorEn": "The tense is slightly off; 〜たつもり refers to a past belief, while 〜てるつもり refers to a current one.",
  "major": "もう、ずっとそうしてたはずだけど。",
  "majorZh": "语法错误。はず表达客观的推测（“理应如此”），而不是主观上的自以为（つもり）。",
  "majorEn": "はず expresses an objective expectation (\"it was supposed to be\"), not a subjective belief or intention (つもり)."
 },
 "光も、自分に優しくしてね。": {
  "minor": "光も、自分を優しくしてね。",
  "minorZh": "助词错误。優しくする（温柔对待）的对象应该用助词に，而不是を。",
  "minorEn": "The target of an action like 優しくする (be nice to) is marked with the particle に, not を.",
  "major": "光も、自分に優しくさせてね。",
  "majorZh": "使役动词。させて的意思是“让我做”，句子意思变成了“让我对你温柔一点吧”。",
  "majorEn": "Using the causative form させて changes the meaning to \"Let me be nice to you\"."
 },
 "今、葉っぱが勝手にどいた。": {
  "minor": "今、葉っぱを勝手にどかした。",
  "minorZh": "他动词。どかした是及物动词（“（某人）把它移开”），与勝手に（“自己”）矛盾。应使用不及物动词どいた。",
  "minorEn": "どかした is a transitive verb (\"someone moved it\"), which contradicts 勝手に (\"on its own\"). The intransitive どいた (\"it moved\") is correct.",
  "major": "今、葉っぱが勝手にどかれた。",
  "majorZh": "动词变位错误。どく是不及物动词，没有被动形态（どかれた）。",
  "majorEn": "どく is an intransitive verb (\"to move aside by itself\") and cannot be put into the passive form (どかれた)."
 },
 "「最近」も「この前」も、こっちの単位とちゃうやろ。": {
  "minor": "「最近」も「この前」も、こっちの単位にちゃうやろ。",
  "minorZh": "���词错误。ちゃう（違う）表示“和...不同”时，比较的对象要用と。",
  "minorEn": "The verb ちゃう (違う), \"to be different,\" takes the particle と for comparison, not に.",
  "major": "「最近」も「この前」も、こっちの単位を変わるやろ。",
  "majorZh": "动词错误。変わる是“变化”的意思，句子意思完全改变了。",
  "majorEn": "変わる means \"to change,\" which completely alters the meaning from \"is not the same as\" to \"it changes into.\""
 },
 "千年って、退屈せえへんの。": {
  "minor": "千年って、退屈がせえへんの。",
  "minorZh": "助词错误。退屈是サ变动词，可以直接连接する（或せえへん），不需要助词が。",
  "minorEn": "退屈 is a suru-verb; it can directly combine with する (or its negative form せえへん) without a particle like が.",
  "major": "千年って、退屈するん。",
  "majorZh": "意思相反。するん是肯定形式（“会无聊吗？”），而せえへんの是否定形式（“不会无聊吗？”）。",
  "majorEn": "The meaning is flipped. するん is affirmative (\"Do you get bored?\"), while せえへんの is negative (\"Don't you get bored?\")."
 },
 "四本目は、誰が植えるん。": {
  "minor": "四個目は、誰が植えるん。",
  "minorZh": "量词错误。本是树苗的正确量词，而個通常用于小的、圆的东西。",
  "minorEn": "本 is the correct counter for long, thin objects like saplings; 個 is a general counter for smaller items.",
  "major": "四本目は、誰が育てるん。",
  "majorZh": "动词错误。育てる是“培育、养育”已经种下的植物，而不是“种植”（植える）。",
  "majorEn": "The verb is wrong. 育てる means \"to raise/nurture,\" while the context requires 植える, meaning \"to plant.\""
 },
 "稲荷がやってみ。": {
  "minor": "稲荷をやってみ。",
  "minorZh": "助词错误。を会把稲荷变成宾语，意思是“扮演一下稻荷”，而不是让她做动作的主语。",
  "minorEn": "Using を makes \"Inari\" the object of the action, changing the meaning to \"Do Inari\" instead of \"Inari, you do it.\"",
  "major": "稲荷がやめてみ。",
  "majorZh": "动词错误。やめてみ是“试试停下”，和やってみ（“试试看”）意思相反。",
  "majorEn": "The verb is the opposite. やめてみ means \"Try stopping,\" while やってみ means \"Try doing it.\""
 },
 "その面、ちょっと見せて。": {
  "minor": "その面、ちょっと見て。",
  "minorZh": "动词错误。見て是请求对方“看”，而不是“给我看”（見せて）。",
  "minorEn": "",
  "major": "その面、ちょっと見られて。",
  "majorZh": "动词变位错误。見られて是被动态的て形（“被看见”），不能用于请求。",
  "majorEn": "This uses the passive form 見られて (\"to be seen\"), which cannot be used to make a request like this."
 },
 "その一行、俺のじゃろ。": {
  "minor": "その一行、俺にじゃろ。",
  "minorZh": "助词错误。の表示所有权（“我的”），而に表示对象（“给我的”），不符合此句型。",
  "minorEn": "The particle の indicates possession (\"mine\"). に would mean \"to me,\" which doesn't fit the structure.",
  "major": "その一行、俺からじゃろ。",
  "majorZh": "助词错误。から是“从...”，句意变成了“那一行是从我这里来的吧？”。",
  "majorEn": "The particle から means \"from,\" flipping the meaning to \"That line is from me, isn't it?\"."
 },
 "書かんでええ。勝手に来るし。": {
  "minor": "書けんでええ。勝手に来るし。",
  "minorZh": "动词变位错误。書けん是可能形的否定（“不能写”），而不是普通否定（書かん，“不写”）。",
  "minorEn": "",
  "major": "書いてええ。勝手に来るし。",
  "majorZh": "意思相反。書いてええ的意思是“可以写”，与原文相反。",
  "majorEn": "The meaning is the opposite. 書いてええ means \"It's okay to write.\""
 },
 "今度は、稲荷が覚えられる番や。": {
  "minor": "今度は、稲荷が覚える番や。",
  "minorZh": "主动/被动错误。覚える是主动形式（“去记”），而不是被动形式覚えられる（“被记”）。",
  "minorEn": "Using the active verb 覚える changes the meaning to \"it's your turn to remember,\" not \"to be remembered.\"",
  "major": "今度は、稲荷が覚えさせる番や。",
  "majorZh": "使役动词。覚えさせる是使役形式，意思是“让别人记住”。",
  "majorEn": "Using the causative verb 覚えさせる changes the meaning to \"it's your turn to make someone remember.\""
 },
 "今日一日、人の時間で過ごしてみ。": {
  "minor": "今日一日、人の時間に過ごしてみ。",
  "minorZh": "助词错误。で表示范围或方式（“以人的时间度过”），在此处是正确的；��不适用。",
  "minorEn": "The particle で indicates the context or means (\"by way of human time\"), which is correct here; に would be incorrect.",
  "major": "今日一日、人の時間で暮らしてみ。",
  "majorZh": "动词错误。暮らす有“生活、度日”等长期意味，不适合用于度过一天。",
  "majorEn": "The verb 暮らす implies \"to live\" or \"make a living,\" which doesn't fit the context of spending a single day. 過ごす is correct."
 },
 "もしかして、怖い？": {
  "minor": "もしかして、怖いだ？",
  "minorZh": "语法错误。像怖い这样的い形容词后面不需要加だ就可以构成问句。",
  "minorEn": "い-adjectives like 怖い connect directly to sentence endings; they do not use だ.",
  "major": "もしかして、怖がらせる？",
  "majorZh": "动词错误。怖がらせる是使役动词，意思是“吓唬（某人）”。",
  "majorEn": "This uses the causative verb 怖がらせる, changing the question to \"Are you trying to scare (me/someone)?\""
 },
 "窓際、譲るよ。一番よく見えるところ。": {
  "minor": "窓際、譲るよ。一番よく見るところ。",
  "minorZh": "动词错误。見る是主动的“看”，而見える是“能看见、看得到”，在这里更自然。",
  "minorEn": "見る is the active verb \"to look,\" while 見える means \"to be visible\" or \"can be seen,\" which is more natural here.",
  "major": "窓際、譲ってもらうよ。",
  "majorZh": "授受关系错误。譲ってもらう是“请别人让给我”，变成了索要座位，而不是主动让座。",
  "majorEn": "The giving/receiving is reversed. 譲ってもらう means \"I'll have you give it to me,\" which is a demand, not an offer."
 },
 "書くよ。": {
  "minor": "書こうよ。",
  "minorZh": "意志形。書こう是意志形（“我们写吧”），用于提议，而不是表达个人意图。",
  "minorEn": "",
  "major": "書かせるよ。",
  "majorZh": "使役动词。書かせる是使役形，意思是“我让（你）写”。",
  "majorEn": "This is the causative form 書かせる, which means \"I'll make you write,\" completely changing the agent."
 },
 "稲荷の名前も、こっちに書いていい？": {
  "minor": "稲荷の名前も、こっちで書いていい？",
  "minorZh": "助词错误。に表示书写的目的地（写“在”纸“上”）；で表示动作发生的场所，不够贴切。",
  "minorEn": "The particle に marks the surface onto which one writes. で would imply the location where the action takes place, which is less fitting.",
  "major": "稲荷の名前も、こっちに書いてくれる？",
  "majorZh": "授受关系错误。書いてくれる是请求对方来写（“你能帮我写吗？”），把写字的人从“我”换成了“你”。",
  "majorEn": "書いてくれる？ is a request for the listener to do the writing (\"Will you write it for me?\"), changing who performs the action."
 },
 "今日で、何日目？": {
  "minor": "今日は、何日目？",
  "minorZh": "助词错误。で强调“到今天为止是第几天”；は只是把“今天”作为话题。",
  "minorEn": "The particle で emphasizes that today marks a point in a sequence (\"as of today\"), while は simply sets \"today\" as the topic.",
  "major": "今日は、何日？",
  "majorZh": "疑问词错误。何日问的是日期（“几号”），而不是经过的天数（何日目，“第几天”）。",
  "majorEn": "This asks a different question. 何日？ asks for the date (e.g., \"the 15th\"), while 何日目？ asks for the ordinal day (\"the 15th day\")."
 },
 "約束してへんやろ。": {
  "minor": "約束せえへんやろ。",
  "minorZh": "时态错误。せえへん是一般否定式（“不约定”��，而してへん是否定完成式（“还没约定”）。",
  "minorEn": "",
  "major": "約束したやろ。",
  "majorZh": "意思相反。した是肯定的过去式（“我们约好了”），与否定相反。",
  "majorEn": "The meaning is the opposite. した is the affirmative past tense (\"we did promise\")."
 },
 "どんくらい待っててん。": {
  "minor": "どんくらい待ってん。",
  "minorZh": "时态错误。待ってん（待ってるの）是现在进行时（“你在等吗？”），而待っててん（待っていたの）是过去进行时（“你等了多久了？”）。",
  "minorEn": "",
  "major": "どんくらい待たせてん。",
  "majorZh": "使役动词。待たせてん的意思是“我让你等了多久？”，改变了动作的主语。",
  "majorEn": "This uses the causative verb 待たせる, changing the question to \"How long have I made you wait?\"."
 },
 "三本勝負やろ。もう勝ってるやん。": {
  "minor": "三本勝負やろ。もう勝ってやん。",
  "minorZh": "动词变位错误。勝って是て形，用于连接句子；这里需要用过去进行时勝ってる。",
  "minorEn": "",
  "major": "三本勝負やろ。もう負けてるやん。",
  "majorZh": "动词错误。負けてる是“输了”的意思，与“赢了”相反。",
  "majorEn": "The verb is the opposite. 負けてる means \"you're losing/have lost.\""
 },
 "あんた、勝ち負けどうでもええんちゃう？": {
  "minor": "あんた、勝ち負けどうでもええやろ？",
  "minorZh": "语感错误。やろ？是直接确认（“……对吧？”），而んちゃう？是更委婉的推测性提问（“该不会是……”）。",
  "minorEn": "",
  "major": "あんた、勝ち負け大事やん。",
  "majorZh": "意思相反。大事是“重要”的意思，句子意思变成了“输赢很重要，不是吗？”。",
  "majorEn": "The meaning is the opposite. 大事 means \"important,\" so the sentence becomes \"Winning and losing is important, isn't it?\"."
 },
 "真希。": {
  "minor": "真希は。",
  "minorZh": "助词错误。は把“真希”变成了话题（“那真希呢？”），而不是单纯地呼唤名字。",
  "minorEn": "",
  "major": "真希です。",
  "majorZh": "句式错误。です用于自我介绍，意思是“我是真希”。",
  "majorEn": "This is a self-introduction. 真希です means \"I am Maki.\""
 },
 "今、何時？": {
  "minor": "今、何時だ？",
  "minorZh": "语法错误。加上だ会使语气更生硬或偏男性化，通常直接说何時？更自然。",
  "minorEn": "",
  "major": "今、何時間？",
  "majorZh": "疑问词错误。何時間问的是“几个小时”，是时长，而不是“几点了”（何時）。",
  "majorEn": "This asks the wrong question. 何時間 means \"how many hours\" (a duration), not \"what time\" (a point in time)."
 },
 "理由、なくてもええねんで。": {
  "minor": "理由をなくてもええねんで。",
  "minorZh": "在「なくても」前不应该用助词「を」。",
  "minorEn": "The particle を is incorrect before なくても.",
  "major": "理由、なくてもあかんねんで。",
  "majorZh": "这句话的意思正好相反：「没有理由是不行的。」",
  "majorEn": "This means the opposite: \"It's not okay to be without a reason.\""
 },
 "水曜、いつも何時までおるん。": {
  "minor": "水曜、いつも何時におるん。",
  "minorZh": "「何時に」问的是“几点在（几点到）”，而「何時まで」问的是“待到几点”。",
  "minorEn": "に asks \"at what time,\" while まで asks \"until what time.\"",
  "major": "水曜、いつも何時まであるん。",
  "majorZh": "「ある」用于无生命物体，对人用「おる」或「いる」。",
  "majorEn": "ある is for inanimate objects; for people, you must use おる or いる."
 },
 "ふーん、通り道な。": {
  "minor": "ふーん、通り道をな。",
  "minorZh": "这里不需要宾格助词「を」，「通り道」本身就是理由。",
  "minorEn": "The object particle を is not needed; 通り道 acts as a reason or state here.",
  "major": "ふーん、近道な。",
  "majorZh": "这句话的意思变成了「哦，抄近路啊」，改变了“只是路过”的原意。",
  "majorEn": "This changes the meaning to \"Oh, a shortcut,\" which is different from \"just passing by.\""
 },
 "今日は真希が決めてええよ。なにしたい。": {
  "minor": "今日は真希が決めてええよ。なにしたいですか。",
  "minorZh": "前半句是关西方言简体（ええよ），后半句却是敬体（ですか），文体不统一。",
  "minorEn": "The first part is casual dialect (ええよ), but the second is polite (ですか). The politeness level should be consistent.",
  "major": "今日は真希が決めてくれるよ。なにしたい。",
  "majorZh": "「決めてくれる」的意思是“她会为我决定”，与让对方自己决定的原意相反。",
  "majorEn": "決���てくれる means \"she will decide for me,\" which is the opposite of letting her decide for herself."
 },
 "この十個、全部一人でやったんやろ。": {
  "minor": "この十人、全部一人でやったんやろ。",
  "minorZh": "量词用错了，名单上的条目应该用「個」，而不是用于数人的「人」。",
  "minorEn": "The counter for items on a list is 個 (ko), not 人 (nin), which is for counting people.",
  "major": "この十個、全部一人でやらせたんやろ。",
  "majorZh": "「やらせた」是使役态，意思是“你让别人做的”，与“你自己做的”原意相反。",
  "majorEn": "やらせた is the causative form, meaning \"you made someone do it,\" which is the opposite of doing it yourself (やった)."
 },
 "真希、名字なんて言うん。": {
  "minor": "真希、名字をなんて言うん。",
  "minorZh": "有了「なんて」，就不需要再加助词「を」了。",
  "minorEn": "The particle を is unnecessary when なんて is already used.",
  "major": "真希、名字なんて呼ぶん。",
  "majorZh": "询问姓名时用「言う」，而「呼ぶ」是“呼唤”或“称呼”的意思，这是典型的中式日语错误。",
  "majorEn": "For asking a name, you use 言う (to be called), not 呼ぶ (to call/summon). This is a common L1 interference error."
 },
 "うん、一緒に。": {
  "minor": "うん、一緒で。",
  "minorZh": "表示状态时应用助词「に」，「で」表示方式或手段。",
  "minorEn": "The particle に indicates a state (\"together\"), while で implies means (\"by means of being together\").",
  "major": "うん、一人で。",
  "majorZh": "这句话的意思完全相反：「嗯，一个人。」",
  "majorEn": "This means the exact opposite: \"Yeah. Alone.\""
 },
 "勝負でもいいよ。手加減しないで。": {
  "minor": "勝負でもいいよ。手加減しなくて。",
  "minorZh": "「しなくて」是「て形」的否定，需要接「もいい」等，表示请求或命令的否定是「しないで」。",
  "minorEn": "しなくて is the negative te-form and must be followed by something like もいい; the negative request form is しないで.",
  "major": "勝負でもいいよ。手加減して。",
  "majorZh": "这句话的意思正好相反：「对我手下留情。」",
  "majorEn": "This means the opposite: \"Please go easy on me.\""
 },
 "先にマキのプレイ、見せて。": {
  "minor": "先にマキのプレイ、見て。",
  "minorZh": "「見て」是“你看”，但说话人是想说“给我看”，即「見せて」。混淆了“看”和“展示”。",
  "minorEn": "",
  "major": "先にマキのプレイ、見せてあげる。",
  "majorZh": "「見せてあげる」的意思是“我给你看”，把玩家和真希的角色颠倒了。",
  "majorEn": "見せてあげる means \"I'll show you,\" which reverses the roles of the speaker and listener."
 },
 "約束する。一番に。": {
  "minor": "約束する。一番で。",
  "minorZh": "助词「で」表示方式，而「に」在这里表示顺序（“作为第一”）。",
  "minorEn": "The particle で is for means, while に is used here to indicate order (\"as the first thing\").",
  "major": "約束する。全部。",
  "majorZh": "这句话的意思从“第一”变成了“全部”，改变了约定的内容。",
  "majorEn": "This changes the meaning from \"First\" to \"Everything,\" altering the content of the promise."
 },
 "始まる前に、一回褒めとく。ここまで来たの、すごいよ。": {
  "minor": "始まる前に、一回褒めといて。ここまで来たの、すごいよ。",
  "minorZh": "「褒めといて」是请求对方“你先夸奖一下���，而说话人是想说“我先夸奖一下”（褒めとく）。",
  "minorEn": "",
  "major": "始まる前に、一回褒められとく。ここまで来たの、すごいよ。",
  "majorZh": "「褒められとく」是被动态，意思是“我先被夸奖一下”，这在逻辑上不通。",
  "majorEn": "褒められとく is passive (\"I will be praised in advance\"), which makes no sense here as the speaker is the one doing the praising."
 },
 "負けたら、ざぁこって言ってあげる。": {
  "minor": "負けたら、ざぁこって言ってくれる。",
  "minorZh": "「言ってくれる」的主语是对方，意思是“你会为我说”，把说“ざぁこ”的人从“我”变成了“你”。",
  "minorEn": "",
  "major": "負けたら、ざぁこって言ってもらう。",
  "majorZh": "「言ってもらう」的意思是“我会让你说”，暗示强迫对方说自己是“ざぁこ”。",
  "majorEn": "言ってもらう means \"I will have you say it,\" which implies forcing the listener to call themselves a loser."
 },
 "お茶碗、全部二つずつなんですね。": {
  "minor": "お茶碗、全部二つだけなんですね。",
  "minorZh": "「二つだけ」是“只有两个”的意思，而「二つずつ」是“每样两个”或“成对”的意思。",
  "minorEn": "二つだけ means \"only two,\" while 二つずつ means \"two of each\" or \"in pairs.\"",
  "major": "お茶碗、全部二人のずつなんですね。",
  "majorZh": "「二人」是用来数人的量词，不能用来数碗。",
  "majorEn": "二人 is the counter for people, not for objects like bowls (お茶碗)."
 },
 "いただきます。……うまい。ほんとに。": {
  "minor": "いただきます。……うまい。ほんとで。",
  "minorZh": "助词「で」在这里用法错误，表示强调时应用「に」或不用助词。",
  "minorEn": "The particle で is incorrect here for emphasis; it should be に or no particle.",
  "major": "いただきます。……まずい。ほんとに。",
  "majorZh": "「まずい」的意思是“难吃”，与夸奖对方的「うまい」（好吃）意思完全相反。",
  "majorEn": "まずい means \"tastes bad,\" which is the opposite of the intended compliment うまい (delicious)."
 },
 "次は俺が作ります。食べに来てください。": {
  "minor": "次は俺が作ります。食べに来てあげます。",
  "minorZh": "「来てあげます��的意思是“（我）来是给你面子”，但说话人是在邀请对方来。",
  "minorEn": "",
  "major": "次は俺が作ります。食べて来てください。",
  "majorZh": "「食べて来てください」的意思是“请吃完饭再过来”，与邀请对方来吃饭的原意相反。",
  "majorEn": "食べて来てください means \"Please eat before you come,\" which is the opposite of an invitation to eat at the speaker's place."
 },
 "それ、誰の分ですか。": {
  "minor": "それ、誰が分ですか。",
  "minorZh": "表示所属关系应用助词「の」，而不是「が」。",
  "minorEn": "The possessive particle is の, not が.",
  "major": "それ、誰の物ですか。",
  "majorZh": "「誰の物」问的是所有权（“这是谁的东西”），而「誰の分」问的是给谁准备的（“这是谁的份”）。",
  "majorEn": "誰の物 asks about ownership (\"Whose is it?\"), while 誰の分 asks who it is for (\"Whose portion is it?\")."
 },
 "俺、書いといてください。": {
  "minor": "俺、描いといてください。",
  "minorZh": "「描いて」用于画画，在名单上写名字应该用「書いて」。",
  "minorEn": "描���て is for drawing pictures; for writing names, you should use 書いて.",
  "major": "俺、書いといてあげます。",
  "majorZh": "「書いておいてあげます」意思是“我帮你写上”，与请求对方把自己写上的原意相反。",
  "majorEn": "書いておいてあげます means \"I'll write you down,\" which is the opposite of the speaker's request to be written down."
 },
 "深雪さんが倒れたら、誰が作るんですか。": {
  "minor": "深雪さんが倒れるなら、誰が作るんですか。",
  "minorZh": "「なら」用于基于对方言论的假设，对于单纯的未来假设，「たら」更自然。",
  "minorEn": "なら is used for a different kind of conditional (\"if it's the case that...\"); たら is more natural for a simple future \"if.\"",
  "major": "深雪さんが倒したら、誰が作るんですか。",
  "majorZh": "「倒したら」是及物动词，意思是“如果你推倒（某物/某人）”，而不是“如果你倒下”。",
  "majorEn": "倒したら is transitive and means \"if you knock (something/someone) over,\" not \"if you fall/collapse.\""
 },
 "深雪。": {
  "minor": "深雪さん。",
  "minorZh": "加上「さん」会使称呼显得更礼貌、有距离感，改变了直呼其名的亲密感。",
  "minorEn": "Adding さん makes the address more polite and distant, changing the intended intimate tone.",
  "major": "深雪が。",
  "majorZh": "这不是称呼，而是一个不完整的句子，意思是“深雪她……”。",
  "majorEn": "This is not a form of address, but an incomplete sentence fragment starting with a subject (\"Miyuki...\")."
 },
 "今日は何もせんといてください。俺、おるんで。": {
  "minor": "今日は何もせんでいてください。俺、おるんで。",
  "minorZh": "「せんでいて」是错误的变位，正确的关西方言说法是「せんといて」。",
  "minorEn": "",
  "major": "今日は何もせんといてください。俺、おらんので。",
  "majorZh": "「おらんので」的意思是“因为我不在”，让整个句子的逻辑完全反了。",
  "majorEn": "おらんので means \"because I'm not here,\" which reverses the logic of the sentence."
 },
 "どう呼ばれたいですか。": {
  "minor": "どう呼べたいですか。",
  "minorZh": "「呼べたい」是错误的可能态变位，正确的形式是「呼ばれたい」（想被叫）。",
  "minorEn": "呼べたい is an incorrect potential form; the correct form is 呼ばれたい (want to be called).",
  "major": "どう呼びたいですか。",
  "majorZh": "「呼びたいですか」的意思是“你想怎么称呼（别人）？”，问的是对方的意愿，而不是她想被怎么称呼。",
  "majorEn": "呼びたいですか means \"How do you want to call (someone)?\", asking about her preference, not how she wants to be called."
 },
 "深雪は、行きたい？": {
  "minor": "深雪が、行きたい？",
  "minorZh": "用「が」会过分强调主语“深雪”，有“难道是‘你’想去吗”的质问语气，不如「は」自然。",
  "minorEn": "Using が puts a strong, often contrastive, emphasis on \"Miyuki,\" which sounds unnatural for a simple question.",
  "major": "深雪は、行かせたい？",
  "majorZh": "「行かせたい」是使役态，意思是“你想让（别人）去吗？”，而不是问她自己是否想去。",
  "majorEn": "行かせたい means \"Do you want to make (someone) go?\", which is different from asking if she herself wants to go."
 },
 "福引、当たったの？本当に？": {
  "minor": "福引、勝ったの？本当に？",
  "minorZh": "「勝つ」用于比赛或竞争，而抽奖、彩票中奖应该用「当たる」。",
  "minorEn": "",
  "major": "福引、当たらなかったの？本当に？",
  "majorZh": "这句话的意思被反转了，变成了“你没中奖吗？真的假的？”",
  "majorEn": "This flips the question to the negative: \"You didn't win the raffle? Really?\""
 },
 "行く。理由はいらないよ。": {
  "minor": "行く。理由は必要ないよ。",
  "minorZh": "「必要ない」虽然意思正确，但比「いらない」更书面、生硬，在口语中不太自然。",
  "minorEn": "必要ない is correct but sounds more formal and stiff than the casual いらない, which fits the context better.",
  "major": "行く。理由を知らないよ。",
  "majorZh": "「知らない」是“不知道”，把“不需要理由”的意思变成了“我不知道理由”。",
  "majorEn": "知らない means \"I don't know,\" changing the meaning from \"You don't need a reason\" to \"I don't know the reason.\""
 },
 "今日は座ってて。こっちが作る。": {
  "minor": "今日は座って。こっちが作る。",
  "minorZh": "「座って」是“坐下”（动作），而「座ってて」是“坐着别动”（状态），后者更符合语境。",
  "minorEn": "",
  "major": "今日は触ってて。こっちが作る。",
  "majorZh": "「触ってて」的意思是“一直摸着”，在这个语境下完全说不通。",
  "majorEn": "触ってて means \"Keep touching,\" which is a completely different and nonsensical verb for this situation."
 },
 "謝るの、今日は禁止。": {
  "minor": "謝るは、今日は禁止。",
  "minorZh": "应使用动词名词化的「の」，而非主语标记「は」。",
  "minorEn": "The nominalizing particle の should be used, not the topic marker は.",
  "major": "謝るの、今日は許可。",
  "majorZh": "意思完全相反，从“禁止”变成了“许可”。",
  "majorEn": "This flips the meaning from \"forbidden\" to \"permitted\"."
 },
 "あれ、二週間前に付けられたんだ。話すと長いけど。": {
  "minor": "あれ、二週間前で付けられたんだ。話すと長いけど。",
  "minorZh": "表示特定时间点时应用助词「に」，而非「で」。",
  "minorEn": "The particle に should be used for a specific point in time, not で.",
  "major": "あれ、二週間前に付けたんだ。話すと長いけど。",
  "majorZh": "动词从被动态（被起外号）变成了主动态（我起了外号），意思完全颠倒。",
  "majorEn": "This changes the verb from passive (\"was given\") to active (\"I gave\"), reversing the meaning."
 },
 "奈緒もそう呼んでいいよ。": {
  "minor": "奈緒はそう呼んでいいよ。",
  "minorZh": "使用了「は」而没有使用「も」，失去了“你也”的含义。",
  "minorEn": "Using は instead of も loses the meaning of \"you too.\"",
  "major": "奈緒もそう呼ぶなよ。",
  "majorZh": "意思完全相反，从“可以这么叫”变成了“别这么叫”。",
  "majorEn": "This flips the meaning from \"you can call me that\" to \"don't call me that.\""
 },
 "気にしてるの、呼び方じゃないだろ。": {
  "minor": "気にしてるの、呼び方をじゃないだろ。",
  "minorZh": "「じゃない」前接名词时不需要助词「を」。",
  "minorEn": "The particle を is unnecessary and incorrect before じゃない.",
  "major": "気にしてるの、呼び方だろう。",
  "majorZh": "意思完全相反，从“不是……”的否定推测变成了“是……”的肯定推测。",
  "majorEn": "This flips the sentence from a negative assumption (\"it isn't...\") to an affirmative one (\"it is...\")."
 },
 "じゃあ、一個足そう。今日から。": {
  "minor": "じゃあ、一個を足そう。今日から。",
  "minorZh": "虽然语法上可行，但在这里省略助词「を」更自然；加上「を」是学习者常有的习惯。",
  "minorEn": "While grammatically possible, omitting the particle を is more natural here; adding it is a common learner habit.",
  "major": "じゃあ、一個足される。今日から。",
  "majorZh": "把“我们来加一条吧”的意志形，说成了“一条会被加上”的被动形，不自然且改变了说话者的角色。",
  "majorEn": "This changes the volitional (\"let's add\") to passive (\"will be added\"), making the sentence unnatural and changing the speaker's role."
 },
 "それも今の俺だよ。古くなってない。": {
  "minor": "それも今の俺だよ。古くならない。",
  "minorZh": "「古くならない」指“不会变旧”（将来/一般情况），而正确的「古くなってない」指“还没变旧”（当前状态）。",
  "minorEn": "古くならない means \"won't become old\" (future/general), while the correct 古くなってない means \"has not become old\" (current state).",
  "major": "それも今の俺だよ。古くなった。",
  "majorZh": "意思完全相反，从“没变旧”变成了“已经变旧了��。",
  "majorEn": "This flips the meaning from \"has not become old\" to \"has become old.\""
 },
 "逆に聞くけど。この十年の奈緒、俺は何を知らない？": {
  "minor": "逆に聞くけど。この十年の奈緒、俺は何が知らない？",
  "minorZh": "动词「知る」的宾语通常用「を」来标记，而不是「が」。",
  "minorEn": "The direct object of the verb 知る is typically marked by を, not が.",
  "major": "逆に聞くけど。この十年の奈緒、俺は何を知っている？",
  "majorZh": "问题完全反了，从“我不知道什么？”变成了“我知道什么？”。",
  "majorEn": "This flips the question from \"What don't I know?\" to \"What do I know?\""
 },
 "あれな、先週の朝礼で——": {
  "minor": "あれな、先週の朝礼に——",
  "minorZh": "「に」表示存在的地点，而「で」表示动作发生的地点。",
  "minorEn": "に marks a location of existence, while で marks the location of an action.",
  "major": "あれな、先週の朝礼を——",
  "majorZh": "「を」标记直接宾语，在此处没有意义，因为这句话只是在交代背景。",
  "majorEn": "を marks a direct object, which makes no sense here as the phrase is setting a scene."
 },
 "今の顔、なに。": {
  "minor": "今の顔は、なに。",
  "minorZh": "加上「は」使句子听起来更刻意，不像自然的、突然的疑问。",
  "minorEn": "Adding は makes the sentence more deliberate and less like a natural, sudden question.",
  "major": "今の顔、だれ。",
  "majorZh": "问一个表情“是谁”不合逻辑。",
  "majorEn": "It is illogical to ask \"who\" a facial expression is."
 },
 "ほな、奈緒しか分からんやつ、一個教えて。": {
  "minor": "ほな、奈緒しか分からんやつ、一人教えて。",
  "minorZh": "东西（やつ）的量词应该是「個」，而不是用于人的「人」。",
  "minorEn": "The counter for things (やつ) should be 個 (ikko), not 人 (hitori), which is for people.",
  "major": "ほな、奈緒しか分かるやつ、一個教えて。",
  "majorZh": "语法「しか」（只有）必须与否定动词（分からない/分からん）一起使用。",
  "majorEn": "The grammar pattern しか (only) must be used with a negative verb form (分からない/分からん)."
 },
 "俺、変わってへんよ。": {
  "minor": "俺、変わらへんよ。",
  "minorZh": "「変わらへん」是“不改变/不会改变”，而正确的「変わってへん」是“没有变”。",
  "minorEn": "変わらへん means \"I don't/won't change,\" whereas the correct 変わってへん means \"I haven't changed.\"",
  "major": "俺、変わったんよ。",
  "majorZh": "意思完全相反，从“我没有变”变成了“我变了”。",
  "majorEn": "This flips the meaning from \"I haven't changed\" to \"I have changed.\""
 },
 "ほな、奈緒もこっち来たらええやん。": {
  "minor": "ほな、奈緒もこっち来ればええやん。",
  "minorZh": "在这种随意的建议中，「～たら」比略显生硬的「～れば」更自然。",
  "minorEn": "In this kind of casual suggestion, ～たら is more natural than the slightly stiffer ～れば.",
  "major": "ほな、奈緒もこっち来るはずやん。",
  "majorZh": "意思从“你不如过来吧”的建议，变成了“你应该会过来吧”的断言。",
  "majorEn": "This changes the meaning from a suggestion (\"why don't you come\") to an assertion (\"you're supposed to come\")."
 },
 "奈緒、遅れてへんよ。ずっと書いとったやん。": {
  "minor": "奈緒、遅らしてへんよ。ずっと書いとったやん。",
  "minorZh": "使用了他动词「遅らす」（使……延迟），而非正确的自动词「遅れる」（落后）。",
  "minorEn": "Uses the transitive verb 遅らす (\"to delay something\") instead of the intransitive 遅れる (\"to fall behind\").",
  "major": "奈緒、遅れてへんよ。ずっと書いてへんかったやん。",
  "majorZh": "后半句与前半句矛盾，变成了“你不是一直在记”，而不是“你一直在记”。",
  "majorEn": "The second half contradicts the first, saying \"you weren't writing\" instead of \"you were writing.\""
 },
 "帰るとき、奈緒も一緒に来て。": {
  "minor": "帰るとき、奈緒も一緒に来てください。",
  "minorZh": "使用敬语「来てください」在这种亲密的情景下显得过于正式和疏远。",
  "minorEn": "Using the polite form 来てください sounds too formal and distant for this intimate situation.",
  "major": "帰るとき、奈緒も一緒に来る。",
  "majorZh": "句子从“跟我一起来”的请求变成了“你会跟我一起来”的陈述。",
  "majorEn": "This changes the sentence from a request (\"come with me\") to a simple statement of fact (\"you will come with me\")."
 },
 "歩くのが、前より半歩速くなった。": {
  "minor": "歩くのは、前より半歩速くなった。",
  "minorZh": "「は」把“走路”作为普遍性话题，而「が」更适合描述一个具体的观察。",
  "minorEn": "は makes \"walking\" a general topic, whereas が is more natural for highlighting a specific observation.",
  "major": "歩くのが、前より半歩速くした。",
  "majorZh": "动词从“变快了”（自然变化）变成了“弄快了”（刻意行为）。",
  "majorEn": "This changes the verb from \"became\" (a natural change) to \"made it\" (a deliberate action)."
 },
 "笑う前に、一回まばたきする。": {
  "minor": "笑った前に、一回まばたきする。",
  "minorZh": "语法「～前に」前面必须使用动词的原形，而不是过去式。",
  "minorEn": "The grammar pattern ～前に requires the dictionary form of the verb, not the past tense.",
  "major": "笑うために、一回まばたきする。",
  "majorZh": "意思从“笑之前”变成了“为了笑”，暗示眨眼是笑的前提。",
  "majorEn": "This changes the meaning from \"before laughing\" to \"in order to laugh,\" implying the blink is a prerequisite for laughing."
 },
 "字が、前より大きくなった。": {
  "minor": "字は、前より大きくなった。",
  "minorZh": "「は」把“字”作为普遍性话题，而「が」更适合描述一个具体的观察。",
  "minorEn": "は makes \"handwriting\" a general topic, whereas が is more natural for highlighting a specific observation.",
  "major": "字が、前より大きくした。",
  "majorZh": "动词从“变大了”（自然变化）变成了“写大了”（刻意行为）��",
  "majorEn": "This changes the verb from \"got bigger\" (a natural change) to \"made it bigger\" (a deliberate action)."
 },
 "十年後も、奈緒の隣を歩いてますか。": {
  "minor": "十年後も、奈緒の隣に歩いてますか。",
  "minorZh": "「に」表示走向旁边，而「を」才正确地表示沿着旁边走。",
  "minorEn": "に would imply walking to her side, whereas を correctly indicates movement along her side.",
  "major": "十年後も、奈緒の隣を歩かせますか。",
  "majorZh": "意思从“我是否在走”变成了“你是否会让我走”，混淆了动词的使役态。",
  "majorEn": "This changes the question from \"am I walking\" to \"will you make me walk?\", confusing the verb's voice."
 },
 "十年後の日本語は、どれくらい上手ですか。": {
  "minor": "十年後の日本語は、どれくらい得意ですか。",
  "minorZh": "「得意」指个人强项，而「上手」更适合描述客观的技能水平。",
  "minorEn": "得意 refers to one's personal strength/confidence, while 上手 is the more appropriate word for objective skill level.",
  "major": "十年後の日本語は、どれくらい易しいですか。",
  "majorZh": "问题从“我的日语有多好”变成了“日语有多简单”。",
  "majorEn": "This changes the question from \"how good is my Japanese\" to \"how easy is Japanese.\""
 },
 "新しいノートは、何冊目になりましたか。": {
  "minor": "新しいノートは、何冊になりましたか。",
  "minorZh": "这个问的是“变成了几本”（数量），而不是“变成了第几本”（序数）。",
  "minorEn": "This asks \"how many notebooks\" (quantity) instead of \"which number notebook\" (ordinal).",
  "major": "新しいノートは、何冊目にしましたか。",
  "majorZh": "动词从“变成了”（状态变化）变成了“做成了”（决定）。",
  "majorEn": "This changes the verb from \"has it become\" (a state of change) to \"did you make it\" (a decision)."
 },
 "どうして、この建物なんですか。": {
  "minor": "どうして、この建物はなんですか。",
  "minorZh": "这个问句的意思从“为什么是这栋楼？”变成了“这栋楼是什么？”。",
  "minorEn": "This changes the question from \"Why this building?\" to the different question \"What is this building?\".",
  "major": "どうやって、この建物なんですか。",
  "majorZh": "「どうやって」问的是“如何”（方法），在这个问原因的句式中不合逻辑。",
  "majorEn": "どうやって asks \"how\" (by what method), which does not make sense in this grammatical structure asking for a reason."
 },
 "同じ建物だよ。元の形を覚えてた人がいたんだから。": {
  "minor": "同じ建物だよ。元の形が覚えてた人がいたんだから。",
  "minorZh": "动词「覚える」（记住）的宾语应该用「を」标记，而不是「が」。",
  "minorEn": "The object of the verb 覚える (\"to remember\") should be marked by を, not が.",
  "major": "同じ建物だよ。元の形を覚えてた人がいたのに。",
  "majorZh": "句子的逻辑关系从“因为……”的因果关系，变成了“即使……也”的转折关系。",
  "majorEn": "This changes the sentence from giving a reason (\"because...\") to stating a contrast (\"even though...\"), reversing the logical connection."
 },
 "自分の基準で書けばいい。表が崩れたら意味ないだろ。": {
  "minor": "自分の基準に書けばいい。表が崩れたら意味ないだろ。",
  "minorZh": "表示动作方式或基准时应用助词「で」，而非「に」。",
  "minorEn": "The particle で should be used to indicate the means or standard by which an action is done, not に.",
  "major": "自分の基準で書けばいい。表が崩れたら意味あるだろ。",
  "majorZh": "意思完全相反，从“没有意义”变成了“有意义”。",
  "majorEn": "This flips the meaning from \"it's meaningless\" to \"it's meaningful.\""
 },
 "その数字、名前あるよ。": {
  "minor": "その数字、名前持ってるよ。",
  "minorZh": "「持っている」指“持有/拥有”，用于“名字”这种抽象概念不自然，应用表示存在的「ある」。",
  "minorEn": "持っている means \"to hold/possess\" and is unnatural for an abstract concept like a name; ある is correct for existence.",
  "major": "その名前、数字あるよ。",
  "majorZh": "主宾颠倒，错误地表达了“那个名字有个数字”而不是“那个数字有个名字”。",
  "majorEn": "This reverses the sentence, incorrectly stating \"that name has a number\" instead of \"that number has a name.\""
 },
 "対照実験は、やった？": {
  "minor": "対照実験は、しましたか。",
  "minorZh": "「しましたか」比「やった」更正式，在这个随意的语境中听起来有些生硬。",
  "minorEn": "しましたか is more formal than やった and sounds a bit stiff in this casual context.",
  "major": "対照実験は、あった？",
  "majorZh": "问题从“你做了吗？”（询问行为）变成了“有过吗？”（询问存在）。",
  "majorEn": "This changes the question from \"Did you do...?\" (asking about an action) to \"Was there...?\" (asking about existence)."
 },
 "こっちも測って。": {
  "minor": "こっちも測るて。",
  "minorZh": "动词的て形错了。測る的て形是測って，不是測るて。",
  "minorEn": "Incorrect te-form. The te-form of 測る is 測って, not 測るて.",
  "major": "こっちも測らせて。",
  "majorZh": "意思反了。这句话的意思是「让我量一下」，而不是「请量一下我的」。",
  "majorEn": "The meaning is reversed. This means \"Let me measure,\" not \"Please measure me.\""
 },
 "それ、エラーちゃう。データや。": {
  "minor": "それ、エラーじゃない。データだ。",
  "minorZh": "混用了关西方言和标准日语。ちゃう是关西方言，而じゃない/だ是标准语。",
  "minorEn": "Mixed Kansai dialect and standard Japanese. ちゃう is Kansai dialect, while じゃない/だ is standard Japanese.",
  "major": "それ、エラーや。データちゃう。",
  "majorZh": "意思完全相反。这句话的意思是「那是故障。不是数据。」",
  "majorEn": "The meaning is the complete opposite. This says, \"That is a fault. It is not data.\""
 },
 "ほな、勝手に来る。記録は好きにしたらええ。": {
  "minor": "ほな、勝手に来る。記録を好きにしたらええ。",
  "minorZh": "助词用错了。这里用は更自然，表示「至于记录，你随便」，を虽然也可以但不太符合语境。",
  "minorEn": "Incorrect particle. は is more natural here to mean \"As for the record, do as you like,\" while を is less fitting for the context.",
  "major": "ほな、勝手に帰る。記録は好きにしたらええ。",
  "majorZh": "动词用错了。帰る的意思是「回去」，而不是来る「来」。",
  "majorEn": "Wrong verb. 帰る means \"to go home,\" not 来る, \"to come.\""
 },
 "読む。十九冊、全部。": {
  "minor": "読む。十九本、全部。",
  "minorZh": "量词用错了。书的量词是冊（さつ），不是本（ほん）。",
  "minorEn": "Wrong counter. The counter for books is 冊 (satsu), not 本 (hon).",
  "major": "読まない。十九冊、全部。",
  "majorZh": "意思反了。読まない的意思是「不读」，而不是「读」。",
  "majorEn": "The meaning is reversed. 読まない means \"I won't read,\" not \"I will read.\""
 },
 "これ、誰のために書いてるの。": {
  "minor": "これ、誰のために書いてるか。",
  "minorZh": "句尾助词用错了。用か会使句子听起来不完整，の在这里用于带有关心或质问语气的提问。",
  "minorEn": "Incorrect final particle. Using か makes the sentence sound like an incomplete clause; の is used here to ask a question seeking explanation.",
  "major": "これ、誰のために書かせてるの。",
  "majorZh": "动词形式错了。書かせてる是「让（别人）写」，而不是「（自己）写」。",
  "majorEn": "Wrong verb form. 書かせてる is the causative \"to make someone write,\" not the progressive \"to be writing.\""
 },
 "……こっちも、記録することにする。": {
  "minor": "……こっちも、記録することになる。",
  "minorZh": "语法用错了。ことになる表示「（客观上）决定了」，而ことにする表示「（主观上）决定了」。",
  "minorEn": "Wrong grammar pattern. ことになる implies the decision was made by outside factors, while ことにする indicates a personal decision.",
  "major": "……こっちも、記録されたことにする。",
  "majorZh": "意思完全不同。这句话的意思是「就当做也被记录下来了」，用了被动语态。",
  "majorEn": "The meaning is completely different. This means \"I'll pretend this was recorded, too,\" using the passive form."
 },
 "受け取ったよ。ちゃんと、こっちに届いてる。": {
  "minor": "受け取ったよ。ちゃんと、こっちに届けてる。",
  "minorZh": "自动词和他动词用错了。届けてる（届ける）是他动词「递送」，而届いてる（届く）是自动词「送达」。",
  "minorEn": "Wrong verb type (transitive/intransitive). 届けてる (届ける) is transitive \"to deliver,\" while 届いてる (届く) is intransitive \"to arrive.\"",
  "major": "受け取ってあげたよ。ちゃんと、こっちに届いてる。",
  "majorZh": "授受动词用错了。受け取ってあげたよ有种居高临下的感觉，意思是「我（为你）收下了」，改变了句子的语气和重心。",
  "majorEn": "Misused giving/receiving verb. 受け取ってあげたよ sounds condescending, meaning \"I did you the favor of receiving it,\" changing the tone and focus."
 },
 "説明つかんでも、こっちはここにおるから。": {
  "minor": "説明つかんでも、こっちはここでいるから。",
  "minorZh": "助词用错了。表示存在的地点时用助词に，而不是で。",
  "minorEn": "Incorrect particle. To indicate a location of existence, the particle に is used, not で.",
  "major": "説明つかんでも、こっちはここにおらんから。",
  "majorZh": "意思反了。おらん是いる的否定形式，所以这句话的意思是「因为我不会在这里」。",
  "majorEn": "The meaning is reversed. おらん is the negative form of いる/おる, so this means \"because I won't be here.\""
 },
 "今日のあの項目、いくつ。": {
  "minor": "今日のあの項目、何。",
  "minorZh": "疑问词用得不精确。询问数量时，いくつ（多少）比何（什么）更常用和准确。",
  "minorEn": "Imprecise question word. When asking for a number/quantity, いくつ (how many) is more common and precise than 何 (what).",
  "major": "今日のあの項目、いつ。",
  "majorZh": "疑问词用错了。いつ是问「什么时候」，而不是「多少」。",
  "majorEn": "Wrong question word. いつ asks \"when,\" not \"how many/what number.\""
 },
 "どっちも合ってると思う。見てた場所が違うだけ。": {
  "minor": "どっちも合ってると思う。見る場所が違うだけ。",
  "minorZh": "时态用错了。因为是在说过去发生的事，��以用过去时てた（見てた）比现在时（見る）更合适。",
  "minorEn": "Incorrect tense. The context is about a past event, so the past progressive てた (見てた) is more appropriate than the present tense (見る).",
  "major": "どっちも間違ってると思う。見てた場所が違うだけ。",
  "majorZh": "意思反了。間違ってる的意思是「错了」，而不是「对了」。",
  "majorEn": "The meaning is reversed. 間違ってる means \"are wrong,\" not \"are right.\""
 },
 "たぶん、途中で見るのやめてた。君のほう見てたから。": {
  "minor": "たぶん、途中で見るのやめてた。君のほうに見てたから。",
  "minorZh": "助词用错了。看一个方向或对象时，用を或省略助词，用に是错的。",
  "minorEn": "Incorrect particle. When looking at something, use the particle を or no particle; に is incorrect.",
  "major": "たぶん、途中で見るの始めた。君のほう見てたから。",
  "majorZh": "动词用错了。始めた的意思是「开始了」，与やめてた「停止了」意思相反。",
  "majorEn": "Wrong verb. 始めた means \"started,\" the opposite of やめてた, \"had stopped.\""
 },
 "平均すれば三十九・五。": {
  "minor": "平均したら三十九・五。",
  "minorZh": "语法形式选择不当。在这种表示计算或假设的语��下，用すれば比たら更自然。",
  "minorEn": "Less natural conditional form. In this context of calculation or hypothesis, すれば is more natural than たら.",
  "major": "合計すれば三十九・五。",
  "majorZh": "单词用错了。合計是「合计」，不是「平均」。",
  "majorEn": "Wrong word. 合計 means \"total/sum,\" not \"average.\""
 },
 "その一行、消さないで残しておいて。": {
  "minor": "その一行、消しないで残しておいて。",
  "minorZh": "动词否定て形错了。消す的否定て形是消さないで，不是消しないで。",
  "minorEn": "Incorrect negative te-form. The negative te-form of 消す is 消さないで, not 消しないで.",
  "major": "その一行、消して残さないで。",
  "majorZh": "意思完全相反。这句话的意思是「把那一行擦掉，不要留下」。",
  "majorEn": "The meaning is the complete opposite. This says, \"Erase that line and don't keep it.\""
 },
 "十歳の君も、今の君も、どっちも原物だよ。": {
  "minor": "十歳の君も、今の君も、どっちも本物だよ。",
  "minorZh": "近义词使用不当。本物指「真货」，而原物指「原件、原作」，后者更贴切语境。",
  "minorEn": "Wrong near-synonym. 本物 means \"a real/authentic thing,\" while 原物 means \"the original (source) object,\" which is more specific to the context.",
  "major": "十歳の君も、今の君も、どっちも偽物だよ。",
  "majorZh": "意思反了。偽物的意思是「冒牌货、赝品」。",
  "majorEn": "The meaning is reversed. 偽物 means \"fake/imitation.\""
 },
 "最後の項目、声に出して読んでくれる？": {
  "minor": "最後の項目、声で出して読んでくれる？",
  "minorZh": "助词用错了。声に出す是固定短语，意思是「说出声」，不能用で。",
  "minorEn": "Incorrect particle. 声に出す is a set phrase meaning \"to say aloud\"; the particle で cannot be used.",
  "major": "最後の項目、声に出して読んであげる？",
  "majorZh": "授受动词用错了。読んであげる？的意思是「我读给你听好吗？」，请求者和执行者反了。",
  "majorEn": "Wrong giving/receiving verb. 読んであげる？ means \"Shall I read it for you?\", reversing who is being asked to perform the action."
 },
 "じゃあ、ここからやろう。": {
  "minor": "じゃあ、ここからやる。",
  "minorZh": "动词形式改变了语气。やる是「（我）要做」，而やろう是「我们一起做吧」，后者有提议的语气。",
  "minorEn": "The verb form changes the nuance. やる is a declaration \"I will do it,\" while やろう is a suggestion \"Let's do it.\"",
  "major": "じゃあ、ここからやった。",
  "majorZh": "时态用错了。やった是过去时「做了」，而不是表示提议的やろう「做吧」。",
  "majorEn": "Wrong tense. やった is the past tense \"we did,\" not the volitional やろう \"let's do.\""
 },
 "このページ、作りが下手やわ。誰が書いたんこれ。": {
  "minor": "このページ、作りが下手やわ。誰が作ったんこれ。",
  "minorZh": "近义词使用不当。書く指「书写（内容）」，而作る指「制作」。根据上下文，两者都可能，但意思有细微差别。",
  "minorEn": "Wrong near-synonym. 書く means \"to write (the content),\" while 作る means \"to make/produce.\" Both are possible but have slightly different nuances.",
  "major": "このページ、作りが上手やわ。誰が書いたんこれ。",
  "majorZh": "意思反了。上手的意思是「好、高明」，与下手「笨拙、差劲」相反。",
  "majorEn": "The meaning is reversed. 上手 means \"skillful/good,\" the opposite of 下手, \"unskillful/bad.\""
 },
 "十二ページ目。今日、十一ページ越えたやん。": {
  "minor": "十二ページ目。今日、十一ページ越えるやん。",
  "minorZh": "时态用错了。因为「超过第11页」是已经完成的动作，所以应该用过去时越えた，而不是现在时越える。",
  "minorEn": "Incorrect tense. The action of \"passing page 11\" is complete, so the past tense 越えた should be used, not the present tense 越える.",
  "major": "十二ページ目。今日、十一ページ始まったやん。",
  "majorZh": "动词用错了。始まった是「开始了」，而越えた是「超过了」。",
  "majorEn": "Wrong verb. 始まった means \"started,\" while 越えた means \"passed/surpassed.\""
 },
 "来週も同じ時間な。その本、持ってきて。": {
  "minor": "来週も同じ時間な。その本、持って行って。",
  "minorZh": "动词用错了。持って行って是「带去（别处）」，而持ってきて是「带来（这里）」。",
  "minorEn": "Wrong verb. 持って行って means \"to take (away from here),\" while 持ってきて means \"to bring (here).\"",
  "major": "来週も同じ時間な。その本、忘れてきて。",
  "majorZh": "意思反了。忘れてきて的意思是「忘了带来」，而不是「带来」。",
  "majorEn": "The meaning is reversed. 忘れてきて means \"forget to bring it,\" not \"bring it.\""
 },
 "さっきの二本目、フォーム変わってたやろ。": {
  "minor": "さっきの二回目、フォーム変わってたやろ。",
  "minorZh": "量词用错了。在体育运动中数「投」的次数时，常用「本」，而「回」是更通用的次数单位。",
  "minorEn": "Wrong counter. For counting shots in sports, 本 is often used. 回 is the more general counter for \"times.\"",
  "major": "さっきの二本目、フォーム同じやったやろ���",
  "majorZh": "意思反了。同じやった是「是一样的」，而変わってた是「变了、不一样了」。",
  "majorEn": "The meaning is reversed. 同じやった means \"(it) was the same,\" while 変わってた means \"(it) had changed/was different.\""
 },
 "今も、バスケ好き？": {
  "minor": "今も、バスケを好き？",
  "minorZh": "助词用错了。な形容词好き前面应该用助词が，而不是を。",
  "minorEn": "Incorrect particle. The na-adjective 好き takes the particle が, not を.",
  "major": "今も、バスケ嫌い？",
  "majorZh": "意思反了。嫌い是「讨厌」，而不是「喜欢」。",
  "majorEn": "The meaning is reversed. 嫌い means \"to dislike/hate,\" not \"to like.\""
 },
 "その五センチ、誰が測ってん。": {
  "minor": "その五センチ、誰が計ってん。",
  "minorZh": "近义词用错了。測る是测量长度、距离，而計る是计量重量、时间、数量。",
  "minorEn": "Wrong near-synonym. 測る is for measuring length/distance, while 計る is for weighing/timing/counting.",
  "major": "その五センチ、誰に測ってもらってん。",
  "majorZh": "语法结构错了。这句话的意思是「你让谁给你量的？」，改变了问话的焦点。",
  "majorEn": "Wrong grammar structure. This asks, \"Who did you have measure it for you?\", changing the focus of the question."
 },
 "絶対戻れるって。頑張れ。": {
  "minor": "絶対戻るって。頑張れ。",
  "minorZh": "动词形式改变了语意。戻る是「回去」，而戻れる是可能形「能回去」，后者更能表达鼓励的语气。",
  "minorEn": "The verb form changes the nuance. 戻る means \"will return,\" while 戻れる is the potential form \"can return,\" which better fits the encouraging tone.",
  "major": "絶対戻れないって。頑張れ。",
  "majorZh": "意思反了。戻れない是「回不去」，与戻れる「能回去」意思相反。",
  "majorEn": "The meaning is reversed. 戻れない means \"can't return,\" the opposite of 戻れる, \"can return.\""
 },
 "あの五センチ、今もう一回測ろう。": {
  "minor": "あの五センチ、今もう一回測る。",
  "minorZh": "动词形式改变了语气。測る是「（我）要量」，而測ろう是「我们来量吧」，后者有提议的语气。",
  "minorEn": "The verb form changes the nuance. 測る is a declaration \"I will measure,\" while 測ろう is a suggestion \"Let's measure.\"",
  "major": "あの五センチ、今もう一回測った。",
  "majorZh": "时态用错了。測った是过去时「量了」，而不是表示提议的測ろう「量吧」。",
  "majorEn": "Wrong tense. 測った is the past tense \"we measured,\" not the volitional 測ろう \"let's measure.\""
 },
 "二年間、一日も休んでへんやろ。": {
  "minor": "二年間、一日も休んでいないだろう。",
  "minorZh": "混用了关西方言和标准日语。休んでへん/やろ是关西方言，而休んでいない/だろう是标准语。",
  "minorEn": "Mixed Kansai dialect and standard Japanese. 休んでへん/やろ is Kansai dialect, while 休んでいない/だろう is standard Japanese.",
  "major": "二年間、毎日休んでるやろ。",
  "majorZh": "意思几乎相反。这句话的意思是「这两年你每天都在休息吧」，而不是「一天都没休」。",
  "majorEn": "The meaning is nearly the opposite. This says, \"You've been resting every day for two years, haven't you?\", instead of \"you haven't missed a single day.\""
 },
 "出しや。ウチ、全部見に行くから。": {
  "minor": "出しや。ウチ、全部を見に行くから。",
  "minorZh": "粒子错误：“全部”作为副词使用时，后面通常不需要助词“を”。",
  "minorEn": "Particle error: The particle を is generally not needed after 全部 when it's used as an adverb.",
  "major": "出しや。ウチ、全部見に来てくれるから。",
  "majorZh": "动词错误：使用了“くれる”，意思是“你会来看”，而不是“我会去看”。",
  "majorEn": "Verb error: Uses くれる (you will come [for me]), changing the meaning from 'I will come' to 'you will come'."
 },
 "楽しそうだった。": {
  "minor": "楽しいそうだった。",
  "minorZh": "语法错误：い形容词连接“そう”时���需要去掉词尾的“い”。正确的是“楽しそうだった”。",
  "minorEn": "Grammar error: The final い must be dropped from an i-adjective before adding そう. The correct form is 楽しそうだった.",
  "major": "楽しいはずだった。",
  "majorZh": "意思错误：这句话的意思是“本应该很开心的”，而不是“看起来很开心”。",
  "majorEn": "Meaning error: This means 'It was supposed to be fun,' not 'It looked like you were having fun.'"
 },
 "惜しかった。あと五センチ。": {
  "minor": "惜しかった。あとで五センチ。",
  "minorZh": "词汇错误：“あとで”的意思是“稍后”，这里应该用“あと”表示“还差”。",
  "minorEn": "Word error: あとで means 'later,' but the context requires あと, meaning 'more' or 'remaining.'",
  "major": "惜しくなかった。あと五センチ。",
  "majorZh": "意思错误：使用了否定形式“惜しくなかった”，意思是“一点也不可惜”，与原意完全相反。",
  "majorEn": "Meaning error: Uses the negative form 惜しくなかった, meaning 'it wasn't close at all,' the opposite of the intended meaning."
 },
 "次は入る。": {
  "minor": "次は入れる。",
  "minorZh": "动词错误：使用了他动词“入れる”（放进去），���应该用自动词“入る”（进去）。",
  "minorEn": "Verb error: Uses the transitive verb 入れる (to put in) instead of the intransitive 入る (to go in).",
  "major": "次は入らせる。",
  "majorZh": "动词错误：使用了使役态“入らせる”（让它进去），语气比单纯的“入る”要强硬得多，不自然。",
  "majorEn": "Verb error: Uses the causative form 入らせる (to make it go in), which is much more forceful and unnatural than the simple declaration 入る."
 },
 "それでも、跳びたいんだよね。": {
  "minor": "それでも、跳べたいんだよね。",
  "minorZh": "动词变形错误：把表示“想做”的“たい形”和表示“能够做”的“可能形”混淆了。正确的是“跳びたい”。",
  "minorEn": "Conjugation error: Confuses the desiderative `-tai` form (want to do) with the potential form (`-eru`). The correct form is 跳びたい.",
  "major": "それでも、跳ぶはずなんだよね。",
  "majorZh": "语法错误：“はず”表示“理应，本应”，而不是“想要”。这句话的意思变成了“即便如此，你应该跳的吧”。",
  "majorEn": "Grammar error: はず means 'supposed to,' expressing expectation, not desire. The sentence becomes 'And you're still supposed to jump, right?'"
 },
 "二センチ縮めたんでしょ。すごいよ。": {
  "minor": "二センチ縮んだんでしょ。すごいよ。",
  "minorZh": "动词错误：使用了自动词“縮んだ”（缩短了），而这里语境是人主动缩短了距离，应该用他动词“縮めた”。",
  "minorEn": "Verb error: Uses the intransitive verb 縮んだ (it shrank) instead of the transitive 縮めた (you shortened it).",
  "major": "二センチ伸ばしたんでしょ。すごいよ。",
  "majorZh": "意思错误：使用了反义词“伸ばした”（延长了），与原意“缩短了”完全相反。",
  "majorEn": "Meaning error: Uses the opposite verb 伸ばした (extended/lengthened) instead of 縮めた (shortened)."
 },
 "その五センチ、誰が決めたの？": {
  "minor": "その五センチ、誰が決まったの？",
  "minorZh": "动词错误：使用了自动词“決まった”（被决定），这让“誰”（谁）成了被决定的主语，不合逻辑。应该用他动词“決めた”。",
  "minorEn": "Verb error: Uses the intransitive verb 決まった (was decided), which makes 誰 (who) the subject, nonsensically asking 'Which person was decided?'. The transitive verb 決めた is needed.",
  "major": "その五センチ、どうして決めたの？",
  "majorZh": "意思错误：把“誰”（谁）换成了“どうして”（为什么），完全改变了问题。",
  "majorEn": "Meaning error: Changes the question word from 誰 (who) to どうして (why), completely changing the question."
 },
 "なんで、俺の祖父のだって分かるんだ。": {
  "minor": "なんで、俺の祖父のだって分かったんだ。",
  "minorZh": "时态错误：使用了过去时“分かった”，将“你怎么知道”这个状态，变成了“你是怎么察觉到的”这个动作，语感稍有不同。",
  "minorEn": "Tense error: Uses the past tense 分かった (figured out/realized), slightly changing the nuance from the state of 'knowing' (分かる) to the past action of 'finding out.'",
  "major": "なんで、俺の祖父のだって教えるんだ。",
  "majorZh": "动词错误：使用了“教える”（告诉），而不是“分かる”（知道），意思变成了“你为什么要告诉我这是我外公的？”",
  "majorEn": "Verb error: Uses 教える (to teach/tell) instead of 分かる (to know), changing the meaning to 'Why are you telling me it's my grandfather's?'"
 },
 "なんで三回も？": {
  "minor": "なんで三つも？",
  "minorZh": "量词错误：用了通用量词“つ”，但表示次数应该用“回”。",
  "minorEn": "Counter error: Uses the general counter つ instead of the correct counter for frequency, 回.",
  "major": "どうやって三回も？",
  "majorZh": "疑问词错误：把“なんで”（为什么）换成了“どうやって”（怎样），问题从问原因变成了问方法。",
  "majorEn": "Question word error: Changes the question from なんで (why) to どうやって (how), asking about the method instead of the reason."
 },
 "何回、来たんだ。": {
  "minor": "何回、来るんだ。",
  "minorZh": "时态错误：使用了现在/将来时“来る”，意思是“要来几次？”，而不是过去时“来た”（来了几次）。",
  "minorEn": "Tense error: Uses the present/future tense 来る (will come) instead of the past tense 来た (came).",
  "major": "何階、来たんだ。",
  "majorZh": "词汇错误：使用了“何階”（几楼），而不是“何回”（几次），两者是同音异义词。",
  "majorEn": "Word error: Uses 何階 (what floor) instead of 何回 (how many times), which are homophones."
 },
 "何しに来てたんだ。": {
  "minor": "何するに来てたんだ。",
  "minorZh": "语法错误：表示“来做某事”的目的时，应用动词的“ます形”词干+“に”。“するに”是错误的，应该是“しに”。",
  "minorEn": "Grammar error: To express purpose, the pattern is verb stem + に, not dictionary form + に. The correct form is しに.",
  "major": "誰と来てたんだ。",
  "majorZh": "疑问词错误：把“何しに”（来做什么）换成了“誰と”（和谁一起来），改变了问题。",
  "majorEn": "Question word error: Changes the question from 何しに (what for) to 誰と (with whom)."
 },
 "毎日来てたのって、誰か待ってたのか？": {
  "minor": "毎日来てたのって、誰を待ってたのか？",
  "minorZh": "疑问词错误：用了“誰を”（等谁），把问题从“是不是在等某人？”（是/否问题）变成了“他在等谁？”（开放问题）。",
  "minorEn": "Question word error: Uses 誰を (whom), changing the question from 'Was he waiting for someone?' (a yes/no question) to 'Who was he waiting for?' (a WH-question).",
  "major": "毎日来てたのって、誰か待たせてたのか？",
  "majorZh": "动词错误：使用了使役态“待たせてた”（让某人等），与原意“在等某人”相反。",
  "majorEn": "Verb error: Uses the causative form 待たせてた (was making someone wait), reversing the roles from the original 'was waiting for someone.'"
 },
 "あの人、実は何もしてなかったんじゃないか？": {
  "minor": "あの人、実は何もしなかったんじゃないか？",
  "minorZh": "时态错误：用了��纯过去时“しなかった”，而不是过去进行时“してなかった”，语感上从描述持续状态变成了描述一次性动作。",
  "minorEn": "Tense error: Uses the simple past しなかった (didn't do) instead of the past progressive してなかった (wasn't doing), subtly changing the nuance.",
  "major": "あの人、実は何かしてたじゃないか？",
  "majorZh": "意思错误：使用了“何か”（某些事）和肯定动词，意思完全相反，变成了“他其实是不是干了些什么？”",
  "majorEn": "Meaning error: Uses 何か (something) and a positive verb, completely flipping the meaning to 'Wasn't he actually doing something?'"
 },
 "あの日……一人でここに居たのか。": {
  "minor": "あの日……一人でここで居たのか。",
  "minorZh": "粒子错误：表示存在的地点时用“に”，表示动作发生的地点时用“で”。“居る”是表示存在的动词，所以应该用“ここに”。",
  "minorEn": "Particle error: に marks a location of existence, while で marks a location of action. The verb 居る (to be/exist) takes に.",
  "major": "あの日……一人でここに来たのか。",
  "majorZh": "动词错误：使用了“来た”（来了）而不是“居た”（在），问题从“你当时是不是在这里”变成了“你当时是不是来了这里”。",
  "majorEn": "Verb error: Uses 来た (came) instead of 居た (was here), changing the question from being about presence to being about arrival."
 },
 "これ、置いていく。": {
  "minor": "これ、置いてくる。",
  "minorZh": "语法错误：用了“てくる”，表示离开某物后回到说话者所在的位置。这里更自然的说法是“ていく”，表示留下某物后离开。",
  "minorEn": "Grammar error: Uses 〜てくる (to do and come back), which is less natural than 〜ていく (to do and go) for the action of 'leaving something behind.'",
  "major": "これ、持っていく。",
  "majorZh": "意思错误：使用了“持っていく”（带走），与原意“置いていく”（留下）完全相反。",
  "majorEn": "Meaning error: Uses 持っていく (to take with you), which is the opposite of 置いていく (to leave behind)."
 },
 "これは、持って帰る。": {
  "minor": "これは、持って帰される。",
  "minorZh": "动词错误：使用了被动/使役态“帰される”，听起来像是“被带回家”或“被要求带回家”，而不是自己主动带回。",
  "minorEn": "Verb error: Uses the passive/causative form 帰される, making it sound like 'it is taken home' or 'I am made to take it home' rather than an active choice.",
  "major": "これは、置いて帰る。",
  "majorZh": "意思错误：使用了“置いて”（放下）而不是“持って”（拿着），意思变成了“把它留下然后回去”，与原意相反。",
  "majorEn": "Meaning error: Uses 置いて (to leave) instead of 持って (to take), meaning 'I'll leave it here and go home,' the opposite of the original intent."
 },
 "来る。ずっと、ずっと先だけど。": {
  "minor": "来よう。ずっと、ずっと先だけど。",
  "minorZh": "动词变形错误：使用了意志形“来よう”（来吧），把陈述变成了建议。",
  "minorEn": "Conjugation error: Uses the volitional form 来よう (let's come), changing a statement of fact into a suggestion.",
  "major": "来ない。ずっと、ずっと先だけど。",
  "majorZh": "意思错误：使用了否定形“来ない”（不来），与后半句“虽然是很久之后的事”在逻辑上矛盾，且意思相反。",
  "majorEn": "Meaning error: Uses the negative form 来ない (won't come), which contradicts the second clause and reverses the meaning."
 },
 "待たなくていい。長すぎる。": {
  "minor": "待たないでいい。長すぎる。",
  "minorZh": "语法错误：“待たないでいい”是“待たないでください”（请不要等）和“待たなくていい”（不必等）的错误混合。",
  "minorEn": "Grammar error: 待たないでいい is an awkward blend of 待たないでください (please don't wait) and 待たなくていい (you don't have to wait).",
  "major": "待たなければならない。長すぎる。",
  "majorZh": "意思错误：使用了“なければならない”（必须），意思变成了“必须等我”，与原意完全相反。",
  "majorEn": "Meaning error: Uses 〜なければならない (must), meaning 'You must wait,' the opposite of the intended 'You don't have to wait.'"
 },
 "まだ痛い？": {
  "minor": "まだ痛かった？",
  "minorZh": "时态错误：使用了过去时“痛かった”，问的是过去某时刻“是否还在疼”，而不是现在。",
  "minorEn": "Tense error: Uses the past tense 痛かった, asking if it was still hurting in the past, rather than right now.",
  "major": "もう痛い？",
  "majorZh": "副词错误：用了“もう”（已经），而不是“まだ”（还）。“もう痛い？”的意思是“已经开始疼了吗？”",
  "majorEn": "Adverb error: Uses もう (already) instead of まだ (still). もう痛い？ means 'Does it hurt already?'"
 },
 "黒板、見える？": {
  "minor": "黒板、見る？",
  "minorZh": "动词错误：使用了“見る”（看），而不是可能态的“見える”（能看见）。问题从“能看见吗？”变成了“你看吗？”。",
  "minorEn": "Verb error: Uses the non-potential verb 見る (to look) instead of the potential 見える (can see/is visible). The question becomes 'Are you looking?' instead of 'Can you see?'.",
  "major": "黒板、見せる？",
  "majorZh": "动词错误：使用了“見せる”（给…看），而不是“見える”（能看见）。问题从“你能看见吗？”变成了“你给我看黑板吗？”。",
  "majorEn": "Verb error: Uses 見せる (to show) instead of 見える (can see). The question becomes 'Will you show me the board?' instead of 'Can you see the board?'"
 },
 "歩いて登ろう。": {
  "minor": "歩きで登ろう。",
  "minorZh": "语法错误：用“で”来表示方式“步行”，虽然有时可以，但在这里用动词て形“歩いて”更自然和常用。",
  "minorEn": "Grammar error: Uses the particle で to indicate means, which is less natural than the standard te-form 歩いて in this context.",
  "major": "歩いて降りよう。",
  "majorZh": "动词错误：使用了“降りよう”（下去吧）而不是“登ろう”（爬上去吧），方向完全相反。",
  "majorEn": "Verb error: Uses 降りよう (let's go down) instead of 登ろう (let's climb up), reversing the direction of movement."
 },
 "バジルがいいと思う。": {
  "minor": "バジルをいいと思う。",
  "minorZh": "粒子错误：形容词“いい”前面不能用宾格助词“を”。应该用主格助词“が”或主题助词“は”。",
  "minorEn": "Particle error: The adjective いい doesn't take an object with を. The subject should be marked by が or は.",
  "major": "バジルになると思う。",
  "majorZh": "动词错误：使用了“になる”（变成），而不是“がいい”（……比较好），句子意思变成了“我觉得会变成罗勒”。",
  "majorEn": "Verb error: Uses になる (to become) instead of がいい (is good), resulting in the nonsensical sentence 'I think it will become basil.'"
 },
 "ローズマリーは？冬も枯れないって。": {
  "minor": "ローズマリーは？冬も枯らさないって。",
  "minorZh": "动词错误：使用了他动词“枯らさない”（不让…枯萎），而不是自动词“枯れない”（不枯萎）。",
  "minorEn": "Verb error: Uses the transitive verb 枯らさない (doesn't cause to wither) instead of the intransitive 枯れない (doesn't wither).",
  "major": "ローズマリーは？冬も枯れるって。",
  "majorZh": "意思错误：使用了肯定形式“枯れる���（会枯萎），与原意“枯れない”（不会枯萎）相反。",
  "majorEn": "Meaning error: Uses the positive form 枯れる (to wither) instead of the negative 枯れない (doesn't wither), reversing the meaning."
 },
 "ラベンダー。料理じゃないけど、いい香りだから。": {
  "minor": "ラベンダー。料理じゃないけど、いい香りですから。",
  "minorZh": "语法错误：前半句“じゃないけど”是简体，后半句“ですから”是敬体，混用显得不自然。",
  "minorEn": "Grammar error: Mixes plain form (じゃないけど) with polite form (ですから), which is stylistically inconsistent.",
  "major": "ラベンダー。料理じゃないし、いい香りじゃないから。",
  "majorZh": "意思错误：后半句变成了“香味也不好”，并且用“し”表示并列，把优点变成了缺点。",
  "majorEn": "Meaning error: The second half is negated to いい香りじゃない (doesn't smell nice) and a new conjunction is used, turning the positive reason into a negative one."
 },
 "見たよ。本当に、真珠みたいだった。": {
  "minor": "見たよ。本当に、真珠のようだった。",
  "minorZh": "词汇错误：“のようだ”比“みたいだ”更书面化，在口语中用“みたいだ”更自然。",
  "minorEn": "Word choice error: のようだ is more formal/written than みたいだ. In casual speech, it can sound a little stiff, a common nuance for learners to miss.",
  "major": "見たよ。本当に、真珠のはずだった。",
  "majorZh": "语法错误：“はずだった”表示“本应是”，意思变成了“本应是珍珠（但不是）”，与原意“看起来像珍珠”完全不同。",
  "majorEn": "Grammar error: Uses はずだった (was supposed to be), changing the meaning from 'it looked like a pearl' to 'it was supposed to be a pearl (but it wasn't).'"
 },
 "袖が狭いって、どういう意味？": {
  "minor": "袖が狭いって、どういう意味だ？",
  "minorZh": "句尾用了「だ？」，问人时显得生硬；口语里直接说「どういう意味？」。",
  "minorEn": "Ending on だ？ sounds blunt when asking someone; just say どういう意味？",
  "major": "袖が狭いって、どういう意味を？",
  "majorZh": "「意味を？」不成句：「どういう意味」后面不接宾格助词「を」。",
  "majorEn": "意味を？ does not work: どういう意味 takes no object particle."
 },
 "今度、一緒に歩いて見に行こうか。": {
  "minor": "今度、一緒に歩いて見に行くか。",
  "minorZh": "「行くか」是自言自语式的决定；邀请对方要用意志形「行こうか」。",
  "minorEn": "行くか sounds like deciding to yourself; to invite someone use the volitional 行こうか.",
  "major": "今度、一緒に歩かせて見に行こうか。",
  "majorZh": "「歩かせて」是使役形，变成了「让（谁）走着去看」，意思不对。",
  "majorEn": "歩かせて is causative — 'make someone walk' — not what you meant."
 },
 "もう一回、読んでくれる？": {
  "minor": "もう一回、読んでもらう？",
  "minorZh": "「読んでもらう？」是问\"要不要我请（别人）读\"；请对方帮忙读要用「読んでくれる？」。",
  "minorEn": "読んでもらう？ asks whether someone will have it read; to ask her to read it, use 読んでくれる？",
  "major": "もう一回、読んであげる？",
  "majorZh": "「読んであげる」是\"我读给你听\"，授受方向反了。",
  "majorEn": "読んであげる means 'shall I read it for you' — giving and receiving reversed."
 },
 "今日のことは、ぼやけないように覚えておくよ。": {
  "minor": "今日のことは、ぼやけないで覚えておくよ。",
  "minorZh": "表示\"为了不……\"要用「ないように」，「ないで」是\"不……就\"。",
  "minorEn": "'So that it does not…' is ないように; ないで means 'without doing'.",
  "major": "今日のことは、ぼやけるように覚えておくよ。",
  "majorZh": "「ぼやけるように」变成\"为了让它变模糊而记住\"，意思反了。",
  "majorEn": "ぼやけるように means 'so that it blurs' — the opposite."
 },
 "負けないからな。": {
  "minor": "負けないからね。",
  "minorZh": "意思一样，但「ね」比「な」软，少了跟对手较劲的那股劲。",
  "minorEn": "Same meaning, but ね is softer than な and loses the rival edge.",
  "major": "負けさせないからな。",
  "majorZh": "「負けさせない」是\"不让（你）输\"，意思完全变了。",
  "majorEn": "負けさせない means 'I will not let you lose' — a different meaning."
 },
 "走ったら、滝が見えないだろ。": {
  "minor": "走ると、滝が見えないだろ。",
  "minorZh": "「と」表示必然结果，这里说\"要是跑了的话\"，用「たら」更自然。",
  "minorEn": "と states an inevitable result; for 'if you run' here, たら is more natural.",
  "major": "走ったら、滝を見えないだろ。",
  "majorZh": "「見える」是自动词，对象用「が」，不能用「を」。",
  "majorEn": "見える is intransitive: the thing seen takes が, not を."
 },
 "次は歩いて来る。で、お前より先に着く。": {
  "minor": "次は歩いて来る。で、お前より先に着いた。",
  "minorZh": "说的是下一次，要用现在形「着く」，不能用过去形。",
  "minorEn": "It is about next time, so use 着く, not the past 着いた.",
  "major": "次は歩いて来る。で、お前より後に着く。",
  "majorZh": "「後に」是\"比你晚到\"，意思反了。",
  "majorEn": "後に means 'arrive after you' — the opposite."
 },
 "でも、上から見る神戸、きれいだったよ。": {
  "minor": "でも、上から見る神戸、きれかったよ。",
  "minorZh": "「きれい」是な形容词，过去形是「きれいだった」，不是「きれかった」。",
  "minorEn": "きれい is a na-adjective: past is きれいだった, not きれかった.",
  "major": "でも、上から見られる神戸、きれいだったよ。",
  "majorZh": "「見られる」变成了被动\"被从上面看着的神户\"，句子变得别扭。",
  "majorEn": "見られる turns it passive — 'Kobe being looked at from above' — awkward and off."
 },
 "知ってます。だから見てるんです。": {
  "minor": "知ってます。だから見るんです。",
  "minorZh": "\"正在看\"要用「見てる」；「見る」只是\"会看\"。",
  "minorEn": "'I am watching' is 見てる; 見る is just 'I watch' in general.",
  "major": "知ってます。だから見せてるんです。",
  "majorZh": "「見せてる」是\"给（你）看\"，意思变了。",
  "majorEn": "見せてる means 'I am showing it' — a different meaning."
 },
 "あ、いえ、その、見てただけで……": {
  "minor": "あ、いえ、その、見ただけで……",
  "minorZh": "解释\"刚才一直在看\"要用持续的「見てた」，「見た」只是看了一眼。",
  "minorEn": "For 'I was just watching' use 見てた; 見た is a single look.",
  "major": "あ、いえ、その、見られただけで……",
  "majorZh": "「見られた」是\"被看了\"，主语变成了你被人看。",
  "majorEn": "見られた means 'I was seen' — you became the one being watched."
 },
 "……なんでも知ってるんですか。": {
  "minor": "……なんでも知るんですか。",
  "minorZh": "\"知道\"的状态要说「知ってる」，「知る」是\"去得知\"。",
  "minorEn": "The state of knowing is 知ってる; 知る means 'to find out'.",
  "major": "……なんでも知らせるんですか。",
  "majorZh": "「知らせる」是\"通知、告诉别人\"，意思完全不同。",
  "majorEn": "知らせる means 'to inform someone' — a different verb."
 },
 "駅まで、入りますか。": {
  "minor": "駅まで、入れますか。",
  "minorZh": "邀请对方进伞要问「入りますか」；「入れますか」变成了\"能不能进得去\"。",
  "minorEn": "Offering your umbrella is 入りますか; 入れますか asks whether she is able to fit.",
  "major": "駅まで、入れさせますか。",
  "majorZh": "使役形「入れさせる」意思乱了，听起来像\"要不要让人把（东西）放进去\"。",
  "majorEn": "The causative 入れさせる garbles it into 'shall I make someone put it in'."
 },
 "あの、これ、落としましたよ。": {
  "minor": "あの、これ、落ちましたよ。",
  "minorZh": "「落ちる」是自动词\"掉了\"；提醒对方\"你掉了东西\"用他动词「落とした」。",
  "minorEn": "落ちる is 'it fell'; to tell her she dropped it, use 落とした.",
  "major": "あの、これ、落としてくださいよ。",
  "majorZh": "「落としてください」是\"请把它扔掉\"，完全不是要还给她。",
  "majorEn": "落としてください means 'please drop it' — not handing it back."
 },
 "あの、これは何ですか。": {
  "minor": "あの、これは何ですか？ですか。",
  "minorZh": "句尾的「ですか」重复了一次。",
  "minorEn": "ですか is repeated twice.",
  "major": "あの、これは誰ですか。",
  "majorZh": "问雕花不能用「誰」（谁），东西要用「何」。",
  "majorEn": "誰 is 'who'; for a carving you need 何 'what'."
 },
 "はい、今日、着いたばかりです。": {
  "minor": "はい、今日、着くばかりです。",
  "minorZh": "\"刚刚到\"要用过去形加「ばかり」：「着いたばかり」。",
  "minorEn": "'Just arrived' is past + ばかり: 着いたばかり.",
  "major": "はい、今日、着いたばかりではありません。",
  "majorZh": "否定之后变成\"并不是今天刚到\"，意思反了。",
  "majorEn": "The negative turns it into 'I did not just arrive today' — the opposite."
 },
 "どうして分かったんですか。": {
  "minor": "どうして分かりたんですか。",
  "minorZh": "「分かる」的过去形是「分かった」，没有「分かりた」。",
  "minorEn": "The past of 分かる is 分かった, not 分かりた.",
  "major": "どうして分からせたんですか。",
  "majorZh": "使役「分からせた」是\"为什么让（我）明白\"，问错了。",
  "majorEn": "分からせた is causative — 'why did you make me understand' — the wrong question."
 },
 "はい。今日、来ました。……これ、どうやって食べるんですか。": {
  "minor": "はい。今日、来ました。……これ、どうやって食べますんですか。",
  "minorZh": "「ます」后面不能再接「んですか」，说「食べるんですか」或「食べますか」。",
  "minorEn": "You cannot stack ます and んですか; say 食べるんですか or 食べますか.",
  "major": "はい。今日、来ました。……これ、どうやって食べさせるんですか。",
  "majorZh": "「食べさせる」是\"怎么喂（别人）吃\"，意思完全不对。",
  "majorEn": "食べさせる means 'how do I feed it to someone' — not what you meant."
 },
 "あ、はい。袋をお願いします。": {
  "minor": "あ、はい。袋がお願いします。",
  "minorZh": "「お願いします」前面的东西用「を」，不用「が」。",
  "minorEn": "The thing you ask for takes を before お願いします, not が.",
  "major": "あ、はい。袋はいりません、お願いします。",
  "majorZh": "「いりません」是\"不要\"，跟\"要个袋子\"正好相反。",
  "majorEn": "いりません means 'I do not need one' — the opposite."
 },
 "あの、すみません——": {
  "minor": "あの、すみませんでした——",
  "minorZh": "叫住别人用「すみません」；「すみませんでした」是为已经做的事道歉。",
  "minorEn": "To call someone use すみません; すみませんでした apologises for something already done.",
  "major": "あの、ありがとうございました——",
  "majorZh": "\"谢谢您了\"是道谢收尾，不能用来叫住人。",
  "majorEn": "ありがとうございました closes a thank-you; it cannot call someone over."
 },
 "あの、袋、一つ持ちましょうか。": {
  "minor": "あの、袋、一つ持ちますか。",
  "minorZh": "主动提出帮忙用「持ちましょうか」；「持ちますか」是在问对方要不要自己拿。",
  "minorEn": "Offering help is 持ちましょうか; 持ちますか asks whether she will carry it herself.",
  "major": "あの、袋、一つ持たせましょうか。",
  "majorZh": "「持たせましょうか」是\"要不要让（你）拿着\"，反过来了。",
  "majorEn": "持たせましょうか means 'shall I make you carry it' — reversed."
 },
 "この辺、どこで買うと安いですか。": {
  "minor": "この辺、どこに買うと安いですか。",
  "minorZh": "动作发生的地点用「で」，不是「に」。",
  "minorEn": "The place where an action happens takes で, not に.",
  "major": "この辺、どこで買うと高いですか。",
  "majorZh": "问成了\"哪里买比较贵\"。",
  "majorEn": "It now asks where things are expensive."
 },
 "あの……お名前、聞いてもいいですか。": {
  "minor": "あの……お名前、聞いてはいいですか。",
  "minorZh": "请求许可是「〜てもいいですか」，不是「〜てはいい」。",
  "minorEn": "Asking permission is 〜てもいいですか, not 〜てはいい.",
  "major": "あの……お名前、聞いてはいけませんか。",
  "majorZh": "「〜てはいけません」是\"禁止\"，变成了很别扭的反问。",
  "majorEn": "〜てはいけません expresses prohibition; it turns into an odd negative question."
 },
 "本日、欠席します。": {
  "minor": "本日、欠席しました。",
  "minorZh": "请假通知要说接下来的事，用「欠席します」；「しました」是已经缺席了。",
  "minorEn": "A notice is about what will happen: 欠席します; しました means you already missed it.",
  "major": "本日、出席します。",
  "majorZh": "「出席」是\"出席\"，跟请假正好相反。",
  "majorEn": "出席 means 'attend' — the opposite of taking the day off."
 },
 "馴染むのは、勝負じゃないだろ。": {
  "minor": "馴染むのが、勝負じゃないだろ。",
  "minorZh": "这里是拿\"融入\"当话题来否定，用「は」更自然；「が」听起来像在挑出某一样。",
  "minorEn": "Here 馴染むの is the topic being denied, so は fits; が sounds like singling it out.",
  "major": "馴染ませるのは、勝負じゃないだろ。",
  "majorZh": "「馴染ませる」是\"让（别人）融入\"，主语变了。",
  "majorEn": "馴染ませる means 'making someone fit in' — the subject changes."
 },
 "じゃあ、僕も旗はいいです。": {
  "minor": "じゃあ、僕は旗もいいです。",
  "minorZh": "「も」放错了位置：想说\"我也不要旗\"，「も」跟在「僕」后面。",
  "minorEn": "も is in the wrong place: 'I don't need a flag either' puts も after 僕.",
  "major": "じゃあ、僕も旗がほしいです。",
  "majorZh": "「ほしい」是\"想要\"，意思反了。",
  "majorEn": "ほしい means 'I want one' — the opposite."
 },
 "クラス全員で撮った方が、国際的じゃないですか。": {
  "minor": "クラス全員で撮る方が、国際的じゃないですか。",
  "minorZh": "建议\"……比较好\"常用过去形「撮った方が」，用「撮る方が」更像一般比较。",
  "minorEn": "Suggestions usually take the past form: 撮った方が; 撮る方が sounds like a general comparison.",
  "major": "クラス全員に撮られた方が、国際的じゃないですか。",
  "majorZh": "被动「撮られた」是\"被全班拍\"，意思乱了。",
  "majorEn": "撮られた is passive — 'being photographed by the class' — the meaning falls apart."
 },
 "お父さんに、会いたい？": {
  "minor": "お父さんを、会いたい？",
  "minorZh": "「会う」的对象用「に」，不用「を」。",
  "minorEn": "The person you meet takes に with 会う, not を.",
  "major": "お父さんに、会わせたい？",
  "majorZh": "「会わせたい」是\"想让（别人）见你爸\"，问错了。",
  "majorEn": "会わせたい means 'do you want to let someone meet him' — the wrong question."
 },
 "どっち側でもないなら、こっち側に来ればいい。": {
  "minor": "どっち側でもないなら、こっち側に来たらいい。",
  "minorZh": "意思差不多，但「来ればいい」更像在给出路；「来たらいい」偏随口一说。",
  "minorEn": "Close, but 来ればいい offers a way out; 来たらいい sounds more offhand.",
  "major": "どっち側でもないなら、こっち側に来てはいけない。",
  "majorZh": "「来てはいけない」是\"不准来\"，意思完全反了。",
  "majorEn": "来てはいけない means 'you must not come' — the complete opposite."
 },
 "帰ったら、向こうで一番になってやる。": {
  "minor": "帰ったら、向こうで一番にしてやる。",
  "minorZh": "\"成为第一\"是「一番になる」；「一番にする」是\"把（别人）弄成第一\"。",
  "minorEn": "'Become number one' is 一番になる; 一番にする means 'make something number one'.",
  "major": "帰ったら、向こうで一番になってもらう。",
  "majorZh": "「なってもらう」是\"让别人当第一\"，主语换了人。",
  "majorEn": "なってもらう means 'have someone else become number one' — a different subject."
 },
 "一年間、ずっと勝負してくれて、ありがとう。": {
  "minor": "一年間、ずっと勝負してあげて、ありがとう。",
  "minorZh": "感谢对方为你做的事用「してくれて」；「してあげて」是你为对方做。",
  "minorEn": "Thanking her for what she did is してくれて; してあげて is what you did for her.",
  "major": "一年間、ずっと勝負させてくれなくて、ありがとう。",
  "majorZh": "\"谢谢你一直不让我比\"，意思完全乱了。",
  "majorEn": "'Thank you for never letting me compete' — the meaning collapses."
 },
 "三月には帰る。": {
  "minor": "三月では帰る。",
  "minorZh": "表示时间点用「に」（「三月には」），不能用「では」。",
  "minorEn": "A point in time takes に (三月には), not では.",
  "major": "三月には帰らない。",
  "majorZh": "否定之后变成\"三月不回去\"，意思反了。",
  "majorEn": "The negative means 'I won't go back in March' — the opposite."
 },
 "大丈夫です。": {
  "minor": "大丈夫でした。",
  "minorZh": "拒绝店员现在的提议用「大丈夫です」；「でした」是过去的事。",
  "minorEn": "Declining an offer now is 大丈夫です; でした refers to the past.",
  "major": "大丈夫ではありません。",
  "majorZh": "\"不行、有问题\"，跟\"不用了\"的意思相反。",
  "majorEn": "大丈夫ではありません means 'I am not okay' — not 'no thanks'."
 },
 "お願いします。": {
  "minor": "お願いしました。",
  "minorZh": "现在请对方给的时候用「お願いします」；「お願いしました」是\"刚才已经拜托过了\"。",
  "minorEn": "Asking now is お願いします; お願いしました means you already asked.",
  "major": "お願いされます。",
  "majorZh": "被动「お願いされます」是\"被人拜托\"，意思反了。",
  "majorEn": "お願いされます is passive — 'I am asked' — reversed."
 },
 "釣った魚って、売るんですか。": {
  "minor": "釣る魚って、売るんですか。",
  "minorZh": "已经钓上来的鱼要用过去形修饰：「釣った魚」。",
  "minorEn": "Fish already caught take the past form: 釣った魚.",
  "major": "釣った魚って、売られるんですか。",
  "majorZh": "被动「売られる」听起来像在说鱼被卖掉的可怜遭遇，问法不对。",
  "majorEn": "売られる makes it 'are the fish sold off' as if pitying them — the wrong question."
 },
 "似合ってる。": {
  "minor": "似合う。",
  "minorZh": "\"（现在穿着）很合适\"要用状态「似合ってる」，「似合う」是一般性的\"适合\"。",
  "minorEn": "For 'it suits you (right now)' use 似合ってる; 似合う is general.",
  "major": "似合わせてる。",
  "majorZh": "使役「似合わせる」不成话，像在说\"让它合适\"。",
  "majorEn": "似合わせてる is causative nonsense — 'making it suit'."
 },
 "……どちら様ですか？": {
  "minor": "……どなた様ですか？",
  "minorZh": "「どなた様」不常这样说，礼貌地问\"哪位\"用「どちら様」。",
  "minorEn": "どなた様 is not idiomatic here; the polite 'who is it' is どちら様.",
  "major": "……どちらですか？",
  "majorZh": "「どちらですか」是\"在哪边\"，问的是方向，玩笑就没了。",
  "majorEn": "どちらですか asks 'which way' — the joke disappears."
 },
 "明日、なにが出ますか。": {
  "minor": "明日、なにを出ますか。",
  "minorZh": "\"会出什么\"里「出る」是自动词，主语用「が」。",
  "minorEn": "出る is intransitive here, so the subject takes が.",
  "major": "明日、なにが出ましたか。",
  "majorZh": "过去形变成\"明天出了什么\"，时态矛盾。",
  "majorEn": "The past tense makes it 'what came out tomorrow' — contradictory."
 },
 "ここ、長いんですか。": {
  "minor": "ここ、長いですか。",
  "minorZh": "意思能懂，但问对方情况时「長いんですか」带着好奇，更自然。",
  "minorEn": "Understandable, but 長いんですか carries curiosity about her and sounds more natural.",
  "major": "ここ、短くないんですか。",
  "majorZh": "\"这里不短吗\"，听起来像在说地方的长度，不是问她做了多久。",
  "majorEn": "'Is it not short here?' sounds like the place's length, not how long she has worked."
 },
 "今の俺でも読める本、ありますか。": {
  "minor": "今の俺でも読む本、ありますか。",
  "minorZh": "\"能读的书\"要用可能形「読める」。",
  "minorEn": "'A book I can read' needs the potential form 読める.",
  "major": "今の俺でも読ませる本、ありますか。",
  "majorZh": "使役「読ませる」是\"让（别人）读的书\"，意思不对。",
  "majorEn": "読ませる is causative — 'a book that makes someone read'."
 },
 "先生は、ホームシックとかないんですか。": {
  "minor": "先生は、ホームシックとかありないんですか。",
  "minorZh": "「ある」的否定是「ない」，没有「ありない」。",
  "minorEn": "The negative of ある is ない, not ありない.",
  "major": "先生は、ホームシックとかさせないんですか。",
  "majorZh": "\"老师不让（人）想家吗\"，意思完全变了。",
  "majorEn": "'Do you not make people homesick?' — a completely different question."
 },
 "この書類、どこ間違えやすいですか。": {
  "minor": "この書類、どこ間違いやすいですか。",
  "minorZh": "「やすい」接动词连用形：「間違え（る）」→「間違えやすい」。",
  "minorEn": "やすい attaches to the verb stem: 間違える → 間違えやすい.",
  "major": "この書類、どこ間違えにくいですか。",
  "majorZh": "「にくい」是\"不容易\"，问成了\"哪里不容易错\"。",
  "majorEn": "にくい means 'hard to' — it asks where it is hard to make mistakes."
 },
 "……ちょっとだけ、いいですか。": {
  "minor": "……ちょっとしか、いいですか。",
  "minorZh": "「しか」要接否定，这里说\"就一会儿\"用「だけ」。",
  "minorEn": "しか needs a negative; for 'just a little' use だけ.",
  "major": "……ちょっとだけ、だめですか。",
  "majorZh": "\"一会儿也不行吗\"，从请求变成了抱怨。",
  "majorEn": "'Is even a little not allowed?' turns the request into a complaint."
 },
 "さっきの、なんですか。": {
  "minor": "さっきの、なんでしたか。",
  "minorZh": "能懂，但问\"刚才那个是什么\"口语里用「なんですか」就够了。",
  "minorEn": "Understandable, but なんですか is enough for 'what was that just now'.",
  "major": "さっきの、だれですか。",
  "majorZh": "问烧的东西不能用「だれ」（谁）。",
  "majorEn": "だれ is 'who' — not for something being burned."
 },
 "今日、どうですか。": {
  "minor": "今日、どうでしたか。",
  "minorZh": "问今天鱼口\"怎么样\"（还在钓）用现在形；过去形像是钓完了。",
  "minorEn": "He is still fishing, so ask in the present; the past sounds like it is over.",
  "major": "今日、どこですか。",
  "majorZh": "「どこ」是\"在哪儿\"，问错了东西。",
  "majorEn": "どこ asks 'where' — the wrong question."
 },
 "今のおすすめ、何ですか？": {
  "minor": "今のおすすめ、何をですか？",
  "minorZh": "「何ですか」前不能加「を」。",
  "minorEn": "You cannot put を before ですか here.",
  "major": "今のおすすめ、誰ですか？",
  "majorZh": "问推荐的款式要用「何」，不是「誰」。",
  "majorEn": "For a recommended style you need 何, not 誰."
 },
 "サイズ、これだけですか？": {
  "minor": "サイズ、これしかですか？",
  "minorZh": "「しか」必须接否定（「これしかないですか」），不能直接接「ですか」。",
  "minorEn": "しか must be followed by a negative (これしかないですか).",
  "major": "サイズ、これだけじゃないですか？",
  "majorZh": "反问变成\"这不就只有这个吗\"，像在抱怨，不是询问库存。",
  "majorEn": "It becomes 'isn't this all there is?' — a complaint, not a question about stock."
 },
 "勉強で目が疲れるんですけど……": {
  "minor": "勉強に目が疲れるんですけど……",
  "minorZh": "表示原因用「で」：「勉強で疲れる」。",
  "minorEn": "Cause takes で: 勉強で疲れる.",
  "major": "勉強で目を疲れさせたいんですけど……",
  "majorZh": "\"我想让眼睛累\"，意思完全反了。",
  "majorEn": "'I want to tire my eyes out' — the opposite of what you need."
 },
 "新入荷っていつ出ますか？": {
  "minor": "新入荷っていつに出ますか？",
  "minorZh": "「いつ」后面不加「に」。",
  "minorEn": "いつ does not take に.",
  "major": "新入荷っていつ出しましたか？",
  "majorZh": "过去形变成\"什么时候上过新\"，问的不是下一次。",
  "majorEn": "The past asks when it came in before, not when it will."
 },
 "いいの、入ってますか？": {
  "minor": "いいの、入りますか？",
  "minorZh": "问\"现在有没有好货\"用状态「入ってますか」；「入りますか」像在问能不能放进去。",
  "minorEn": "'Has anything good come in' is 入ってますか; 入りますか sounds like 'will it fit'.",
  "major": "いいの、入れてますか？",
  "majorZh": "「入れてます」是\"（你）有在放进去吗\"，主语和意思都偏了。",
  "majorEn": "入れてます means 'are you putting some in' — subject and sense drift."
 },
 "あれ、どうやってるんですか。": {
  "minor": "あれ、どうやるんですか。",
  "minorZh": "问她\"正在用的手法\"，用「やってる」更贴切；「やる」是一般性的\"怎么做\"。",
  "minorEn": "For the technique she is using, やってる fits; やる is general 'how is it done'.",
  "major": "あれ、どうやらせるんですか。",
  "majorZh": "使役「やらせる」是\"怎么让（别人）做\"，问错了。",
  "majorEn": "やらせる is causative — 'how do you make someone do it'."
 },
 "なんで二回言うんですか。": {
  "minor": "なんで二回言いますんですか。",
  "minorZh": "「ます」和「んですか」不能叠在一起。",
  "minorEn": "ます and んですか cannot be stacked.",
  "major": "なんで二回言われるんですか。",
  "majorZh": "被动「言われる」是\"为什么被说两遍\"，主语反了。",
  "majorEn": "言われる is passive — 'why am I told twice' — reversed."
 },
 "「ゆっくり」って、どういう意味ですか。": {
  "minor": "「ゆっくり」って、どんな意味ですか。",
  "minorZh": "能懂，但问词义的固定说法是「どういう意味」。",
  "minorEn": "Understandable, but the set phrase for asking a word's meaning is どういう意味.",
  "major": "「ゆっくり」って、どういう意味でしたか。",
  "majorZh": "过去形像是在问\"刚才那个是什么意思来着\"，不是第一次问。",
  "majorEn": "The past makes it 'what did it mean again', not a first question."
 },
 "いつも二分前ですね。": {
  "minor": "いつも二分前ですよ。",
  "minorZh": "「よ」是在告诉对方；向对方确认他的习惯用「ね」。",
  "minorEn": "よ informs; to remark on his habit to him, use ね.",
  "major": "いつも二分後ですね。",
  "majorZh": "「二分後」是\"晚两分钟\"，意思反了。",
  "majorEn": "二分後 means two minutes late — the opposite."
 },
 "……たぶん、こっちです。": {
  "minor": "……たぶん、こっちでした。",
  "minorZh": "指路说的是现在的方向，用「です」。",
  "minorEn": "Giving directions now, use です.",
  "major": "……たぶん、こっちじゃありません。",
  "majorZh": "\"大概不是这边\"，指路指反了。",
  "majorEn": "'Probably not this way' — the directions point the wrong way."
 }
};
