import { useEffect, useRef, useState } from 'react';

interface Props { height?: number }

export default function TriangleBoard({ height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  const [info, setInfo] = useState({ AB: 0, BC: 0, CA: 0, angleA: 0, angleB: 0, angleC: 0 });

  useEffect(() => {
    // @ts-ignore
    import('jsxgraph').then(({ JXG }) => {
      if (!containerRef.current || boardRef.current) return;
      const board = JXG.JSXGraph.initBoard(containerRef.current, {
        boundingbox: [-5, 6, 9, -4], axis: false,
        showNavigation: false, showCopyright: false,
        grid: true, pan: { enabled: false }, zoom: { enabled: false },
      });
      boardRef.current = board;

      const A = board.create('point', [0, 0], {
        name: 'A', size: 6, fillColor: '#ef4444', strokeColor: '#b91c1c',
        label: { fontSize: 15, fontWeight: 'bold', color: '#b91c1c', offset: [-18,-5] }
      });
      const B = board.create('point', [6, 0], {
        name: 'B', size: 6, fillColor: '#2563eb', strokeColor: '#1d4ed8',
        label: { fontSize: 15, fontWeight: 'bold', color: '#1d4ed8', offset: [5,-5] }
      });
      const C = board.create('point', [3, 5], {
        name: 'C', size: 6, fillColor: '#16a34a', strokeColor: '#15803d',
        label: { fontSize: 15, fontWeight: 'bold', color: '#15803d', offset: [0,10] }
      });

      board.create('segment', [A, B], { strokeColor: '#1e293b', strokeWidth: 2.5 });
      board.create('segment', [B, C], { strokeColor: '#1e293b', strokeWidth: 2.5 });
      board.create('segment', [C, A], { strokeColor: '#1e293b', strokeWidth: 2.5 });

      board.create('angle', [B, A, C], { radius: .7, strokeColor: '#ef4444', fillColor: 'rgba(239,68,68,0.12)', name: 'α', label: { fontSize: 12, color: '#ef4444' } });
      board.create('angle', [C, B, A], { radius: .7, strokeColor: '#2563eb', fillColor: 'rgba(37,99,235,0.12)',  name: 'β', label: { fontSize: 12, color: '#2563eb' } });
      board.create('angle', [A, C, B], { radius: .7, strokeColor: '#16a34a', fillColor: 'rgba(22,163,74,0.12)',  name: 'γ', label: { fontSize: 12, color: '#16a34a' } });

      // Median from A
      const mBC = board.create('midpoint', [B, C], { visible: false });
      board.create('segment', [A, mBC], { strokeColor: '#a855f7', strokeWidth: 1.5, dash: 2 });

      const dist = (p1: any, p2: any) => Math.sqrt((p1.X()-p2.X())**2 + (p1.Y()-p2.Y())**2);
      const round1 = (v: number) => Math.round(v * 10) / 10;

      const update = () => {
        const ab = dist(A,B), bc = dist(B,C), ca = dist(C,A);
        const aA = Math.acos(Math.max(-1, Math.min(1, (ab**2 + ca**2 - bc**2) / (2*ab*ca)))) * 180/Math.PI;
        const aB = Math.acos(Math.max(-1, Math.min(1, (ab**2 + bc**2 - ca**2) / (2*ab*bc)))) * 180/Math.PI;
        setInfo({ AB: round1(ab), BC: round1(bc), CA: round1(ca), angleA: round1(aA), angleB: round1(aB), angleC: round1(180-aA-aB) });
      };

      A.on('drag', update); B.on('drag', update); C.on('drag', update);
      update();
    });
    return () => {
      // @ts-ignore
      if (boardRef.current) import('jsxgraph').then(({ JXG }) => {
        JXG.JSXGraph.freeBoard(boardRef.current);
        boardRef.current = null;
      });
    };
  }, []);

  const sum = info.angleA + info.angleB + info.angleC;
  const sumOk = sum >= 179.5 && sum <= 180.5;

  return (
    <div>
      <div className="jxg-board-wrapper" style={{ marginBottom: '1rem' }}>
        <div ref={containerRef} style={{ width: '100%', height: `${height}px` }} />
      </div>
      <p style={{ fontSize: '.85rem', color: '#64748b', textAlign: 'center', marginBottom: '.75rem' }}>
        💡 Kéo đỉnh A, B, C để khám phá tính chất tam giác
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
        <div style={{ padding: '.875rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '.5rem' }}>Độ dài cạnh</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', fontSize: '.9rem' }}>
            <span>AB = <strong>{info.AB}</strong></span>
            <span>BC = <strong>{info.BC}</strong></span>
            <span>CA = <strong>{info.CA}</strong></span>
          </div>
        </div>
        <div style={{ padding: '.875rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '.5rem' }}>Góc (°)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.3rem', fontSize: '.9rem' }}>
            <span style={{ color: '#ef4444' }}>∠A = <strong>{info.angleA}°</strong></span>
            <span style={{ color: '#2563eb' }}>∠B = <strong>{info.angleB}°</strong></span>
            <span style={{ color: '#16a34a' }}>∠C = <strong>{info.angleC}°</strong></span>
          </div>
        </div>
        <div style={{
          gridColumn: '1/-1', padding: '.875rem 1.25rem', borderRadius: '10px', textAlign: 'center',
          background: sumOk ? '#dcfce7' : '#fff7ed',
          border: `2px solid ${sumOk ? '#86efac' : '#fed7aa'}`
        }}>
          <strong>∠A + ∠B + ∠C = {Math.round(sum * 10)/10}° {sumOk ? '✅ ≈ 180°' : ''}</strong>
          <p style={{ fontSize: '.8rem', color: '#64748b', marginTop: '.25rem' }}>
            Tổng ba góc trong tam giác luôn bằng <strong>180°</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
