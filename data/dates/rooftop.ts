import { D, say, joke, act } from './kit';

// 放学后的天台
export const ROOFTOP = {
  asuka: D(
    ['明日香站在铁丝网边上，手里拿着一本单词书，嘴唇在动——她在背东西。看见你，她把书合上，合得很快，像是被抓到在做什么不该做的事。', 'Asuka is standing at the fence with a vocabulary book, lips moving — memorising. When she sees you she shuts it fast, as if caught at something she should not be doing.'],
    ['她说天台的门锁坏了这件事，作为班长她本该上报。然后她看了一眼门，又看了一眼海，说「……今年不报」。', 'She says that as class rep she ought to report the broken lock. Then she looks at the door, then at the sea, and says, "...Not this year."'],
    ['风把她的单词书吹开了一页。', 'The wind flips her vocabulary book open to a page.'],
    [say('そのページの単語、一緒に覚えよう。', '那一页的单词，一起背吧。', 'Let\'s learn the words on that page together.', '陪她背', 'Study with her',
      ['shy', '……し、仕方ないわね。一問でも間違えたら、もう一回最初からよ。', '……真、真拿你没办法。错一个就从头再来。', '...F-fine. Get one wrong and we start over.'],
      ['そのページの単語、一緒に覚えろう。', '「覚える」的意志形是「覚えよう」，没有「覚えろう」。', 'The volitional of 覚える is 覚えよう.'],
      ['そのページの単語、一緒に忘れよう。', '「忘れよう」是\"一起忘掉吧\"，她会生气。', '忘れよう means \"let\'s forget them\".']),
     joke('「班长也会偷偷在天台用功啊。」', '"So the class rep studies in secret on the roof."', '揭穿她', 'Call her out',
      ['angry', '偷偷じゃないわよ！　……教室だと、みんなに頼られて集中できないの。', '才不是偷偷！……在教室的话，大家都来找我，没法集中。', 'It is not secret! ...In the classroom everyone needs me and I cannot focus.']),
     act('在她旁边坐下，从书包里拿出自己的课本', 'Sit beside her and take out your own textbook', '一起学习', 'Study alongside',
      ['happy', '……ふん。静かにしてるなら、隣にいてもいいわ。', '……哼。安静的话，可以待在旁边。', '...Hmph. If you are quiet, you may stay.'])]
  ),
  hikari: D(
    ['光趴在铁丝网上朝下面的操场挥手，下面有人回她手，她挥得更起劲了。她回头看见你，用同一只手朝你挥——挥得一样大。', 'Hikari is leaning on the fence waving down at the field. Someone waves back and she waves harder. She turns, sees you, and waves at you with the same hand — just as big.'],
    ['她说从这儿看，港口的起重机像一排在跟她打招呼的人。然后她朝起重机也挥了挥手。', 'She says from here the harbour cranes look like a row of people saying hello. Then she waves at the cranes too.'],
    ['一艘船慢慢离港了。', 'A ship is slowly leaving port.'],
    [say('あの船にも、手をふろうか。', '也朝那艘船挥挥手吧。', 'Shall we wave at that ship too?', '陪她挥手', 'Wave with her',
      ['happy', 'うん！　せーので！　……見えたかな。見えてたら ええな。', '嗯！一起！……看到了吗。看到就好了呢。', 'Yes! Together! ...Did they see? I hope they did.'],
      ['あの船にも、手をふるうか。', '「ふる」的意志形是「ふろう」，「ふるう」是别的动词（挥舞、发挥）。', 'The volitional of ふる is ふろう; ふるう is a different verb.'],
      ['あの船にも、手をふらないか。', '\"不挥手吗\"，语气成了反问。', '\"Shall we not wave?\" — a reverse question.']),
     joke('「挥那么大力，手不会掉下来吗？」', '"Wave that hard and your arm might fall off."', '逗她', 'Tease her',
      ['tease', 'おちへんよ！　……おちたら、{name}くんが ひろってな。', '才不会掉！……掉了的话，你帮我捡哦。', 'It will not! ...If it does, you pick it up.']),
     act('举起手，跟她一起挥', 'Raise your hand and wave alongside her', '不说话，直接做', 'Just do it',
      ['happy', 'えへへ、ふたりで ふると、二ばい とどく気が する！', '嘿嘿，两个人一起挥，感觉能传两倍远！', 'Hehe, waving together feels twice as far-reaching!'])]
  ),
  rei: D(
    ['铃坐在水塔的阴影里，膝盖上摊着一本观测笔记，在记录云的形状。她抬头看了你一眼，在本子上写了一行字，然后才说「お疲れさまです」。', 'Rei is sitting in the shade of the water tank, an observation notebook on her knees, recording cloud shapes. She glances up, writes a line, and only then says, "Good work today."'],
    ['你问她写了什么。她把本子转过来：「十六時十二分　来訪者一名」。下面空着一行，她说那一行要等你走了才写。', 'You ask what she wrote. She turns the notebook round: "16:12 — one visitor." The line below is blank. She says it gets written after you leave.'],
    ['一朵云正在慢慢改变形状。', 'A cloud is slowly changing shape.'],
    [say('あの雲、何の形に見える？', '那朵云，你看像什么？', 'What does that cloud look like to you?', '问她的看法', 'Ask her view',
      ['neutral', '……気象学的には積雲です。……主観的には、少しだけ、猫に見えます。記録には書きませんが。', '……从气象学上讲是积云。……主观上，有一点点像猫。不过不会写进记录。', '...Meteorologically, cumulus. ...Subjectively, a little like a cat. I will not record that.'],
      ['あの雲、何の形が見える？', '\"看起来像……\"用「に見える」，「何の形に見える」。', '\"Looks like\" is に見える.'],
      ['あの雲、何の形で見せる？', '「見せる」是\"给人看\"，问法不成立。', '見せる means to show — the question breaks.']),
     joke('「那一行空着的，我能先看看吗？」', '"Can I read the blank line in advance?"', '耍赖', 'Cheat',
      ['tease', '……未来の記録を読む方法は、まだ発明されていません。', '……读取未来记录的方法，还没有被发明出来。', '...A method for reading future records has not yet been invented.']),
     act('学她的样子，也仰头看云', 'Copy her and look up at the clouds', '一起观测', 'Observe together',
      ['happy', '……観測者が二名になりました。精度が、上がります。', '……观测者变成两名了。精度会提高。', '...There are now two observers. Accuracy improves.'])]
  ),
  inari: D(
    ['稻荷坐在铁丝网的外面——外面。她坐在天台边缘那道只有十厘米宽的水泥沿上，两条腿悬在空中晃，九条尾巴垂下去，在风里摆。', 'Inari is sitting outside the fence — outside — on a ledge ten centimetres wide, legs swinging over the drop, nine tails hanging down and swaying in the wind.'],
    ['她说一千年前这里是一片山坡，开满了野菊。她伸手往下指，好像那片花还在那儿，只是你看不见。', 'She says a thousand years ago this was a hillside covered in wild chrysanthemums. She points down as if the flowers are still there and you simply cannot see them.'],
    ['她拍了拍旁边的水泥沿，示意你也坐过来。', 'She pats the ledge beside her, inviting you over.'],
    [say('危ないから、こっちに来てください。', '太危险了，请到这边来。', 'It\'s dangerous. Please come over here.', '先把她叫回来', 'Call her back first',
      ['tease', 'ふふ、神の身を案じるか。……よかろう。そなたの隣のほうが、景色もよいしの。', '呵呵，担心神明的安危吗。……好吧。你旁边的风景也更好。', 'Heh, worried for a god? ...Very well. The view beside you is better anyway.'],
      ['危ないから、こっちに来てあげてください。', '「来てあげて」是\"为了别人来\"，授受用错了。', '来てあげて means coming for someone else\'s sake — wrong.'],
      ['危なくないから、こっちに来ないでください。', '\"不危险，别过来\"，意思完全反了。', '\"It is not dangerous, do not come\" — reversed.']),
     joke('「你掉下去的话，会变成一只狐狸飞走吗？」', '"If you fall, do you turn into a fox and fly off?"', '好奇', 'Curious',
      ['happy', '狐は飛ばぬわ、たわけ。……されど、落ちはせぬ。千年、落ちたことはない。', '狐狸不会飞，蠢货。……不过，我不会掉下去。一千年没掉过。', 'Foxes do not fly, fool. ...But I will not fall. Not once in a thousand years.']),
     act('隔着铁丝网，握住她垂下来的一条尾巴尖', 'Through the fence, take hold of the tip of one tail', '怕她掉下去', 'In case she falls',
      ['surprised', '……！　しっ、尻尾は掴むでない！　……案ずるな。……そちらへ行くから、離せ。', '……！别、别抓尾巴！……别担心。……我过去，你先放手。', '...! D-do not grab the tail! ...Do not worry. ...I am coming over. Let go.'])]
  ),
  miyuki: D(
    ['深雪站在天台门口，手里拎着一个保温饭盒，样子像是迷路了。她说她来学校送东西，送完了，然后就——不知道为什么——一路走到了天台。', 'Miyuki is standing in the roof doorway holding a thermos lunch box, looking lost. She says she came to drop something off at the school, did, and then — she does not know why — walked all the way up here.'],
    ['她说她上学的时候，也有一个这样的天台。也是锁坏了。也没有人报修。她笑了一下，说「どこの学校も、同じなのね」。', 'She says the school she went to had a roof like this too. The lock was broken there too. Nobody reported it either. She smiles: "Every school is the same."'],
    ['她打开饭盒，里面是两人份的饭团。', 'She opens the box. Rice balls for two.'],
    [say('二人分あるの、偶然ですか。', '刚好有两人份，是巧合吗？', 'Two portions — a coincidence?', '问破', 'Ask straight out',
      ['tease', 'ふふ、偶然よ。……偶然、あなたの好きな梅干しも入ってるの。', '呵呵，是巧合哦。……巧合的是，你喜欢的梅干也在里面。', 'Hehe, coincidence. ...And by coincidence, your favourite umeboshi is in there.'],
      ['二人分あるの、偶然でしたか。', '眼前的事问\"是巧合吗\"用现在形「ですか」更自然。', 'For what is in front of you, ですか is more natural.'],
      ['二人分ないの、偶然ですか。', '\"没有两人份\"，跟眼前的事实不符。', '\"There are not two portions\" — untrue.']),
     joke('「被老师发现的话，你就说是我姐姐。」', '"If a teacher catches us, say you are my sister."', '编个理由', 'Make up a cover',
      ['happy', 'お姉さん、ね。……ふふ、それなら本当のことだから、言いやすいわ。', '姐姐吗。……呵呵，那倒是真话，好说出口。', 'Sister, hm. ...Hehe, that is true enough to say easily.']),
     act('把自己的外套铺在水泥地上，让她坐', 'Spread your blazer on the concrete for her to sit on', '天台地上脏', 'The roof is dirty',
      ['shy', 'あら……紳士ね。……汚れたら、私がちゃんと洗ってあげる。', '哎呀……真是绅士。……弄脏了的话，我会好好帮你洗的。', 'Oh... a gentleman. ...If it gets dirty, I will wash it for you.'])]
  ),
  sora: D(
    ['空在天台上运球。运一下，砰；再运一下，砰。天台的水泥地把声音弹得很远，楼下大概有人在奇怪今天的天花板为什么在响。', 'Sora is dribbling a ball on the roof. Bounce, thud; bounce, thud. The concrete throws the sound far — someone downstairs is probably wondering why the ceiling is knocking.'],
    ['她说体育馆今天被排球部占了，她只是来练手感的。然后她把球往你怀里一扔，说「パス」。', 'She says the volleyball club has the gym today, she is just keeping her touch. Then she throws the ball at your chest: "Pass."'],
    ['球在你手里，铁丝网那头是整片的海。', 'The ball is in your hands; beyond the fence, the whole sea.'],
    [say('ここでシュートしたら、海に落ちるよ。', '在这儿投篮的话，会掉进海里的。', 'Shoot from here and it lands in the sea.', '先把规矩讲清楚', 'Lay down the rules',
      ['happy', 'アホ、入れるんちゃうわ。パスやパス。……ほら、返して。', '笨蛋，又不是要投进去。传球、传球。……快，传回来。', 'Idiot, I am not shooting. Pass, pass. ...Come on, give it back.'],
      ['ここでシュートすれば、海に落ちるよ。', '能懂，但说眼前的假设\"要是投了的话\"，「したら」更口语自然。', 'Understandable, but したら is more natural for this kind of \"if\".'],
      ['ここでシュートしたら、海から落ちるよ。', '「海から落ちる」是\"从海里掉下来\"，方向反了。', '海から means from the sea — reversed.']),
     joke('假装要把球往铁丝网外扔', 'Pretend to throw the ball over the fence', '吓她', 'Scare her',
      ['angry', 'ちょ、待て待て待て！　それ部室のやつや！　……ほんまにやめてや！', '喂、等等等等！那是社团的球！……真的别啊！', 'Hey, wait wait wait! That is the club\'s ball! ...Seriously, do not!']),
     act('把球稳稳地传回她手里', 'Pass the ball cleanly back into her hands', '认真传', 'A proper pass',
      ['happy', 'ナイスパス。……お前、意外と手首使えるやん。明日も来いや。', '好传。……你手腕还挺灵的嘛。明天也来吧。', 'Nice pass. ...Your wrist is better than I thought. Come tomorrow too.'])]
  ),
  nao: D(
    ['奈绪坐在铁丝网下面，抱着膝盖，在那个小本子上画东西。你走近才看清，她画的是天台本身——门、水塔、你刚刚推门进来的样子。', 'Nao is sitting under the fence, hugging her knees, drawing in her little notebook. Up close you see she is drawing the roof itself — the door, the water tank, you pushing the door open just now.'],
    ['她说这个天台，她小学的时候就想上来看看。那时候她跟你说过。你不记得了。她说「でしょうね」，翻到了下一页。', 'She says she has wanted to come up here since primary school. She told you back then. You do not remember. She says, "Figured," and turns the page.'],
    ['她把本子递给你，空白的那一页朝上。', 'She hands you the notebook, a blank page up.'],
    [say('今日のこと、書いてもいい？', '今天的事，我可以写下来吗？', 'Can I write about today?', '接过本子', 'Take the notebook',
      ['shy', '……いいよ。……へんなこと 書いたら、けすからね。', '……可以哦。……写奇怪的东西的话，我会擦掉。', '...Okay. ...If you write anything weird, I will erase it.'],
      ['今日のこと、書いてはいい？', '请求许可是「てもいい」，不是「てはいい」。', 'Permission is てもいい, not てはいい.'],
      ['今日のこと、書かれてもいい？', '被动「書かれても」变成\"被写也可以吗\"，意思乱了。', '書かれても is passive and muddles it.']),
     joke('「我小学说过什么，你都记在本子上了吗？」', '"Did you write down everything I said in primary school?"', '有点怕', 'Slightly nervous',
      ['tease', 'ぜんぶ じゃないよ。……だいじな ことだけ。……あんたが 一年生のとき ないた日、とか。', '不是全部哦。……只记重要的。……比如你一年级哭的那天。', 'Not everything. ...Only the important bits. ...Like the day you cried in first grade.']),
     act('在她旁边坐下，抱起膝盖，跟她一样', 'Sit beside her and hug your knees, like her', '回到小时候', 'Like when you were kids',
      ['happy', '……むかしも、こうして すわってたね。……せが のびても、かわんないね。', '……以前也是这样坐着的呢。……长高了，也没变。', '...We used to sit like this. ...Taller now, but the same.'])]
  ),
  maki: D(
    ['真希蹲在天台角落，手机横拿着，大拇指快得看不清——在打游戏。她头也不抬地说「せんぱい遅い」，然后输了，然后抬起头来瞪你，好像是你害的。', 'Maki is crouched in a corner, phone sideways, thumbs too fast to see — gaming. Without looking up she says, "Senpai, you are late," then loses, then glares at you as if it were your fault.'],
    ['她说一年级的不该上二年级的天台，所以她是偷偷上来的。说完她冲你挤了挤眼睛：「共犯やで、せんぱい」。', 'She says first-years are not supposed to use the second-years\' roof, so she snuck up. Then she winks: "We are accomplices now, senpai."'],
    ['她把手机递给你，屏幕上是「CONTINUE?」。', 'She hands you the phone. The screen says CONTINUE?'],
    [say('一回だけ、やってみてもいい？', '我能玩一局吗？', 'Can I have one go?', '接过手机', 'Take the phone',
      ['tease', 'ええよ。……どうせ一面でゲームオーバーやろ？　ざぁこ♡　……ほら、ボタンそっちやで。', '行啊。……反正第一关就会死吧？杂鱼♡……喂，按钮在那边哦。', 'Sure. ...You will die on stage one anyway. Loser. ...Hey, the button is over there.'],
      ['一回だけ、やってもらってもいい？', '「やってもらう」是\"请别人玩\"，授受方向错了。', 'やってもらう means having someone else play.'],
      ['一回も、やってみてもいい？', '「一回も」后面要接否定，不能跟「やってみてもいい」连用。', '一回も needs a negative.']),
     joke('「我去告诉班长，有一年级的上天台。」', '"I am telling the class rep a first-year is up here."', '反将一军', 'Turn the tables',
      ['angry', 'は！？　あかんあかん！　……ジュースおごるから、な？　な？', '哈！？不行不行！……我请你喝饮料，好吗？好吗？', 'What?! No no no! ...I will buy you a drink, okay? Okay?']),
     act('蹲到她旁边，看她打下一局', 'Crouch beside her and watch the next round', '当观众', 'Be her audience',
      ['shy', '……見られとると、手ぇ震えるんやけど。……でも、まあ、見ててもええで。', '……被你看着，手会抖啊。……不过，嘛，你看着也行。', '...My hands shake when you watch. ...But, well, you can watch.'])]
  )
};
