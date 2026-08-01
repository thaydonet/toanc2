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
    // a + b * c
    const a = randInt(5, 30);
    const b = randInt(2, 9);
    const c = randInt(2, 9);
    return {
      text: `${a} + ${b} × ${c}`,
      answer: a + b * c,
      hint: `Nhân trước: ${b} × ${c} = ${b * c}, sau đó cộng ${a} + ${b * c}.`,
    };
  } else if (type === 1) {
    // (a + b) * c
    const a = randInt(3, 15);
    const b = randInt(3, 15);
    const c = randInt(2, 6);
    return {
      text: `(${a} + ${b}) × ${c}`,
      answer: (a + b) * c,
      hint: `Tính trong ngoặc trước: ${a} + ${b} = ${a + b}, sau đó nhân với ${c}.`,
    };
  } else {
    // a^2 + b * c
    const a = randInt(2, 6);
    const b = randInt(2, 8);
    const c = randInt(2, 8);
    return {
      text: `${a}² + ${b} × ${c}`,
      answer: a * a + b * c,
      hint: `Lũy thừa trước: ${a}² = ${a * a}, nhân: ${b} × ${c} = ${b * c}, sau đó cộng.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // a * b + a * c
    const a = randInt(3, 12);
    const b = randInt(2, 15);
    const c = 20 - b > 0 ? 20 - b : randInt(2, 15);
    return {
      text: `${a} × ${b} + ${a} × ${c}`,
      answer: a * (b + c),
      hint: `Đặt ${a} ra ngoài: ${a} × (${b} + ${c}) = ${a} × ${b + c}.`,
    };
  } else if (type === 1) {
    // [a + (b - c) * d] : e
    const sub = randInt(2, 6);
    const d = randInt(2, 5);
    const insideMul = sub * d;
    const a = randInt(5, 20);
    const sum = a + insideMul;
    const e = pick([2, 3, 4, 5].filter(x => sum % x === 0)) || 1;
    const b = randInt(sub + 1, sub + 10);
    const c = b - sub;
    return {
      text: `[${a} + (${b} - ${c}) × ${d}] : ${e}`,
      answer: sum / e,
      hint: `Tính ngoặc tròn (${b} - ${c} = ${sub}), rồi ngoặc vuông [${a} + ${sub} × ${d} = ${sum}], cuối cùng chia cho ${e}.`,
    };
  } else {
    // a^3 - b * (c + d)
    const a = randInt(3, 5); // a^3 = 27, 64, 125
    const c = randInt(2, 5);
    const d = randInt(2, 5);
    const sum = c + d;
    const b = randInt(1, Math.floor((a * a * a - 1) / sum));
    return {
      text: `${a}³ - ${b} × (${c} + ${d})`,
      answer: a * a * a - b * sum,
      hint: `Lũy thừa ${a}³ = ${a * a * a}, ngoặc (${c} + ${d} = ${sum}), nhân ${b} × ${sum} = ${b * sum}, trừ sau cùng.`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    // 2 * x + a = b
    const x = randInt(3, 12);
    const coeff = randInt(2, 5);
    const a = randInt(2, 15);
    const b = coeff * x + a;
    return {
      text: `${coeff} × x + ${a} = ${b}`,
      answer: x,
      hint: `${coeff} × x = ${b} - ${a} = ${b - a} ⇒ x = ${b - a} : ${coeff}.`,
    };
  } else if (type === 1) {
    // (x - a) * b = c
    const x = randInt(5, 20);
    const a = randInt(2, x - 1);
    const b = randInt(2, 6);
    const c = (x - a) * b;
    return {
      text: `(x - ${a}) × ${b} = ${c}`,
      answer: x,
      hint: `x - ${a} = ${c} : ${b} = ${c / b} ⇒ x = ${c / b} + ${a}.`,
    };
  } else {
    // a + x : b = c
    const xMult = randInt(2, 10);
    const b = randInt(2, 5);
    const x = xMult * b;
    const a = randInt(5, 20);
    const c = a + xMult;
    return {
      text: `${a} + x : ${b} = ${c}`,
      answer: x,
      hint: `x : ${b} = ${c} - ${a} = ${c - a} ⇒ x = ${c - a} × ${b}.`,
    };
  }
};

export default function ThuTuPhepTinhInteractive() {
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
          {problem.text} = ?
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
        🎯 Thực hành: Thứ tự thực hiện các phép tính
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
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-indigo-600 hover:bg-indigo-100'
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
          ⚡ Phức tạp / Ngoặc
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 Tìm x
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Thực hiện phép tính theo đúng thứ tự ưu tiên:',
        '#4f46e5',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Biểu thức có ngoặc và nhiều phép tính:',
        '#16a34a',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Tìm x trong các biểu thức:',
        '#7c3aed',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-indigo-900 font-medium mb-2">💡 Quy tắc thứ tự ưu tiên:</p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Ngoặc: ( ) → [ ] → &#123; &#125; (từ trong ra ngoài)</li>
          <li>• Phép tính: Lũy thừa → Nhân & Chia → Cộng & Trừ</li>
          <li>• Nếu cùng mức ưu tiên: Thực hiện từ trái sang phải</li>
        </ul>
      </div>
    </div>
  );
}
