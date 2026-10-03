import React from 'react';
import { RentReport, RENT_WORRY_STAMINA } from '../data/rentData';
import { audioManager } from '../services/audioManager';

// ---------------------------------------------------------
// 🏠 月初的账单
//
// 睡醒的时候信箱里塞着一张纸。不是弹一句 toast 就过去——
// 这是一个月里唯一一次"钱是怎么没的"摆在你面前，值得停下来看一眼。
// 写成日式家计簿的样子：每一行一个日语词，顺手又是一组生活词汇。
// ---------------------------------------------------------

const yen = (n: number) => '¥' + n.toLocaleString('ja-JP');

const RentNoticeModal: React.FC<{ report: RentReport; en: boolean; onClose: () => void }> = ({ report, en, onClose }) => {
  const r = report;
  const rows: { jp: string; zh: string; en: string; amount: number }[] = [
    { jp: '仕送り', zh: '家里打来的生活费', en: 'Money from home', amount: r.allowance },
    { jp: '家賃', zh: '房租', en: 'Rent', amount: -r.rent },
    { jp: '光熱費', zh: `水电煤（${r.usedMonth} 月份）`, en: `Utilities (${r.usedMonth}月)`, amount: -r.utilities },
    ...(r.owedBefore > 0 ? [{ jp: '滞納分', zh: '上个月欠的', en: 'Carried-over arrears', amount: -r.owedBefore }] : [])
  ];
  const clear = r.owedAfter <= 0;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#f4efe4] text-[#2a2620] shadow-2xl border-t-8 border-[#7a5c3a] p-6 md:p-8">
        <div className="text-[11px] font-mono tracking-[0.3em] text-[#7a5c3a]">海風荘 · {r.month}月</div>
        <h2 className="mt-1 text-2xl font-black">
          {en ? 'The monthly bills' : '这个月的账单'}
          <span className="ml-2 text-sm font-bold text-[#7a5c3a]">家計簿</span>
        </h2>
        <p className="mt-2 text-xs text-[#5a5246] leading-relaxed">
          {en
            ? 'An envelope in the letterbox this morning. The landlord\'s handwriting is very neat.'
            : '早上信箱里塞着一个信封。房东的字写得一丝不苟。'}
        </p>

        <div className="mt-5 divide-y divide-[#d8cfbd] border-y border-[#d8cfbd]">
          {rows.map(row => (
            <div key={row.jp} className="flex items-baseline justify-between py-2">
              <span>
                <span className="font-bold">{row.jp}</span>
                <span className="ml-2 text-[11px] text-[#7d7465]">{en ? row.en : row.zh}</span>
              </span>
              <span className={`font-mono font-bold tabular-nums ${row.amount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {row.amount >= 0 ? '+' : '−'}{yen(Math.abs(row.amount))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm font-bold">{en ? 'Left in your wallet' : '钱包里还剩'}</span>
          <span className="text-xl font-black font-mono tabular-nums">{yen(r.yenAfter)}</span>
        </div>

        {clear ? (
          <p className="mt-4 text-xs text-[#5a5246] leading-relaxed">
            {en
              ? 'Paid in full. One month of a roof over your head, settled.'
              : '全部交清了。又一个月的屋檐，算是付过了。'}
          </p>
        ) : (
          <div className="mt-4 bg-red-100 border-l-4 border-red-600 px-3 py-2 text-xs text-red-900 leading-relaxed">
            {en
              ? `Short by ${yen(r.owedAfter)}. It will come out of your wallet each morning until it is paid. Until then you will not sleep well (stamina only recovers to ${RENT_WORRY_STAMINA}).`
              : `还差 ${yen(r.owedAfter)} 没交上。之后每天早上钱包里有钱就先还这笔。还清之前你会睡不踏实（睡一觉体力只回到 ${RENT_WORRY_STAMINA}）。`}
          </div>
        )}

        <button
          onClick={() => { audioManager.playSfx('click'); onClose(); }}
          className="mt-6 w-full bg-[#2a2620] hover:bg-[#7a5c3a] text-white font-black py-3 tracking-[0.3em] text-sm transition-colors"
        >
          {en ? 'Fold it up' : '把账单折起来'}
        </button>
      </div>
    </div>
  );
};

export default RentNoticeModal;
