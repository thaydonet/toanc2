import { useState, useCallback } from 'react';

interface Problem {
  a: number;
  b: number;
  operator: '+' | '-';
  answer: number;
}

interface UserAnswer {
  value: string;
  isCorrect: boolean | null;
}

const generateProblem = (type: 'add' | 'subtract' | 'mixed'): Problem => {
  let a: number, b: number, operator: '+' | '-';

  if (type === 'add' || (type === 'mixed' && Math.random() > 0.5)) {
    operator = '+';
    a = Math.floor(Math.random() * 200) + 10;
    b = Math.floor(Math.random() * 200) + 10;
  } else {
    operator = '-';
    a = Math.floor(Math.random() * 300) + 100;
    b = Math.floor(Math.random() * a) + 1;
  }

  return {
    a,
    b,
    operator,
    answer: operator === '+' ? a + b : a - b,
  };
};

const generateQuickMentalProblem = (): Problem => {
  const techniques = [
    () => {
      // a + b where a + b = round number
      const base = Math.floor(Math.random() * 8) + 2;
      const a = base * 10 + Math.floor(Math.random() * 9) + 1;
      const b = (10 - (a % 10)) + Math.floor(Math.random() * 10);
      return { a, b, operator: '+' as const, answer: a + b };
    },
    () => {
      // a - b where we can use "add then subtract"
      const a = Math.floor(Math.random() * 200) + 100;
      const b = Math.floor(Math.random() * 30) + 40;
      return { a, b, operator: '-' as const, answer: a - b };
    },
    () => {
      // Simple grouping
      const a = Math.floor(Math.random() * 150) + 50;
      const b = Math.floor(Math.random() * 150) + 50;
      return { a, b, operator: '+' as const, answer: a + b };
    },
  ];

  return techniques[Math.floor(Math.random() * techniques.length)]();
};

export default function PhepCongTruInteractive() {
  const [activeTab, setActiveTab] = useState<'practice' | 'quick' | 'findX'>('practice');
  const [problem, setProblem] = useState<Problem>(() => generateProblem('mixed'));
  const [userAnswer, setUserAnswer] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [quickProblem, setQuickProblem] = useState<Problem>(() => generateQuickMentalProblem());
  const [quickAnswer, setQuickAnswer] = useState<UserAnswer>({ value: '', isCorrect: null });

  // Find X state
  const [findXProblem, setFindXProblem] = useState(() => {
    const a = Math.floor(Math.random() * 100) + 20;
    const b = Math.floor(Math.random() * 100) + 20;
    const type = Math.random() > 0.5 ? 'add' : 'subtract';
    if (type === 'add') {
      return { a, b, type: 'add' as const, x: a, known: b, result: a + b };
    } else {
      const result = a + b;
      return { a: result, b, type: 'subtract' as const, x: a, known: b, result };
    }
  });
  const [findXAnswer, setFindXAnswer] = useState<UserAnswer>({ value: '', isCorrect: null });

  const checkAnswer = useCallback(() => {
    const parsed = parseFloat(userAnswer.value);
    const isCorrect = !isNaN(parsed) && parsed === problem.answer;
    setUserAnswer({ ...userAnswer, isCorrect });
    if (isCorrect) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, [userAnswer, problem]);

  const nextProblem = useCallback(() => {
    setProblem(generateProblem('mixed'));
    setUserAnswer({ value: '', isCorrect: null });
  }, []);

  const checkQuickAnswer = useCallback(() => {
    const parsed = parseFloat(quickAnswer.value);
    const isCorrect = !isNaN(parsed) && parsed === quickProblem.answer;
    setQuickAnswer({ ...quickAnswer, isCorrect });
    if (isCorrect) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, [quickAnswer, quickProblem]);

  const nextQuickProblem = useCallback(() => {
    setQuickProblem(generateQuickMentalProblem());
    setQuickAnswer({ value: '', isCorrect: null });
  }, []);

  const checkFindXAnswer = useCallback(() => {
    const parsed = parseFloat(findXAnswer.value);
    const isCorrect = !isNaN(parsed) && parsed === findXProblem.x;
    setFindXAnswer({ ...findXAnswer, isCorrect });
    if (isCorrect) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, [findXAnswer, findXProblem]);

  const nextFindXProblem = useCallback(() => {
    const a = Math.floor(Math.random() * 100) + 20;
    const b = Math.floor(Math.random() * 100) + 20;
    const type = Math.random() > 0.5 ? 'add' as const : 'subtract' as const;
    if (type === 'add') {
      setFindXProblem({ a, b, type, x: a, known: b, result: a + b });
    } else {
      const result = a + b;
      setFindXProblem({ a: result, b, type, x: a, known: b, result });
    }
    setFindXAnswer({ value: '', isCorrect: null });
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent, checkFn: () => void) => {
    if (e.key === 'Enter') checkFn();
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
        🧮 Thực hành: Phép cộng và phép trừ
      </h3>

      {/* Score display */}
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>

      {/* Tab navigation */}
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
          ⚡ Tính nhanh
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

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-2">Thực hiện phép tính:</p>
            <div className="text-3xl font-mono font-bold text-blue-700">
              {problem.a} {problem.operator} {problem.b} = ?
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={userAnswer.value}
              onChange={(e) => setUserAnswer({ ...userAnswer, value: e.target.value, isCorrect: null })}
              onKeyDown={(e) => handleKeyPress(e, checkAnswer)}
              className="w-40 text-center text-2xl font-mono border-2 border-blue-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
              placeholder="?"
              disabled={userAnswer.isCorrect !== null}
            />

            <div className="flex gap-3">
              {userAnswer.isCorrect === null ? (
                <button
                  onClick={checkAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  onClick={nextProblem}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Câu tiếp →
                </button>
              )}
            </div>

            {userAnswer.isCorrect !== null && (
              <div className={`text-center p-3 rounded-lg ${
                userAnswer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {userAnswer.isCorrect ? (
                  <p className="font-bold">✅ Chính xác! Hoàn hảo!</p>
                ) : (
                  <p className="font-bold">❌ Sai rồi! Đáp án đúng là: {problem.answer}</p>
                )}
              </div>
            )}
          </div>

          {/* Properties reminder */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">💡 Mẹo:</p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Phép cộng có tính chất giao hoán: a + b = b + a</li>
              <li>• Nhóm các số có tổng tròn chục, tròn trăm để tính nhanh</li>
              <li>• Phép trừ là phép ngược lại của phép cộng</li>
            </ul>
          </div>
        </div>
      )}

      {/* Quick Mental Math Tab */}
      {activeTab === 'quick' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-2">Tính nhanh (không dùng giấy bút):</p>
            <div className="text-3xl font-mono font-bold text-green-700">
              {quickProblem.a} {quickProblem.operator} {quickProblem.b} = ?
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={quickAnswer.value}
              onChange={(e) => setQuickAnswer({ ...quickAnswer, value: e.target.value, isCorrect: null })}
              onKeyDown={(e) => handleKeyPress(e, checkQuickAnswer)}
              className="w-40 text-center text-2xl font-mono border-2 border-green-300 rounded-lg p-3 focus:outline-none focus:border-green-500"
              placeholder="?"
              disabled={quickAnswer.isCorrect !== null}
            />

            <div className="flex gap-3">
              {quickAnswer.isCorrect === null ? (
                <button
                  onClick={checkQuickAnswer}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  onClick={nextQuickProblem}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Câu tiếp →
                </button>
              )}
            </div>

            {quickAnswer.isCorrect !== null && (
              <div className={`text-center p-3 rounded-lg ${
                quickAnswer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {quickAnswer.isCorrect ? (
                  <p className="font-bold">✅ Tuyệt vời! Tính rất nhanh!</p>
                ) : (
                  <p className="font-bold">❌ Đáp án đúng là: {quickProblem.answer}</p>
                )}
              </div>
            )}
          </div>

          {/* Quick mental math techniques */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 font-medium mb-2">⚡ Kỹ thuật tính nhanh:</p>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>Kỹ thuật 1:</strong> Nhóm số có tổng tròn</p>
              <p className="ml-2">Ví dụ: 27 + 73 = 100</p>
              <p><strong>Kỹ thuật 2:</strong> Thêm rồi bớt</p>
              <p className="ml-2">Ví dụ: 99 + 45 = 100 + 45 - 1 = 144</p>
              <p><strong>Kỹ thuật 3:</strong> Tách số</p>
              <p className="ml-2">Ví dụ: 156 - 28 = 156 - 30 + 2 = 128</p>
            </div>
          </div>
        </div>
      )}

      {/* Find X Tab */}
      {activeTab === 'findX' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-2">Tìm số chưa biết:</p>
            <div className="text-3xl font-mono font-bold text-purple-700">
              {findXProblem.type === 'add' ? (
                <>x + {findXProblem.known} = {findXProblem.result}</>
              ) : (
                <>{findXProblem.a} - x = {findXProblem.known}</>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <input
              type="number"
              value={findXAnswer.value}
              onChange={(e) => setFindXAnswer({ ...findXAnswer, value: e.target.value, isCorrect: null })}
              onKeyDown={(e) => handleKeyPress(e, checkFindXAnswer)}
              className="w-40 text-center text-2xl font-mono border-2 border-purple-300 rounded-lg p-3 focus:outline-none focus:border-purple-500"
              placeholder="x = ?"
              disabled={findXAnswer.isCorrect !== null}
            />

            <div className="flex gap-3">
              {findXAnswer.isCorrect === null ? (
                <button
                  onClick={checkFindXAnswer}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Kiểm tra
                </button>
              ) : (
                <button
                  onClick={nextFindXProblem}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Câu tiếp →
                </button>
              )}
            </div>

            {findXAnswer.isCorrect !== null && (
              <div className={`text-center p-3 rounded-lg ${
                findXAnswer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {findXAnswer.isCorrect ? (
                  <p className="font-bold">✅ Đúng rồi! x = {findXProblem.x}</p>
                ) : (
                  <div className="font-bold">
                    <p>❌ Sai rồi!</p>
                    <p className="mt-1">
                      {findXProblem.type === 'add' 
                        ? `x = ${findXProblem.result} - ${findXProblem.known} = ${findXProblem.x}`
                        : `x = ${findXProblem.a} - ${findXProblem.known} = ${findXProblem.x}`
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Find X explanation */}
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800 font-medium mb-2">🔍 Cách tìm x:</p>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>Trường hợp 1:</strong> a + x = b → x = b - a</p>
              <p><strong>Trường hợp 2:</strong> a - x = b → x = a - b</p>
              <p><strong>Trường hợp 3:</strong> x + a = b → x = b - a</p>
              <p className="mt-2 italic">Sử dụng mối liên hệ giữa cộng và trừ để tìm x</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
