import styles from './project-visual.module.css';
import { projectArtwork } from '@/lib/project-art';
import { Check,FileText,Layers,Mic } from 'lucide-react';
export function ProjectVisual({id, sizes = '(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc((100vw - 100px) / 2), (max-width: 1416px) calc((100vw - 148px) / 2), 634px', priority = false}:{id:string; sizes?:string; priority?:boolean}){
  const artwork = projectArtwork[id];
  if (artwork) {
    return <figure className={`project-visual ${styles.cover}`} style={{'--art-background': artwork.background} as React.CSSProperties}>
      <picture className={styles.picture}>
        <source type="image/avif" srcSet={[480,800,1280].map(w=>`/projects/${id}-${w}.avif ${w}w`).join(', ')} sizes={sizes}/>
        <img className={styles.image} data-project-image src={`/projects/${id}-800.webp`} srcSet={[480,800,1280].map(w=>`/projects/${id}-${w}.webp ${w}w`).join(', ')} sizes={sizes} width={1280} height={800} alt={artwork.alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async"/>
      </picture>
      {id==='growstack' && <figcaption className={styles.metric}><strong>330M+</strong> records</figcaption>}
    </figure>;
  }
  if(id==='urecruits')return <div className="project-visual recruiting-visual" aria-label="Recruitment workflow: resume parsing, structured evaluation, and recruiter review"><div className="visual-label"><Layers size={15}/> HUMAN-CENTERED HIRING</div><div className="resume-workflow"><div className="document-stack"><div className="resume-sheet"><FileText size={24}/><b>Candidate profile</b><i/><i/><i/><div className="sheet-tags"><span>Skills</span><span>Experience</span></div></div></div><div className="review-steps"><span><Check size={14}/> Parse & structure</span><span><Check size={14}/> Match & evaluate</span><span><Check size={14}/> Recruiter review</span></div></div><span className="visual-footnote">AI-ASSISTED. HUMAN-REVIEWED.</span></div>;
  if(id==='zyberon')return <figure className={`project-visual ${styles.zyberon}`}>
    <div className={styles.zyberonHeading}><img src="/projects/zyberon-logo.webp" width={130} height={29} alt="Zyberon"/><span>PRODUCT → CREATIVE → CAMPAIGN</span></div>
    <div className={styles.adPair}>{['01','04'].map((ad,i)=><img key={ad} data-project-image src={`/projects/zyberon-ad-${ad}-800.webp`} srcSet={`/projects/zyberon-ad-${ad}-400.webp 400w, /projects/zyberon-ad-${ad}-800.webp 800w`} sizes="(max-width: 760px) 40vw, 350px" width={800} height={1000} loading={priority ? 'eager' : 'lazy'} decoding="async" alt={i===0 ? 'Zyberon sample ad: greens gummies on a beach blanket' : 'Zyberon sample ad: a travel essentials collage with greens gummies'}/>)}</div>
    <figcaption>Sample creatives from zyberon.ai</figcaption>
  </figure>;
  return <div className="project-visual voice-visual" aria-label="AI voice workflows for qualifying leads, scheduling appointments, and follow-ups"><div className="visual-label"><Mic size={15}/> CONVERSATIONS WITH CONTEXT</div><div className="waveform" aria-hidden="true">{[12,21,37,18,54,72,38,88,62,100,74,49,83,111,69,48,82,59,38,69,46,25,51,33,17,29,12].map((h,i)=><i key={i} style={{height:h,'--bar-index':i} as React.CSSProperties}/>)}</div><div className="voice-labels"><span>Qualify</span><span>Schedule</span><span>Follow up</span></div><span className="visual-footnote">BUILT TO LISTEN. DESIGNED TO ACT.</span></div>;
}
