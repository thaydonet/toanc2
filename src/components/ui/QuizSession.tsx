/**
 * QuizSession.tsx — Hỗ trợ định dạng JSON mới với:
 *  - type: "mcq" | "msq" | "sa" | "tl"
 *  - option_a / option_b / option_c / option_d
 *  - correct_option: "A" | "A,C" | "8" | string
 *  - Câu hỏi động: !var!, !var:min:max!, !var(2,4,6)!, !var#0!
 *  - Tính toán: {tinh: expr} — eval sau khi đã thay biến
 *  - iff(cond, trueval, falseval)
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

// Chỉ dùng $...$ và $$...$$ làm delimiters — KHÔNG dùng (...) hay [...] để
// tránh render nhầm văn bản thường có dấu ngoặc đơn/vuông thành công thức toán.
const LATEX_DELIMITERS = [
  { left: '$$', right: '$$', display: true },
  { left: '$', right: '$', display: false },
];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  type: 'mcq' | 'msq' | 'sa' | 'tl';
  question: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option: string;   // "A" / "A,C" / "8" / any string
  explanation?: string;
  difficulty_level?: 'easy' | 'medium' | 'hard';
  is_dynamic?: boolean;
}

/** Dạng cũ – vẫn hỗ trợ để không phá bài đã có */
export interface LegacyQuestion {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
}

type AnyQuestion = QuizQuestion | LegacyQuestion;

interface Props {
  questions: AnyQuestion[];
}

// ─── Dynamic engine ──────────────────────────────────────────────────────────

type VarMap = Record<string, number>;

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickFrom(arr: number[]): number {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Sinh tất cả biến động từ text của câu hỏi */
function generateVars(text: string): VarMap {
  const vars: VarMap = {};
  const simple = /!([a-zA-Z][a-zA-Z0-9]*)(#0)?(:\-?\d+:\-?\d+)?(\([^)]+\))?!/g;
  let m: RegExpExecArray | null;
  while ((m = simple.exec(text)) !== null) {
    const name = m[1];
    if (name in vars) continue;
    const noZero = !!m[2];
    const range = m[3];
    const list = m[4];

    if (list) {
      const nums = list.replace(/[()]/g, '').split(',').map(Number).filter(n => !isNaN(n));
      vars[name] = pickFrom(nums);
    } else if (range) {
      const parts = range.split(':').filter(Boolean).map(Number);
      let min = parts[0] ?? -10, max = parts[1] ?? 10;
      let v: number;
      do { v = randInt(min, max); } while (noZero && v === 0);
      vars[name] = v;
    } else {
      let v: number;
      do { v = randInt(-10, 10); } while (noZero && v === 0);
      vars[name] = v;
    }
  }
  return vars;
}

/** Đánh giá biểu thức số học an toàn */
function evalExpr(expr: string, vars: VarMap): number {
  let e = expr;
  for (const [k, v] of Object.entries(vars)) {
    e = e.replaceAll(k, String(v));
  }
  try {
    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + e + ')')() as number;
  } catch {
    return NaN;
  }
}

/** Format số: nếu nguyên thì không có .0 */
function fmt(n: number): string {
  if (!isFinite(n)) return '?';
  return Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(6)).toString();
}

/**
 * Dọn dẹp biểu thức số âm trong LaTeX:
 *  +-7  → -7
 *  --7  → +7
 *  + -7 → - 7  (có khoảng trắng)
 */
function fixSignedNumbers(text: string): string {
  // Trong môi trường LaTeX: +-7 → -7, --7 → +7
  return text
    .replace(/\+\s*-(\d)/g, '-$1')   // +-7 → -7
    .replace(/\-\s*-(\d)/g, '+$1');  // --7 → +7
}

/** Thay thế tất cả token động trong text
 *  Thứ tự: !var! trước → rồi {tinh: expr} → rồi iff()
 *  Điều này cho phép {tinh: !b!-4} hoạt động đúng
 */
function applyVars(text: string, vars: VarMap): string {
  if (!text) return text;

  // 1. !var! / !var:min:max! / !var(list)! / !var#0! — thay trước
  text = text.replace(/!([a-zA-Z][a-zA-Z0-9]*)(#0)?(:\-?\d+:\-?\d+)?(\([^)]+\))?!/g, (_, name) => {
    return name in vars ? String(vars[name]) : `!${name}!`;
  });

  // 2. {tinh: expr} — tính toán sau khi biến đã được thay
  text = text.replace(/\{tinh:\s*([^}]+)\}/g, (_, expr) => fmt(evalExpr(expr, vars)));

  // 3. iff(cond, trueVal, falseVal)
  text = text.replace(/iff\(([^,]+),([^,]+),([^)]+)\)/g, (_, cond, t, f) => {
    try {
      let c = cond;
      for (const [k, v] of Object.entries(vars)) c = c.replaceAll(k, String(v));
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + c + ')')();
      return result ? t.trim() : f.trim();
    } catch { return t.trim(); }
  });

  // 4. Dọn dẹp +-n → -n, --n → +n
  text = fixSignedNumbers(text);

  return text;
}

// ─── Shuffle helper ───────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Normalise question ──────────────────────────────────────────────────────

interface NormalisedQ {
  type: 'mcq' | 'msq' | 'sa' | 'tl';
  question: string;
  options: { key: string; label: string }[];
  correctKeys: string[];  // ["A"] / ["A","C"] / ["8"]
  explanation: string;
  difficulty: string;
  isDynamic: boolean;
  vars: VarMap;
}

function isLegacy(q: AnyQuestion): q is LegacyQuestion {
  return 'id' in q && 'options' in q && Array.isArray((q as LegacyQuestion).options);
}

function normalise(q: AnyQuestion, shuffleOpts: boolean): NormalisedQ {
  if (isLegacy(q)) {
    const opts = shuffleOpts ? shuffleArray(q.options) : q.options;
    return {
      type: 'mcq',
      question: q.question,
      options: opts.map(o => ({ key: o.key, label: o.text })),
      correctKeys: [q.correctKey],
      explanation: q.explanation ?? '',
      difficulty: 'medium',
      isDynamic: false,
      vars: {},
    };
  }

  const nq = q as QuizQuestion;
  const rawText = nq.question + (nq.option_a ?? '') + (nq.option_b ?? '') + (nq.option_c ?? '') + (nq.option_d ?? '');
  const vars = nq.is_dynamic ? generateVars(rawText) : {};

  const apply = (t?: string) => (t ? applyVars(t, vars) : '');

  const optKeys = ['A', 'B', 'C', 'D'] as const;
  const rawOpts = [nq.option_a, nq.option_b, nq.option_c, nq.option_d];
  let options = optKeys
    .map((k, i) => rawOpts[i] !== undefined ? { key: k, label: apply(rawOpts[i]) } : null)
    .filter(Boolean) as { key: string; label: string }[];

  const correctRaw = nq.correct_option?.trim() ?? '';
  const correctKeys = correctRaw.split(',').map(s => s.trim()).filter(Boolean);

  // Trộn đáp án: tạo mapping mới (key hiển thị → key gốc)
  // correctKeys được cập nhật theo mapping mới
  if (shuffleOpts && options.length > 1 && (nq.type === 'mcq' || nq.type === 'msq')) {
    const displayKeys = ['A', 'B', 'C', 'D'].slice(0, options.length);
    const shuffledOpts = shuffleArray(options);
    // originalKey → newDisplayKey
    const keyMap: Record<string, string> = {};
    shuffledOpts.forEach((opt, i) => { keyMap[opt.key] = displayKeys[i]; });
    // Gán lại key hiển thị
    const remapped = shuffledOpts.map((opt, i) => ({ key: displayKeys[i], label: opt.label }));
    const newCorrectKeys = correctKeys.map(k => keyMap[k] ?? k);
    return {
      type: nq.type ?? 'mcq',
      question: apply(nq.question),
      options: remapped,
      correctKeys: newCorrectKeys,
      explanation: apply(nq.explanation),
      difficulty: nq.difficulty_level ?? 'medium',
      isDynamic: nq.is_dynamic ?? false,
      vars,
    };
  }

  return {
    type: nq.type ?? 'mcq',
    question: apply(nq.question),
    options,
    correctKeys,
    explanation: apply(nq.explanation),
    difficulty: nq.difficulty_level ?? 'medium',
    isDynamic: nq.is_dynamic ?? false,
    vars,
  };
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
const diffLabel: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
const diffColor: Record<string, string> = { easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444' };

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizSession({ questions }: Props) {
  // shuffleKey tăng mỗi lần "Làm lại" → kích hoạt re-normalise + shuffle mới
  const [shuffleKey, setShuffleKey] = useState(0);

  // Chỉ shuffle khi shuffleKey > 0 (lần đầu giữ nguyên thứ tự gốc)
  const normed = useMemo(() => {
    const doShuffle = shuffleKey > 0;
    const list = questions.map(q => normalise(q, doShuffle));
    return doShuffle ? shuffleArray(list) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, shuffleKey]);

  const [current, setCurrent] = useState(0);

  // MCQ: Record<idx, "A"|"B"|"C"|"D">
  // MSQ: Record<idx, comma-sorted string> — chỉ ghi KHI bấm Kiểm tra
  // SA:  Record<idx, string>
  // TL:  Record<idx, "__tl__">
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // MSQ — lựa chọn TẠM THỜI (chưa ghi vào answers)
  const [msqPending, setMsqPending] = useState<Record<number, Set<string>>>({});

  // MSQ — câu nào đã bấm "Kiểm tra"
  const [msqChecked, setMsqChecked] = useState<Set<number>>(new Set());

  const [showResult, setShowResult] = useState(false);
  const [saInput, setSaInput] = useState('');

  const q = normed[current];
  const answered = current in answers;
  const userAns = answers[current] ?? '';

  // MSQ pending cho câu hiện tại
  const msqPendingCurrent = msqPending[current] ?? new Set<string>();

  // Reset SA input khi chuyển câu
  useEffect(() => { setSaInput(''); }, [current]);

  // ── Handlers ──
  const selectMCQ = useCallback((key: string) => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [current]: key }));
  }, [answered, current]);

  /** Toggle lựa chọn MSQ vào pending — KHÔNG ghi vào answers */
  const toggleMSQ = useCallback((key: string) => {
    if (msqChecked.has(current)) return; // đã kiểm tra rồi
    setMsqPending(prev => {
      const cur = new Set(prev[current] ?? []);
      if (cur.has(key)) cur.delete(key); else cur.add(key);
      return { ...prev, [current]: cur };
    });
  }, [current, msqChecked]);

  /** Bấm "Kiểm tra": ghi pending vào answers và đánh dấu checked */
  const submitMSQ = useCallback(() => {
    setAnswers(prev => {
      const pending = msqPending[current] ?? new Set<string>();
      const val = [...pending].sort().join(',') || '__skip__';
      return { ...prev, [current]: val };
    });
    setMsqChecked(prev => { const s = new Set(prev); s.add(current); return s; });
  }, [current, msqPending]);

  const submitSA = useCallback(() => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [current]: saInput.trim() }));
  }, [answered, current, saInput]);

  const submitTL = useCallback(() => {
    if (answered) return;
    setAnswers(prev => ({ ...prev, [current]: '__tl__' }));
  }, [answered, current]);

  const handleNext = () => {
    if (current < normed.length - 1) { setCurrent(c => c + 1); setSaInput(''); }
    else setShowResult(true);
  };

  const resetAll = () => {
    setCurrent(0);
    setAnswers({});
    setMsqPending({});
    setMsqChecked(new Set());
    setShowResult(false);
    setSaInput('');
    setShuffleKey(k => k + 1); // kích hoạt shuffle mới
  };

  // ── Scoring ──
  const isCorrect = useCallback((idx: number, ans: string): boolean => {
    const nq = normed[idx];
    if (!ans) return false;
    if (nq.type === 'tl') return true;
    if (nq.type === 'sa') {
      const correct = nq.correctKeys[0] ?? '';
      return ans.trim().toLowerCase() === correct.toLowerCase() ||
        (parseFloat(ans) === parseFloat(correct) && !isNaN(parseFloat(ans)));
    }
    if (nq.type === 'msq') {
      const userSet = new Set(ans.split(',').filter(Boolean));
      const corrSet = new Set(nq.correctKeys);
      return userSet.size === corrSet.size && [...userSet].every(k => corrSet.has(k));
    }
    return ans === nq.correctKeys[0];
  }, [normed]);

  const score = Object.entries(answers).filter(([i, a]) => isCorrect(Number(i), a)).length;
  const total = normed.length;

  // ─────────────────────────────── RESULT SCREEN ──────────────────────────────
  if (showResult) {
    const pct = Math.round((score / total) * 100);
    const badge = pct === 100 ? 'perfect' : pct >= 70 ? 'good' : pct >= 50 ? 'fair' : 'poor';
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '⭐' : pct >= 50 ? '📚' : '💡';
    const msg = pct === 100 ? 'Xuất sắc! Hoàn thành tất cả câu hỏi!'
      : pct >= 70 ? 'Giỏi lắm! Hãy ôn lại phần còn sai.'
        : pct >= 50 ? 'Cố gắng thêm nhé! Xem lại lý thuyết.'
          : 'Hãy đọc lại bài và thử lại nhé!';
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '.5rem' }}>{emoji}</div>
        <h3 style={{ marginBottom: '.5rem' }}>Kết quả</h3>
        <div className={`score-badge ${badge}`} style={{ margin: '0 auto 1rem', fontSize: '1.2rem', padding: '.5rem 1.5rem' }}>
          {score}/{total} câu đúng ({pct}%)
        </div>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{msg}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', textAlign: 'left', marginBottom: '1.5rem' }}>
          {normed.map((nq, i) => {
            const a = answers[i];
            const ok = isCorrect(i, a ?? '');
            const isTL = nq.type === 'tl';
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '.5rem',
                padding: '.6rem .75rem', borderRadius: '8px',
                background: !a ? '#f1f5f9' : isTL ? '#dbeafe' : ok ? '#dcfce7' : '#fee2e2',
                fontSize: '.875rem',
              }}>
                <span>{!a ? '⬜' : isTL ? '📝' : ok ? '✅' : '❌'}</span>
                <span>
                  <strong>Câu {i + 1}{nq.type === 'msq' ? ' (chọn nhiều)' : nq.type === 'sa' ? ' (tự điền)' : nq.type === 'tl' ? ' (tự luận)' : ''}:</strong>{' '}
                  <Latex delimiters={LATEX_DELIMITERS}>{nq.question}</Latex>
                </span>
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" onClick={resetAll}>
          🔄 Làm lại (trộn câu)
        </button>
      </div>
    );
  }

  // ─────────────────────────────── QUESTION SCREEN ────────────────────────────

  const renderAnswer = () => {
    // MCQ
    if (q.type === 'mcq') {
      return (
        <div className="quiz-options">
          {q.options.map(opt => {
            const isCorrectOpt = q.correctKeys.includes(opt.key);
            const isUser = userAns === opt.key;
            const state = !answered ? '' : isCorrectOpt ? 'correct' : isUser ? 'incorrect' : '';
            return (
              <button key={opt.key} className={`quiz-option ${state}`}
                onClick={() => selectMCQ(opt.key)} disabled={answered}>
                <span className="option-key">{opt.key}</span>
                <span><Latex delimiters={LATEX_DELIMITERS}>{opt.label}</Latex></span>
              </button>
            );
          })}
        </div>
      );
    }

    // MSQ (chọn nhiều) ─────────────────────────────────────────────────────────
    if (q.type === 'msq') {
      const isChecked = msqChecked.has(current);
      const pending = msqPendingCurrent;
      return (
        <>
          <p style={{ fontSize: '.8rem', color: '#64748b', marginBottom: '.75rem' }}>
            💡 Tích vào các ô để chọn tất cả đáp án đúng, rồi nhấn <strong>Kiểm tra</strong>.
          </p>
          <div className="quiz-options">
            {q.options.map(opt => {
              const isCorrectOpt = q.correctKeys.includes(opt.key);
              const isSelected = pending.has(opt.key);
              let state = '';
              if (isChecked) {
                state = isCorrectOpt ? 'correct' : isSelected ? 'incorrect' : '';
              }
              return (
                <button key={opt.key}
                  className={`quiz-option msq-option ${state}`}
                  style={!isChecked && isSelected
                    ? { boxShadow: '0 0 0 2px #6366f1', background: '#eef2ff' }
                    : undefined
                  }
                  onClick={() => toggleMSQ(opt.key)}
                  disabled={isChecked}>
                  {/* Checkbox */}
                  <span className={`msq-checkbox${isSelected ? ' msq-checked' : ''}`} aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                  <span className="option-key">{opt.key}</span>
                  <span><Latex delimiters={LATEX_DELIMITERS}>{opt.label}</Latex></span>
                </button>
              );
            })}
          </div>
          {/* Nút Kiểm tra — ẩn sau khi đã kiểm tra */}
          {!isChecked && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary"
                onClick={submitMSQ}
                disabled={pending.size === 0}>
                🔍 Kiểm tra
              </button>
            </div>
          )}
        </>
      );
    }

    // SA (trả lời ngắn)
    if (q.type === 'sa') {
      return (
        <div style={{ marginTop: '.75rem' }}>
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
            <input
              type="text" value={saInput}
              onChange={e => !answered && setSaInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !answered && submitSA()}
              placeholder="Nhập đáp án..."
              disabled={answered}
              style={{
                flex: 1, padding: '.55rem .75rem', borderRadius: '8px',
                border: !answered ? '2px solid #cbd5e1'
                  : isCorrect(current, answers[current]) ? '2px solid #22c55e' : '2px solid #ef4444',
                fontSize: '1rem', outline: 'none',
                background: answered ? (isCorrect(current, answers[current]) ? '#dcfce7' : '#fee2e2') : 'white',
              }}
            />
            {!answered && (
              <button className="btn btn-primary" onClick={submitSA} disabled={!saInput.trim()}>
                Trả lời
              </button>
            )}
          </div>
          {answered && (
            <p style={{ marginTop: '.4rem', fontSize: '.875rem', color: '#64748b' }}>
              Bạn trả lời: <strong>{answers[current]}</strong>
              {!isCorrect(current, answers[current]) && (
                <> — Đáp án đúng: <strong>{q.correctKeys[0]}</strong></>
              )}
            </p>
          )}
        </div>
      );
    }

    // TL (tự luận)
    if (q.type === 'tl') {
      return (
        <div style={{ marginTop: '.75rem' }}>
          {!answered ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              <textarea
                rows={4}
                placeholder="Viết bài giải của bạn tại đây (hoặc làm ra giấy)..."
                style={{
                  width: '100%', padding: '.6rem .75rem', borderRadius: '8px',
                  border: '2px solid #cbd5e1', fontSize: '.95rem', resize: 'vertical',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={submitTL}>
                  📝 Xem đáp án / Tiếp tục
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '.6rem .75rem', borderRadius: '8px',
              background: '#dbeafe', fontSize: '.875rem', color: '#1e40af',
            }}>
              📝 Câu tự luận — xem lời giải bên dưới để tự chấm.
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Feedback hiển thị sau khi answered (với MSQ: sau khi msqChecked)
  const msqAnswered = q.type === 'msq' ? msqChecked.has(current) : answered;
  const showFeedback = q.type === 'msq' ? msqAnswered && q.explanation : answered && q.explanation;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '.85rem', color: '#64748b', fontWeight: 600 }}>
          Câu {current + 1} / {total}
        </span>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          {q.difficulty && (
            <span style={{
              fontSize: '.72rem', fontWeight: 700, padding: '.18rem .55rem',
              borderRadius: '999px', background: diffColor[q.difficulty] + '22',
              color: diffColor[q.difficulty], border: `1px solid ${diffColor[q.difficulty]}55`,
            }}>
              {diffLabel[q.difficulty] ?? q.difficulty}
            </span>
          )}
          {q.isDynamic && (
            <span style={{
              fontSize: '.72rem', fontWeight: 700, padding: '.18rem .55rem',
              borderRadius: '999px', background: '#6366f122', color: '#6366f1',
              border: '1px solid #6366f155',
            }}>🎲 Động</span>
          )}
          <span style={{ fontSize: '.85rem', color: '#64748b' }}>
            {Object.keys(answers).length} đã trả lời
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-track" style={{ marginBottom: '1.25rem' }}>
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>

      {/* Type badge */}
      {q.type !== 'mcq' && (
        <div style={{ marginBottom: '.6rem' }}>
          <span style={{
            fontSize: '.78rem', fontWeight: 600, padding: '.18rem .55rem',
            borderRadius: '6px', background: '#f1f5f9', color: '#475569',
            border: '1px solid #e2e8f0',
          }}>
            {q.type === 'msq' ? '☑ Chọn nhiều đáp án' : q.type === 'sa' ? '✏️ Trả lời ngắn' : '📝 Tự luận'}
          </span>
        </div>
      )}

      {/* Question */}
      <p className="quiz-question"><Latex delimiters={LATEX_DELIMITERS}>{q.question}</Latex></p>

      {/* Answer area */}
      {renderAnswer()}

      {/* Feedback */}
      {showFeedback && (
        <>
          <div className={`quiz-feedback ${q.type === 'tl' ? 'correct'
            : isCorrect(current, userAns) ? 'correct' : 'incorrect'
            }`}>
            <span>
              {q.type === 'tl' ? '📝' : isCorrect(current, userAns) ? '✅' : '❌'}
            </span>
            <div>
              {q.type !== 'tl' && !isCorrect(current, userAns) && (
                <p style={{ marginBottom: '.3rem' }}>
                  <strong>Đáp án đúng: {q.correctKeys.join(', ')}</strong>
                </p>
              )}
              <p><Latex delimiters={LATEX_DELIMITERS}>{q.explanation}</Latex></p>
            </div>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" onClick={handleNext}>
              {current < total - 1 ? 'Câu tiếp theo →' : '🏁 Xem kết quả'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

