type Pattern = 'orbit' | 'weave' | 'signal' | 'arc' | 'timeline';
const paths: Record<Pattern, string[]> = {
  orbit: ['M60 250a190 190 0 1 0 380 0a190 190 0 1 0-380 0', 'M20 250a230 130 0 1 0 460 0a230 130 0 1 0-460 0'],
  weave: Array.from({ length: 7 }, (_, i) => {
    const inset = i * 10;
    return `M${40 + inset} 260 C${-25 + inset} ${80 + inset},${300 - inset} ${-15 + inset},${337 - inset} 132 S${80 + inset} ${337 - inset},${76 + inset} 170 S${330 - inset} ${26 + inset},${340 - inset} 265`;
  }),
  signal: ['M4 50 H140 C200 50 205 15 270 15 S340 65 410 65 S470 25 540 25 H690 C745 25 745 55 805 55 H940 C995 55 995 20 1050 20 H1196'],
  arc: ['M20 240 C20 30 270 10 300 150 S80 350 120 180 S470 70 450 290'],
  timeline: ['M4 0 V1000'],
};
const boxes: Record<Pattern, string> = { orbit: '0 0 500 500', weave: '0 0 400 320', signal: '0 0 1200 80', arc: '0 0 500 360', timeline: '0 0 8 1000' };

// Nonrepresentational SVG linework. Content remains fully visible without JS.
export function ScrollPattern({ variant, anchor, className = '' }: { variant: Pattern; anchor: string; className?: string }) {
  return <svg className={`scroll-pattern pattern-${variant} ${className}`} viewBox={boxes[variant]} fill="none" aria-hidden="true" focusable="false" data-scroll-pattern data-pattern-anchor={anchor} preserveAspectRatio={variant === 'signal' || variant === 'timeline' ? 'none' : 'xMidYMid meet'}>
    <g className="pattern-lines">{paths[variant].map((d, index) => <g key={d}>
      <path className="pattern-guide" d={d}/>
      <path className="pattern-trace" d={d} pathLength="1" style={{ '--trace-index': index } as React.CSSProperties}/>
    </g>)}</g>
    {variant === 'orbit' && <g className="pattern-orbit-points"><circle cx="250" cy="60" r="5"/><circle cx="440" cy="250" r="3"/><circle cx="20" cy="250" r="4"/></g>}
    {variant === 'signal' && <g className="pattern-nodes"><circle cx="270" cy="15" r="5"/><circle cx="600" cy="25" r="5"/><circle cx="940" cy="55" r="5"/></g>}
  </svg>;
}
