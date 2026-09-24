'use client';

import dynamic from 'next/dynamic';
import { demoStyles as styles } from './demo-tailwind';

const DemoExperience = dynamic(() => import('./demo-experience'), { loading: () => <p role="status">Loading the project workspace…</p> });

export function DemoLauncher({ slug, name }: { slug: string; name: string }) {
  return <section id="interactive-workspace" className={styles.section} aria-labelledby="interactive-workspace-title">
    <div className={styles.heading}><div><span className={styles.eyebrow}>INTERACTIVE PROJECT WORKSPACE</span><h2 id="interactive-workspace-title">Explore {name}.</h2><p>Explore a representative workflow with sample data. Everything runs in your browser.</p></div></div>
    <div className={styles.panel}><DemoExperience slug={slug}/></div>
  </section>;
}
