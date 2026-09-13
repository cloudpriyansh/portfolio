'use client';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Mail, LoaderCircle, CheckCircle2 } from 'lucide-react';
import { profile } from '@/lib/content';
import styles from './contact.module.css';
export function Contact() {
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const [error,setError]=useState('');
  const busy=useRef(false);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(busy.current)return;
    busy.current=true;setStatus('sending');setError('');
    const form=event.currentTarget;const data=Object.fromEntries(new FormData(form));
    try {
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(20000)});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'Your message could not be sent. Please try again or email me directly.');
      setStatus('success');form.reset();
    } catch(err) {setStatus('error');setError(err instanceof Error && err.name==='TimeoutError' ? 'The request timed out. Please email me directly if you do not receive a reply.' : err instanceof Error ? err.message : 'Please try again or email me directly.');}
    finally {busy.current=false;}
  }
  return <section id="contact" className={styles.section} aria-labelledby="contact-title"><div className={`container ${styles.grid}`}>
    <div className={styles.intro}><div className="eyebrow">05 / LET’S TALK</div><h2 id="contact-title">Have an idea?<br/><span>Let’s build it.</span></h2><p>Tell me what you’re working on, what you need, and where you’d like to take it.</p><a className={styles.email} href={`mailto:${profile.email}`}><Mail size={19}/><span>{profile.email}</span></a><a className={styles.linkedin} href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn <ArrowUpRight size={17}/></a></div>
    <form className={styles.form} onSubmit={submit} aria-busy={status==='sending'}>
      <div className={styles.row}><label>Your name <input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Alex Morgan"/></label><label>Email address <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="alex@company.com"/></label></div>
      <label>What can I help with? <select name="projectType" defaultValue=""><option value="" disabled>Select a project type (optional)</option><option>Full-stack development</option><option>AI agents & RAG</option><option>Automation & integrations</option><option>Something else</option></select></label>
      <label>Tell me about your project <textarea name="message" required minLength={20} maxLength={5000} rows={5} placeholder="The idea, the challenge, and what you have in mind…"/></label>
      <div className={styles.trap} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <div className={styles.actions}><p>I’ll use these details only to respond to your enquiry.</p><button type="submit" disabled={status==='sending'}>{status==='sending'?<><LoaderCircle className={styles.spinner} size={18}/> Sending…</>:<>Send message <ArrowUpRight size={18}/></>}</button></div>
      <div role="status" aria-live="polite">{status==='success'&&<p className={styles.success}><CheckCircle2 size={18}/> Your message has been sent. Thanks for reaching out!</p>}{status==='error'&&<p className={styles.error}>{error} <a href={`mailto:${profile.email}`}>Email me directly</a>.</p>}</div>
    </form>
  </div></section>;
}
