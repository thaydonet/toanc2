import { useState, useCallback } from 'react';

interface Problem {
  text: string;
  answer: string;
  hint?: string;
}

interface UserAnswer {
  value: string;
  isCorrect: boolean | null;
}

const gcd = (a: number, b: number): number => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
};

const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const simplify = (n: number, d: number): [number, number] => {
  if (d === 0) return [n, d];
  const g = gcd(n, d);
  let sn = n / g, sd = d / g;
  if (sd < 0) { sn = -sn; sd = -sd; }
  return [sn, sd];
};

const fracToStr = (n: number, d: number) => {
  const [sn, sd] = simplify(n, d);
  if (sd === 1) return `${sn}`;
  return `\\frac{${sn}}{${sd}}`;
};

const generatePractice = (): Problem => {
  const topics = ['rut_gon', 'so_sanh', 'cong_tru', 'nhan_chia', 'phan_so_am'];
  const topic = pick(topics);

  if (topic === 'rut_gon') {
    const n = randInt(2, 36); const d = randInt(2, 36);
    const [rn, rd] = simplify(n, d);
    return { text: `Rút gọn ${fracToStr(n, d)}`, answer: rd === 1 ? `${rn}` : `${rn}/${rd}`, hint: `ƯCLN(${n},${d})=${gcd(n,d)}.` };
  } else if (topic === 'so_sanh') {
    const a = randInt(1, 7); const b = randInt(2, 9);
    const c = randInt(1, 7); const d = randInt(2, 9);
    const cmp = a * d > b * c ? '>' : a * d < b * c ? '<' : '=';
    return { text: `So sánh ${fracToStr(a,b)} và ${fracToStr(c,d)}`, answer: cmp, hint: `${a}×${d}=${a*d} và ${c}×${b}=${c*b}.` };
  } else if (topic === 'cong_tru') {
    const a = randInt(1, 5); const b = randInt(1, 5);
    const d = randInt(3, 10);
    const [rn, rd] = simplify(a + b, d);
    return { text: `Tính ${fracToStr(a,d)} + ${fracToStr(b,d)}`, answer: rd === 1 ? `${rn}` : `${rn}/${rd}`, hint: `Cộng tử: ${a}+${b}=${a+b}.` };
  } else if (topic === 'nhan_chia') {
    const a = randInt(1, 5); const b = randInt(2, 7);
    const c = randInt(1, 5); const d = randInt(2, 7);
    const [rn, rd] = simplify(a * c, b * d);
    return { text: `Tính ${fracToStr(a,b)} × ${fracToStr(c,d)}`, answer: rd === 1 ? `${rn}` : `${rn}/${rd}`, hint: `Tử×tử=${a*c}, mẫu×mẫu=${b*d}.` };
  } else {
    const a = randInt(1, 5); const b = randInt(2, 7);
    return { text: `${fracToStr(-a, b)} là phân số: (1=dương, 2=âm)`, answer: '2', hint: `Tử âm, mẫu dương → phân số âm.` };
  }
};

const generateQuick = (): Problem => {
  const topics = ['hon_so', 'nghich_dao', 'quy_dong', 'tim_phan_so'];
  const topic = pick(topics);

  if (topic === 'hon_so') {
    const mixed = randInt(1, 4); const num = randInt(1, 5); const den = randInt(2, 8);
    return { text: `Đổi ${mixed}\\frac{${num}}{${den}} thành phân số`, answer: `${mixed*den+num}/${den}`, hint: `${mixed}×${den}+${num}=${mixed*den+num}.` };
  } else if (topic === 'nghich_dao') {
    const a = randInt(1, 8); const b = randInt(2, 9);
    return { text: `Nghịch đảo của ${fracToStr(a,b)} là?`, answer: b === 1 ? `${a}` : `${b}/${a}`, hint: `Đảo tử và mẫu.` };
  } else if (topic === 'quy_dong') {
    const a = randInt(1, 3); const b = randInt(2, 5);
    const l = lcm(a, b);
    return { text: `BCNN(${a},${b}) = ?`, answer: `${l}`, hint: `BCNN(${a},${b})=${l}.` };
  } else {
    const a = randInt(1, 5); const b = randInt(2, 8);
    const result = randInt(2, 10) * a;
    const whole = result * b / a;
    return { text: `${fracToStr(a,b)} của x = ${result}. x = ?`, answer: `${whole}`, hint: `x = ${result} × ${fracToStr(b,a)}.` };
  }
};

const generateFindX = (): Problem => {
  const type = randInt(0, 2);
  if (type === 0) {
    const d = randInt(3, 10); const a = randInt(1, d - 2); const b = randInt(1, d - a);
    return { text: `Tìm x: ${fracToStr(a,d)} + x = ${fracToStr(a+b,d)}`, answer: `${b}/${d}`, hint: `x = ${fracToStr(b,d)}.` };
  } else if (type === 1) {
    const a = randInt(1, 5); const b = randInt(2, 7);
    const c = randInt(1, 5); const d = randInt(2, 7);
    const [rn, rd] = simplify(c * b, d * a);
    return { text: `Tìm x: ${fracToStr(a,b)} × x = ${fracToStr(c,d)}`, answer: rd === 1 ? `${rn}` : `${rn}/${rd}`, hint: `x = ${fracToStr(c,d)} ÷ ${fracToStr(a,b)}.` };
  } else {
    const a = randInt(1, 4); const b = randInt(2, 6);
    const result = randInt(2, 10);
    return { text: `Tìm x: ${fracToStr(a,b)} × x = ${result}`, answer: `${result*b}/${a}`, hint: `x = ${result} × ${fracToStr(b,a)}.` };
  }
};

export default function OnTapChuong6PhanSoInteractive() {
  const [activeTab, setActiveTab] = useState<'practice' | 'quick' | 'findX'>('practice');
  const [practice, setPractice] = useState<Problem>(() => generatePractice());
  const [practiceAns, setPracticeAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [quick, setQuick] = useState<Problem>(() => generateQuick());
  const [quickAns, setQuickAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [findX, setFindX] = useState<Problem>(() => generateFindX());
  const [findXAns, setFindXAns] = useState<UserAnswer>({ value: '', isCorrect: null });
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const checkAnswer = useCallback((problem: Problem, answer: UserAnswer, setAnswer: (a: UserAnswer) => void) => {
    const userVal = answer.value.trim();
    const correct = userVal === problem.answer;
    setAnswer({ ...answer, isCorrect: correct });
    if (correct) setScore(s => s + 1);
    setTotalAttempts(t => t + 1);
  }, []);

  const nextPractice = () => { setPractice(generatePractice()); setPracticeAns({ value: '', isCorrect: null }); };
  const nextQuick = () => { setQuick(generateQuick()); setQuickAns({ value: '', isCorrect: null }); };
  const nextFindX = () => { setFindX(generateFindX()); setFindXAns({ value: '', isCorrect: null }); };

  const handleKeyPress = (e: React.KeyboardEvent, fn: () => void) => { if (e.key === 'Enter') fn(); };

  const renderProblem = (title: string, color: string, problem: Problem, answer: UserAnswer, setAnswer: (a: UserAnswer) => void, onCheck: () => void, onNext: () => void, placeholder?: string) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">{title}</p>
        <div className="text-2xl font-mono font-bold" style={{ color }}>{problem.text}</div>
        {problem.hint && <p className="text-sm text-gray-400 mt-2">💡 {problem.hint}</p>}
      </div>
      <div className="flex flex-col items-center gap-4">
        <input type="text" value={answer.value} onChange={(e) => setAnswer({ ...answer, value: e.target.value, isCorrect: null })}
          onKeyDown={(e) => handleKeyPress(e, onCheck)} className="w-48 text-center text-xl font-mono border-2 rounded-lg p-3 focus:outline-none"
          style={{ borderColor: color + '88' }} placeholder={placeholder || '?'} disabled={answer.isCorrect !== null} />
        <div className="flex gap-3">
          {answer.isCorrect === null ? (
            <button onClick={onCheck} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>Kiểm tra</button>
          ) : (
            <button onClick={onNext} className="px-6 py-2 text-white rounded-lg font-medium" style={{ background: color }}>Câu tiếp →</button>
          )}
        </div>
        {answer.isCorrect !== null && (
          <div className={`text-center p-3 rounded-lg ${answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {answer.isCorrect ? <p className="font-bold">✅ Chính xác! Đáp án: {problem.answer}</p> : <p className="font-bold">❌ Đáp án đúng: {problem.answer}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-violet-100 rounded-2xl p-6 my-6 shadow-lg">
      <h3 className="text-xl font-bold text-indigo-900 mb-4 text-center">
        🧮 Ôn tập Chương 6: Phân số
      </h3>
      <div className="flex justify-center gap-4 mb-4">
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">Điểm: </span>
          <span className="font-bold text-green-600">{score}</span>
          <span className="text-gray-400">/{totalAttempts}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button onClick={() => setActiveTab('practice')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'practice' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}>✏️ Tổng hợp</button>
        <button onClick={() => setActiveTab('quick')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'quick' ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-violet-600 hover:bg-violet-100'}`}>⚡ Nhanh</button>
        <button onClick={() => setActiveTab('findX')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'findX' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-purple-600 hover:bg-purple-100'}`}>🔍 Tìm x</button>
      </div>
      {activeTab === 'practice' && renderProblem('Ôn tập tổng hợp:', '#4f46e5', practice, practiceAns, setPracticeAns, () => checkAnswer(practice, practiceAns, setPracticeAns), nextPractice)}
      {activeTab === 'quick' && renderProblem('Tính nhanh:', '#7c3aed', quick, quickAns, setQuickAns, () => checkAnswer(quick, quickAns, setQuickAns), nextQuick)}
      {activeTab === 'findX' && renderProblem('Tìm x:', '#9333ea', findX, findXAns, setFindXAns, () => checkAnswer(findX, findXAns, setFindXAns), nextFindX)}
      <div className="mt-6 p-4 bg-white/60 rounded-lg">
        <p className="text-sm text-indigo-900 font-medium mb-2">💡 Kiến thức Chương 6:</p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Phân số a/b, a=b≠0, tối giản khi ƯCLN=1</li>
          <li>• Quy đồng: tìm BCNN của các mẫu</li>
          <li>• Cộng/Trừ: quy đồng rồi cộng/trừ tử</li>
          <li>• Nhân: tử×tử, mẫu×mẫu | Chia: nhân nghịch đảo</li>
        </ul>
      </div>
    </div>
  );
}
