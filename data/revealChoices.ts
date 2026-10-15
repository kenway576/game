import { VarietyOption } from './varietyTypes';
import { ASUKA_REVEALS } from './reveals/asuka';
import { HIKARI_REVEALS } from './reveals/hikari';
import { REI_REVEALS } from './reveals/rei';
import { INARI_REVEALS } from './reveals/inari';
import { MIYUKI_REVEALS } from './reveals/miyuki';
import { SORA_REVEALS } from './reveals/sora';
import { NAO_REVEALS } from './reveals/nao';
import { MAKI_REVEALS } from './reveals/maki';

// 第一次看见她穿这一身：每套衣服三个专属的回应（手写，data/reveals/<角色>.ts）。
// 以前每个人只有一套"夸 / 看呆 / 开玩笑"，泳衣和和服说的是同一句；
// 现在每一套都看着那一身的细节说话，她的回答也按她自己的口吻和日语难度写。
// 用法见 data/dateData.ts（有专属的就用专属的，没有就退回 story/outfitReveals.ts 的通用三句）。
export const REVEAL_CHOICES: Record<string, Record<string, VarietyOption[]>> = {
  asuka: ASUKA_REVEALS, hikari: HIKARI_REVEALS, rei: REI_REVEALS, inari: INARI_REVEALS,
  miyuki: MIYUKI_REVEALS, sora: SORA_REVEALS, nao: NAO_REVEALS, maki: MAKI_REVEALS
};
