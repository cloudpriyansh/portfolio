import Link from 'next/link';
import { projects } from '@/lib/content';

export function ExpertiseProjects() {
  return <section className="section container" aria-labelledby="engineering-work-title">
    <div className="section-heading"><div><div className="eyebrow">ENGINEERING IN PRACTICE</div><h2 id="engineering-work-title">AI engineering.<br/><span className="serif">From problem to product.</span></h2></div>
      <p className="section-lede">Priyansh Dobariya’s project case studies connect the technology to the problem, architecture, and business workflow it supports.</p></div>
    <div className="expertise-projects">{projects.map(project => <article key={project.id}>
      <h3><Link href={`/projects/${project.id}/`}>{project.name}</Link></h3>
      <p>{project.description}</p><p className="expertise-stack"><strong>Built with: </strong>{project.technologies.join(', ')}.</p>
      <Link className="text-link" href={`/projects/${project.id}/`}>Explore architecture and benefits →</Link>
    </article>)}</div>
  </section>;
}
