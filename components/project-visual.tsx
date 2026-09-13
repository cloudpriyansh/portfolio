import styles from './project-visual.module.css';
import { projectArtwork } from '@/lib/project-art';
import { Check,FileText,Layers,Mic,ShoppingBag,Sparkles,ArrowUpRight } from 'lucide-react';
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
    <div className={styles.zyberonTop}><span>AI × COMMERCE</span><span>ZYBERON.AI</span></div>
    <div className={styles.zyberonBrand}><img src="/projects/zyberon-brand.webp" width={1000} height={221} alt="Zyberon" loading={priority ? 'eager' : 'lazy'} decoding="async"/><p>Connected intelligence for Shopify.</p></div>
    <div className={styles.zyberonFlow} aria-label="Product context to AI creative to campaigns">
      <span><ShoppingBag aria-hidden="true"/><b>Product context</b></span><i aria-hidden="true">→</i><span><Sparkles aria-hidden="true"/><b>AI creative</b></span><i aria-hidden="true">→</i><span><ArrowUpRight aria-hidden="true"/><b>Campaigns</b></span>
    </div>
  </figure>;
  return <div className="project-visual voice-visual" aria-label="AI voice workflows for qualifying leads, scheduling appointments, and follow-ups"><div className="visual-label"><Mic size={15}/> CONVERSATIONS WITH CONTEXT</div><div className="waveform" aria-hidden="true">{[12,21,37,18,54,72,38,88,62,100,74,49,83,111,69,48,82,59,38,69,46,25,51,33,17,29,12].map((h,i)=><i key={i} style={{height:h,'--bar-index':i} as React.CSSProperties}/>)}</div><div className="voice-labels"><span>Qualify</span><span>Schedule</span><span>Follow up</span></div><span className="visual-footnote">BUILT TO LISTEN. DESIGNED TO ACT.</span></div>;
}
