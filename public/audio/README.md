# 🔊 音频素材放这里 (`public/audio/`)

游戏的音效系统是**零依赖手写**的（`services/audioManager.ts`，纯 Web Audio API，**没有用 howler**）。

它分两层：

1. **有素材** → 运行时 `fetch` + `decodeAudioData`，用 `AudioBufferSourceNode` 播放真实文件；
2. **没素材** → 用 `OscillatorNode` / 噪声**实时合成一个占位音**。

所以现在不放任何文件，游戏也能听到响（合成占位音）。把真素材丢进来、在
`manifest.json` 里登记，代码不用改，下次加载自动切换成真文件。加载失败只在
**console 里 `info` 一次**，绝不报错、绝不卡游戏。

---

## 怎么启用真实素材

### 1. 放文件

```
public/audio/
├── manifest.json          ← 必需：登记哪些文件存在、什么格式
├── bgm/
│   ├── title.mp3
│   ├── lobby.mp3
│   └── chat.mp3
└── sfx/
    ├── click.mp3
    ├── page.mp3
    └── ...
```

> **没有 `manifest.json` = 纯占位模式**（零网络请求、零 404）。这是刻意的：
> 不想让缺素材时控制台刷一堆 404。

### 2. 写 `manifest.json`

只需要写出**实际存在**的文件。缺的项会自动回退到合成音。

```jsonc
{
  "bgm": {
    "title": "mp3",
    "lobby": "mp3",
    "chat":  "mp3"
  },
  "sfx": {
    "click": "mp3",
    "page":  "mp3",
    "send":  "mp3"
    // 只写你有的；没写的用合成音
  }
}
```

- 值可以只写扩展名（`"mp3"` → 找 `sfx/click.mp3`），
- 也可以写完整相对路径（`"sfx/click_v2.ogg"` 或 `"/audio/custom/foo.mp3"`）。

参考模板见同目录的 **`manifest.example.json`**，直接复制改名即可。

---

## 需要哪些文件

### BGM（3 首，循环播放，默认音量 20%，切换时交叉淡入 800ms）

| key      | 触发场景        | 情绪基调                     | 建议时长 |
|----------|-----------------|------------------------------|----------|
| `title`  | 标题 / 登记画面 | 沉静、开阔、期待感           | 1–2 min loop |
| `lobby`  | 大厅选人画面    | 明亮、日常、轻快             | 1–2 min loop |
| `chat`   | 聊天 / 学习画面 | 温柔、贴近、不抢戏（垫底用） | 2–3 min loop |

> 升级庆祝时 BGM 会被自动压低到约 35%，庆祝结束恢复。

### SFX（一次性短音效）

| name                  | 触发点                                   | 音色方向 |
|-----------------------|------------------------------------------|----------|
| `click`               | 任意按钮点击（根节点统一捕获）           | 极短、干、轻 |
| `page`                | 对话框翻页                               | 轻「唰」 |
| `type`                | 打字机逐字（**内部节流** ~55ms + 随机 pitch ±5%） | 极短、极轻、低频 |
| `send`                | 玩家发送消息                             | 上行「咻」 |
| `receive`             | 收到 AI 回复                             | 柔和两音 |
| `collect`             | 收藏生词                                 | 闪亮上行分解和弦 |
| `error`               | 通信 / 连接错误                          | 短、下行、不刺耳 |
| `modal_open`          | 主要弹窗打开                             | 上行 |
| `modal_close`         | 主要弹窗关闭                             | 下行 |
| `confirm`             | 确认类操作（备用）                       | 稳定两音 |
| `affection_up`        | 好感度上涨（**暖**音色）                 | 正弦/三角、大三度、带揉音、圆润 |
| `familiarity_up`      | 親密度上涨（**冷**音色，要能和上面听出区别） | 三角/方波偏硬、纯四度、更高更短、无揉音 |
| `relation_down`       | 关系倒退（任一轴下降）                   | 下行小三度 + 低通下扫 |
| `levelup_affection`   | 好感度**跨级**庆祝                       | 暖：C–E–G–C 大调琶音，尾音长 |
| `levelup_familiarity` | 親密度**跨级**庆祝                       | 冷：纯四度堆叠，短促清脆 |
| `unlock`              | 解锁服装 / 场景                          | 4 音上行，明亮 |
| `quiz_correct`        | 答对题                                   | 明亮两音上行 |
| `quiz_wrong`          | 答错题（**柔和**，别做成惩罚音）         | 两下低音「咚咚」，钝、圆 |
| `dice_rattle`         | 骰子翻滚（**循环**，落定时停）           | 密集短「咔哒」 |
| `dice_land_low`       | 骰子落定 1–2 点                          | 沉闷低「咚」 |
| `dice_land_mid`       | 骰子落定 3–4 点                          | 中等 |
| `dice_land_high`      | 骰子落定 5–6 点                          | 明亮 + 一点铃声 |
| `enter_chat`          | 进入聊天                                 | 上行淡入 swell |
| `leave_chat`          | 离开聊天                                 | 下行淡出 |

---

## 格式规格

- **格式**：`.mp3`（兼容性最好）。也支持 `.ogg` / `.wav` / `.m4a` / `.webm`，在
  manifest 里写对扩展名即可。Safari 对 `.ogg` 支持差，跨端优先 `.mp3`。
- **采样率**：44.1 kHz。**声道**：SFX 单声道够用，BGM 可立体声。
- **码率**：SFX 128 kbps 足够；BGM 128–192 kbps。
- **响度**：SFX 峰值留 -3 dBFS 余量（代码里还有每音效的相对音量微调）。
  各音效之间响度尽量拉齐，别让某一个特别炸。
- **BGM 循环**：请做成**无缝循环**（首尾能接上），代码里是 `loop = true` 直接续。
- **体积**：单个 SFX 尽量 < 50 KB，整个 `bgm/` 控制在几 MB 以内
  （仓库已经很大了，注意 `.gitattributes` 已把音频标成 binary）。

---

## CC0 / 免费素材来源

以下均可商用、可再分发，**注意仍要看单个素材页的具体授权**：

| 站点 | 内容 | 授权 |
|------|------|------|
| **[Kenney.nl](https://kenney.nl/assets?q=audio)** | UI 音效包（`click`/`page`/`confirm`/`error` 一站配齐）、骰子、界面反馈 | CC0 |
| **[freesound.org](https://freesound.org/)** | 海量真实录音（骰子、翻书、环境音）。**筛选 License = Creative Commons 0** | 多为 CC0 / CC-BY，逐条确认 |
| **[Pixabay Audio](https://pixabay.com/sound-effects/)** | SFX + 循环 BGM，含大量 UI / 提示音 | Pixabay License（可商用免署名） |
| **[freepd.com](https://freepd.com/)** | 完全公有领域的背景音乐，风格分类清晰 | CC0 |
| **[incompetech.com](https://incompetech.com/music/royalty-free/)** | Kevin MacLeod 背景音乐库 | CC-BY（需署名）/ 付费免署名 |
| **[sonniss.com/gameaudiogdc](https://sonniss.com/gameaudiogdc)** | 每年 GDC 免费放出的数十 GB 游戏音效库 | 免版税，可商用 |
| **[opengameart.org](https://opengameart.org/)** | 游戏音效 / 音乐，注意逐条看授权 | CC0 / CC-BY / GPL 混杂 |

### 建议的最省事组合

1. **UI / SFX** → Kenney 的 *Interface Sounds* + *Digital Audio* 两个包（CC0），
   从里面挑对应 `click` / `page` / `send` / `error` / `unlock`。
2. **骰子** → freesound 搜 `dice roll` `dice shake`，选 CC0。
3. **关系 / 庆祝音** → 现在的合成音其实已经挺贴合「暖 vs 冷」的设计意图，
   可以先不换；要换就去 Pixabay 搜 `sparkle` `chime` `success`。
4. **BGM** → freepd.com 挑 3 首氛围曲（calm / bright / warm 各一），或 Pixabay
   搜 `ambient loop` `lofi loop`。

放好文件、写好 `manifest.json`，刷新页面即可听到真实素材。
