import { useEffect, useRef } from 'react';
import katex from 'katex';
import { withSuppressedKatexMetricWarnings } from '../../lib/katex-silence.mjs';

interface Props {
  math: string;
  display?: boolean;
  className?: string;
}

export default function MathFormula({ math, display = false, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      withSuppressedKatexMetricWarnings(() => {
        katex.render(math, ref.current, {
          displayMode: display,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      });
    }
  }, [math, display]);
  return <span ref={ref} className={className} />;
}
