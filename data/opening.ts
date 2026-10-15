// 自动生成：node scripts/op/gen-op.mjs data —— 别手改
// 开场动画：曲子 Three O'clock in Kobe 的 0–123 秒，每 4 小节一个镜头（切点来自 librosa 量的小节）
export interface OpShot { id: string; start: number; end: number; image: string; video: string | null; still: boolean; name: [string, string, string] | null; clipIn?: number; title?: boolean }
export const OP_MUSIC = '/audio/bgm/Three_O_clock_in_Kobe.mp3';
export const OP_BEATS: number[] = [1.138,1.556,1.974,2.392,2.786,3.204,3.622,4.04,4.458,4.853,5.271,5.689,6.107,6.525,6.92,7.338,7.755,8.173,8.591,9.009,9.427,9.845,10.356,10.867,11.285,11.703,12.098,12.516,12.934,13.351,13.769,14.187,14.582,15,15.418,15.836,16.254,16.649,17.067,17.485,17.903,18.297,18.715,19.133,19.551,19.969,20.387,20.782,21.2,21.618,22.036,22.454,22.848,23.266,23.684,24.102,24.52,24.938,25.333,25.751,26.169,26.587,27.005,27.4,27.818,28.235,28.653,29.071,29.489,29.907,30.325,30.72,31.138,31.556,31.974,32.369,32.787,33.205,33.622,34.04,34.458,34.876,35.294,35.712,36.107,36.525,36.943,37.338,37.756,38.174,38.592,39.01,39.451,39.915,40.356,40.774,41.215,41.657,42.098,42.516,42.934,43.352,43.77,44.164,44.582,45,45.418,45.836,46.254,46.672,47.067,47.485,47.903,48.321,48.715,49.133,49.551,49.969,50.387,50.805,51.2,51.618,52.036,52.454,52.872,53.29,53.685,54.102,54.52,54.938,55.356,55.774,56.169,56.587,57.005,57.423,57.818,58.236,58.654,59.072,59.49,59.907,60.325,60.72,61.138,61.556,61.974,62.392,62.787,63.205,63.623,64.041,64.459,64.877,65.271,65.689,66.107,66.525,66.943,67.361,67.756,68.174,68.592,69.01,69.428,69.846,70.24,70.658,71.076,71.494,71.912,72.353,72.818,73.282,73.723,74.165,74.582,75,75.418,75.836,76.231,76.649,77.067,77.485,77.903,78.298,78.716,79.134,79.552,79.97,80.364,80.782,81.2,81.618,82.036,82.454,82.849,83.267,83.685,84.103,84.521,84.939,85.333,85.751,86.169,86.587,87.005,87.423,87.818,88.236,88.654,89.072,89.49,89.908,90.326,90.72,91.138,91.556,91.974,92.369,92.787,93.205,93.623,94.041,94.459,94.877,95.295,95.689,96.107,96.525,96.943,97.338,97.756,98.174,98.592,99.033,99.498,99.962,100.403,100.844,101.285,101.703,102.121,102.539,102.934,103.352,103.77,104.165,104.583,105.001,105.419,105.837,106.255,106.649,107.067,107.485,107.903,108.321,108.716,109.134,109.552,109.97,110.388,110.782,111.2,111.618,112.036,112.454,112.872,113.267,113.685,114.103,114.521,114.939,115.357,115.751,116.169,116.587,117.005,117.423,117.841,118.236,118.654,119.072,119.49,119.908,120.303,120.721,121.139,121.556,121.974,122.392,122.81,123.205,123.623,124.041,124.459,124.854];
export const OP_SHOTS: OpShot[] = [
 {
  "id": "op01_train",
  "start": 2.392,
  "end": 9.009,
  "image": "/images/op/op01_train.webp",
  "video": "/videos/op/op01_train.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op02_harbor",
  "start": 9.009,
  "end": 15.836,
  "image": "/images/op/op02_harbor.webp",
  "video": "/videos/op/op02_harbor.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op03_journal",
  "start": 15.836,
  "end": 22.454,
  "image": "/images/op/op03_journal.webp",
  "video": "/videos/op/op03_journal.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op04_hikari",
  "start": 22.454,
  "end": 29.071,
  "image": "/images/op/op04_hikari.webp",
  "video": "/videos/op/op04_hikari.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op05_asuka",
  "start": 29.071,
  "end": 35.712,
  "image": "/images/op/op05_asuka.webp",
  "video": "/videos/op/op05_asuka.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op06_rei",
  "start": 35.712,
  "end": 42.516,
  "image": "/images/op/op06_rei.webp",
  "video": "/videos/op/op06_rei.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op07_nao",
  "start": 42.516,
  "end": 49.133,
  "image": "/images/op/op07_nao.webp",
  "video": "/videos/op/op07_nao.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op08_miyuki",
  "start": 49.133,
  "end": 55.774,
  "image": "/images/op/op08_miyuki.webp",
  "video": "/videos/op/op08_miyuki.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op09_sora",
  "start": 55.774,
  "end": 62.392,
  "image": "/images/op/op09_sora.webp",
  "video": "/videos/op/op09_sora.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op10_maki",
  "start": 62.392,
  "end": 69.01,
  "image": "/images/op/op10_maki.webp",
  "video": "/videos/op/op10_maki.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op11_inari",
  "start": 69.01,
  "end": 75.836,
  "image": "/images/op/op11_inari.webp",
  "video": "/videos/op/op11_inari.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op12_kai",
  "start": 75.836,
  "end": 82.454,
  "image": "/images/op/op12_kai.webp",
  "video": "/videos/op/op12_kai.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op13_challenge",
  "start": 82.454,
  "end": 89.072,
  "image": "/images/op/op13_challenge.webp",
  "video": "/videos/op/op13_challenge.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op14_1184",
  "start": 89.072,
  "end": 95.689,
  "image": "/images/op/op14_1184.webp",
  "video": "/videos/op/op14_1184.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op15_fireworks",
  "start": 95.689,
  "end": 102.539,
  "image": "/images/op/op15_fireworks.webp",
  "video": "/videos/op/op15_fireworks.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op16_rooftop",
  "start": 102.539,
  "end": 109.134,
  "image": "/images/op/op16_rooftop.webp",
  "video": "/videos/op/op16_rooftop.webm",
  "still": false,
  "name": null
 },
 {
  "id": "op17_lineup",
  "start": 109.134,
  "end": 115.751,
  "image": "/images/op/op17_lineup.webp",
  "video": null,
  "still": true,
  "name": null
 },
 {
  "id": "op18_title",
  "start": 115.751,
  "end": 122.392,
  "image": "/images/op/op18_title.webp",
  "video": "/videos/op/op18_title.webm",
  "still": false,
  "name": null
 }
];
