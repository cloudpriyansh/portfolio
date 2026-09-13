import { Braces, Database, Sparkles, ArrowRight } from 'lucide-react';
import { skillGroups } from '@/lib/content';
import { ToolkitScroll } from './toolkit-scroll';

export function Toolkit() {
  return <ToolkitScroll>
    <div className="section-heading" data-reveal="wipe"><div><div className="eyebrow">03 / THE FULL STACK</div><h2 id="skills-title">From the first pixel.<br/><span className="serif">To the intelligence behind it.</span></h2></div><p className="section-lede">Frontend. Backend. Data. AI.<br/>One connected product.</p></div>
    <div className="toolkit-window"><div className="toolkit-track">{skillGroups.map((group, i) => <article className={`toolkit-card toolkit-${group.id}`} key={group.id} data-reveal="tilt" aria-labelledby={`skill-${group.id}`}>
      <div className="toolkit-card-top"><span>{group.label}</span><span>0{i + 1} / 04</span></div>
      <div className="toolkit-art" aria-hidden="true">
        {group.id === 'frontend' ? <div className="mini-browser"><div className="mini-browser-bar"><i/><i/><i/><span>interface.tsx</span></div><div className="mini-browser-body"><div className="mini-browser-nav"/><div className="mini-browser-title"/><div className="mini-browser-line"/><div className="mini-browser-button"/><div className="mini-browser-tile"><Braces size={34}/></div></div></div>
          : group.id === 'backend' ? <div className="mini-api"><div><b>GET</b><code>/api/products</code><span>200</span></div><div><b>POST</b><code>/api/workflows</code><span>201</span></div><div><b>GET</b><code>/api/insights</code><span>200</span></div></div>
          : group.id === 'ai' ? <div className="mini-intelligence"><span>CONTEXT</span><i/><div><Sparkles size={42}/></div><i/><span>ACTION</span></div>
          : <div className="mini-data"><div><Database size={32}/><span>Database</span></div><div><Braces size={28}/><span>Redis</span></div><div><span className="cloud-symbol">☁</span><span>Cloud</span></div></div>}
      </div>
      <h3 id={`skill-${group.id}`}>{group.title}</h3><p>{group.description}</p><ul aria-label={`${group.label} technologies`}>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
    </article>)}</div></div>
    <div className="toolkit-footer" aria-hidden="true"><span>THE TOOLS BEHIND THE BUILD</span><div className="toolkit-progress"><i/></div><span className="toolkit-direction">SCROLL TO EXPLORE <ArrowRight size={15}/></span></div>
  </ToolkitScroll>;
}
