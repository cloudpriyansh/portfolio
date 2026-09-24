'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { demoStyles as styles } from './demo-tailwind';
import { ProjectTour } from './project-tour';

const DataDemos = dynamic(() => import('./experiences-data').then(module => module.DataDemos));
const AgentDemos = dynamic(() => import('./experiences-agents').then(module => module.AgentDemos));
const WorkflowDemos = dynamic(() => import('./experiences-workflows').then(module => module.WorkflowDemos));
const CommerceDemos = dynamic(() => import('./experiences-commerce').then(module => module.CommerceDemos));

export default function DemoExperience({ slug }: { slug: string }) {
  const [run, setRun] = useState(0);
  const [mode, setMode] = useState<'tour' | 'hands-on'>('hands-on');
  const isAgent = slug === 'urecruits';
  const isGrowstack = slug === 'growstack';
  const titles: Record<string, string> = { growstack:'Growstack AI Studio', urecruits:'uR Agent', zyberon:'Zyberon AI Workforce', 'voice-agent':'AI Voice Operations', mychatpdf:'MyChatPDF Workspace', 'workforce-engine':'AI Workforce Control', 'top-cars-n8n':'Top Cars Automation', 'hotel-social-n8n':'Hotel Social Operations', 'epulse-discovery':'EPulse Research', 'trading-engine':'Trading Engine Control', sketchapaw:'SketchAPaw Studio' };
  return <div className={styles.macBrowser} data-project={slug}>
    <div className={styles.macChrome} aria-label="Project browser frame"><div className={styles.macLights} aria-hidden="true"><span/><span/><span/></div><div className={styles.macAddress}><span aria-hidden="true">⌁</span> portfolio.local/{slug}</div><span className={styles.macBadge}>LOCAL PREVIEW</span></div>
    <div className={styles.macToolbar}><div><strong>{titles[slug] ?? 'Product workspace'}</strong><p className={styles.notice}>Interactive product preview · local sample data</p></div><div className={styles.actions}>{!isAgent && !isGrowstack && <div className={styles.modeTabs} role="tablist" aria-label="Workspace mode"><button role="tab" type="button" aria-selected={mode === 'hands-on'} onClick={() => setMode('hands-on')}>Workspace</button><button role="tab" type="button" aria-selected={mode === 'tour'} onClick={() => setMode('tour')}>How it works</button></div>}<button type="button" className={styles.button} onClick={() => setRun(value => value + 1)}>Reset</button></div></div>
    <div className={styles.macContent} key={`${slug}-${run}`}>
      {!isAgent && mode === 'tour' ? <ProjectTour slug={slug} onExplore={() => setMode('hands-on')}/> :
      <div className={styles.handsOn}>
      {['growstack', 'mychatpdf', 'epulse-discovery', 'trading-engine'].includes(slug) ? <DataDemos slug={slug}/> :
       ['urecruits', 'workforce-engine', 'voice-agent'].includes(slug) ? <AgentDemos slug={slug}/> :
       ['top-cars-n8n', 'hotel-social-n8n'].includes(slug) ? <WorkflowDemos slug={slug}/> :
       ['zyberon', 'sketchapaw'].includes(slug) ? <CommerceDemos slug={slug}/> : <p>Interactive workspace unavailable for this project.</p>}
      </div>}
    </div>
  </div>;
}
