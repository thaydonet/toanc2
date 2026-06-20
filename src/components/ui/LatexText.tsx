/**
 * LatexText — thay thế react-latex-next, dùng katex trực tiếp.
 * - Chỉ nhận $...$ và $$...$$ làm delimiters toán học.
 * - Văn bản thường (kể cả dấu ngoặc đơn) KHÔNG bị render nhầm.
 */
import katex from 'katex';

interface Props {
  children: string;
  className?: string;
}

interface Segment {
  type: 'text' | 'math-inline' | 'math-display';
  content: string;
}

/** Tách chuỗi thành các đoạn text / math */
function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  // Thứ tự quan trọng: $$ trước $
  const re = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(input)) !== null) {
    if (m.index > last) {
      segments.push({ type: 'text', content: input.slice(last, m.index) });
    }
    const token = m[0];
    if (token.startsWith('$$')) {
      segments.push({ type: 'math-display', content: token.slice(2, -2) });
    } else {
      segments.push({ type: 'math-inline', content: token.slice(1, -1) });
    }
    last = m.index + token.length;
  }

  if (last < input.length) {
    segments.push({ type: 'text', content: input.slice(last) });
  }

  return segments;
}

export default function LatexText({ children, className }: Props) {
  const segments = parseSegments(children ?? '');

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.content}</span>;
        }
        const isDisplay = seg.type === 'math-display';
        let html = '';
        try {
          html = katex.renderToString(seg.content, {
            displayMode: isDisplay,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
        } catch {
          html = seg.content;
        }
        return (
          <span
            key={i}
            style={isDisplay ? { display: 'block', textAlign: 'center', margin: '0.5em 0' } : undefined}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </span>
  );
}
