import styles from './project-visual.module.css';
import { projectArtwork } from '@/lib/project-art';
import { Check,FileText,Layers,Mic,ShoppingBag,Sparkles,Workflow } from 'lucide-react';
export function ProjectVisual({id}:{id:string}){
  const artwork = projectArtwork[id];
  if (artwork) {
    const sizes = '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 100px) / 2), (max-width: 1416px) calc((100vw - 148px) / 2), 634px';
    return <figure className={`project-visual ${styles.cover}`} style={{'--art-background': artwork.background} as React.CSSProperties}>
      <picture className={styles.picture}>
        <source type="image/avif" srcSet={[480,800,1280].map(w=>`/projects/${id}-${w}.avif ${w}w`).join(', ')} sizes={sizes}/>
        <img className={styles.image} src={`/projects/${id}-800.webp`} srcSet={[480,800,1280].map(w=>`/projects/${id}-${w}.webp ${w}w`).join(', ')} sizes={sizes} width={1280} height={800} alt={artwork.alt} loading="lazy" decoding="async"/>
      </picture>
      {id==='growstack' && <figcaption className={styles.metric}><strong>330M+</strong> records</figcaption>}
    </figure>;
  }
  if(id==='urecruits')return <div className="project-visual recruiting-visual" aria-label="Recruitment workflow: resume parsing, structured evaluation, and recruiter review"><div className="visual-label"><Layers size={15}/> HUMAN-CENTERED HIRING</div><div className="resume-workflow"><div className="document-stack"><div className="resume-sheet"><FileText size={24}/><b>Candidate profile</b><i/><i/><i/><div className="sheet-tags"><span>Skills</span><span>Experience</span></div></div></div><div className="review-steps"><span><Check size={14}/> Parse & structure</span><span><Check size={14}/> Match & evaluate</span><span><Check size={14}/> Recruiter review</span></div></div><span className="visual-footnote">AI-ASSISTED. HUMAN-REVIEWED.</span></div>;
  if(id==='zyberon')return <div className="project-visual commerce-visual" aria-label="Ecommerce workflow: product context, AI generation, and campaign execution"><div className="visual-label"><Workflow size={15}/> CONNECTING THE DOTS</div><div className="commerce-flow"><div><ShoppingBag size={29}/><span>Product</span></div><span className="flow-line"/><div className="ai-node"><Sparkles size={34}/><span>Intelligence</span></div><span className="flow-line"/><div><Layers size={29}/><span>Campaign</span></div></div><span className="visual-footnote">GOOD CONTEXT. BETTER CREATIVE.</span></div>;
  return <div className="project-visual voice-visual" aria-label="AI voice workflows for qualifying leads, scheduling appointments, and follow-ups"><div className="visual-label"><Mic size={15}/> CONVERSATIONS WITH CONTEXT</div><div className="waveform" aria-hidden="true">{[12,21,37,18,54,72,38,88,62,100,74,49,83,111,69,48,82,59,38,69,46,25,51,33,17,29,12].map((h,i)=><i key={i} style={{height:h,'--bar-index':i} as React.CSSProperties}/>)}</div><div className="voice-labels"><span>Qualify</span><span>Schedule</span><span>Follow up</span></div><span className="visual-footnote">BUILT TO LISTEN. DESIGNED TO ACT.</span></div>;
}
