import React, { useMemo } from 'react';
import { Language, PracticeProgress, StoryWord } from '../types';
import { shiftPay, shiftGrade } from '../data/konbiniData';
import { KONBINI_PACK } from '../data/drills/konbini';
import { buildSession } from '../data/drillData';
import { SCENE_MAP, SCENE_FALLBACK } from '../constants';
import DrillModal from './DrillModal';

// ---------------------------------------------------------
// 🏪 收银台前的八小时
//
// 原来这里是一整套自己的收银小游戏。现在它是情景对答的一个用法：
// 同一个引擎、同一套分档，只是多了排队的人、多了工钱。
// 这样打工练的敬语也会升档——第十次上班，客人不该还是第一天那几个。
// ---------------------------------------------------------

export interface ShiftResult {
  correct: number;
  total: number;
  bestCombo: number;
  pay: number;
  grade: 'ace' | 'fine' | 'rough';
  words: StoryWord[];
  // 分档要用的：计分（看了译文算半分）和这一班出过的题
  score: number;
  seenIds: string[];
}

interface Props {
  language: Language;
  playerName: string;
  progress?: PracticeProgress;
  onFinish: (r: ShiftResult) => void;
  onCancel: () => void;
}

const KonbiniShiftModal: React.FC<Props> = ({ language, playerName, progress, onFinish, onCancel }) => {
  const en = language === 'en';
  // 一班出的题在开门那一刻定下来，中途不再变
  const rounds = useMemo(() => buildSession(KONBINI_PACK, progress), []);
  const bg = SCENE_MAP['convenience_store'] || SCENE_FALLBACK['convenience_store'];

  return (
    <DrillModal
      pack={KONBINI_PACK}
      rounds={rounds}
      progress={progress}
      language={language}
      playerName={playerName}
      background={bg}
      variant="shift"
      summaryExtra={r => ({
        line: en
          ? `Pay: ¥${shiftPay(r.correct, r.total, r.bestCombo).toLocaleString('ja-JP')}`
          : `今天的工钱 ¥${shiftPay(r.correct, r.total, r.bestCombo).toLocaleString('ja-JP')}`,
        button: en ? 'Clock off' : '下班'
      })}
      onFinish={r => onFinish({
        correct: r.correct,
        total: r.total,
        bestCombo: r.bestCombo,
        pay: shiftPay(r.correct, r.total, r.bestCombo),
        grade: shiftGrade(r.correct, r.total),
        words: r.words,
        score: r.score,
        seenIds: r.seenIds
      })}
      onCancel={onCancel}
    />
  );
};

export default KonbiniShiftModal;
