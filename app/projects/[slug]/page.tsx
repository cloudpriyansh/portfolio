import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Effects } from '@/components/effects';
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
        <div className="eyebrow">PROJECT 0{index + 1} / {project.category}</div>
        <h1>{project.name}<span className="accent">.</span></h1>
        <p className={styles.tagline}>{project.title}</p>
        <p className={styles.description}>{project.description}</p>
      </header>
      <div className={styles.cover}><ProjectVisual id={project.id} priority sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1416px) calc(100vw - 112px), 1304px"/></div>
      <section className={styles.overview} aria-labelledby="overview-title">
        <div><div className="eyebrow">PROJECT OVERVIEW</div><h2 id="overview-title">Behind the <span className="serif">build.</span></h2></div>
        <div className={styles.content}><ul className={styles.details}>{project.details.map((detail, i) => <li key={detail}><span aria-hidden="true">0{i + 1}</span><p>{detail}</p></li>)}</ul>
          <h3 className={styles.stackTitle}>Tools & technologies</h3><ul className={`tech-tags ${styles.tags}`}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
        </div>
      </section>
      <Link href={`/projects/${next.id}/`} className={styles.next} aria-label={`Next project: ${next.name}`}><div><span>EXPLORE NEXT</span><h2>{next.name}</h2></div><ArrowRight size={36} strokeWidth={1.3}/></Link>
    </main>
    <footer className={`container ${styles.footer}`}><Link href="/">© {new Date().getFullYear()} {profile.name}</Link><Link href="/#contact">Let’s build something <ArrowUpRight size={16}/></Link></footer>
  </>;
}
