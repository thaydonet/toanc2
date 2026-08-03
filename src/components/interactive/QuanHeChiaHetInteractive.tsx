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
  const type = randInt(0, 2);
  if (type === 0) {
    // a chia hết cho b
    const b = randInt(2, 9);
    const q = randInt(2, 8);
    const a = b * q;
    return {
      text: `${a} có chia hết cho ${b} không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `${a} = ${b} × ${q} nên chia hết.`,
    };
  } else if (type === 1) {
    // a không chia hết cho b
    const b = randInt(2, 9);
    const q = randInt(2, 8);
    const a = b * q + randInt(1, b - 1);
    return {
      text: `${a} có chia hết cho ${b} không? (1=Có, 0=Không)`,
      answer: 0,
      hint: `${a} = ${b} × ${q} + ${a % b} (dư ${a % b}) nên không chia hết.`,
    };
  } else {
    // Tính chất bắc cầu
    let a = randInt(2, 5) * randInt(2, 5) * randInt(2, 5);
    let b = randInt(2, 5);
    let c = randInt(2, 5);
    while (a % (b * c) !== 0 || b % c !== 0) {
      a = randInt(2, 5) * randInt(2, 5) * randInt(2, 5);
      b = randInt(2, 5);
      c = randInt(2, 5);
    }
    return {
      text: `${a} chia hết cho ${b}, ${b} chia hết cho ${c}. ${a} có chia hết cho ${c} không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `Tính chất bắc cầu: a⋮b và b⋮c ⇒ a⋮c.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tổng/hiệu chia hết
    const m = randInt(2, 8);
    const q1 = randInt(2, 6);
    const q2 = randInt(2, 6);
    const a = m * q1;
    const b = m * q2;
    const op = randInt(0, 1);
    if (op === 0 && a >= b) {
      return {
        text: `Cho ${a}⋮${m}, ${b}⋮${m}. Tính ${a}+${b} có chia hết cho ${m} không? (1=Có, 0=Không)`,
        answer: 1,
        hint: `a⋮m và b⋮m ⇒ (a+b)⋮m.`,
      };
    } else if (op === 1 && a >= b) {
      return {
        text: `Cho ${a}⋮${m}, ${b}⋮${m}. Tính ${a}-${b} có chia hết cho ${m} không? (1=Có, 0=Không)`,
        answer: 1,
        hint: `a⋮m và b⋮m ⇒ (a-b)⋮m.`,
      };
    } else {
      return {
        text: `Cho ${a}⋮${m}, ${b}⋮${m}. Tính ${a}+${b} có chia hết cho ${m} không? (1=Có, 0=Không)`,
        answer: 1,
        hint: `a⋮m và b⋮m ⇒ (a+b)⋮m.`,
      };
    }
  } else if (type === 1) {
    // Tích chia hết
    const a = randInt(2, 15);
    const m = randInt(2, 9);
    const k = randInt(2, 8);
    const num = a * m;
    return {
      text: `Cho ${num}⋮${m}. ${num}×${k} có chia hết cho ${m} không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `a⋮m ⇒ (a×k)⋮m với mọi k tự nhiên.`,
    };
  } else {
    // Chia có dư
    const a = randInt(20, 50);
    const b = randInt(3, 9);
    const q = Math.floor(a / b);
    const r = a % b;
    return {
      text: `${a} = ${b} × ${q} + ${r}. Số dư là?`,
      answer: r,
      hint: `Định lý chia có dư: a = b×q + r với 0 ≤ r < b.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tìm số chia hết
    const m = randInt(2, 9);
    const max = 50;
    const nums = Array.from({ length: Math.floor(max / m) }, (_, i) => m * (i + 1));
    const a = pick(nums);
    return {
      text: `Tìm số tự nhiên x ≤ ${max} chia hết cho ${m} (trả lời số lượng)`,
      answer: Math.floor(max / m),
      hint: `Các bội của ${m} không quá ${max}: ${m}, ${2*m}, ...`,
    };
  } else if (type === 1) {
    // Tìm ước
    const a = pick([12, 18, 20, 24, 30, 36, 48]);
    return {
      text: `Số ${a} có bao nhiêu ước?`,
      answer: Array.from({ length: a }, (_, i) => i + 1).filter(x => a % x === 0).length,
      hint: `Liệt kê các ước của ${a}.`,
    };
  } else {
    // Ước chung
    const a = pick([12, 18, 20, 24, 30]);
    const b = pick([15, 24, 36, 40, 48]);
    const gcd = (x: number, y: number): number => y === 0 ? x : gcd(y, x % y);
    return {
      text: `Ước chung lớn nhất của ${a} và ${b} là?`,
      answer: gcd(a, b),
      hint: `Phân tích: ${a} = ..., ${b} = ...`,
    };
  }
};

export default function QuanHeChiaHetInteractive() {
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
        ➗ Thực hành: Quan hệ chia hết
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
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ✏️ Luyện tập
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-green-600 hover:bg-green-100'
          }`}
        >
          ⚡ Tính chất
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 Ứng dụng
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Kiểm tra quan hệ chia hết:',
        '#2563eb',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Áp dụng tính chất chia hết:',
        '#16a34a',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm số thỏa mãn điều kiện:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-indigo-900 font-medium mb-2">💡 Ghi nhớ:</p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• a ⋮ b nếu a = b × q (q tự nhiên)</li>
          <li>• Bắc cầu: a ⋮ b, b ⋮ c ⇒ a ⋮ c</li>
          <li>• Tổng/hiệu: a ⋮ m, b ⋮ m ⇒ a ± b ⋮ m</li>
          <li>• Tích: a ⋮ m ⇒ a × k ⋮ m</li>
          <li>{`• Chia có dư: a = b × q + r (0 ≤ r < b)`}</li>
        </ul>
      </div>
    </div>
  );
}