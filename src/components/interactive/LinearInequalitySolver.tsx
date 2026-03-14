import React, { useState } from 'react';

export default function LinearInequalitySolver() {
    const [a, setA] = useState<number>(2);
    const [b, setB] = useState<number>(3);
    const [operator, setOperator] = useState<string>('>');
    const [c, setC] = useState<number>(7);

    const [solution, setSolution] = useState<string | null>(null);
    const [steps, setSteps] = useState<string[]>([]);

    const solveInequality = () => {
        const newC = c - b;
        const step1 = `${a}x ${operator} ${c} - ${b}`;
        const step2 = `${a}x ${operator} ${newC}`;

        let step3 = '';
        let res = '';

        if (a === 0) {
            let isTrue = false;
            if (operator === '>') isTrue = 0 > newC;
            if (operator === '<') isTrue = 0 < newC;
            if (operator === '>=') isTrue = 0 >= newC;
            if (operator === '<=') isTrue = 0 <= newC;

            if (isTrue) {
                step3 = `0 ${operator} ${newC} (Luôn đúng)`;
                res = 'Bất phương trình nghiệm đúng với mọi x ∈ ℝ';
            } else {
                step3 = `0 ${operator} ${newC} (Vô lý)`;
                res = 'Bất phương trình vô nghiệm';
            }
            setSteps([step1, step2, step3]);
            setSolution(res);
            return;
        }

        const val = newC / a;
        let finalOp = operator;
        if (a < 0) {
            if (operator === '>') finalOp = '<';
            else if (operator === '<') finalOp = '>';
            else if (operator === '>=') finalOp = '<=';
            else if (operator === '<=') finalOp = '>=';
            step3 = `x ${finalOp} ${newC} / (${a}) (Đổi chiều bđt do chia số âm)`;
        } else {
            step3 = `x ${finalOp} ${newC} / ${a} (Giữ nguyên chiều bđt)`;
        }

        res = `x ${finalOp} ${val}`;
        setSteps([step1, step2, step3]);
        setSolution(res);
    };

    return (
        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-sm my-6">
            <h4 className="text-xl font-bold text-green-800 mb-4 text-center">⚖️ Luyện tập giải Bất phương trình ax + b &gt; c</h4>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg flex flex-wrap items-center gap-2">
                    <input type="number" value={a} onChange={e => setA(Number(e.target.value))} className="w-16 p-2 border rounded text-center text-lg font-bold" />
                    <span className="text-xl font-bold">x +</span>
                    <input type="number" value={b} onChange={e => setB(Number(e.target.value))} className="w-16 p-2 border rounded text-center text-lg font-bold" />

                    <select
                        value={operator}
                        onChange={e => setOperator(e.target.value)}
                        className="p-2 border rounded text-center text-lg font-bold mx-2 bg-white"
                    >
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&ge;</option>
                        <option value="<=">&le;</option>
                    </select>

                    <input type="number" value={c} onChange={e => setC(Number(e.target.value))} className="w-16 p-2 border rounded text-center text-lg font-bold" />
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <button
                    onClick={solveInequality}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full transition-colors text-lg"
                >
                    Giải từng bước
                </button>
            </div>

            {solution && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-4 w-full md:w-3/4 mx-auto">
                    <h5 className="font-bold text-blue-800 mb-3 text-lg">📝 Các bước giải:</h5>
                    <div className="space-y-2 mb-4 font-mono">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-3 items-center">
                                <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">{index + 1}</span>
                                <span className="text-lg">=&gt; {step}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-200">
                        <h5 className="font-bold text-green-700 mb-1">Kết luận tập nghiệm:</h5>
                        <p className="text-green-900 font-bold text-2xl text-center">{solution}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
