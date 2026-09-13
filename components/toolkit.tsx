import { ArrowDown, Braces, Server, Sparkles, Database } from 'lucide-react';
import { skillGroups } from '@/lib/content';
import { TechnologyMarquee, TechnologyMark } from './technology';
import styles from './profile-sections.module.css';
const icons = [Braces, Server, Sparkles, Database];
const logos = [['react','nextdotjs','typescript'],['nodedotjs','nestjs','python'],['python'],['redis','postgresql','docker']];
export function Toolkit() {
  return <><section id="toolkit" className={`section container ${styles.stack}`} aria-labelledby="skills-title">
    <header className={styles.stackIntro}><div className="eyebrow">03 / MY TOOLKIT</div><h2 id="skills-title">The whole<br/>stack.<br/><span>One builder.</span></h2><p>From what you see to everything that makes it work.</p><a href="#skill-frontend">Explore the layers <ArrowDown size={16}/></a></header>
    <div className={styles.layers}>{skillGroups.map((group,i)=>{const Icon=icons[i];return <article className={styles.layer} key={group.id} aria-labelledby={`skill-${group.id}`} data-reveal="rise">
      <div className={styles.layerTop}><span>0{i+1} / {group.label}</span><Icon size={24} strokeWidth={1.3}/></div>
      <h3 id={`skill-${group.id}`}>{group.title}</h3><p>{group.description}</p>
      <div className={styles.layerTools}><div className={styles.logos} aria-hidden="true">{logos[i].map(slug=><TechnologyMark key={slug} slug={slug}/>)}</div><ul aria-label={`${group.label} technologies`}>{group.items.map(item=><li key={item}>{item}</li>)}</ul></div>
    </article>})}</div>
  </section><TechnologyMarquee/></>;
}
