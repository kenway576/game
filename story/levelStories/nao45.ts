import { CharacterId, StoryNode } from '../../types';
import { kit } from './_kit';

// ---------------------------------------------------------
// 奈绪 · 第④段「答え合わせ」 / 第⑤段「十年後の予約」
//
// 【③之后还剩什么】
// ③：旧的那本清单不扔，但不再翻了；新的那本一天都没断过。
// 相爱线是那一条十年都写不下去的项目，终于写下去了。
// 剩下的那个不对称：**一直都是她在记你**。十年、两本笔记，记录的方向只有一个。
//
// ④：换你来写一页关于她的。她第一次被记录。
//    她紧张得要命——她知道被一条一条核对是什么滋味，因为①里她就是这么核对你的。
//    结果你写的东西里，有一条是她自己都不知道的习惯。
//    "原来我也是被看着的那一边。"
// ⑤：十年。两个人各写一封给十年后的信，交给对方保管，约好十年后在校门口的樱花树下拆。
//    ②里她怕的是"回来的会是另一个人"。⑤的解法不是保证不变，
//    是**约好十年后再对一次答案**——变了就再记，记得比变得快。
//
// 【动画】④：傍晚的北野坂，她跑上坡去又回头，笔记本抱在胸前，马尾一甩。
//         ⑤：校门口的老樱花树下，她把信封举起来对着天，叶子落下来，她笑了。
// ---------------------------------------------------------

const K = kit(CharacterId.NAO, 'bg-emerald-500', '奈绪', 'Nao');
const { scene, nar, say, me, choice, fork, anime, done } = K;

export const NAO_STORY_4: StoryNode[] = [
  scene('kitano_slope', '答え合わせ', 'Checking the Answers', '傍晚 · 北野坂', 'Early evening · The Kitano slope', 'town'),
  nar('北野坂。一年前她在这条坡上把关于你的一切报了一遍——全对，全是十年前的。', 'The Kitano slope. A year ago, on this slope, she recited everything about you. All correct. All ten years out of date.'),
  nar('她今天带着那本新的笔记本。已经写到第三本了。', 'Today she has the new notebook with her. She is on her third one already.'),
  say('knit', 'neutral', 'なあ。ずっと思っててんけど。', '呐。我一直在想。', 'Hey. Something I\'ve been thinking.'),
  say('knit', 'pout', 'これ、不公平ちゃう？ ウチばっかり書いてるやん。あんたのこと。', '这个，不公平吧？光是我一个人在写。写你的事。', 'This isn\'t fair, is it? I\'m the only one writing. About you.'),
  nar('她把笔记本翻到空白的一页，连同笔一起塞到你手里。', 'She opens the notebook to a blank page and shoves it into your hands along with the pen.'),
  say('knit', 'neutral', '一ページだけ。ウチのこと、書いて。今のウチ。……十年前のやなくて。', '就一页。写我的事。现在的我。……不是十年前的。', 'Just one page. Write about me. Me now. ...Not me ten years ago.'),
  nar('说完她转过身去，看着坡下的海。肩膀绷得很紧。', 'Having said it she turns away to look down the slope at the sea. Her shoulders are tight.'),
  nar('她知道被一条一条核对是什么滋味。一年前她就是这么核对你的。', 'She knows what it is like to be checked off item by item. A year ago that is exactly what she did to you.'),
  choice('你想了一会儿，写下了第一条。', 'You think for a while, then write the first item.', [
    { id: 'na4_faster', zh: '「歩くのが、前より半歩速くなった。」', en: '"Walks half a step faster than she used to."', jp: '歩くのが、前より半歩速くなった。', hintZh: '③那天之后', hintEn: 'Since that day',
      aff: 6, fam: 5, stat: 'knowledge',
      then: [nar('她回过头看了一眼，又迅速转回去。耳朵红了。那半步，是她在校门口决定"不再守着旧本子"那天开始的。', 'She glances back, then quickly turns away again. Her ears go red. That half step began the day at the school gate when she decided to stop guarding the old notebook.')] },
    { id: 'na4_blink', zh: '「笑う前に、一回まばたきする。」', en: '"Blinks once before she laughs."', jp: '笑う前に、一回まばたきする。', hintZh: '她自己都不知道的', hintEn: 'Something she doesn\'t know',
      aff: 7, fam: 4, stat: 'charm', words: [{ jp: 'まばたき', reading: 'まばたき', zh: '眨眼', en: 'blink' }],
      then: [
        say('knit', 'surprised', '……え、ウチ、そんなんしてる？', '……诶，我有那样吗？', '...Wait, I do that?'),
        nar('她转过来，想对着你笑一下证明没有——然后在笑之前，眨了一下眼。', 'She turns round to smile at you and prove it isn\'t true, and blinks once before she does.'),
        say('knit', 'shy', '……ほんまや。知らんかった。', '……真的诶。我都不知道。', '...You\'re right. I never knew.')
      ] },
    { id: 'na4_hand', zh: '「字が、前より大きくなった。」', en: '"Her handwriting has got bigger."', jp: '字が、前より大きくなった。', hintZh: '新本子上的字', hintEn: 'The writing in the new notebook',
      aff: 5, fam: 6, stat: 'kindness',
      then: [nar('旧的那本字很小，挤在格子里，像怕占地方。新的这本，字一天比一天大。她翻了翻自己前面写的几页，发现你说得对。', 'In the old notebook the writing was tiny, crammed into the lines as if afraid of taking up room. In the new one it gets bigger by the day. She flips back through her own pages and finds you are right.')] }
  ]),
  nar('你写满了一页。她接过去，从头到尾读了一遍，又读了一遍。', 'You fill the page. She takes it and reads it from top to bottom, then again.'),
  say('knit', 'neutral', '……ウチも、見られてたんやな。ずっと。', '……原来我也是被看着的那一边啊。一直都是。', '...So I was being watched too. All along.'),
  nar('她没有说"被看着"是好是坏。她只是把那一页对着夕阳举起来，看了很久。', 'She does not say whether being watched is good or bad. She only holds the page up to the setting sun and looks at it for a long time.'),
  nar('然后她抱着笔记本往坡上跑，跑出去几步又回过头来。', 'Then she runs up the slope with the notebook in her arms, and a few steps on turns back.'),
  anime(4),
  fork([
    say('knit', 'happy', '答え合わせ、全問正解！ ……やけど、一個足りひんで。', '对答案，全对！……不过，少了一条哦。', 'Answers checked. All correct! ...But you\'re missing one.'),
    me('どれ？', '哪条？', 'Which one?'),
    say('knit', 'shy', '「この人は、書いた人のことが好き」。……それも、ちゃんと項目にしといて。', '"这个人，喜欢写下这些的人"。……那一条，也给我好好写成一项。', '"This person likes the person who wrote this." ...Put that in as an item, properly.'),
    nar('你在最后一行补上了。她凑过来看，看完把脸埋进笔记本里，说了一句「遅い」——跟那天说的一模一样，只是这次是笑着说的。', 'You add it on the last line. She leans in, reads it, buries her face in the notebook and says "too slow", exactly as she did that day, except this time she is laughing.')
  ], [
    say('knit', 'happy', '答え合わせ、全問正解！ ……これ、毎週交換しよ。ウチが一ページ、あんたが一ページ。', '对答案，全对！……以后每周交换吧。我写一页，你写一页。', 'Answers checked. All correct! ...Let\'s swap every week. I write a page, you write a page.'),
    nar('记录的方向第一次变成了两个。她把那本笔记本的封面改了：「奈緒のノート」划掉，旁边写上「二人のノート」。', 'For the first time the record runs both ways. She changes the cover: "Nao\'s notebook" crossed out, and beside it, "Our notebook".')
  ]),
  done(4, 4, 4, '第一次被记录', 'The first time she was the one written about')
];

export const NAO_STORY_5: StoryNode[] = [
  scene('school_gate', '十年後の予約', 'Booked for Ten Years From Now', '放学后 · 校门口的樱花树下', 'After school · Under the cherry tree by the gate', 'chat'),
  nar('校门口那棵老樱花树。③那天她在这儿撕下了一页纸，递给你。', 'The old cherry tree by the school gate. On that day she tore a page out here and handed it to you.'),
  nar('今天她带来了两个信封，两张信纸。', 'Today she has brought two envelopes and two sheets of letter paper.'),
  say('knit', 'neutral', '十年後の自分に、手紙書こ。', '给十年后的自己，写信吧。', 'Let\'s write letters to ourselves ten years from now.'),
  say('knit', 'neutral', 'で、自分のは自分で持たへん。相手に預けんねん。', '然后，自己的信自己不拿。交给对方保管。', 'And we don\'t keep our own. We give them to each other to look after.', [{ jp: '預ける', reading: 'あずける', zh: '寄存、交给对方保管', en: 'to leave in someone\'s care' }]),
  nar('②里她问的是：回去的时候要是变成了别的人怎么办。', 'In the cafeteria she asked: what if, when you go back, you have turned into someone else?'),
  say('knit', 'neutral', '十年後、ここで開けるの。変わってても、変わってなくても。……答え合わせ、もう一回するために。', '十年后，在这儿拆开。变了也好，没变也好。……为了再对一次答案。', 'Ten years from now we open them here. Changed or not. ...So we can check the answers one more time.'),
  nar('她没有说"你不会变"。她说的是：变了也来对答案。', 'She does not say you will not change. She says: come and check the answers even if you have.'),
  nar('你们背靠着樱花树坐下，各写各的。她写得很快，写完了把信纸翻过去扣在膝盖上，不给你看。', 'You sit with your backs to the cherry tree and write separately. She writes fast, and when she is done she turns the page face down on her knee where you cannot see.'),
  choice('你的信纸上，第一句写什么？', 'What is the first line of your letter?', [
    { id: 'na5_nao', zh: '「十年後も、奈緒の隣を歩いてますか。」', en: '"Ten years on, am I still walking beside Nao?"', jp: '十年後も、奈緒の隣を歩いてますか。', hintZh: '一个问题', hintEn: 'A question',
      aff: 7, fam: 4, stat: 'charm',
      then: [nar('你写的是一个问题。答案要十年后的你自己来填。', 'You write a question. The answer is for the you of ten years from now to fill in.')] },
    { id: 'na5_jp', zh: '「十年後の日本語は、どれくらい上手ですか。」', en: '"How good is my Japanese ten years on?"', jp: '十年後の日本語は、どれくらい上手ですか。', hintZh: '写给自己的', hintEn: 'For yourself',
      aff: 4, fam: 7, stat: 'proficiency',
      then: [nar('你用日语写的。十年后的你如果读得懂这封信的每一个字，那就说明你没有停下来。', 'You write it in Japanese. If the you of ten years from now can read every word, it will mean you never stopped.')] },
    { id: 'na5_list', zh: '「新しいノートは、何冊目になりましたか。」', en: '"How many new notebooks is it up to now?"', jp: '新しいノートは、何冊目になりましたか。', hintZh: '关于她的本子', hintEn: 'About her notebooks',
      aff: 6, fam: 6, stat: 'kindness',
      then: [nar('你写的是她的本子。你想知道，十年后那一摞会有多高。', 'You write about her notebooks. You want to know how tall the stack will be in ten years.')] }
  ]),
  nar('你们交换了信封。她把你的那一封举起来，对着天看了看——当然什么也看不见。', 'You exchange envelopes. She holds yours up against the sky. Of course she can see nothing through it.'),
  anime(5),
  fork([
    say('knit', 'shy', '……ウチの、一行だけ教えたる。', '……我那封，告诉你一句。', '...I\'ll tell you one line of mine.'),
    say('knit', 'shy', '「十年後も、たぶん好き」って書こうとして、「たぶん」消した。', '我本来想写"十年后，大概也还喜欢"，然后把"大概"划掉了。', 'I was going to write "ten years from now I\'ll probably still love them", and then I crossed out "probably".'),
    nar('十年都写不下去的一个项目，现在连"大概"都不要了。', 'An item she could not write for ten years, and now she does not even want the "probably".'),
    say('knit', 'happy', '十年後、ここで。予約な。……遅れたら、今度はウチが「遅い」って言う番やで。', '十年后，这里。预约好了。……要是迟到了，这次换我说"太晚了"。', 'Ten years from now. Here. It\'s booked. ...If you\'re late, this time it\'s my turn to say "too slow".')
  ], [
    say('knit', 'happy', '十年後、ここで。予約な。', '十年后，这里。预约好了。', 'Ten years from now. Here. It\'s booked.'),
    say('knit', 'neutral', '……あんたがどこの国におっても、その日だけは帰ってきてや。ウチ、ノート持って待っとくから。', '……不管你在哪个国家，只有那天给我回来。我会带着笔记本等你。', '...Whatever country you\'re in, come back for that one day. I\'ll be waiting with the notebook.'),
    nar('她把你的信封夹进了那本"二人のノート"里，夹在最新的那一页。', 'She tucks your envelope into "Our notebook", at the newest page.')
  ]),
  done(5, 4, 4, '交换保管的两封信', 'Two letters, each in the other\'s keeping')
];
