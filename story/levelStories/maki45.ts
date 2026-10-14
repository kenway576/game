import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 真希 · 第④段「筐体の行方」 / 第⑤段「ご褒美の頼み方」
//
// 【③之后还剩什么】
// ③：她过了一次桥——「これは勝負じゃない」。相爱线说出了真心话，
//    挚友线留了两格空着的名字。那台机器月底搬走了。
// 剩下的：她只会用"比赛"开口。不比赛的时候，她不知道怎么**要**一样东西。
//
// ④：那台街机去哪儿了？她查到了：大阪一家老游戏厅收了它。她拖你去找。
//    机器搬家的时候高分榜被清空了——那四个字母（或那两格空着的位置）没了。
//    相爱线：她让你先输前两个字母。挚友线：四格全空，她说"这次センパイ先填"。
//    她习惯性地说「勝負せえへん？」，说到一半改口：「……ちゃう。一緒にやろ」。
// ⑤：音游比赛（Beat Crash 的街机大赛）。她报了名。开赛前她第一次紧张，
//    把耳机交给你保管，然后说出了她这辈子最难开口的一句：
//    「勝っても負けても、終わったら、一番に褒めて」——
//    不是比赛，不是挑衅，是**要奖励**。
//
// 【动画】④：霓虹的老游戏厅，她拍着按钮，回头露出虎牙笑。
//         ⑤：音游机台的灯光下，她的手快得看不清，最后一个音符落下，她定格。
// ---------------------------------------------------------

const K = kit(CharacterId.MAKI, 'bg-pink-500', '真希', 'Maki');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const MAKI_STORY_4: StoryNode[] = [
  scene('dotonbori', '筐体の行方', 'Where the Cabinet Went', '下午 · 大阪', 'Afternoon · Osaka', 'town'),
  nar('那台机器搬走的第二周，她给你发了一张截图：大阪一家老游戏厅的推特，配图是一台很眼熟的机器。', 'The second week after the cabinet was taken away, she sends you a screenshot: the account of an old arcade in Osaka, with a photo of a very familiar machine.'),
  nar('然后是她的消息：「土曜、大阪。来るやんな？ 来ぉへんかったら、ざぁこ認定な」。', 'Then her message: "Saturday. Osaka. You\'re coming, right? If you don\'t, you\'re officially a loser."'),
  nar('道顿堀边上一条小巷子里，招牌上的灯坏了一半。她站在门口，耳机挂在脖子上，脚尖一直在点地。', 'An alley off Dotonbori, half the lights in the sign dead. She waits at the door, headphones round her neck, toe tapping.'),
  say('punk', 'tease', '遅いで、センパイ。三分遅刻。ざぁこ。', '慢死了，前辈。迟到三分钟。杂鱼。', 'You\'re late, senpai. Three minutes. Loser.'),
  nar('游戏厅最里面，那台机器在。屏幕上的贴纸、按钮上的划痕，全都一样。', 'At the very back of the arcade, there it is. The sticker on the screen, the scratches on the buttons, all the same.'),
  nar('她投了一枚硬币，什么都没打，直接调出了高分榜。', 'She feeds in a coin and, without playing, brings up the high-score table.'),
  nar('高分榜是空的。搬家的时候清零了。', 'The table is empty. It was wiped when the machine moved.', undefined, [{ jp: 'リセット', reading: 'りせっと', zh: '重置、清零', en: 'reset' }]),
  fork([
    nar('那四个字母——前两个她的，后两个你的——没了。', 'The four letters, the first two hers and the last two yours, are gone.')
  ], [
    nar('那两格空着的位置也没了。不只那两格，所有的格子都空了。', 'The two blank spaces are gone too. Not just those two. Every space is blank now.')
  ]),
  nar('她盯着空空的屏幕看了很久，没有说话。', 'She stares at the empty screen for a long time without a word.'),
  say('punk', 'neutral', '……しゃーないな。機械って、そういうもんやし。', '……没办法嘛。机器就是这样的。', '...Can\'t be helped. That\'s machines for you.'),
  say('punk', 'tease', 'ほな、もう一回作ったらええだけや。センパイ、勝負せえへん？ 負けたほうが、', '那再弄一次就行了。前辈，要不要比一场？输的人要——', 'Then we just make a new one. Senpai, wanna go head-to-head? Loser has to—'),
  nar('她说到一半，停住了。', 'She stops halfway through.'),
  say('punk', 'shy', '……ちゃう。一緒にやろ。二人プレイ。', '……不对。一起玩吧。双人模式。', '...No. Let\'s play together. Two-player.'),
  choice('她往旁边挪了一点，把左边的摇杆让给你。', 'She shifts over and leaves you the left stick.', [
    { id: 'mk4_coop', zh: '「うん、一緒に。」', en: '"Yeah. Together."', jp: 'うん、一緒に。', hintZh: '双人模式', hintEn: 'Two-player',
      aff: 6, fam: 6, stat: 'kindness',
      then: [nar('双人模式。你们打到第四关就全灭了——你太烂，她一直在替你挡子弹，自己也死了。她笑得趴在机台上。', 'Two-player. You are both wiped out by stage four: you are hopeless, she keeps taking bullets for you, and goes down too. She laughs until she is draped over the cabinet.')] },
    { id: 'mk4_versus', zh: '「勝負でもいいよ。手加減しないで。」', en: '"Head-to-head is fine. Don\'t go easy on me."', jp: '勝負でもいいよ。手加減しないで。', hintZh: '她的老规矩', hintEn: 'Her old rules',
      aff: 4, fam: 7, stat: 'guts',
      then: [say('punk', 'surprised', '……ええの？', '……可以吗？', '...You sure?'), nar('她赢了，赢得很彻底。赢完她没有说杂鱼，只是说「もう一回」，然后又说「……次は一緒にやろな」。', 'She wins, completely. Afterwards she does not call you a loser. She says "again", and then: "...Next one, let\'s play together, okay?"')] },
    { id: 'mk4_watch', zh: '「先にマキのプレイ、見せて。」', en: '"Let me watch you play first."', jp: '先にマキのプレイ、見せて。', hintZh: '当观众', hintEn: 'Be the audience',
      aff: 7, fam: 4, stat: 'charm',
      then: [say('punk', 'shy', '……見るだけなん？ ……しゃーないな、ちゃんと見ときや。', '……光看吗？……没办法，给我好好看着。', '...Just watch? ...Fine. Watch properly, then.')] }
  ]),
  nar('最后她一个人打了一局，打到了第一名。输入名字的界面跳出来。', 'In the end she plays one game alone and takes first place. The name entry screen comes up.'),
  anime(4),
  fork([
    nar('四个字母的位置。她把摇杆推给你。', 'Four letters. She pushes the stick toward you.'),
    say('punk', 'shy', '今度は、前二つ、センパイの。後ろ二つ、ウチの。……順番、逆にしたろ思て。', '这次，前两个是前辈的。后两个是我的。……想把顺序反过来。', 'This time the first two are yours, senpai. The last two are mine. ...Thought I\'d swap the order.'),
    nar('你输完，她输完。新的四个字母在机器里亮着，跟旧的那个一样，只是先后换了。', 'You enter yours, she enters hers. The new four letters shine in the machine, just like the old ones, only the other way round.'),
    say('punk', 'happy', '……機械はリセットされても、ウチはリセットされへんからな。覚えときや。', '……机器就算清零了，我可不会清零。给我记住了。', '...The machine got reset, but I didn\'t. Remember that.')
  ], [
    nar('四个字母的位置。她一个都没填，把摇杆推给你。', 'Four letters. She does not fill in any. She pushes the stick toward you.'),
    say('punk', 'neutral', '今度は、センパイが先。……前は二つ空けて待ってたけど、今度はウチが待たれる番な。', '这次，前辈先。……以前我空着两格等你，这次换你让我等了。', 'You first this time, senpai. ...Before, I left two blank and waited for you. This time I\'m the one who gets waited for.'),
    nar('你填了前两格。后两格你空着，把摇杆还给她。她愣了一下，然后很认真地，一个字母一个字母地填满了。', 'You fill in the first two and leave the last two blank, and hand the stick back. She hesitates, then very carefully fills them in, letter by letter.')
  ]),
  done(4, 4, 4, '大阪那台机器里的新名字', 'The new name in the machine in Osaka')
];

export const MAKI_STORY_5: StoryNode[] = [
  scene('sannomiya_arcade', 'ご褒美の頼み方', 'How to Ask for a Reward', '夜 · 三宫的游戏厅', 'Night · The arcade in Sannomiya', 'night'),
  nar('三宫的游戏厅门口贴着一张海报：「Beat Crash 神戸大会」。参赛名单的最后一行，写着她的名字。', 'A poster on the arcade door in Sannomiya: Beat Crash Kobe Tournament. On the last line of the entrants\' list, her name.'),
  nar('她一年前说过，比赛有规则，规则规定对方必须回应你。所以她什么都要比。但真正的比赛，她一次都没报过名。', 'A year ago she said contests have rules, and the rules make the other person respond to you. So she turns everything into a contest. But a real tournament, she has never once entered.', undefined, [{ jp: '大会', reading: 'たいかい', zh: '大赛、比赛', en: 'tournament' }]),
  nar('开赛前十分钟。她坐在机台旁边的长椅上，一直在搓手。', 'Ten minutes before the start. She sits on the bench by the cabinets, rubbing her hands together.'),
  say('punk', 'neutral', '……センパイ。これ、持っといて。', '……前辈。这个，帮我拿着。', '...Senpai. Hold these for me.'),
  nar('她把那副紫色的猫耳耳机摘下来，放在你手里。你认识她一年，第一次看见她把它摘下来交给别人。', 'She takes off the purple cat-ear headphones and puts them in your hands. In a year of knowing her, you have never seen her hand them to anyone.'),
  say('punk', 'sad', 'ウチ、本物の大会出るの、初めてやねん。……負けたら、言い訳でけへんやん。', '我啊，参加真正的大赛还是第一次。……要是输了，连借口都找不到。', 'This is my first real tournament. ...If I lose, there\'s no excuse.'),
  nar('然后她深吸一口气，说得非常快，快得像怕自己中途停下来。', 'Then she takes a deep breath and says it very fast, as if afraid she will stop halfway.'),
  say('punk', 'shy', '勝っても負けても、終わったら、一番に褒めて。', '赢也好输也好，结束之后，第一个夸我。', 'Win or lose, when it\'s over, be the first to tell me I did well.', [{ jp: '褒める', reading: 'ほめる', zh: '夸奖、表扬', en: 'to praise' }]),
  nar('不是"比一场"，不是"杂鱼"，不是"你输了就得怎样"。她第一次没有用比赛来包装一句话。她在要一样东西。', 'Not "let\'s compete", not "loser", not "if you lose you have to". For the first time she has not wrapped what she wants in a contest. She is asking for something.'),
  choice('她低着头，等你回答。', 'Head down, she waits for your answer.', [
    { id: 'mk5_promise', zh: '「約束する。一番に。」', en: '"I promise. First."', jp: '約束する。一番に。', hintZh: '答应', hintEn: 'Promise',
      aff: 7, fam: 4, stat: 'kindness',
      then: [say('punk', 'happy', '……言うたな。録音しとけばよかったわ。', '……你说的哦。早知道录下来了。', '...You said it. Should\'ve recorded that.')] },
    { id: 'mk5_now', zh: '「始まる前に、一回褒めとく。ここまで来たの、すごいよ。」', en: '"One in advance: getting here at all is amazing."', jp: '始まる前に、一回褒めとく。ここまで来たの、すごいよ。', hintZh: '先给一次', hintEn: 'One on account',
      aff: 6, fam: 6, stat: 'charm',
      then: [say('punk', 'surprised', '……っ、まだ早いって！', '……！还早着呢！', '...! Too early!'), nar('她跳起来，脸红到了耳根。但她走向机台的脚步，比刚才稳多了。', 'She jumps up, red to the ears. But her steps toward the cabinet are much steadier than before.')] },
    { id: 'mk5_zako', zh: '「負けたら、ざぁこって言ってあげる。」', en: '"If you lose, I\'ll call you a loser."', jp: '負けたら、ざぁこって言ってあげる。', hintZh: '用她的话', hintEn: 'In her own words',
      aff: 5, fam: 7, stat: 'guts',
      then: [say('punk', 'tease', '……生意気。センパイのくせに。', '……嚣张。明明是前辈。', '...Cheeky. For a senpai.'), say('punk', 'happy', '……けど、ありがと。ちょっと力抜けた。', '……不过，谢啦。放松了一点。', '...Thanks, though. Loosened me up a bit.')] }
  ]),
  nar('比赛开始了。她一路打进了决赛。决赛的对手是一个初中生，戴着跟她一样的猫耳耳机。', 'The tournament begins. She fights her way to the final. Her opponent is a middle-schooler wearing the same cat-ear headphones she does.'),
  nar('最后一首。屏幕上的音符像下暴雨。她的手快得你看不清。', 'Last song. The notes pour down the screen like a cloudburst. Her hands move too fast to see.'),
  anime(5),
  nar('最后一个音符落下。比分出来了：差了一千二百分。第二名。', 'The last note falls. The score comes up: twelve hundred points short. Second place.'),
  nar('那个初中生跳起来欢呼。她站在原地，盯着屏幕，没有动。', 'The middle-schooler leaps and cheers. She stays where she is, staring at the screen, not moving.'),
  nar('然后她转过身，走下台，穿过人群，直直地走到你面前。', 'Then she turns, steps down, cuts through the crowd and walks straight up to you.'),
  say('punk', 'sad', '……負けた。', '……输了。', '...I lost.'),
  say('punk', 'shy', '……約束。', '……约好的。', '...You promised.'),
  fork([
    nar('你把耳机给她戴回去，然后说了。说她最后那一段的连打有多快，说她从头到尾一个音都没漏，说她站在台上的样子有多好看。', 'You put the headphones back on her, and then you tell her. How fast her last run was, how she did not drop a single note start to finish, how good she looked up on that stage.'),
    nar('你说到第三句，她把脸埋进了你胸口。', 'By your third sentence she has buried her face in your chest.'),
    say('punk', 'shy', '……もっと。もっと褒めて。……今日だけやから。', '……还要。再多夸我一点。……就今天。', '...More. Tell me more. ...Just for today.'),
    nar('不是"今天就到此为止"的意思。你知道的。是"今天开始可以要"的意思。', 'Not "today and never again". You know that. It means: from today, I am allowed to ask.')
  ], [
    nar('你把耳机给她戴回去，然后说了。说她的连打有多快，说那个初中生赢的时候她第一个鼓了掌——你看见了。', 'You put the headphones back on her and then you tell her. How fast her runs were, and that when the middle-schooler won, she was the first to clap. You saw.'),
    say('punk', 'surprised', '……そこ、見てたん？', '……那个，你看见了？', '...You saw that?'),
    say('punk', 'happy', '……センパイ、褒めんの下手くそやな。……もう一回言うて。今の、最後のとこ。', '……前辈，夸人真不会夸。……再说一遍。刚才，最后那句。', '...You\'re terrible at praise, senpai. ...Say it again. The last bit.'),
    nar('你又说了一遍。她把耳机往下拉了拉，遮住了半张脸。遮住的那半张在笑。', 'You say it again. She pulls the headphones down to cover half her face. The covered half is smiling.')
  ]),
  done(5, 4, 4, '第一次开口要的奖励', 'The first reward she asked for')
];
