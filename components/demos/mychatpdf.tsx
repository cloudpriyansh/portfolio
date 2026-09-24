'use client';
import { useState } from 'react';
import styles from './mychatpdf.module.css';

const pages = [
  { title: 'Service Handbook', body: 'Customer Support Coverage\n\nSupport coverage runs Monday to Friday, 09:00–18:00 IST. Priority incidents are acknowledged within two business hours.\n\nTeams should include the affected workspace, impact, and recent changes when reporting an incident.' },
  { title: 'Escalation Policy', body: 'Priority and ownership\n\nPriority incidents move to the on-call owner after acknowledgement. Updates are shared every sixty minutes until service is restored.\n\nThe incident owner records the resolution and follow-up actions.' },
  { title: 'Account Setup', body: 'Workspace onboarding\n\nNew accounts begin with a guided workspace setup. An administrator can invite team members from the Members screen and assign access by role.' }
];
type Message = { role:'user'|'assistant'; text:string; page?:number };
export function MyChatPdf() {
  const [page,setPage]=useState(1); const [zoom,setZoom]=useState(100); const [view,setView]=useState<'pdf'|'split'|'chat'>('split');
  const [tier,setTier]=useState<'Fast'|'Quality'>('Fast'); const [draft,setDraft]=useState(''); const [messages,setMessages]=useState<Message[]>([]);
  function ask(value:string){ const q=value.trim(); if(!q)return; const lower=q.toLowerCase(); let answer:Message;
    if(/hour|open|coverage/.test(lower)) answer={role:'assistant',text:'Support coverage runs Monday to Friday, 09:00–18:00 IST.',page:1};
    else if(/priority|incident|acknowledge/.test(lower)) answer={role:'assistant',text:'Priority incidents are acknowledged within two business hours and then move to the on-call owner.',page:1};
    else if(/invite|member|account|setup/.test(lower)) answer={role:'assistant',text:'New accounts start with guided setup. Administrators invite team members from the Members screen.',page:3};
    else answer={role:'assistant',text:'I could not find that in this sample document. Try asking about support hours, priority incidents, or inviting team members.'};
    setMessages(items=>[...items,{role:'user',text:q},answer]); setDraft('');
  }
  return <div className={styles.app}>
    <header className={styles.header}><div className={styles.brand}><span>◆</span> MyChatPDF</div><div className={styles.doc}><b>Service handbook.pdf</b><small>Ready · 3 pages</small></div><div className={styles.views}>{(['pdf','split','chat'] as const).map(item=><button key={item} aria-pressed={view===item} onClick={()=>setView(item)}>{item==='pdf'?'▤':item==='split'?'◫':'◌'}<span>{item}</span></button>)}</div></header>
    <div className={styles.mobileTabs}><button onClick={()=>setView('pdf')}>Document</button><button onClick={()=>setView('chat')}>Chat</button></div>
    <div className={styles.body} data-view={view}>
      {view!=='chat'&&<section className={styles.viewer}><div className={styles.viewerBar}><button disabled={page===1} onClick={()=>setPage(v=>v-1)}>‹</button><span>Page <b>{page}</b> / {pages.length}</span><button disabled={page===pages.length} onClick={()=>setPage(v=>v+1)}>›</button><div/><button onClick={()=>setZoom(v=>Math.max(75,v-25))}>−</button><span>{zoom}%</span><button onClick={()=>setZoom(v=>Math.min(150,v+25))}>+</button></div><div className={styles.canvas}><article style={{transform:`scale(${zoom/100})`}}><div className={styles.pdfBrand}>MYCHATPDF</div><h2>{pages[page-1].title}</h2>{pages[page-1].body.split('\n').map((line,i)=>line?<p key={i}>{line}</p>:<br key={i}/>) }<footer>{page}</footer></article></div></section>}
      {view==='split'&&<div className={styles.resizer} aria-hidden="true">⋮</div>}
      {view!=='pdf'&&<section className={styles.chat}><div className={styles.chatHead}><p>CONVERSATION</p><h3>Ask this document</h3><div className={styles.fileChip}>▤ Service handbook.pdf <small>PDF</small></div></div><div className={styles.messages}>{!messages.length&&<><div className={styles.intro}>Ask anything about this document. Answers cite the page they come from.</div><div className={styles.prompts}>{['What are the support hours?','How are priority incidents handled?','Who invites team members?'].map(q=><button key={q} onClick={()=>ask(q)}>{q}</button>)}</div></>}{messages.map((m,i)=><article key={i} data-role={m.role}>{m.role==='assistant'&&<span className={styles.bot}>◆</span>}<div>{m.text}{m.page&&<button className={styles.citation} onClick={()=>{setPage(m.page!);setView('split')}}>▤ Service handbook.pdf · page {m.page}</button>}</div></article>)}</div><form className={styles.composer} onSubmit={e=>{e.preventDefault();ask(draft)}}><div className={styles.toggle}><button type="button" aria-pressed={tier==='Fast'} onClick={()=>setTier('Fast')}>⚡ Fast</button><button type="button" aria-pressed={tier==='Quality'} onClick={()=>setTier('Quality')}>✦ Quality</button></div><div className={styles.input}><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask about this document…"/><button disabled={!draft.trim()} aria-label="Send question">➤</button></div><small>Answers are grounded in the visible sample pages.</small></form></section>}
    </div>
  </div>;
}
