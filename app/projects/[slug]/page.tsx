import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Effects } from '@/components/effects';
import { ScrollPattern } from '@/components/scroll-pattern';
import { ProjectVisual } from '@/components/project-visual';
import { profile, projects } from '@/lib/content';
import { projectArtwork } from '@/lib/project-art';
import { siteUrl } from '@/lib/site';
import styles from './project.module.css';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(project => project.id === slug);
  if (!project) notFound();
  const title = `${project.name} — Priyansh Dobariya`;
  const url = `${siteUrl}/projects/${project.id}/`;
  const image = projectArtwork[project.id] ? `${siteUrl}/projects/${project.id}-1280.webp` : null;
  return {
    title, description: project.description, alternates: { canonical: url },
    openGraph: { type: 'website', title, description: project.description, url, siteName: profile.name,
      images: image ? [{ url: image, width: 1280, height: 800, alt: projectArtwork[project.id].alt }] : [] },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description: project.description, images: image ? [image] : [] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex(project => project.id === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const url = `${siteUrl}/projects/${project.id}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CreativeWork', '@id': `${url}#project`, name: project.name, description: project.description,
      url, about: project.category, keywords: project.technologies.join(', '),
      image: projectArtwork[project.id] ? `${siteUrl}/projects/${project.id}-1280.webp` : undefined,
      contributor: { '@type': 'Person', '@id': `${siteUrl}/#priyansh`, name: profile.name, url: siteUrl },
    },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portfolio', item: `${siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: project.name, item: url },
    ] },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}/>
    <a className="skip-link" href="#main">Skip to content</a><Effects/><Header/>
    <main id="main" className={`container ${styles.page}`}>
      <a href={`/#${project.id}`} className={styles.back}><ArrowLeft size={17}/> All projects</a>
      <header className={styles.intro}>
        <div className="eyebrow">PROJECT {String(index + 1).padStart(2, '0')} / {project.category}</div>
        <h1>{project.name}<span className="accent">.</span></h1>
        <p className={styles.tagline}>{project.title}</p>
        <p className={styles.description}>{project.description}</p>
      </header>
      <div className={styles.cover}><ProjectVisual id={project.id} priority sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1416px) calc(100vw - 112px), 1304px"/></div>
      {project.id === 'zyberon' && <section className={styles.productContext} aria-labelledby="product-title">
        <div className="eyebrow">THE PRODUCT</div><h2 id="product-title">One workspace. A connected AI workforce.</h2>
        <p>Zyberon brings Shopify workflows together across marketing, customer service, and business operations.</p>
        <div className={styles.capabilities}>
          <article><h3>Creative & campaigns</h3><p>Generate image and video ads, build Meta campaigns from product links, and plan social content.</p></article>
          <article><h3>Store experiences</h3><p>Create pages, quiz funnels, and lifecycle emails, with customer support informed by Shopify order context.</p></article>
          <article><h3>Business intelligence</h3><p>Research products, track profit, and coordinate tasks across the store’s AI tools.</p></article>
        </div>
        <a href="https://zyberon.ai/" target="_blank" rel="noopener noreferrer" className={styles.source}>Explore Zyberon <ArrowUpRight size={16}/></a>
        <small>Product overview and brand logo sourced from Zyberon’s official website.</small>
      </section>}
      <ScrollPattern variant="signal" anchor=".project-overview" className="project-signal"/>
      <section className={`${styles.overview} project-overview`} aria-labelledby="overview-title">
        <div><div className="eyebrow">{project.id === 'zyberon' ? 'MY CONTRIBUTIONS' : 'PROJECT OVERVIEW'}</div><h2 id="overview-title">Behind the <span className="serif">build.</span></h2></div>
        <div className={styles.content}><ul className={styles.details}>{project.details.map((detail, i) => <li key={detail} data-reveal="slide"><span aria-hidden="true">0{i + 1}</span><p>{detail}</p></li>)}</ul>
          <h3 className={styles.stackTitle}>Tools & technologies</h3><ul className={`tech-tags ${styles.tags}`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
        </div>
      </section>
      {project.caseStudy && <div className={styles.caseStudy}>
        <section aria-labelledby="problem-title"><div className="eyebrow">THE PROBLEM</div><h2 id="problem-title">What this solves</h2><p>{project.caseStudy.problem}</p></section>
        <section aria-labelledby="architecture-title"><div className="eyebrow">ARCHITECTURE</div><h2 id="architecture-title">How it works</h2><p>{project.caseStudy.architecture}</p></section>
        <section aria-labelledby="workflow-title"><div className="eyebrow">ONE WORKFLOW</div><h2 id="workflow-title">From input to outcome</h2><p>{project.caseStudy.workflow}</p></section>
        <section aria-labelledby="decisions-title"><div className="eyebrow">ENGINEERING</div><h2 id="decisions-title">Decisions visible in the code</h2><ul>{project.caseStudy.decisions.map(item => <li key={item}>{item}</li>)}</ul></section>
        <section aria-labelledby="benefit-title"><div className="eyebrow">BENEFIT & EVIDENCE</div><h2 id="benefit-title">What the workflow enables</h2><p>{project.caseStudy.benefit}</p>{project.caseStudy.boundary && <p className={styles.boundary}>{project.caseStudy.boundary}</p>}</section>
      </div>}
      <Link href={`/projects/${next.id}/`} className={styles.next} data-reveal="rise" aria-label={`Next project: ${next.name}`}><div><span>EXPLORE NEXT</span><h2>{next.name}</h2></div><ArrowRight size={36} strokeWidth={1.3}/></Link>
    </main>
    <footer className={`container ${styles.footer}`}><Link href="/">© {new Date().getFullYear()} {profile.name}</Link><Link href="/#contact">Let’s build something <ArrowUpRight size={16}/></Link></footer>
  </>;
}
