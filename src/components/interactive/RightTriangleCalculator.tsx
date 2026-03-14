import React, { useState } from 'react';

export default function RightTriangleCalculator() {
    const [inputs, setInputs] = useState({ b: '', c: '', a: '', angleB: '', angleC: '' });
    const [result, setResult] = useState<{ b: string, c: string, a: string, angleB: string, angleC: string, steps: string[] } | null>(null);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const calculate = () => {
        setError('');
        let b = parseFloat(inputs.b);
        let c = parseFloat(inputs.c);
        let a = parseFloat(inputs.a);
        let angleB = parseFloat(inputs.angleB);
        let angleC = parseFloat(inputs.angleC);

        const rad = (deg: number) => (deg * Math.PI) / 180;
        const deg = (rad: number) => (rad * 180) / Math.PI;

        let sidesCount = (!isNaN(b) ? 1 : 0) + (!isNaN(c) ? 1 : 0) + (!isNaN(a) ? 1 : 0);
        let anglesCount = (!isNaN(angleB) ? 1 : 0) + (!isNaN(angleC) ? 1 : 0);

        if (sidesCount + anglesCount < 2) {
            setError('Vui lòng nhập ít nhất 2 thông số (ít nhất 1 cạnh).');
            return;
        }
        if (sidesCount === 0) {
            setError('Cần biết ít nhất độ dài 1 cạnh để tính được các cạnh còn lại của tam giác vuông.');
            return;
        }

        let steps: string[] = [];

        try {
            if (!isNaN(angleB) && !isNaN(angleC)) {
                if (Math.abs(angleB + angleC - 90) > 0.1) {
                    throw new Error('Tổng hai góc nhọn phải bằng 90 độ.');
                }
            }

            if (!isNaN(b) && !isNaN(c)) {
                steps.push(`Biết 2 cạnh góc vuông b=${b}, c=${c}.`);
                a = Math.sqrt(b * b + c * c);
                steps.push(`- Tính cạnh huyền a (Pytago): a = √(b² + c²) = √(${b}² + ${c}²) = ${a.toFixed(2)}`);
                angleB = deg(Math.atan(b / c));
                steps.push(`- Tính góc B: tan(B) = b/c = ${b}/${c}  => B ≈ ${angleB.toFixed(2)}°`);
                angleC = 90 - angleB;
                steps.push(`- Tính góc C: C = 90° - B = ${angleC.toFixed(2)}°`);
            } else if (!isNaN(b) && !isNaN(a)) {
                if (b >= a) throw new Error('Cạnh góc vuông phải nhỏ hơn cạnh huyền.');
                steps.push(`Biết cạnh góc vuông b=${b} và cạnh huyền a=${a}.`);
                c = Math.sqrt(a * a - b * b);
                steps.push(`- Tính cạnh góc vuông c (Pytago): c = √(a² - b²) = ${c.toFixed(2)}`);
                angleB = deg(Math.asin(b / a));
                steps.push(`- Tính góc B: sin(B) = b/a = ${b}/${a} => B ≈ ${angleB.toFixed(2)}°`);
                angleC = 90 - angleB;
                steps.push(`- Tính góc C: C = 90° - B = ${angleC.toFixed(2)}°`);
            } else if (!isNaN(c) && !isNaN(a)) {
                if (c >= a) throw new Error('Cạnh góc vuông phải nhỏ hơn cạnh huyền.');
                steps.push(`Biết cạnh góc vuông c=${c} và cạnh huyền a=${a}.`);
                b = Math.sqrt(a * a - c * c);
                steps.push(`- Tính cạnh góc vuông b (Pytago): b = √(a² - c²) = ${b.toFixed(2)}`);
                angleC = deg(Math.asin(c / a));
                steps.push(`- Tính góc C: sin(C) = c/a = ${c}/${a} => C ≈ ${angleC.toFixed(2)}°`);
                angleB = 90 - angleC;
                steps.push(`- Tính góc B: B = 90° - C = ${angleB.toFixed(2)}°`);
            } else if (!isNaN(angleB) && !isNaN(a)) {
                steps.push(`Biết góc B=${angleB}° và cạnh huyền a=${a}.`);
                angleC = 90 - angleB;
                steps.push(`- Tính góc C: C = 90° - B = ${angleC.toFixed(2)}°`);
                b = a * Math.sin(rad(angleB));
                steps.push(`- Tính cạnh b: b = a * sin(B) = ${a} * sin(${angleB}°) ≈ ${b.toFixed(2)}`);
                c = a * Math.cos(rad(angleB));
                steps.push(`- Tính cạnh c: c = a * cos(B) = ${a} * cos(${angleB}°) ≈ ${c.toFixed(2)}`);
            } else if (!isNaN(angleC) && !isNaN(a)) {
                steps.push(`Biết góc C=${angleC}° và cạnh huyền a=${a}.`);
                angleB = 90 - angleC;
                steps.push(`- Tính góc B: B = 90° - C = ${angleB.toFixed(2)}°`);
                c = a * Math.sin(rad(angleC));
                steps.push(`- Tính cạnh c: c = a * sin(C) = ${a} * sin(${angleC}°) ≈ ${c.toFixed(2)}`);
                b = a * Math.cos(rad(angleC));
                steps.push(`- Tính cạnh b: b = a * cos(C) = ${a} * cos(${angleC}°) ≈ ${b.toFixed(2)}`);
            } else if (!isNaN(angleB) && !isNaN(b)) {
                steps.push(`Biết góc B=${angleB}° và cạnh đối b=${b}.`);
                angleC = 90 - angleB;
                steps.push(`- Tính góc C: C = 90° - B = ${angleC.toFixed(2)}°`);
                a = b / Math.sin(rad(angleB));
                steps.push(`- Tính cạnh huyền a: a = b / sin(B) ≈ ${a.toFixed(2)}`);
                c = b / Math.tan(rad(angleB));
                steps.push(`- Tính cạnh góc vuông c: c = b / tan(B) ≈ ${c.toFixed(2)}`);
            } else if (!isNaN(angleC) && !isNaN(c)) {
                steps.push(`Biết góc C=${angleC}° và cạnh đối c=${c}.`);
                angleB = 90 - angleC;
                steps.push(`- Tính góc B: B = 90° - C = ${angleB.toFixed(2)}°`);
                a = c / Math.sin(rad(angleC));
                steps.push(`- Tính cạnh huyền a: a = c / sin(C) ≈ ${a.toFixed(2)}`);
                b = c / Math.tan(rad(angleC));
                steps.push(`- Tính cạnh góc vuông b: b = c / tan(C) ≈ ${b.toFixed(2)}`);
            } else if (!isNaN(angleB) && !isNaN(c)) {
                steps.push(`Biết góc B=${angleB}° và cạnh kề c=${c}.`);
                angleC = 90 - angleB;
                steps.push(`- Tính góc C: C = 90° - B = ${angleC.toFixed(2)}°`);
                b = c * Math.tan(rad(angleB));
                steps.push(`- Tính cạnh góc vuông b: b = c * tan(B) ≈ ${b.toFixed(2)}`);
                a = c / Math.cos(rad(angleB));
                steps.push(`- Tính cạnh huyền a: a = c / cos(B) ≈ ${a.toFixed(2)}`);
            } else if (!isNaN(angleC) && !isNaN(b)) {
                steps.push(`Biết góc C=${angleC}° và cạnh kề b=${b}.`);
                angleB = 90 - angleC;
                steps.push(`- Tính góc B: B = 90° - C = ${angleB.toFixed(2)}°`);
                c = b * Math.tan(rad(angleC));
                steps.push(`- Tính cạnh góc vuông c: c = b * tan(C) ≈ ${c.toFixed(2)}`);
                a = b / Math.cos(rad(angleC));
                steps.push(`- Tính cạnh huyền a: a = b / cos(C) ≈ ${a.toFixed(2)}`);
            }

            // Check results logic: Angle between 0 and 90, side > 0
            if (a <= 0 || b <= 0 || c <= 0) throw new Error("Cạnh tam giác phải nhận giá trị dương.");
            if (angleB <= 0 || angleB >= 90 || angleC <= 0 || angleC >= 90) throw new Error("Góc nhọn phải lớn hơn 0 và nhỏ hơn 90 độ.");

            setResult({
                b: b.toFixed(2),
                c: c.toFixed(2),
                a: a.toFixed(2),
                angleB: angleB.toFixed(2),
                angleC: angleC.toFixed(2),
                steps
            });
        } catch (err: any) {
            setError(err.message || 'Lỗi dữ liệu. Không thể giải tam giác với dữ liệu mâu thuẫn.');
        }
    };

    const clear = () => {
        setInputs({ b: '', c: '', a: '', angleB: '', angleC: '' });
        setResult(null);
        setError('');
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm font-sans max-w-2xl mx-auto my-6">
            <h3 className="text-xl font-bold mb-4 text-blue-700 border-b pb-2">📐 Máy Tính Giải Tam Giác Vuông (Tại A)</h3>
            <p className="text-sm text-gray-600 mb-6">Nhập ít nhất 2 kích thước (trong đó phải có 1 cạnh). Để trống các ô còn lại để máy tự tính.</p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* SVG Triangle representation */}
                <div className="w-full md:w-1/3 flex flex-col justify-center items-center font-semibold text-gray-700">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <polygon points="40,160 160,160 40,40" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3" />
                        {/* Right angle symbol */}
                        <polyline points="40,140 60,140 60,160" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                        <text x="30" y="175" fill="#333" fontSize="16">A</text>
                        <text x="170" y="175" fill="#333" fontSize="16">C</text>
                        <text x="30" y="30" fill="#333" fontSize="16">B</text>
                        <text x="110" y="90" fill="#2563eb" fontSize="16" transform="rotate(45, 110, 90)">a</text>
                        <text x="100" y="180" fill="#2563eb" fontSize="16">b</text>
                        <text x="20" y="100" fill="#2563eb" fontSize="16">c</text>
                    </svg>
                </div>

                {/* Inputs */}
                <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Cạnh góc vuông b</label>
                        <input type="number" name="b" value={inputs.b} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-300" placeholder="Độ dài b" min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Cạnh góc vuông c</label>
                        <input type="number" name="c" value={inputs.c} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-300" placeholder="Độ dài c" min="0" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold mb-1 text-purple-700">Cạnh huyền a</label>
                        <input type="number" name="a" value={inputs.a} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-purple-300" placeholder="Độ dài a" min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-amber-700">Góc B (độ °)</label>
                        <input type="number" name="angleB" value={inputs.angleB} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-amber-300" placeholder="0 - 90" min="0" max="90" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-amber-700">Góc C (độ °)</label>
                        <input type="number" name="angleC" value={inputs.angleC} onChange={handleChange} className="w-full p-2 border rounded shadow-sm focus:ring-2 focus:ring-amber-300" placeholder="0 - 90" min="0" max="90" />
                    </div>

                    <div className="col-span-2 flex justify-end gap-3 mt-2">
                        <button onClick={clear} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition">Xóa</button>
                        <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow-md hover:bg-blue-700 transition">Giải tam giác</button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded text-sm">
                    <strong>Lỗi: </strong> {error}
                </div>
            )}

            {result && !error && (
                <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-3 block border-b border-green-200 pb-2">✅ Kết quả giải:</h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 mb-4 font-mono text-sm bg-white p-3 rounded shadow-inner">
                        <div className="text-purple-800"><b>a =</b> {result.a}</div>
                        <div className="text-blue-800"><b>b =</b> {result.b}</div>
                        <div className="text-blue-800"><b>c =</b> {result.c}</div>
                        <div className="text-amber-800"><b>Góc B =</b> {result.angleB}°</div>
                        <div className="text-amber-800"><b>Góc C =</b> {result.angleC}°</div>
                        <div className="text-gray-600"><b>Góc A =</b> 90.00°</div>
                    </div>

                    <div className="text-sm text-gray-700 bg-green-100/30 p-3 rounded">
                        <strong>Các bước thực hiện:</strong>
                        <ul className="list-none space-y-1 mt-2">
                            {result.steps.map((step, idx) => (
                                <li key={idx} className={idx === 0 ? "font-semibold text-gray-800" : ""}>{step}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
