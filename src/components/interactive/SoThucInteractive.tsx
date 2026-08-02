import { useState } from 'react';

const tabBtn = (active: boolean): React.CSSProperties => ({
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  backgroundColor: active ? '#2563eb' : '#f1f5f9',
  color: active ? '#ffffff' : '#475569',
  transition: 'all 0.2s',
});

interface ClassifyItem {
  label: string;
  rational: boolean;
  why: string;
}

const CLASSIFY: ClassifyItem[] = [
  { label: '5', rational: true, why: '5 = 5/1 là số nguyên nên là số hữu tỉ.' },
  { label: '√3', rational: false, why: '√3 ≈ 1,732... là số thập phân vô hạn không tuần hoàn.' },
  { label: '-2/7', rational: true, why: '-2/7 là một phân số nên là số hữu tỉ.' },
  { label: 'π', rational: false, why: 'π ≈ 3,14159... là số thập phân vô hạn không tuần hoàn.' },
  { label: '0,6', rational: true, why: '0,6 = 3/5 là số thập phân hữu hạn.' },
  { label: '√16', rational: true, why: '√16 = 4 là số nguyên nên là số hữu tỉ.' },
  { label: '0,333...', rational: true, why: '0,333... = 1/3 là số thập phân vô hạn tuần hoàn.' },
  { label: '-√2', rational: false, why: '-√2 ≈ -1,414... là số thập phân vô hạn không tuần hoàn.' },
];

const ABS_POOL = [
  { q: '|-7|', opts: ['7', '-7', '0', '±7'], correct: '7', explain: 'Khoảng cách từ -7 đến 0 trên trục số là 7.' },
  { q: '|5|', opts: ['5', '-5', '0', '±5'], correct: '5', explain: 'Khoảng cách từ 5 đến 0 trên trục số là 5.' },
  { q: '|0|', opts: ['0', '1', '-1', 'Không xác định'], correct: '0', explain: 'Khoảng cách từ 0 đến 0 là 0.' },
  { q: '|√2|', opts: ['√2', '-√2', '2', '±√2'], correct: '√2', explain: '√2 > 0 nên |√2| = √2.' },
  { q: '|-π|', opts: ['π', '-π', '0', '3,14'], correct: 'π', explain: '-π < 0 nên |-π| = -(-π) = π.' },
  { q: '|3 − π|', opts: ['π − 3', '3 − π', 'π + 3', '3'], correct: 'π − 3', explain: 'π ≈ 3,14 > 3 nên 3 − π < 0, do đó |3 − π| = −(3 − π) = π − 3.' },
  { q: '|-1,5|', opts: ['1,5', '-1,5', '0', '±1,5'], correct: '1,5', explain: 'Khoảng cách từ -1,5 đến 0 trên trục số là 1,5.' },
  { q: '|−2/3|', opts: ['2/3', '-2/3', '0', '±2/3'], correct: '2/3', explain: 'Giá trị tuyệt đối luôn không âm: |−2/3| = 2/3.' },
];

const SORT_POOL = [
  { label: '−√5', value: -Math.sqrt(5) },
  { label: '−2', value: -2 },
  { label: '−√2', value: -Math.sqrt(2) },
  { label: '0', value: 0 },
  { label: '1/2', value: 0.5 },
  { label: '√2', value: Math.sqrt(2) },
  { label: '1,5', value: 1.5 },
  { label: '√3', value: Math.sqrt(3) },
  { label: 'π', value: Math.PI },
  { label: '√5', value: Math.sqrt(5) },
  { label: '3,2', value: 3.2 },
  { label: '−π', value: -Math.PI },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSet(count: number): typeof SORT_POOL {
  const picked: typeof SORT_POOL = [];
  const pool = [...SORT_POOL];
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked;
}

export default function SoThucInteractive() {
  const [tab, setTab] = useState<'phanLoai' | 'gttd' | 'sapXep'>('phanLoai');

  // ── Tab 1: Phân loại ─────────────────────────────────────────────────────
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState(false);
  const choose = (idx: number, rational: boolean) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [idx]: rational }));
  };
  const correctCount = CLASSIFY.filter((it, i) => answers[i] === it.rational).length;
  const allAnswered = CLASSIFY.every((_, i) => i in answers);

  // ── Tab 2: Giá trị tuyệt đối ─────────────────────────────────────────────
  const [absQ, setAbsQ] = useState(() => ({ item: pick(ABS_POOL), order: shuffle(ABS_POOL[0].opts) }));
  const [absPicked, setAbsPicked] = useState<string | null>(null);
  const [absDone, setAbsDone] = useState(false);
  const newAbs = () => {
    const item = pick(ABS_POOL);
    setAbsQ({ item, order: shuffle(item.opts) });
    setAbsPicked(null);
    setAbsDone(false);
  };

  // ── Tab 3: Sắp xếp ───────────────────────────────────────────────────────
  const [items, setItems] = useState(() => pickSet(5));
  const [order, setOrder] = useState<string[]>([]);
  const [sortChecked, setSortChecked] = useState(false);
  const sortedLabels = [...items].sort((a, b) => a.value - b.value).map(i => i.label);
  const isSorted = order.length === items.length && order.every((l, i) => l === sortedLabels[i]);
  const newSort = () => {
    setItems(pickSet(5));
    setOrder([]);
    setSortChecked(false);
  };

  return (
    <div style={{
      background: '#ffffff', border: '2px solid #e2e8f0', borderRadius: '16px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', margin: '1.5rem 0',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem',
        borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '1.25rem' }}>ℝ</span>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Thực hành tương tác: Tập hợp các số thực
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setTab('phanLoai'); setChecked(false); }} style={tabBtn(tab === 'phanLoai')}>
          1. Phân loại số thực
        </button>
        <button onClick={() => setTab('gttd')} style={tabBtn(tab === 'gttd')}>
          2. Giá trị tuyệt đối
        </button>
        <button onClick={() => setTab('sapXep')} style={tabBtn(tab === 'sapXep')}>
          3. Sắp xếp tăng dần
        </button>
      </div>

      {/* ───────── Tab 1: Phân loại ───────── */}
      {tab === 'phanLoai' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Mỗi số sau là số <strong style={{ color: '#2563eb' }}>hữu tỉ</strong> hay <strong style={{ color: '#7c3aed' }}>vô tỉ</strong>?
            (Tất cả đều là số thực ℝ!)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {CLASSIFY.map((it, i) => {
              const ans = answers[i];
              const showState = checked && ans !== undefined;
              const ok = checked && ans === it.rational;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                  padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#ffffff',
                }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', minWidth: '70px' }}>{it.label}</span>
                  <span style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => choose(i, true)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #2563eb', cursor: 'pointer',
                        fontWeight: 700, background: ans === true ? '#2563eb' : '#ffffff',
                        color: ans === true ? '#ffffff' : '#2563eb', opacity: checked ? 0.6 : 1,
                      }}>
                      Hữu tỉ
                    </button>
                    <button onClick={() => choose(i, false)}
                      style={{
                        padding: '0.3rem 0.9rem', borderRadius: '6px', border: '2px solid #7c3aed', cursor: 'pointer',
                        fontWeight: 700, background: ans === false ? '#7c3aed' : '#ffffff',
                        color: ans === false ? '#ffffff' : '#7c3aed', opacity: checked ? 0.6 : 1,
                      }}>
                      Vô tỉ
                    </button>
                  </span>
                  {showState && (
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 700, color: ok ? '#166534' : '#991b1b',
                      background: ok ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '999px',
                    }}>
                      {ok ? '✓ Đúng' : '✗ Sai'}
                    </span>
                  )}
                  {checked && ans !== undefined && !ok && (
                    <span style={{ flexBasis: '100%', fontSize: '0.82rem', color: '#991b1b' }}>{it.why}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
            {!checked ? (
              <button onClick={() => { if (allAnswered) setChecked(true); }}
                disabled={!allAnswered}
                style={{
                  padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700,
                  background: allAnswered ? '#10b981' : '#cbd5e1', color: allAnswered ? '#ffffff' : '#64748b',
                }}>
                ✅ Kiểm tra
              </button>
            ) : (
              <button onClick={() => { setChecked(false); setAnswers({}); }}
                style={{ padding: '0.5rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Làm lại
              </button>
            )}
            {checked && (
              <span style={{
                padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem',
                background: correctCount === CLASSIFY.length ? '#dcfce7' : '#fef3c7',
                color: correctCount === CLASSIFY.length ? '#166534' : '#92400e',
              }}>
                Kết quả: {correctCount}/{CLASSIFY.length} câu đúng
              </span>
            )}
            {!allAnswered && !checked && (
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Hãy trả lời đủ {CLASSIFY.length} số rồi bấm Kiểm tra.</span>
            )}
          </div>
        </div>
      )}

      {/* ───────── Tab 2: Giá trị tuyệt đối ───────── */}
      {tab === 'gttd' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Tính: <strong style={{ fontSize: '1.3rem', color: '#2563eb' }}>{absQ.item.q}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {absQ.order.map((opt, i) => {
              const isCorrectOpt = opt === absQ.item.correct;
              let style: React.CSSProperties = {
                padding: '0.75rem 1rem', borderRadius: '8px', border: '2px solid #cbd5e1',
                background: '#ffffff', cursor: 'pointer', textAlign: 'center', fontSize: '1.05rem',
                fontWeight: 700, transition: 'all 0.2s',
              };
              if (absPicked === opt) {
                style.borderColor = '#2563eb';
                style.background = '#eff6ff';
              }
              if (absDone) {
                if (isCorrectOpt) {
                  style.borderColor = '#22c55e';
                  style.background = '#f0fdf4';
                  style.color = '#15803d';
                } else if (absPicked === opt) {
                  style.borderColor = '#ef4444';
                  style.background = '#fef2f2';
                  style.color = '#b91c1c';
                }
              }
              return (
                <button key={i} disabled={absDone} onClick={() => setAbsPicked(opt)} style={style}>
                  {opt}
                </button>
              );
            })}
          </div>

          {!absDone ? (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => { if (absPicked !== null) setAbsDone(true); }}
                disabled={absPicked === null}
                style={{
                  padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: absPicked !== null ? 'pointer' : 'not-allowed',
                  fontWeight: 700, background: absPicked !== null ? '#2563eb' : '#cbd5e1', color: '#ffffff',
                }}>
                Xác nhận đáp án
              </button>
              <button onClick={newAbs}
                style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🎲 Câu hỏi mới
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem',
                background: absPicked === absQ.item.correct ? '#dcfce7' : '#fee2e2',
                color: absPicked === absQ.item.correct ? '#166534' : '#991b1b',
                border: `1px solid ${absPicked === absQ.item.correct ? '#86efac' : '#fca5a5'}`,
              }}>
                <strong>{absPicked === absQ.item.correct ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong>{' '}
                {absQ.item.explain}
              </div>
              <button onClick={newAbs}
                style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#ffffff' }}>
                🎲 Câu hỏi tiếp theo
              </button>
            </div>
          )}
        </div>
      )}

      {/* ───────── Tab 3: Sắp xếp ───────── */}
      {tab === 'sapXep' && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: '#334155' }}>
            Hãy sắp xếp các số sau theo thứ tự <strong style={{ color: '#2563eb' }}>tăng dần</strong> bằng cách bấm vào từng số:
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {items.map(it => {
              const used = order.includes(it.label);
              return (
                <button key={it.label}
                  disabled={sortChecked}
                  onClick={() => {
                    if (used) setOrder(o => o.filter(l => l !== it.label));
                    else if (order.length < items.length) setOrder(o => [...o, it.label]);
                  }}
                  style={{
                    padding: '0.5rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    border: used ? '2px solid #2563eb' : '2px solid #cbd5e1',
                    background: used ? '#eff6ff' : '#ffffff',
                    color: used ? '#1e40af' : '#334155',
                    opacity: used ? 0.75 : 1,
                  }}>
                  {it.label}
                </button>
              );
            })}
          </div>

          <div style={{ background: '#ffffff', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '1rem', minHeight: '46px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginRight: '0.5rem' }}>
              Thứ tự của bạn:
            </span>
            {order.length === 0
              ? <span style={{ color: '#cbd5e1' }}>(chưa chọn)</span>
              : order.map((l, i) => (
                <span key={l}>
                  <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '1.05rem' }}>{l}</span>
                  {i < order.length - 1 && <span style={{ color: '#94a3b8', margin: '0 0.4rem' }}>&lt;</span>}
                </span>
              ))}
          </div>

          {!sortChecked ? (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={() => { if (order.length === items.length) setSortChecked(true); }}
                disabled={order.length !== items.length}
                style={{
                  padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: order.length === items.length ? 'pointer' : 'not-allowed',
                  fontWeight: 700, background: order.length === items.length ? '#2563eb' : '#cbd5e1', color: '#ffffff',
                }}>
                ✅ Kiểm tra thứ tự
              </button>
              <button onClick={() => setOrder([])}
                style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#f1f5f9', color: '#475569' }}>
                🔄 Xóa lựa chọn
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '0.8rem',
                background: isSorted ? '#dcfce7' : '#fee2e2',
                color: isSorted ? '#166534' : '#991b1b',
                border: `1px solid ${isSorted ? '#86efac' : '#fca5a5'}`,
              }}>
                <strong>{isSorted ? '🎉 Chính xác!' : '❌ Chưa đúng!'}</strong>{' '}
                Thứ tự đúng: <strong>{sortedLabels.join(' &lt; ')}</strong>.
              </div>
              <button onClick={newSort}
                style={{ padding: '0.55rem 1.4rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: '#059669', color: '#ffffff' }}>
                🎲 Bộ số mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
