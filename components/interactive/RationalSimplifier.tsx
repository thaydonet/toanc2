import { useState, useEffect, useRef } from 'react';

declare const JXG: any;

let _counter = 0;
function uid() { return `jxg-rational-${++_counter}`; }

interface Props {
    height?: number;
}

export default function RationalSimplifier({ height = 380 }: Props) {
    const boardId = useRef(uid());
    const boardRef = useRef<any>(null);
    const holeRef = useRef<any>(null);
    const asymRef = useRef<any>(null);
    const lineRef = useRef<any>(null);
    const [a, setA] = useState(2);

    useEffect(() => {
        const init = () => {
            if (typeof JXG === 'undefined' || !JXG?.JSXGraph) return setTimeout(init, 150);
            if (boardRef.current) return;

            const board = JXG.JSXGraph.initBoard(boardId.current, {
                boundingbox: [-8, 10, 8, -10],
                axis: true, showNavigation: false, showCopyright: false, grid: true,
                defaultAxes: {
                    x: { name: 'x', withLabel: true, label: { position: 'rt', offset: [15, -18], fontSize: 12 } },
                    y: { withLabel: true, name: 'y', label: { position: 'rt', offset: [-20, 10], fontSize: 12 } },
                },
            });
            boardRef.current = board;
            board.__aVal = 2;

            lineRef.current = board.create('functiongraph', [
                (x: number) => x + board.__aVal, -10, 10
            ], { strokeColor: '#2563eb', strokeWidth: 2.5, highlight: false });

            holeRef.current = board.create('point', [2, 4], {
                name: '', size: 7, fillColor: 'white', strokeColor: '#f97316', strokeWidth: 2.5, fixed: true,
            });

            asymRef.current = board.create('line', [[2, -10], [2, 10]], {
                strokeColor: '#ef4444', strokeWidth: 1.5, dash: 2, highlight: false,
            });
        };
        init();
        return () => {
            if (boardRef.current && typeof JXG !== 'undefined') {
                JXG.JSXGraph.freeBoard(boardRef.current);
                boardRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const b = boardRef.current;
        if (!b) return;
        b.__aVal = a;
        b.suspendUpdate();
        holeRef.current?.setPosition(JXG.COORDS_BY_USER, [a, 2 * a]);
        asymRef.current?.point1?.setPosition(JXG.COORDS_BY_USER, [a, -10]);
        asymRef.current?.point2?.setPosition(JXG.COORDS_BY_USER, [a, 10]);
        b.unsuspendUpdate();
    }, [a]);

    const a2 = a * a;
    const sign = a >= 0 ? `+ ${a}` : `− ${Math.abs(a)}`;
    const numStr = a2 === 0 ? 'x^2' : (a2 > 0 ? `x^2 - ${a2}` : `x^2 + ${Math.abs(a2)}`);
    const denStr = a >= 0 ? `x - ${a}` : `x + ${Math.abs(a)}`;

    return (
        <div>
            <div className="jxg-board-wrapper" style={{ marginBottom: '1rem' }}>
                <div id={boardId.current} className="jxgbox" style={{ width: '100%', height: `${height}px` }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '.875rem', fontWeight: 700, display: 'block', marginBottom: '.4rem' }}>
                    Giá trị <em>a</em> = <strong style={{ color: '#2563eb', fontSize: '1.1rem' }}>{a}</strong>
                </label>
                <input type="range" min={-4} max={4} step={0.5} value={a}
                    onChange={e => setA(Number(e.target.value))} />
                <p style={{ fontSize: '.78rem', color: '#64748b', marginTop: '.3rem' }}>
                    Điểm cam ⭕ = điểm không xác định ($x = {a}$) | Đường đỏ nét đứt = tiệm cận đứng
                </p>
            </div>

            <div style={{ padding: '.875rem 1.25rem', borderRadius: '12px', background: '#eff6ff', border: '2px solid #bfdbfe', textAlign: 'center' }}>
                <div style={{ fontSize: '.85rem', color: '#475569', marginBottom: '.4rem' }}>Phân thức đang xét:</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d4ed8' }}>
                    ({numStr}) ÷ ({denStr}) = x {sign} &nbsp; | &nbsp; x ≠ {a}
                </div>
            </div>
        </div>
    );
}
