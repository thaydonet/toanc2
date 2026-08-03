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
    const shapes = [
      { name: 'tam giác đều', axes: 3, center: false },
      { name: 'hình vuông', axes: 4, center: true },
      { name: 'hình chữ nhật', axes: 2, center: true },
      { name: 'hình thoi', axes: 2, center: true },
      { name: 'hình tròn', axes: -1, center: true },
      { name: 'hình thang cân', axes: 1, center: false },
      { name: 'lục giác đều', axes: 6, center: true },
    ];
    const s = pick(shapes);
    return {
      text: `${s.name} có ${s.axes === -1 ? 'vô số' : s.axes} trục đối xứng và ${s.center ? 'có' : 'không có'} tâm đối xứng. Đúng không? (1=Đúng, 0=Sai)`,
      answer: 1,
      hint: `${s.name}: ${s.axes === -1 ? 'vô số' : s.axes} trục đối xứng, ${s.center ? 'có' : 'không có'} tâm đối xứng.`,
    };
  } else if (type === 1) {
    const letters = pick(['A', 'H', 'O', 'S', 'N', 'X', 'M', 'E', 'I', 'Z']);
    const hasAxis = ['A', 'H', 'O', 'M', 'E', 'I', 'X'].includes(letters);
    const hasCenter = ['O', 'S', 'N', 'X', 'Z'].includes(letters);
    return {
      text: `Chữ "${letters}" có cả trục và tâm đối xứng? (1=Cả hai, 0=Chỉ 1 hoặc không)`,
      answer: (hasAxis && hasCenter) ? 1 : 0,
      hint: `Chữ ${letters}: ${hasAxis ? 'có' : 'không'} trục, ${hasCenter ? 'có' : 'không'} tâm.`,
    };
  } else {
    return {
      text: `Khi gấp hình theo trục đối xứng, hai phần sẽ: (1=Chồng khít, 0=Không)`,
      answer: 1,
      hint: `Định nghĩa: trục đối xứng là đường thẳng mà khi gập hình theo đó, hai phần chồng khít.`,
    };
  }
};

const generateQuick = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    return {
      text: `Khi quay hình 180° quanh tâm đối xứng, hình sẽ: (1=Trùng khít, 0=Không)`,
      answer: 1,
      hint: `Định nghĩa tâm đối xứng: quay 180° quanh tâm thì hình trùng khít.`,
    };
  } else if (type === 1) {
    const nums = pick(['0', '8', '3', '1', '2']);
    const hasAxis = ['0', '8', '3'].includes(nums);
    const hasCenter = ['0', '8'].includes(nums);
    return {
      text: `Số "${nums}" có cả trục và tâm? (1=Cả hai, 0=Không)`,
      answer: (hasAxis && hasCenter) ? 1 : 0,
      hint: `Số ${nums}: ${hasAxis ? 'có' : 'không'} trục, ${hasCenter ? 'có' : 'không'} tâm.`,
    };
  } else {
    return {
      text: `Đường thẳng nào là trục đối xứng của hình chữ nhật? (1=Đường qua trung điểm cạnh đối, 0=Đường chéo)`,
      answer: 1,
      hint: `Hình chữ nhật: trục là đường qua trung điểm 2 cặp cạnh đối. Đường chéo KHÔNG phải trục (trừ hình vuông).`,
    };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 1);
  if (type === 0) {
    return {
      text: `Hình nào có tâm đối xứng nhưng KHÔNG có trục đối xứng? (1=Hình bình hành thường, 0=Hình thoi)`,
      answer: 1,
      hint: `Hình bình hành thường: có tâm (giao điểm 2 đường chéo) nhưng 0 trục đối xứng.`,
    };
  } else {
    return {
      text: `Hình nào có 4 trục đối xứng và tâm đối xứng? (1=Hình vuông, 0=Hình chữ nhật)`,
      answer: 1,
      hint: `Hình vuông: 4 trục + tâm. Hình chữ nhật thường: 2 trục + tâm.`,
    };
  }
};

export default function OnTapChuong5DoiXungInteractive() {
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
    <div className="bg-gradient-to-br from-indigo-50 to-violet-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
        🧮 Ôn tập chương 5 — Đối xứng
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
          ✏️ Trục & Tâm đối xứng
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'quick'
              ? 'bg-violet-600 text-white shadow-md'
              : 'bg-white text-violet-600 hover:bg-violet-100'
          }`}
        >
          ⚡ Chữ cái & Số
        </button>
        <button
          onClick={() => setActiveTab('findX')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'findX'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          🔍 So sánh & Phân loại
        </button>
      </div>

      {activeTab === 'practice' && renderProblem(
        'Xác định trục và tâm đối xứng:',
        '#4f46e5',
        practice,
        practiceAns,
        setPracticeAns,
        () => checkAnswer(practice, practiceAns, setPracticeAns),
        nextPractice,
      )}

      {activeTab === 'quick' && renderProblem(
        'Kiến thức đối xứng tổng hợp:',
        '#7c3aed',
        quick,
        quickAns,
        setQuickAns,
        () => checkAnswer(quick, quickAns, setQuickAns),
        nextQuick,
      )}

      {activeTab === 'findX' && renderProblem(
        'Phân loại hình theo đối xứng:',
        '#9333ea',
        findX,
        findXAns,
        setFindXAns,
        () => checkAnswer(findX, findXAns, setFindXAns),
        nextFindX,
      )}

      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-indigo-900 font-medium mb-2">💡 Tổng hợp chương 5:</p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Trục đối xứng: gập hình → hai phần chồng khít</li>
          <li>• Tâm đối xứng: quay 180° → hình trùng khít</li>
          <li>• Hình có cả hai: vuông, chữ nhật, thoi, tròn, lục giác đều</li>
          <li>• Chỉ có trục: tam giác đều (3), thang cân (1)</li>
          <li>• Chỉ có tâm: hình bình hành thường</li>
          <li>• Không có cả hai: ngũ giác đều, tam giác thường</li>
        </ul>
      </div>
    </div>
  );
}
