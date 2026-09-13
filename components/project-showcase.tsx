import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/content';
import { ProjectScroll } from './project-scroll';
import { ProjectVisual } from './project-visual';
import styles from './project-showcase.module.css';

export function ProjectShowcase() {
  return <ProjectScroll>{projects.map((project, index) =>
    <article id={project.id} key={project.id} className={styles.step} data-project-step aria-labelledby={`${project.id}-title`}>
      <Link href={`/projects/${project.id}/`} className={`${styles.card} project`} data-project-card aria-labelledby={`${project.id}-title ${project.id}-cta`}>
        <div className={styles.art}><ProjectVisual id={project.id} sizes="(max-width: 760px) calc(100vw - 66px), (max-width: 1100px) calc((100vw - 132px) / 2), 650px"/></div>
        <div className={styles.body}>
          <div className={styles.meta}><span>{project.category}</span><span className={styles.number}>0{index + 1}<span> / 0{projects.length}</span></span></div>
          <h3 id={`${project.id}-title`}>{project.name}</h3>
          <p className={styles.title}>{project.title}</p>
          <p className={styles.description}>{project.description}</p>
          <ul className="tech-tags" aria-label="Technologies">{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
          <div className={styles.cta}><span id={`${project.id}-cta`}>Explore project</span><span className={styles.arrow}><ArrowUpRight size={22}/></span></div>
        </div>
      </Link>
    </article>
  )}</ProjectScroll>;
}
