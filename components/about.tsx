import { ArrowUpRight, Download } from 'lucide-react';
import { BrandMark } from './brand-mark';
import { profile } from '@/lib/content';
import styles from './profile-sections.module.css';

export function About() {
  return <section id="about" className={styles.about} aria-labelledby="about-title"><div className="container">
    <div className={styles.sectionLabel}><span>02 / ABOUT ME</span><span>THE PERSON BEHIND THE BUILD</span></div>
    <div className={styles.aboutGrid}>
      <div className={styles.identity} data-reveal="rise"><div className={styles.nameMark}><BrandMark/></div><div><h3>Priyansh Dobariya</h3><p>Full-Stack & Applied AI Engineer</p></div><dl><div><dt>Currently</dt><dd>Applied AI at Bitontree</dd></div><div><dt>Based in</dt><dd>India · Building everywhere</dd></div></dl><a href="/Priyansh_Resume.pdf" download>Get my resume <Download size={17}/></a></div>
      <div className={styles.aboutCopy}><h2 id="about-title" data-reveal="wipe">A developer’s mind.<br/><span>A builder’s instinct.</span></h2><p className={styles.lead}>I connect the interface, the systems, and the intelligence that make a product work.</p><p>I’m Priyansh. At Bitontree, I work on Applied AI. Across my projects, I also build the full stack—from React and Next.js experiences to Node.js and NestJS services, databases, and Redis caching.</p><p>I also connect Stripe payments, build NestJS microservices and n8n workflows, and deploy on AWS. For AI applications, I build RAG pipelines with embeddings and vector databases to give agents the right context.</p><a className={styles.profileLink} href={profile.linkedin} target="_blank" rel="noopener noreferrer">More about me on LinkedIn <ArrowUpRight size={18}/></a></div>
    </div>
    <div className={styles.principles}>{[['01','Think in systems','Understand how the pieces fit.'],['02','Build for people','Make the complex feel intuitive.'],['03','Care about the details','From the first interaction to delivery.']].map(([n,t,d])=><div key={n} data-reveal="slide"><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>
  </div></section>;
}
