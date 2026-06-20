import { useEffect, useRef, useState } from 'react';

interface Props {
  a?: number;
  b?: number;
  height?: number;
}

// Unique ID per board instance
let _counter = 0;
function uniqueId() {
  return `jxg-plotter-${++_counter}`;
}

declare const JXG: any; // loaded via CDN script tag in LessonLayout.astro head

export default function FunctionPlotter({ a: initA = 1, b: initB = 0, height = 380 }: Props) {
  const boardId = useRef<string>(uniqueId());
  const boardRef = useRef<any>(null);
  const [a, setA] = useState(initA);
  const [b, setB] = useState(initB);

  useEffect(() => {
    // JXG is set on window by the CDN script loaded in <head>
    if (typeof JXG === 'undefined' || !JXG?.JSXGraph) {
      console.error('JSXGraph (JXG) not available on window. Check that jsxgraphcore.js is loaded before React.');
      return;
    }
    if (boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardId.current, {
      boundingbox: [-7, 9, 7, -9],
      axis: true,
      showNavigation: false,
      showCopyright: false,
      pan: { enabled: true },
      zoom: { enabled: true, wheel: true },
      grid: true,
      defaultAxes: {
        x: { name: 'x', withLabel: true, label: { position: 'rt', offset: [15, -20], fontSize: 13 } },
        y: { withLabel: true, name: 'y', label: { position: 'rt', offset: [-25, 10], fontSize: 13 } },
      },
    });

    boardRef.current = board;
    board.__aVal = initA;
    board.__bVal = initB;

    board.create('functiongraph', [
      (x: number) => board.__aVal * x + board.__bVal, -15, 15
    ], { strokeColor: '#2563eb', strokeWidth: 3, highlight: false });

    // y-intercept point
    board.create('point', [0, initB], {
      name: '', size: 5, fillColor: '#f97316', strokeColor: '#c2410c', fixed: true,
    });

    board.update();

    return () => {
      if (boardRef.current && typeof JXG !== 'undefined') {
        JXG.JSXGraph.freeBoard(boardRef.current);
        boardRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.__aVal = a;
    boardRef.current.__bVal = b;
    boardRef.current.update();
  }, [a, b]);

  const fmtCoef = (v: number, isFirst: boolean) => {
    if (isFirst) return v === 1 ? '' : v === -1 ? '−' : String(v);
    if (v > 0) return ` + ${v}`;
    if (v < 0) return ` − ${Math.abs(v)}`;
    return '';
  };

  return (
    <div>
      <div className="jxg-board-wrapper" style={{ marginBottom: '1rem' }}>
        <div
          id={boardId.current}
          className="jxgbox"
          style={{ width: '100%', height: `${height}px` }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '.875rem', fontWeight: 700, display: 'block', marginBottom: '.4rem' }}>
            Hệ số góc <em>a</em> = <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>{a}</strong>
          </label>
          <input type="range" min={-5} max={5} step={0.5} value={a} onChange={e => setA(Number(e.target.value))} />
          <p style={{ fontSize: '.78rem', color: '#64748b', marginTop: '.3rem' }}>
            {a > 0 ? '📈 Đồ thị tăng' : a < 0 ? '📉 Đồ thị giảm' : '➡️ Đường nằm ngang'}
          </p>
        </div>
        <div>
          <label style={{ fontSize: '.875rem', fontWeight: 700, display: 'block', marginBottom: '.4rem' }}>
            Tung độ gốc <em>b</em> = <strong style={{ color: '#f97316', fontSize: '1.1rem' }}>{b}</strong>
          </label>
          <input type="range" min={-7} max={7} step={0.5} value={b} onChange={e => setB(Number(e.target.value))} />
          <p style={{ fontSize: '.78rem', color: '#64748b', marginTop: '.3rem' }}>Cắt trục Oy tại (0, {b})</p>
        </div>
        <div style={{
          gridColumn: '1/-1', padding: '.875rem 1.25rem', borderRadius: '12px',
          background: '#eff6ff', border: '2px solid #bfdbfe', textAlign: 'center'
        }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8', fontStyle: 'italic' }}>
            y = {a !== 0 ? `${fmtCoef(a, true)}x` : ''}
            {b > 0 ? ` + ${b}` : b < 0 ? ` − ${Math.abs(b)}` : a === 0 ? '0' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
