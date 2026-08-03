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
const sumDigits = (n: number): number => String(n).split('').reduce((s, d) => s + Number(d), 0);

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Chia hết cho 2, 5
    const last = pick([0, 2, 4, 5, 6, 8]);
    const first = randInt(100, 999);
    const num = Math.floor(first / 10) * 10 + last;
    const divisor = last === 0 || last === 5 ? 5 : 2;
    return {
      text: `${num} có chia hết cho ${divisor} không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `Tận cùng là ${last} ⇒ chia hết cho ${divisor}.`,
    };
  } else if (type === 1) {
    // Chia hết cho 3, 9
    const sum = pick([3, 6, 9, 12, 15, 18]);
    const digits = [];
    let remaining = sum;
    while (remaining > 0) {
      digits.push(Math.min(remaining, 9));
      remaining -= digits[digits.length - 1];
    }
    const num = Number(digits.join('')) || sum;
    const divisor = sum % 9 === 0 ? 9 : 3;
    return {
      text: `${num} có chia hết cho ${divisor} không? (1=Có, 0=Không)`,
      answer: 1,
      hint: `Tổng chữ số = ${sum} ⋮ ${divisor} ⇒ ${num} ⋮ ${divisor}.`,
    };
  } else {
    // Không chia hết
    const num = randInt(100, 999);
    const divisor = pick([2, 3, 5, 9]);
    let divisible = false;
    if (divisor === 2 && num % 2 === 0) divisible = true;
    if (divisor === 5 && (num % 10 === 0 || num % 10 === 5)) divisible = true;
    if (divisor === 3 && sumDigits(num) % 3 === 0) divisible = true;
    if (divisor === 9 && sumDigits(num) % 9 === 0) divisible = true;
    return {
      text: `${num} có chia hết cho ${divisor} không? (1=Có, 0=Không)`,
      answer: divisible ? 1 : 0,
      hint: divisible ? `✓ Thỏa mãn dấu hiệu.` : `✗ Không thỏa dấu hiệu chia hết cho ${divisor}.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tìm chữ số x
    const prefix = randInt(10, 99);
    const divisor = pick([3, 9]);
    const sumFixed = sumDigits(prefix);
    const possible = [];
    for (let x = 0; x <= 9; x++) {
      if ((sumFixed + x) % divisor === 0) possible.push(x);
    }
    return {
      text: `Tìm x (0-9) để ${prefix}x chia hết cho ${divisor} (trả lời số lượng giá trị)`,
      answer: possible.length,
      hint: `Tổng chữ số = ${sumFixed} + x ⋮ ${divisor}. Các x: ${possible.join(', ')}.`,
    };
  } else if (type === 1) {
    // Chia hết cho 6
    const num = randInt(100, 999);
    const div2 = num % 2 === 0;
    const div3 = sumDigits(num) % 3 === 0;
    const div6 = div2 && div3;
    return {
      text: `${num} có chia hết cho 6 không? (1=Có, 0=Không)`,
      answer: div6 ? 1 : 0,
      hint: div6 ? `Tận cùng chẵn + tổng ⋮ 3 ⇒ ⋮ 6.` : `Không thỏa cả 2 điều kiện.`,
    };
  } else {
    // Chia hết cho 10
    const last = pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const first = randInt(100, 999);
    const num = Math.floor(first / 10) * 10 + last;
    return {
      text: `${num} có chia hết cho 10 không? (1=Có, 0=Không)`,
      answer: last === 0 ? 1 : 0,
      hint: last === 0 ? `Tận cùng 0 ⇒ ⋮ 10.` : `Tận cùng ${last} ≠ 0 ⇒ không ⋮ 10.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tìm chữ số cuối
    const prefix = randInt(10, 99);
    const divisors = [2, 5, 10];
    const divisor = pick(divisors);
    let count = 0;
    for (let x = 0; x <= 9; x++) {
      const num = prefix * 10 + x;
      if (divisor === 2 && num % 2 === 0) count++;
      if (divisor === 5 && (x === 0 || x === 5)) count++;
      if (divisor === 10 && x === 0) count++;
    }
    return {
      text: `Số có dạng ${prefix}x (x là chữ số). Bao nhiêu giá trị x để số đó chia hết cho ${divisor}?`,
      answer: count,
      hint: divisor === 2 ? `x ∈ {0,2,4,6,8} (5 giá trị)` : divisor === 5 ? `x ∈ {0,5} (2 giá trị)` : `x = 0 (1 giá trị)`,
    };
  } else if (type === 1) {
    // Tìm chữ số giữa
    const a = randInt(1, 9);
    const c = randInt(0, 9);
    const divisor = pick([3, 9]);
    let count = 0;
    for (let b = 0; b <= 9; b++) {
      if ((a + b + c) % divisor === 0) count++;
    }
    return {
      text: `Số ${a}x${c} chia hết cho ${divisor}. Có bao nhiêu giá trị x (0-9)?`,
      answer: count,
      hint: `Tổng = ${a} + x + ${c} = ${a + c} + x ⋮ ${divisor}.`,
    };
  } else {
    // Số nguyên tố nhỏ nhất có 3 chữ số chia hết cho 2, 3, 5
    return {
      text: `Số tự nhiên có 3 chữ số nhỏ nhất chia hết cho 2, 3, 5 là?`,
      answer: 120,
      hint: `BCNN(2,3,5) = 30. Bội của 30 có 3 chữ số nhỏ nhất: 30×4=120.`,
    };
  }
};

export default function DauHieuChiaHetInteractive() {
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-emerald-900 mb-4 text-center">
        🔍 Thực hành: Dấu hiệu chia hết
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
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          ✏️ Luyện tập
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
        >
          ⚡ Tìm x
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
        'Kiểm tra dấu hiệu chia hết:',
        '#059669',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tìm chữ số chưa biết:',
        '#2563eb',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Bài toán kết hợp:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-emerald-900 font-medium mb-2">💡 Dấu hiệu chia hết:</p>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• Chia hết 2: Tận cùng 0,2,4,6,8</li>
          <li>• Chia hết 5: Tận cùng 0,5</li>
          <li>• Chia hết 3: Tổng chữ số ⋮ 3</li>
          <li>• Chia hết 9: Tổng chữ số ⋮ 9</li>
          <li>• Chia hết 6: Cả ⋮ 2 và ⋮ 3</li>
          <li>• Chia hết 10: Tận cùng 0</li>
        </ul>
      </div>
    </div>
  );
}