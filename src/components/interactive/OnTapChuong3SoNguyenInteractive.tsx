import { useState, useCallback } from 'react';

interface Problem {
  text: string;
  answer: number;
  hint?: string;
}

interface UserAnswer {
  value: string;
  isCorrect: boolean | null;
}

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generatePractice = (): Problem => {
  const type = randInt(0, 4);
  if (type === 0) {
    const n = randInt(-20, 20);
    let ans: number;
    if (n > 0) ans = 1;
    else if (n < 0) ans = 2;
    else ans = 3;
    return {
      text: `Số ${n} là: (1=Dương, 2=Âm, 3=Số 0)`,
      answer: ans,
      hint: `${n} ${n < 0 ? 'nhỏ hơn 0 nên là số âm' : n > 0 ? 'lớn hơn 0 nên là số dương' : 'bằng 0'}.`,
    };
  } else if (type === 1) {
    const a = randInt(-20, 20);
    const b = randInt(-20, 20);
    return {
      text: `So sánh ${a} và ${b}: (1=${a} > ${b}, 2=${a} < ${b}, 3=${a} = ${b})`,
      answer: a > b ? 1 : a < b ? 2 : 3,
      hint: `Trên trục số: ${a > b ? `${a} nằm bên phải ${b}` : a < b ? `${a} nằm bên trái ${b}` : `${a} bằng ${b}`}.`,
    };
  } else if (type === 2) {
    const n = randInt(-30, 30);
    return {
      text: `|${n}| = ?`,
      answer: Math.abs(n),
      hint: `Giá trị tuyệt đối là khoảng cách từ ${n} đến 0: |${n}| = ${Math.abs(n)}.`,
    };
  } else if (type === 3) {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    return {
      text: `${a} + ${b} = ?`,
      answer: a + b,
      hint: `${a} + ${b} = ${a + b}. Phép cộng số nguyên.`,
    };
  } else {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    return {
      text: `${a} - ${b} = ?`,
      answer: a - b,
      hint: `${a} - ${b} = ${a - b}. Phép trừ số nguyên.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(-12, 12);
    const b = randInt(-12, 12);
    return {
      text: `${a} × ${b} = ?`,
      answer: a * b,
      hint: `Phép nhân: ${a} × ${b} = ${a * b}.`,
    };
  } else if (type === 1) {
    const b = pick([2, 3, 4, 5, 6]);
    const q = randInt(-8, 8);
    if (q === 0) return generateQuick();
    const a = q * b;
    return {
      text: `${a} : ${b} = ?`,
      answer: q,
      hint: `Phép chia: ${a} : ${b} = ${q}.`,
    };
  } else {
    const a = randInt(5, 20);
    const b = randInt(1, 10);
    const c = randInt(1, 8);
    const ans = a + b - c;
    return {
      text: `${a} + (${b} - ${c}) = ?`,
      answer: ans,
      hint: `${a} + ${b} - ${c} = ${ans}. Bước ngoặc trước.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const x = b - a;
    return {
      text: `${a} + x = ${b} → x = ?`,
      answer: x,
      hint: `x = ${b} - ${a} = ${x}.`,
    };
  } else if (type === 1) {
    const a = randInt(1, 12);
    if (a === 0) return generateFindX();
    const x = randInt(-10, 10);
    if (x === 0) return generateFindX();
    const product = a * x;
    return {
      text: `${a} × x = ${product} → x = ?`,
      answer: x,
      hint: `x = ${product} : ${a} = ${x}.`,
    };
  } else {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    const x = a - b;
    return {
      text: `${a} - x = ${b} → x = ?`,
      answer: x,
      hint: `x = ${a} - ${b} = ${x}.`,
    };
  }
};

export default function OnTapChuong3SoNguyenInteractive() {
  const [activeTab, setActiveTab] = useState<'practice' | 'quick' | 'findX'>('practice');
  const [practice, setPractice] = useState<Problem>(() => generatePractice());
  const [practiceAns, setPracticeAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [quick, setQuick] = useState<Problem>(() => generateQuick());
  const [quickAns, setQuickAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [findX, setFindX] = useState<Problem>(() => generateFindX());
  const [findXAns, setFindXAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const checkAnswer = useCallback((
    problem: Problem,
    answer: UserAnswer,
    setAnswer: (a: UserAnswer) => void,
  ) => {
    const parsed = parseFloat(answer.value);
    const isCorrect = !isNaN(parsed) && parsed === problem.answer;
    setAnswer({ ...answer, isCorrect });
    if (isCorrect) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, []);

  const nextPractice = () => { setPractice(generatePractice()); setPracticeAns({ value: '', isCorrect: null }); };
  const nextQuick = () => { setQuick(generateQuick()); setQuickAns({ value: '', isCorrect: null }); };
  const nextFindX = () => { setFindX(generateFindX()); setFindXAns({ value: '', isCorrect: null }); };

  const handleKeyPress = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter') fn();
  };

  const renderProblem = (
    title: string,
    color: string,
    problem: Problem,
    answer: UserAnswer,
    setAnswer: (a: UserAnswer) => void,
    onCheck: () => void,
    onNext: () => void,
  ) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">{title}</p>
        <div className="text-3xl font-mono font-bold" style={{ color }}>
          {problem.text}
        </div>
        {problem.hint && (
          <p className="text-sm text-gray-400 mt-2">💡 {problem.hint}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="number"
          value={answer.value}
          onChange={(e) => setAnswer({ ...answer, value: e.target.value, isCorrect: null })}
          onKeyDown={(e) => handleKeyPress(e, onCheck)}
          className="w-40 text-center text-2xl font-mono border-2 rounded-lg p-3 focus:outline-none"
          style={{ borderColor: color + '88' }}
          placeholder="?"
          disabled={answer.isCorrect !== null}
        />

        <div className="flex gap-3">
          {answer.isCorrect === null ? (
            <button
              onClick={onCheck}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ background: color }}
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors"
              style={{ background: color }}
            >
              Câu tiếp →
            </button>
          )}
        </div>

        {answer.isCorrect !== null && (
          <div className={`text-center p-3 rounded-lg ${
            answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {answer.isCorrect ? (
              <p className="font-bold">✅ Chính xác! Đáp án là {problem.answer}</p>
            ) : (
              <p className="font-bold">❌ Đáp án đúng là: {problem.answer}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-orange-900 mb-4 text-center">
        🧮 Thực hành: Ôn tập chương 3 — Số nguyên
      </h3>

      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'practice'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-orange-600 hover:bg-orange-100'
          }`}
        >
          📝 Tổng hợp
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-amber-600 hover:bg-amber-100'
          }`}
        >
          ⚡ Tính nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-yellow-600 text-white shadow-md'
              : 'bg-white text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Ôn tập: Nhận biết, so sánh, GTTĐ, cộng trừ:',
        '#ea580c',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Ôn tập: Tính nhanh nhân, chia, biểu thức:',
        '#d97706',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Ôn tập: Tìm x trong phương trình:',
        '#ca8a04',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-orange-900 font-medium mb-2">💡 Tổng kết chương 3 — Số nguyên:</p>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Số nguyên: ..., -3, -2, -1, 0, 1, 2, 3, ...</li>
          <li>• Số đối: a và -a luôn có a + (-a) = 0</li>
          <li>• GTTĐ: |a| ≥ 0, |a| = |-a|</li>
          <li>• Cộng/trừ: cùng dấu cộng, khác dấu trừ, đổi dấu khi trừ</li>
          <li>• Nhân: cùng dấu dương, khác dấu âm</li>
          <li>• Chia: a : b = c ↔ a = b × c (b ≠ 0)</li>
          <li>• ước: a là ước của b nếu b : a là số nguyên</li>
          <li>• bội: a là bội của b nếu a = b × k (k ∈ ℤ)</li>
        </ul>
      </div>
    </div>
  );
}
