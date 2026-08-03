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

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // ƯCLN 2 số
    const a = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 66, 70, 72, 75, 78, 80, 81, 84, 88, 90, 96, 98, 99, 100]);
    const b = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 66, 70, 72, 75, 78, 80, 81, 84, 88, 90, 96, 98, 99, 100].filter(x => x !== a));
    return {
      text: `ƯCLN(${a}, ${b}) = ?`,
      answer: gcd(a, b),
      hint: `Phân tích: ${a} = ..., ${b} = ... ⇒ ƯCLN = ${gcd(a, b)}.`,
    };
  } else if (type === 1) {
    // BCNN 2 số
    const a = pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30]);
    const b = pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30].filter(x => x !== a));
    return {
      text: `BCNN(${a}, ${b}) = ?`,
      answer: lcm(a, b),
      hint: `Phân tích: ${a} = ..., ${b} = ... ⇒ BCNN = ${lcm(a, b)}.`,
    };
  } else {
    // Nguyên tố cùng nhau
    const a = pick([8, 9, 14, 15, 16, 21, 22, 25, 26, 27, 33, 34, 35]);
    const b = pick([15, 16, 21, 22, 25, 26, 27, 28, 33, 34, 35, 38, 39].filter(x => gcd(a, x) === 1));
    return {
      text: `${a} và ${b} có nguyên tố cùng nhau không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `ƯCLN(${a}, ${b}) = 1 ⇒ nguyên tố cùng nhau.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // ƯCLN 3 số
    const nums = [
      [12, 18, 24],
      [20, 30, 40],
      [15, 25, 35],
      [24, 36, 48],
      [18, 24, 30],
      [30, 45, 60],
      [14, 21, 28],
      [27, 36, 45],
    ];
    const [a, b, c] = pick(nums);
    let result = gcd(a, b);
    result = gcd(result, c);
    return {
      text: `ƯCLN(${a}, ${b}, ${c}) = ?`,
      answer: result,
      hint: `ƯCLN(${a}, ${b}) = ${gcd(a, b)}, ƯCLN(${gcd(a, b)}, ${c}) = ${result}.`,
    };
  } else if (type === 1) {
    // BCNN 3 số
    const nums = [
      [4, 6, 8],
      [6, 9, 12],
      [10, 15, 20],
      [12, 18, 24],
      [8, 12, 16],
      [9, 12, 15],
    ];
    const [a, b, c] = pick(nums);
    let result = lcm(a, b);
    result = lcm(result, c);
    return {
      text: `BCNN(${a}, ${b}, ${c}) = ?`,
      answer: result,
      hint: `BCNN(${a}, ${b}) = ${lcm(a, b)}, BCNN(${lcm(a, b)}, ${c}) = ${result}.`,
    };
  } else {
    // Mối liên hệ ƯCLN × BCNN = a × b
    const a = pick([12, 15, 18, 20, 24, 30, 36, 40]);
    const b = pick([18, 20, 24, 30, 36, 45, 48, 50].filter(x => x !== a));
    const u = gcd(a, b);
    return {
      text: `Cho ƯCLN(${a}, ${b}) = ${u}. BCNN(${a}, ${b}) = ?`,
      answer: lcm(a, b),
      hint: `ƯCLN × BCNN = a × b ⇒ BCNN = ${a}×${b}/${u} = ${lcm(a, b)}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tìm x biết ƯCLN
    const a = pick([12, 18, 24, 30, 36, 40, 48]);
    const targetGcd = pick([2, 3, 4, 5, 6, 8, 10, 12].filter(x => a % x === 0));
    return {
      text: `Tìm x nhỏ nhất sao cho ƯCLN(${a}, x) = ${targetGcd}:`,
      answer: targetGcd,
      hint: `x phải là bội của ${targetGcd} và không chia hết cho thừa số nào lớn hơn của ${a}. Nhỏ nhất là ${targetGcd}.`,
    };
  } else if (type === 1) {
    // Tìm x biết BCNN
    const a = pick([6, 8, 9, 10, 12, 14, 15]);
    const targetLcm = pick([24, 30, 36, 40, 42, 45, 48, 60, 72].filter(x => x % a === 0));
    return {
      text: `Tìm x nhỏ nhất sao cho BCNN(${a}, x) = ${targetLcm}:`,
      answer: targetLcm / a,
      hint: `BCNN(${a}, x) = ${targetLcm} ⇒ x = ${targetLcm}/${a} = ${targetLcm / a}.`,
    };
  } else {
    // Ứng dụng thực tế
    const a = pick([12, 15, 18, 20, 24, 30]);
    const b = pick([18, 20, 24, 30, 36, 40, 45].filter(x => x !== a));
    const g = gcd(a, b);
    return {
      text: `Chia ${a} và ${b} thành các nhóm đều nhau, mỗi nhóm nhiều nhất. Số nhóm = ?`,
      answer: g,
      hint: `Số nhóm nhiều nhất = ƯCLN(${a}, ${b}) = ${g}.`,
    };
  }
};

export default function UocChungBCNNInteractive() {
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
    <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-purple-900 mb-4 text-center">
        🔗 Thực hành: ƯCLN & BCNN
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
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          ✏️ ƯCLN/BCNN
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ⚡ 3 số / Mối liên hệ
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-orange-600 hover:bg-orange-100'
          }`}
        >
          🔍 Tìm x / Ứng dụng
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Tìm ƯCLN / BCNN / Nguyên tố cùng nhau:',
        '#7c3aed',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'ƯCLN/BCNN 3 số & Mối liên hệ:',
        '#2563eb',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x & Bài toán thực tế:',
        '#ea580c',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-purple-900 font-medium mb-2">💡 Ghi nhớ:</p>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• ƯCLN: thừa số chung, mũ nhỏ nhất</li>
          <li>• BCNN: thừa số chung + riêng, mũ lớn nhất</li>
          <li>• ƯCLN(a,b) × BCNN(a,b) = a × b</li>
          <li>• Nguyên tố cùng nhau: ƯCLN = 1</li>
          <li>• ƯCLN: chia đều / BCNN: gặp lại / quy đồng</li>
        </ul>
      </div>
    </div>
  );
}