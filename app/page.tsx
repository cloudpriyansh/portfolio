import { ArrowDown, ArrowUpRight, ArrowUp, Download, Sparkles, Linkedin, GraduationCap, Workflow } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';
import { Contact } from '@/components/contact';
import { Header } from '@/components/header';
import { Effects } from '@/components/effects';
import { ProjectShowcase } from '@/components/project-showcase';
import { FloatingTechnologies } from '@/components/technology';
import { About } from '@/components/about';
import { Toolkit } from '@/components/toolkit';
import { profile, projects } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import { projectArtwork } from '@/lib/project-art';


export default function Home() {
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'Person','@id':`${siteUrl || ''}/#priyansh`,name:profile.name,jobTitle:profile.role,description:profile.description,email:`mailto:${profile.email}`,url:siteUrl||undefined,sameAs:[profile.linkedin],worksFor:{'@type':'Organization',name:'Bitontree'},alumniOf:{'@type':'CollegeOrUniversity',name:'Dharmsinh Desai University'},knowsAbout:['Full-stack development','React','Next.js','Node.js','NestJS','Redis','PostgreSQL','MongoDB','Applied AI','LLM systems','RAG','Python','TypeScript','LangGraph','FastAPI','Stripe payments','RAG pipelines','Vector databases','n8n workflows','NestJS microservices','AWS deployment','AI agents','Multi-agent architecture','LLM observability']},
    {'@type':'ProfilePage','@id':`${siteUrl||''}/#profile`,url:siteUrl||undefined,name:`${profile.name} — ${profile.role}`,mainEntity:{'@id':`${siteUrl||''}/#priyansh`}},
    ...projects.map(project=>({'@type':'CreativeWork',name:project.name,description:project.description,about:project.category,image:siteUrl&&projectArtwork[project.id]?`${siteUrl}/projects/${project.id}-1280.webp`:undefined,contributor:{'@id':`${siteUrl||''}/#priyansh`},url:siteUrl?`${siteUrl}/projects/${project.id}/`:undefined}))
  ]};
  return <>
    <link rel="preload" as="image" href="/developer-sprites.webp"/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
    <a className="skip-link" href="#main">Skip to content</a><Effects/><Header/>
    <main id="main">
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="eyebrow"><span className="tiny-line"/> FULL-STACK &amp; APPLIED AI ENGINEER</div><h1 id="hero-title">Human ideas.<br/><span className="serif">Intelligent</span><br/>execution<span className="accent">.</span></h1><p className="hero-intro">Hey, I’m <strong>Priyansh Dobariya.</strong><br/>I build complete web products and intelligent AI systems.<br className="desktop-break"/> From the interface to the API. From idea to production.</p><div className="hero-actions"><a className="button button-primary" href="#work">Explore my work <ArrowDown size={17}/></a><a className="text-link" href="/Priyansh_Resume.pdf" download>Download CV <Download size={17}/></a></div></div>
        <div className="hero-stage" data-ambient><div className="scene-grid" aria-hidden="true"/><FloatingTechnologies/><div className="celestial" aria-hidden="true"><span className="sun-disc"/></div><div className="scene-stars" aria-hidden="true">✧ <span>✦</span> · <b>✧</b></div><div className="character-space"><div className="character-sprite" role="img" aria-label="Animated developer character working on a laptop"/></div><div className="scene-caption"><Sparkles size={16}/><span>A little curiosity. A lot of building.</span></div><span className="scene-coordinate">IDEA → INTELLIGENCE → IMPACT</span></div>
        <div className="hero-bottom"><span>Based in India · Building for everywhere</span><a href="#work">SCROLL TO EXPLORE <ArrowDown size={14}/></a><span>CRAFTED WITH CURIOSITY ↗</span></div>
      </section>
      <div className="ticker" data-ambient aria-label="Specialties: full-stack development, React and Next.js, backend systems, and applied AI"><div className="ticker-track ambient-moving" aria-hidden="true">{[0,1].map(n=><div className="ticker-set" key={n}><span>FULL-STACK DEVELOPMENT</span><span className="ticker-star">✳</span><span>REACT &amp; NEXT.JS</span><span className="ticker-star">✳</span><span>APPLIED AI</span><span className="ticker-star">✳</span><span>BACKEND SYSTEMS</span><span className="ticker-star">✳</span></div>)}</div></div>
      <section id="work" className="section container" aria-labelledby="work-title"><div className="section-heading" data-reveal="wipe"><div><div className="eyebrow">01 / SELECTED WORK</div><h2 id="work-title">Ideas, put to <span className="serif">work.</span></h2></div><p className="section-lede">Real problems. Thoughtful systems.<br/>A few things I’ve helped bring to life.</p></div><ProjectShowcase/><div className="work-note" data-reveal><span>Always exploring. Always building.</span><a className="text-link" href="#contact">Have something in mind? <ArrowUpRight size={16}/></a></div></section>
      <About/>
      <Toolkit/>
      <section id="experience" className="section container experience-section" aria-labelledby="experience-title"><div className="experience-intro" data-reveal><div className="eyebrow">04 / THE JOURNEY</div><h2 id="experience-title">Learning by<br/><span className="serif">building.</span></h2><p className="section-lede">Where curiosity meets<br/>real-world experience.</p></div><div className="timeline"><article className="timeline-entry" data-reveal="slide"><div className="timeline-icon"><Workflow size={20}/></div><div className="timeline-meta"><span>DEC 2024 — PRESENT</span><span className="current-badge">Current</span></div><h3>Software Engineer — Applied AI</h3><span className="company-link">Bitontree</span><p>Building production AI across analytics, ecommerce, recruitment, and automation. Owning projects from requirement discovery and architecture to deployment and client delivery.</p><p>Working directly with stakeholders to connect LLMs, APIs, databases, and cloud services into reliable business workflows.</p></article><article className="timeline-entry education-entry" data-reveal="slide"><div className="timeline-icon"><GraduationCap size={21}/></div><div className="timeline-meta"><span>2021 — 2025</span></div><h3>B.Tech in Information Technology</h3><span className="company-link">Dharmsinh Desai University</span><p>Building the foundation. CPI: 8.04 / 10.</p></article></div></section>
      <Contact/>
    </main><footer className="container site-footer"><a className="brand" href="#top" aria-label="Back to top"><BrandMark/><span className="footer-name">Priyansh</span></a><p>© {new Date().getFullYear()} Priyansh Dobariya</p><span>Built with intention. And a little AI.</span><a className="back-top" href="#top">Back to top <ArrowUp size={16}/></a></footer>
  </>;
}
