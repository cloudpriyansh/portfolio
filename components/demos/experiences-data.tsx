'use client';

import { useEffect, useMemo, useState } from 'react';
import { demoStyles as styles } from './demo-tailwind';
import { Growstack } from './growstack';
import { MyChatPdf as SourceMyChatPdf } from './mychatpdf';

function downloadCsv(filename: string, rows: string[][]) {
  const escape = (value: string) => {
    const safe = /^[=+\-@\t\r]/.test(value) ? `\t${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const csv = rows.map(row => row.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Passage = { page: number; text: string; topics: string[] };
const documents: { id: string; name: string; passages: Passage[]; suggestions: string[] }[] = [
  { id: 'handbook', name: 'Service handbook', suggestions: ['What are the support hours?', 'How quickly are priority incidents acknowledged?'], passages: [
    { page: 2, text: 'Support coverage runs Monday to Friday, 09:00–18:00 IST.', topics: ['hours', 'coverage', 'support', 'open'] },
    { page: 5, text: 'Priority incidents are acknowledged within two business hours.', topics: ['incident', 'priority', 'acknowledged', 'response'] },
  ] },
  { id: 'onboarding', name: 'Onboarding guide', suggestions: ['How do new accounts start?', 'Who invites team members?'], passages: [
    { page: 1, text: 'New accounts start with a guided workspace setup.', topics: ['account', 'start', 'setup', 'onboard'] },
    { page: 3, text: 'An administrator invites team members from the Members screen.', topics: ['invite', 'members', 'administrator', 'team'] },
  ] },
];
type Answer = { question: string; text: string; page: number | null };
function MyChatPdf() {
  const [docIndex, setDocIndex] = useState(0);
  const [question, setQuestion] = useState(documents[0].suggestions[0]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [focusedPage, setFocusedPage] = useState<number | null>(null);
  const doc = documents[docIndex];

  function ask() {
    const text = question.trim(); if (!text) return;
    const tokens = text.toLowerCase().split(/[^a-z]+/).filter(token => token.length >= 4);
    const scored = doc.passages.map(passage => ({ passage, score: passage.topics.filter(topic => tokens.some(token => token.includes(topic) || topic.includes(token))).length }));
    const best = scored.sort((a, b) => b.score - a.score)[0];
    const answer = best?.score ? { question: text, text: best.passage.text, page: best.passage.page } : { question: text, text: 'This sample document does not contain a supported answer. Choose one of the suggested questions or inspect the passages.', page: null };
    setAnswers(items => [...items, answer]); setQuestion(''); setFocusedPage(null);
  }

  return <div className={styles.grid}>
    <div className={styles.card}>
      <h3>Document viewer</h3>
      <label className={styles.label} htmlFor="document-select">Document</label>
      <select id="document-select" className={styles.select} value={doc.id} onChange={event => { const index = documents.findIndex(item => item.id === event.target.value); setDocIndex(index); setQuestion(documents[index].suggestions[0]); setAnswers([]); setFocusedPage(null); }}>{documents.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      {doc.passages.map(passage => <article key={passage.page} id={`${doc.id}-page-${passage.page}`} className={styles.step} data-active={focusedPage === passage.page}><strong>Page {passage.page}</strong><p>{passage.text}</p></article>)}
      <p className={styles.hint}>Synthetic excerpts stand in for source pages; no personal document is uploaded.</p>
    </div>
    <div className={styles.card}>
      <h3>Ask the document</h3>
      <div className={styles.choices}>{doc.suggestions.map(suggestion => <button className={styles.choice} type="button" key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}</button>)}</div>
      <form onSubmit={event => { event.preventDefault(); ask(); }}><label className={styles.label} htmlFor="pdf-question">Question</label><input id="pdf-question" className={styles.input} value={question} maxLength={180} onChange={event => setQuestion(event.target.value)}/><div className={styles.actions}><button className={styles.primary} type="submit" disabled={!question.trim()}>Find answer</button><button className={styles.button} type="button" disabled={!answers.length} onClick={() => { setAnswers([]); setFocusedPage(null); }}>Clear conversation</button></div></form>
      <ol className={styles.timeline} aria-live="polite">{answers.map((answer, index) => <li key={`${answer.question}-${index}`}><strong>You:</strong> {answer.question}<div className={styles.output}><strong>Answer:</strong> {answer.text}{answer.page !== null && <p><button className={styles.button} type="button" onClick={() => { setFocusedPage(answer.page); document.getElementById(`${doc.id}-page-${answer.page}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }}>View page {answer.page} citation</button></p>}</div></li>)}</ol>
      {!answers.length && <p className={styles.hint}>Choose a suggestion or ask a question. Answers cite the visible sample passages.</p>}
    </div>
  </div>;
}

type EventCandidate = { id: string; name: string; city: string; category: string; price: number; day: number; source: string; duplicateOf?: string };
const eventCandidates: EventCandidate[] = [
  { id: 'builders', name: 'Builders Meetup', city: 'Bengaluru', category: 'Technology', price: 0, day: 14, source: 'Community calendar' },
  { id: 'design', name: 'Design Exchange', city: 'Mumbai', category: 'Design', price: 800, day: 21, source: 'Organizer listing' },
  { id: 'founders', name: 'Founders Forum', city: 'Bengaluru', category: 'Business', price: 1200, day: 32, source: 'Venue calendar' },
  { id: 'builders-mirror', name: 'Builders Meetup', city: 'Bengaluru', category: 'Technology', price: 0, day: 14, source: 'Mirror listing', duplicateOf: 'builders' },
];
function EPulse() {
  const [city, setCity] = useState('Any');
  const [category, setCategory] = useState('Any');
  const [budget, setBudget] = useState('Any');
  const [deduped, setDeduped] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [originDate] = useState(() => new Date());
  const visible = eventCandidates.filter(item => (!deduped || !item.duplicateOf) && (city === 'Any' || item.city === city) && (category === 'Any' || item.category === category) && (budget === 'Any' || item.price <= Number(budget)));
  const saved = eventCandidates.filter(item => shortlist.includes(item.id));
  const dateLabel = (days: number) => { const date = new Date(originDate); date.setDate(date.getDate() + days); return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };

  return <div className={styles.grid}>
    <div className={styles.card}>
      <h3>Event discovery</h3>
      <div className={styles.metrics}><div className={styles.metric}>Candidates<strong>{eventCandidates.length}</strong></div><div className={styles.metric}>Visible<strong>{visible.length}</strong></div><div className={styles.metric}>Duplicates<strong>{deduped ? 'Hidden' : '1'}</strong></div></div>
      <div className={styles.two}><div><label className={styles.label} htmlFor="event-city">City</label><select id="event-city" className={styles.select} value={city} onChange={event => setCity(event.target.value)}>{['Any', 'Bengaluru', 'Mumbai'].map(value => <option key={value}>{value}</option>)}</select></div><div><label className={styles.label} htmlFor="event-category">Category</label><select id="event-category" className={styles.select} value={category} onChange={event => setCategory(event.target.value)}>{['Any', 'Technology', 'Design', 'Business'].map(value => <option key={value}>{value}</option>)}</select></div></div>
      <label className={styles.label} htmlFor="event-budget">Maximum ticket price</label><select id="event-budget" className={styles.select} value={budget} onChange={event => setBudget(event.target.value)}><option value="Any">Any</option><option value="0">Free</option><option value="1000">₹1,000</option></select>
      <div className={styles.actions}><button className={styles.button} type="button" onClick={() => { setDeduped(value => !value); setShortlist(items => items.filter(id => id !== 'builders-mirror')); }}>{deduped ? 'Show duplicate' : 'Remove duplicate'}</button><button className={styles.button} type="button" onClick={() => { setCity('Any'); setCategory('Any'); setBudget('Any'); }}>Clear filters</button></div>
      <ul className={styles.list}>{visible.map(item => <li key={item.id}><strong>{item.name}</strong> · {item.city} · {dateLabel(item.day)} · {item.category} · {item.price ? `₹${item.price}` : 'Free'}<br/><small>Source: {item.source}{item.duplicateOf ? ' · Possible duplicate of Community calendar listing' : ''}</small><br/><button className={styles.button} type="button" onClick={() => setShortlist(items => items.includes(item.id) ? items.filter(id => id !== item.id) : [...items, item.id])}>{shortlist.includes(item.id) ? 'Remove from shortlist' : 'Add to shortlist'}</button></li>)}</ul>
      {!visible.length && <p role="status">No sample events match. Clear or widen the filters.</p>}
    </div>
    <div className={styles.card}>
      <h3>Reviewed shortlist · {saved.length}</h3>
      {saved.length ? <ul className={styles.list}>{saved.map(item => <li key={item.id}>{item.name} · {dateLabel(item.day)}<br/><small>{item.source}</small></li>)}</ul> : <p>Review an event to add it here.</p>}
      <div className={styles.actions}><button className={styles.primary} type="button" disabled={!saved.length} onClick={() => downloadCsv('epulse-shortlist.csv', [['Event', 'City', 'Category', 'Date', 'Source'], ...saved.map(item => [item.name, item.city, item.category, dateLabel(item.day), item.source])])}>Download current shortlist</button><button className={styles.button} type="button" disabled={!saved.length} onClick={() => setShortlist([])}>Clear shortlist</button></div>
      <p className={styles.hint}>Dates are relative to today and all listings are illustrative. No live scraping, booking, or outreach occurs.</p>
    </div>
  </div>;
}

const candles = [101, 103, 102, 105, 107, 104, 108, 110, 107, 111];
type LedgerEntry = { candle: number; price: number; status: 'paper order' | 'blocked'; reason: string };
function Trading() {
  const [step, setStep] = useState(0);
  const [gate, setGate] = useState<'ready' | 'blocked'>('ready');
  const [playing, setPlaying] = useState(false);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [mismatch, setMismatch] = useState(false);
  const finished = step === candles.length - 1;
  useEffect(() => { if (!playing || finished || mismatch) return; const timer = window.setTimeout(() => advance(), 650); return () => window.clearTimeout(timer); }, [playing, step, finished, mismatch]);
  function advance() {
    if (finished || mismatch) return;
    const next = step + 1;
    setStep(next);
    if (next === 3 || next === 6) setLedger(items => [...items, { candle: next + 1, price: candles[next], status: gate === 'ready' ? 'paper order' : 'blocked', reason: gate === 'ready' ? 'Risk gate passed' : 'Risk limit closed' }]);
    if (next === candles.length - 1) setPlaying(false);
  }
  function restart(nextGate: 'ready' | 'blocked' = 'ready') { setPlaying(false); setStep(0); setGate(nextGate); setLedger([]); setMismatch(false); }
  const points = candles.map((value, index) => `${24 + index * 42},${126 - (value - 100) * 8}`).join(' ');
  return <div className={styles.grid}>
    <div className={styles.card}>
      <h3>Paper strategy replay</h3><p className={styles.hint}>Synthetic prices · no market feed or real orders</p>
      <svg viewBox="0 0 440 150" role="img" aria-label={`Synthetic price chart. Current candle ${step + 1} of ${candles.length}; value ${candles[step]}`} style={{ width: '100%', background: 'var(--surface)', borderRadius: 8 }}><polyline points={points} fill="none" stroke="var(--line)" strokeWidth="3"/><polyline points={candles.slice(0, step + 1).map((value, index) => `${24 + index * 42},${126 - (value - 100) * 8}`).join(' ')} fill="none" stroke="var(--accent)" strokeWidth="4"/><circle cx={24 + step * 42} cy={126 - (candles[step] - 100) * 8} r="6" fill="var(--accent)"/></svg>
      <div className={styles.metrics}><div className={styles.metric}>Candle<strong>{step + 1} / {candles.length}</strong></div><div className={styles.metric}>Fixture price<strong>₹{candles[step]}</strong></div><div className={styles.metric}>Gate<strong>{gate === 'ready' ? 'Ready' : 'Blocked'}</strong></div></div>
      <label className={styles.label} htmlFor="trade-gate">Execution gate for future signals</label><select id="trade-gate" className={styles.select} value={gate} onChange={event => setGate(event.target.value as 'ready' | 'blocked')}><option value="ready">Ready</option><option value="blocked">Blocked by risk limit</option></select>
      <div className={styles.actions}><button className={styles.primary} type="button" disabled={finished || mismatch} onClick={() => setPlaying(value => !value)}>{playing ? 'Pause replay' : 'Run replay'}</button><button className={styles.button} type="button" disabled={playing || finished || mismatch} onClick={advance}>Next candle</button><button className={styles.button} type="button" onClick={() => restart('blocked')}>Try blocked gate</button><button className={styles.button} type="button" onClick={() => restart()}>Restart</button></div>
    </div>
    <div className={styles.card}><h3>Execution ledger</h3>{ledger.length ? <ol className={styles.list}>{ledger.map(entry => <li key={entry.candle}><span className={styles.status}>{entry.status}</span> Candle {entry.candle}, ₹{entry.price} · {entry.reason}</li>)}</ol> : <p>Signals occur at candles 4 and 7. Step or run the replay to inspect gate decisions.</p>}
      <div className={styles.divider}/><button className={styles.button} type="button" disabled={!ledger.length} onClick={() => { setPlaying(false); setMismatch(value => !value); }}>{mismatch ? 'Reconcile paper ledger' : 'Simulate broker mismatch'}</button><p role="status">{mismatch ? 'Mismatch detected. Replay is paused until the paper ledger is reconciled.' : ledger.length ? 'Paper ledger and simulated broker record agree.' : 'No execution to reconcile yet.'}</p><p className={styles.hint}>P&amp;L and profitability are intentionally omitted. This workspace highlights execution gates and reconciliation.</p>
    </div>
  </div>;
}

export function DataDemos({ slug }: { slug: string }) {
  switch (slug) {
    case 'growstack': return <Growstack />;
    case 'mychatpdf': return <SourceMyChatPdf />;
    case 'epulse-discovery': return <EPulse />;
    case 'trading-engine': return <Trading />;
    default: return null;
  }
}
