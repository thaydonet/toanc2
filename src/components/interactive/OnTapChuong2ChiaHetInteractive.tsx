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

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n /= d;
    }
    d += d === 2 ? 1 : 2;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function formatPrimeFactors(n: number): string {
  const factors = primeFactors(n);
  const map = new Map<number, number>();
  for (const f of factors) map.set(f, (map.get(f) || 0) + 1);
  return [...map.entries()].map(([p, e]) => e === 1 ? String(p) : `${p}^${e}`).join(' × ');
}

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const num = randInt(100, 999);
    const divisor = pick([2, 3, 5, 9, 10]);
    let ok = false;
    if (divisor === 2) ok = num % 2 === 0;
    if (divisor === 5) ok = num % 5 === 0;
    if (divisor === 10) ok = num % 10 === 0;
    if (divisor === 3) ok = sumDigits(num) % 3 === 0;
    if (divisor === 9) ok = sumDigits(num) % 9 === 0;
    return {
      text: `${num} có chia hết cho ${divisor} không? (1=Có, 0=Không)`,
      answer: ok ? 1 : 0,
      hint: ok
        ? `${divisor === 3 || divisor === 9 ? `Tổng chữ số = ${sumDigits(num)} ⋮ ${divisor}` : `Tận cùng thỏa dấu hiệu chia hết cho ${divisor}`}.`
        : `Không thỏa dấu hiệu chia hết cho ${divisor}.`,
    };
  } else if (type === 1) {
    const num = pick([31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 51, 57, 87, 91, 93, 99, 111, 117, 123, 133, 141, 161, 169, 187, 209]);
    return {
      text: `${num} là số nguyên tố hay hợp số? (1=Nguyên tố, 0=Hợp số)`,
      answer: isPrime(num) ? 1 : 0,
      hint: isPrime(num)
        ? `${num} chỉ có ước 1 và ${num}.`
        : `${num} = ${formatPrimeFactors(num)} nên là hợp số.`,
    };
  } else {
    const num = pick([30, 36, 42, 48, 54, 60, 72, 84, 90, 96, 108, 120]);
    const count = Array.from({ length: num }, (_, i) => i + 1).filter(x => num % x === 0).length;
    return {
      text: `Số ${num} có bao nhiêu ước tự nhiên?`,
      answer: count,
      hint: `Phân tích: ${num} = ${formatPrimeFactors(num)}. Số ước = tích của (số mũ + 1).`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const nums = [
      [12, 18], [24, 36], [15, 20], [28, 42], [30, 45],
      [16, 40], [21, 35], [24, 30], [36, 54], [40, 60],
    ];
    const [a, b] = pick(nums);
    return {
      text: `ƯCLN(${a}, ${b}) = ?`,
      answer: gcd(a, b),
      hint: `${a} = ${formatPrimeFactors(a)}; ${b} = ${formatPrimeFactors(b)}. ƯCLN lấy thừa số chung, mũ nhỏ nhất = ${gcd(a, b)}.`,
    };
  } else if (type === 1) {
    const nums = [
      [6, 8], [9, 12], [10, 15], [12, 18], [14, 21],
      [8, 12], [15, 20], [18, 24], [16, 24], [20, 30],
    ];
    const [a, b] = pick(nums);
    return {
      text: `BCNN(${a}, ${b}) = ?`,
      answer: lcm(a, b),
      hint: `${a} = ${formatPrimeFactors(a)}; ${b} = ${formatPrimeFactors(b)}. BCNN lấy thừa số chung + riêng, mũ lớn nhất = ${lcm(a, b)}.`,
    };
  } else {
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
    const a = pick([12, 18, 24, 30, 36, 40, 48, 60]);
    const targetGcd = pick([2, 3, 4, 5, 6, 8, 10, 12].filter(x => a % x === 0));
    return {
      text: `Tìm số tự nhiên x nhỏ nhất sao cho ƯCLN(${a}, x) = ${targetGcd}:`,
      answer: targetGcd,
      hint: `x nhỏ nhất bằng chính ${targetGcd} vì ƯCLN(${a}, ${targetGcd}) = ${targetGcd}.`,
    };
  } else if (type === 1) {
    const a = pick([6, 8, 9, 10, 12, 14, 15, 18]);
    const targetLcm = pick([24, 30, 36, 40, 42, 45, 48, 60, 72, 90].filter(x => x % a === 0 && x !== a));
    return {
      text: `Tìm số tự nhiên x nhỏ nhất sao cho BCNN(${a}, x) = ${targetLcm}:`,
      answer: targetLcm / a,
      hint: `BCNN(${a}, x) = ${targetLcm} ⇒ x nhỏ nhất = ${targetLcm}/${a} = ${targetLcm / a}.`,
    };
  } else {
    const a = pick([60, 84, 96, 120, 144, 180]);
    const b = pick([72, 90, 108, 120, 144, 168].filter(x => x !== a));
    const g = gcd(a, b);
    return {
      text: `Chia ${a} viên kẹo và ${b} chiếc bánh vào các đĩa đều nhau. Số đĩa nhiều nhất là?`,
      answer: g,
      hint: `Số đĩa nhiều nhất = ƯCLN(${a}, ${b}) = ${g}.`,
    };
  }
};

export default function OnTapChuong2ChiaHetInteractive() {
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
    <div className="bg-gradient-to-br from-sky-50 to-cyan-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-sky-900 mb-4 text-center">
        🧮 Thực hành: Ôn tập chương 2 – Tính chia hết
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
              ? 'bg-sky-600 text-white shadow-md'
              : 'bg-white text-sky-600 hover:bg-sky-100'
          }`}
        >
          ✏️ Chia hết & Số nguyên tố
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-emerald-600 hover:bg-emerald-100'
          }`}
        >
          ⚡ ƯCLN / BCNN
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 Tìm x / Ứng dụng
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Kiểm tra dấu hiệu chia hết, số nguyên tố:',
        '#0284c7',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Tính ƯCLN, BCNN nhanh:',
        '#059669',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Bài toán tìm x và thực tế:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-sky-900 font-medium mb-2">💡 Ghi nhớ trọng tâm chương 2:</p>
        <ul className="text-sm text-sky-800 space-y-1">
          <li>• Dấu hiệu: ⋮2 (tận cùng chẵn), ⋮3 (tổng chữ số ⋮3), ⋮5 (tận cùng 0,5), ⋮9 (tổng chữ số ⋮9)</li>
          <li>• Số nguyên tố: chỉ có 2 ước là 1 và chính nó; số 0, 1 không là nguyên tố</li>
          <li>{`• ƯCLN: thừa số chung, mũ nhỏ nhất`}</li>
          <li>{`• BCNN: thừa số chung + riêng, mũ lớn nhất`}</li>
          <li>{`• ƯCLN(a,b) × BCNN(a,b) = a × b`}</li>
        </ul>
      </div>
    </div>
  );
}
