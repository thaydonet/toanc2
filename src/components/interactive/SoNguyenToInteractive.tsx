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

const PRIMES_UNDER_100 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

const isPrime = (n: number): boolean => {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const generatePractice = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Kiểm tra số nguyên tố
    const num = pick([...PRIMES_UNDER_100, ...Array.from({ length: 20 }, () => randInt(4, 99)).filter(x => !isPrime(x))]);
    return {
      text: `${num} là số gì? (1=Nguyên tố, 0=Hợp số/Đặc biệt)`,
      answer: isPrime(num) ? 1 : 0,
      hint: isPrime(num) ? `${num} chỉ có ước 1 và ${num}.` : `${num} có ước ngoài 1 và nó.`,
    };
  } else if (type === 1) {
    // Phân tích thừa số
    const num = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 66, 70, 72, 75, 78, 80, 81, 84, 88, 90, 96, 98, 99, 100]);
    return {
      text: `Phân tích ${num} = ? (trả lời số thừa số nguyên tố khác nhau)`,
      answer: new Set(primeFactors(num)).size,
      hint: `Phân tích: ${num} = ${formatPrimeFactors(num)}. Các thừa số khác nhau: ${[...new Set(primeFactors(num))].join(', ')}.`,
    };
  } else {
    // Số nguyên tố trong khoảng
    const start = pick([10, 20, 30, 40, 50, 60, 70, 80, 90]);
    const end = start + 9;
    const count = PRIMES_UNDER_100.filter(p => p >= start && p <= end).length;
    return {
      text: `Có bao nhiêu số nguyên tố từ ${start} đến ${end}?`,
      answer: count,
      hint: `Các số nguyên tố: ${PRIMES_UNDER_100.filter(p => p >= start && p <= end).join(', ') || 'không có'}.`,
    };
  }
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

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Phân tích nhanh
    const num = pick([24, 36, 48, 54, 60, 72, 84, 90, 96, 100, 108, 120, 126, 144, 150, 160, 168, 180, 200, 210]);
    return {
      text: `Phân tích ${num} = 2^a × 3^b × 5^c... Tìm a+b+c+... (tổng các số mũ)`,
      answer: primeFactors(num).length,
      hint: `${num} = ${formatPrimeFactors(num)}. Tổng số mũ: ${primeFactors(num).length}.`,
    };
  } else if (type === 1) {
    // Số nguyên tố dạng 6k±1
    const k = randInt(1, 10);
    const form = randInt(0, 1);
    const num = form === 0 ? 6 * k + 1 : 6 * k - 1;
    return {
      text: `Số ${num} (dạng 6×${k}${form === 0 ? '+1' : '-1'}) là số nguyên tố không? (1=Có, 0=Không)`,
      answer: isPrime(num) ? 1 : 0,
      hint: isPrime(num) ? `${num} là số nguyên tố.` : `${num} = ${formatPrimeFactors(num)} là hợp số.`,
    };
  } else {
    // Ước của số nguyên tố
    const p = pick(PRIMES_UNDER_100.filter(x => x >= 5));
    return {
      text: `Số nguyên tố ${p} có bao nhiêu ước dương?`,
      answer: 2,
      hint: `Số nguyên tố chỉ có 2 ước: 1 và ${p}.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // Tìm số nguyên tố tiếp theo
    const start = randInt(10, 90);
    let next = start + 1;
    while (!isPrime(next)) next++;
    return {
      text: `Số nguyên tố nhỏ nhất lớn hơn ${start} là?`,
      answer: next,
      hint: `Kiểm tra từ ${start+1} đến: ${next} là số nguyên tố.`,
    };
  } else if (type === 1) {
    // Phân tích tìm thừa số
    const num = pick([72, 90, 100, 108, 120, 126, 144, 150, 180, 200, 210, 216, 240, 252, 270, 300]);
    const factors = primeFactors(num);
    const unique = [...new Set(factors)];
    const target = pick(unique);
    const exp = factors.filter(x => x === target).length;
    return {
      text: `Trong phân tích ${num}, số mũ của ${target} là?`,
      answer: exp,
      hint: `${num} = ${formatPrimeFactors(num)}. Số mũ của ${target} là ${exp}.`,
    };
  } else {
    // Tìm số nguyên tố trong khoảng
    const start = pick([50, 60, 70, 80, 90]);
    const end = start + 9;
    const primes = PRIMES_UNDER_100.filter(p => p >= start && p <= end);
    return {
      text: `Tìm số nguyên tố lớn nhất từ ${start} đến ${end}:`,
      answer: primes.length > 0 ? primes[primes.length - 1] : 0,
      hint: `Các số nguyên tố: ${primes.join(', ') || 'không có'}. Lớn nhất: ${primes[primes.length - 1] || 'không có'}.`,
    };
  }
};

export default function SoNguyenToInteractive() {
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
    <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-red-900 mb-4 text-center">
        🔢 Thực hành: Số nguyên tố
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
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white text-red-600 hover:bg-red-100'
          }`}
        >
          ✏️ Luyện tập
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-white text-orange-600 hover:bg-orange-100'
          }`}
        >
          ⚡ Phân tích nhanh
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 Tìm số
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Phân loại & kiểm tra số nguyên tố:',
        '#dc2626',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Phân tích & tính chất:',
        '#ea580c',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm số nguyên tố/phân tích:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-red-900 font-medium mb-2">💡 Ghi nhớ:</p>
        <ul className="text-sm text-red-800 space-y-1">
          <li>{`• Số nguyên tố: >1, chỉ 2 ước (1 và nó)`}</li>
          <li>• Số 2: nguyên tố chẵn duy nhất</li>
          <li>• Phân tích: chia liên tiếp cho số nguyên tố từ nhỏ đến lớn</li>
          <li>{`• Dạng 6k±1: số nguyên tố >3 đều có dạng này`}</li>
          <li>{`• Số nguyên tố < 20: 2, 3, 5, 7, 11, 13, 17, 19`}</li>
        </ul>
      </div>
    </div>
  );
}