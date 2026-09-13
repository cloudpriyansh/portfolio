import type { CSSProperties } from 'react';

const technologies = [
  { slug: 'react', name: 'React', color: '#53bfdc' },
  { slug: 'nextdotjs', name: 'Next.js', color: 'var(--ink)' },
  { slug: 'typescript', name: 'TypeScript', color: '#458ed1' },
  { slug: 'nodedotjs', name: 'Node.js', color: '#68a84e' },
  { slug: 'nestjs', name: 'NestJS', color: '#e55676' },
  { slug: 'redis', name: 'Redis', color: '#dc6257' },
  { slug: 'mongodb', name: 'MongoDB', color: '#49a766' },
  { slug: 'postgresql', name: 'PostgreSQL', color: '#568ebc' },
  { slug: 'python', name: 'Python', color: '#d5ae53' },
  { slug: 'docker', name: 'Docker', color: '#3ba2d5' },
];

export function TechnologyMark({ slug }: { slug: string }) {
  return <span className="technology-mark" style={{ maskImage: `url(/tech/${slug}.svg)`, WebkitMaskImage: `url(/tech/${slug}.svg)` }}/>;
}

export function FloatingTechnologies() {
  return <div className="floating-technologies" aria-hidden="true">
    {['javascript', 'react', 'nextdotjs', 'nodedotjs', 'typescript', 'redis'].map((slug, i) =>
      <div className={`tech-float float-${slug}`} key={slug}>
        <div className="tech-cube ambient-moving" style={{ '--float-delay': `${i * -1.7}s`, '--float-duration': `${6.5 + i * .6}s` } as CSSProperties}>
          <div className="tech-cube-back"/><div className="tech-cube-face"><TechnologyMark slug={slug}/></div>
        </div>
      </div>)}
  </div>;
}

export function TechnologyMarquee() {
  return <div className="technology-marquee container" data-ambient aria-label={`Technologies: ${technologies.map(tech => tech.name).join(', ')}`}>
    <div className="technology-marquee-heading"><span>ONE CONNECTED STACK</span><span>Interface → API → Intelligence</span></div>
    <div className="technology-marquee-window"><div className="technology-marquee-track ambient-moving" aria-hidden="true">{[0,1].map(copy => <div className="technology-marquee-set" key={copy}>{technologies.map(tech => <div className="technology-token" key={tech.slug} style={{ '--logo-color': tech.color } as CSSProperties}><TechnologyMark slug={tech.slug}/><span>{tech.name}</span></div>)}</div>)}</div></div>
  </div>;
}
