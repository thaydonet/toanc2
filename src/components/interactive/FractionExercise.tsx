import { useState } from 'react';

interface Exercise {
  id: number;
  fraction1: { num: string; den: string };
  fraction2: { num: string; den: string };
  operation: '+' | '-';
  answer: string;
  steps: string[];
}

const exercises: Exercise[] = [
  {
    id: 1,
    fraction1: { num: '2', den: 'x' },
    fraction2: { num: '3', den: 'x' },
    operation: '+',
    answer: '\\frac{5}{x}',
    steps: [
      'Hai phân thức cùng mẫu',
      '\\frac{2+3}{x} = \\frac{5}{x}'
    ]
  },
  {
    id: 2,
    fraction1: { num: '1', den: 'x-1' },
    fraction2: { num: '1', den: 'x+1' },
    operation: '+',
    answer: '\\frac{2x}{(x-1)(x+1)}',
    steps: [
      'MTC = (x-1)(x+1)',
      '\\frac{x+1}{(x-1)(x+1)} + \\frac{x-1}{(x-1)(x+1)} = \\frac{2x}{(x-1)(x+1)}'
    ]
  },
  {
    id: 3,
    fraction1: { num: 'x', den: 'x-2' },
    fraction2: { num: '2', den: 'x-2' },
    operation: '-',
    answer: '1',
    steps: [
      'Cùng mẫu: \\frac{x-2}{x-2} = 1'
    ]
  },
  {
    id: 4,
    fraction1: { num: '2', den: 'x+1' },
    fraction2: { num: '1', den: 'x-1' },
    operation: '-',
    answer: '\\frac{x-3}{(x+1)(x-1)}',
    steps: [
      'MTC = (x+1)(x-1)',
      '\\frac{2(x-1)}{(x+1)(x-1)} - \\frac{x+1}{(x+1)(x-1)} = \\frac{2x-2-x-1}{(x+1)(x-1)} = \\frac{x-3}{(x+1)(x-1)}'
    ]
  },
  {
    id: 5,
    fraction1: { num: 'x+1', den: 'x-2' },
    fraction2: { num: '3', den: 'x-2' },
    operation: '+',
    answer: '\\frac{x+4}{x-2}',
    steps: [
      'Cùng mẫu: \\frac{x+1+3}{x-2} = \\frac{x+4}{x-2}'
    ]
  }
];

export default function FractionExercise() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const exercise = exercises[currentExercise];

  const checkAnswer = () => {
    const correct = exercise.answer.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)').replace(/\s/g, '');
    const user = userAnswer.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)').replace(/\s/g, '');
    
    if (user === correct || user === exercise.answer.replace(/\\/g, '').replace(/frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
    setShowAnswer(false);
    setUserAnswer('');
    setFeedback(null);
  };

  const prevExercise = () => {
    setCurrentExercise((prev) => (prev - 1 + exercises.length) % exercises.length);
    setShowAnswer(false);
    setUserAnswer('');
    setFeedback(null);
  };

  return (
    <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>Luyện tập cộng trừ phân thức</h3>
        <span style={{ background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
          Bài {currentExercise + 1} / {exercises.length}
        </span>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        border: '2px solid #cbd5e1',
        textAlign: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>{exercise.fraction1.num}</div>
            <div style={{ borderTop: '2px solid #334155', margin: '4px auto', width: '60px' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>{exercise.fraction1.den}</div>
          </div>
          
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: exercise.operation === '+' ? '#22c55e' : '#ef4444' }}>
            {exercise.operation}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>{exercise.fraction2.num}</div>
            <div style={{ borderTop: '2px solid #334155', margin: '4px auto', width: '60px' }} />
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>{exercise.fraction2.den}</div>
          </div>
          
          <div style={{ fontSize: '1.3rem', color: '#64748b' }}>=</div>
          
          <div style={{ minWidth: '120px', textAlign: 'center' }}>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setFeedback(null);
              }}
              placeholder="Nhập kết quả"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: `2px solid ${feedback === 'correct' ? '#22c55e' : feedback === 'incorrect' ? '#ef4444' : '#cbd5e1'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                textAlign: 'center',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          onClick={checkAnswer}
          style={{
            flex: 1,
            padding: '10px',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Kiểm tra
        </button>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            padding: '10px 16px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {showAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
        </button>
      </div>

      {showAnswer && (
        <div style={{ 
          background: '#dbeafe', 
          padding: '1rem', 
          borderRadius: '8px', 
          border: '2px solid #3b82f6',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Đáp án:</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1e40af', textAlign: 'center' }}>
            {exercise.answer}
          </div>
          <div style={{ marginTop: '1rem', borderTop: '1px solid #93c5fd', paddingTop: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', marginBottom: '0.5rem', fontWeight: 600 }}>Các bước giải:</div>
            {exercise.steps.map((step, i) => (
              <div key={i} style={{ fontSize: '0.9rem', color: '#1e40af', marginBottom: '0.25rem' }}>
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ 
          padding: '0.75rem', 
          borderRadius: '8px', 
          textAlign: 'center',
          marginBottom: '1rem',
          background: feedback === 'correct' ? '#dcfce7' : '#fee2e2',
          color: feedback === 'correct' ? '#166534' : '#991b1b',
          fontWeight: 600
        }}>
          {feedback === 'correct' ? '✓ Chính xác!' : '✗ Chưa đúng, thử lại!'}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={prevExercise}
          style={{
            padding: '8px 16px',
            background: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Bài trước
        </button>
        <button
          onClick={nextExercise}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Bài tiếp →
        </button>
      </div>
    </div>
  );
}
