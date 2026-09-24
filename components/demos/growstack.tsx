'use client';

import { useMemo, useState } from 'react';
import styles from './growstack.module.css';

type Company = { id: string; name: string; industry: string; city: string; size: string; description: string };
type Contact = { id: string; name: string; role: string; companyId: string };
type Filters = { industry: string; city: string; size: string; role: string };
const empty: Filters = { industry: 'All industries', city: 'All cities', size: 'All sizes', role: 'All roles' };
const companies: Company[] = [
  { id: 'cedar', name: 'Cedar Labs', industry: 'Software', city: 'Bengaluru', size: '51–200', description: 'Cloud applications and data platforms for growing teams.' },
  { id: 'pine', name: 'Pine Data', industry: 'Software', city: 'Bengaluru', size: '11–50', description: 'Analytics infrastructure for product teams.' },
  { id: 'mosaic', name: 'Mosaic Cloud', industry: 'Software', city: 'Pune', size: '11–50', description: 'Managed cloud operations for businesses.' },
  { id: 'orbit', name: 'Orbit Systems', industry: 'Software', city: 'Mumbai', size: '201–500', description: 'Enterprise workflow software.' },
  { id: 'northline', name: 'Northline Health', industry: 'Healthcare', city: 'Mumbai', size: '201–500', description: 'Connected care and clinical operations.' },
  { id: 'saffron', name: 'Saffron Health', industry: 'Healthcare', city: 'Bengaluru', size: '51–200', description: 'Patient engagement tools for care teams.' },
  { id: 'veda', name: 'Veda Care', industry: 'Healthcare', city: 'Pune', size: '11–50', description: 'Care coordination for local providers.' },
  { id: 'urban', name: 'Urban Cart', industry: 'Retail', city: 'Mumbai', size: '51–200', description: 'Digital commerce and local fulfillment.' },
  { id: 'loop', name: 'Local Loop', industry: 'Retail', city: 'Bengaluru', size: '201–500', description: 'Neighborhood retail operations.' },
  { id: 'marigold', name: 'Marigold Market', industry: 'Retail', city: 'Pune', size: '51–200', description: 'Omnichannel consumer marketplace.' },
];
const contacts: Contact[] = [
  { id: 'a', name: 'Aarav Mehta', role: 'Engineering', companyId: 'cedar' }, { id: 'b', name: 'Diya Shah', role: 'Sales', companyId: 'cedar' },
  { id: 'c', name: 'Ishaan Rao', role: 'Engineering', companyId: 'pine' }, { id: 'd', name: 'Ananya Kulkarni', role: 'Marketing', companyId: 'mosaic' },
  { id: 'e', name: 'Kabir Sethi', role: 'Sales', companyId: 'orbit' }, { id: 'f', name: 'Neha Iyer', role: 'Engineering', companyId: 'northline' },
  { id: 'g', name: 'Riya Nair', role: 'Marketing', companyId: 'saffron' }, { id: 'h', name: 'Dev Joshi', role: 'Sales', companyId: 'veda' },
  { id: 'i', name: 'Mira Patel', role: 'Marketing', companyId: 'urban' }, { id: 'j', name: 'Arjun Singh', role: 'Engineering', companyId: 'loop' },
  { id: 'k', name: 'Tara Desai', role: 'Sales', companyId: 'marigold' },
];
const examples = ['Software companies in Bengaluru', 'Healthcare companies in Mumbai with engineering contacts', 'Retail companies in Pune with 51–200 employees'];
const options = { industry: ['All industries', 'Software', 'Healthcare', 'Retail'], city: ['All cities', 'Bengaluru', 'Mumbai', 'Pune'], size: ['All sizes', '11–50', '51–200', '201–500'], role: ['All roles', 'Engineering', 'Sales', 'Marketing'] };

function parse(question: string): Filters | null {
  const text = question.toLowerCase();
  const industry = /software|saas|tech|cloud/.test(text) ? 'Software' : /health|care|medical/.test(text) ? 'Healthcare' : /retail|commerce|marketplace/.test(text) ? 'Retail' : empty.industry;
  const city = /bengaluru|bangalore/.test(text) ? 'Bengaluru' : /mumbai/.test(text) ? 'Mumbai' : /pune/.test(text) ? 'Pune' : empty.city;
  const size = /(?:11\s*[-–]\s*50|small compan)/.test(text) ? '11–50' : /(?:51\s*[-–]\s*200|mid.?size)/.test(text) ? '51–200' : /(?:201\s*[-–]\s*500|large compan)/.test(text) ? '201–500' : empty.size;
  const role = /engineer|developer/.test(text) ? 'Engineering' : /sales/.test(text) ? 'Sales' : /market(ing|er)/.test(text) ? 'Marketing' : empty.role;
  return [industry, city, size, role].some((value, index) => value !== Object.values(empty)[index]) ? { industry, city, size, role } : null;
}

export function Growstack() {
  const [question, setQuestion] = useState('');
  const [applied, setApplied] = useState('');
  const [filters, setFilters] = useState<Filters>(empty);
  const [feedback, setFeedback] = useState('Ask a question or choose a suggestion to filter the data.');
  const [tab, setTab] = useState<'companies' | 'contacts'>('companies');
  const [selected, setSelected] = useState<{ kind: 'company' | 'contact'; id: string } | null>(null);
  const matchedCompanies = useMemo(() => companies.filter(item =>
    (filters.industry === empty.industry || item.industry === filters.industry) &&
    (filters.city === empty.city || item.city === filters.city) &&
    (filters.size === empty.size || item.size === filters.size) &&
    (filters.role === empty.role || contacts.some(person => person.companyId === item.id && person.role === filters.role))
  ), [filters]);
  const matchedContacts = useMemo(() => contacts.filter(item => matchedCompanies.some(company => company.id === item.companyId) && (filters.role === empty.role || item.role === filters.role)), [matchedCompanies, filters.role]);
  const selectedCompany = selected?.kind === 'company' ? companies.find(item => item.id === selected.id) : undefined;
  const selectedContact = selected?.kind === 'contact' ? contacts.find(item => item.id === selected.id) : undefined;

  function ask(value: string) {
    const next = parse(value);
    if (!next) { setFeedback('Try an industry, city, team size, or contact role from the suggestions below.'); return; }
    setQuestion(value); setApplied(value); setFilters(next); setSelected(null); setTab(next.role !== empty.role ? 'contacts' : 'companies');
    setFeedback('Question mapped to the filters shown below. Results updated locally.');
  }
  function update(key: keyof Filters, value: string) {
    setFilters(current => ({ ...current, [key]: value })); setSelected(null); setApplied('Filters refined manually');
    setFeedback('Results updated from the selected filters.');
  }
  function clear() { setQuestion(''); setApplied(''); setFilters(empty); setSelected(null); setTab('companies'); setFeedback('All filters cleared.'); }

  return <div className={styles.workspace}>
    <aside className={styles.sidebar} aria-label="Growstack navigation"><div className={styles.brand}><span className={styles.brandMark}>✦</span><span>Growstack <b>AI</b></span></div><div className={styles.sideLabel}>AI STUDIO</div><div className={styles.sideActive}>◈ &nbsp; AI Chat</div><div className={styles.sideLabel}>YOUR WORKSPACE</div><p className={styles.sideText}>Ask for a segment, inspect its filters, and follow the links between companies and contacts.</p><div className={styles.sideBottom}><span className={styles.statusDot}/> Local sample workspace</div></aside>
    <main className={styles.main}>
      <div className={styles.topline}><span>AI Studio <span className={styles.chevron}>/</span> AI Chat</span><span className={styles.samplePill}>Sample data</span></div>
      <header className={styles.hero}><div className={styles.icon}>✦</div><h3>What would you like to find?</h3><p>Search for companies, contacts, and the connections between them.</p></header>
      <form className={styles.search} onSubmit={event => { event.preventDefault(); if (question.trim()) ask(question.trim()); }}><label className={styles.visuallyHidden} htmlFor="growstack-question">Ask Growstack a question</label><input id="growstack-question" value={question} onChange={event => setQuestion(event.target.value)} maxLength={160} placeholder="Search for companies, investors, and more"/><button type="submit" disabled={!question.trim()} aria-label="Apply question as filters">↗</button></form>
      <div className={styles.suggestions} aria-label="Suggested questions">{examples.map(example => <button key={example} type="button" onClick={() => ask(example)}>{example} <span>↗</span></button>)}</div>
      <p role="status" className={styles.feedback}>{feedback}</p>
      <div className={styles.resultsHeading}><div><span className={styles.overline}>EXPLORE YOUR DATA</span><h3>Data Results</h3><p>{applied ? `“${applied}”` : 'All available sample records'}</p></div><div className={styles.scale}><strong>300M+ records</strong><span>ClickHouse-backed source architecture</span></div></div>
      <div className={styles.resultsLayout}><aside className={styles.filters} aria-label="Applied filters"><div className={styles.filterHead}><strong>Filters</strong><button type="button" onClick={clear}>Clear all</button></div>{(Object.keys(options) as (keyof Filters)[]).map(key => <label key={key} className={styles.filter}><span>{key === 'size' ? 'Company size' : key === 'role' ? 'Contact role' : key[0].toUpperCase() + key.slice(1)}</span><select value={filters[key]} onChange={event => update(key, event.target.value)}>{options[key].map(value => <option key={value}>{value}</option>)}</select></label>)}<div className={styles.filterFoot}>{Object.keys(filters).filter(key => filters[key as keyof Filters] !== empty[key as keyof Filters]).length} active filters</div></aside>
        <div className={styles.dataPanel}><div className={styles.tabs} role="tablist" aria-label="Result type"><button type="button" role="tab" aria-selected={tab === 'companies'} onClick={() => { setTab('companies'); setSelected(null); }}>Companies <span>{matchedCompanies.length}</span></button><button type="button" role="tab" aria-selected={tab === 'contacts'} onClick={() => { setTab('contacts'); setSelected(null); }}>Contacts <span>{matchedContacts.length}</span></button></div><div className={styles.resultMeta}><span>{tab === 'companies' ? matchedCompanies.length : matchedContacts.length} matching {tab}</span><span>Linked records available in each profile</span></div>
          <div className={styles.rows}>{tab === 'companies' ? matchedCompanies.map(company => <button type="button" className={styles.row} key={company.id} onClick={() => setSelected({ kind: 'company', id: company.id })}><span className={styles.avatar}>{company.name[0]}</span><span className={styles.rowTitle}><strong>{company.name}</strong><small>{company.industry} · {company.city}</small></span><span className={styles.rowExtra}>{company.size} employees</span><span className={styles.arrow}>→</span></button>) : matchedContacts.map(contact => <button type="button" className={styles.row} key={contact.id} onClick={() => setSelected({ kind: 'contact', id: contact.id })}><span className={styles.avatar}>{contact.name[0]}</span><span className={styles.rowTitle}><strong>{contact.name}</strong><small>{contact.role} · {companies.find(item => item.id === contact.companyId)?.name}</small></span><span className={styles.arrow}>→</span></button>)}{!(tab === 'companies' ? matchedCompanies.length : matchedContacts.length) && <div className={styles.empty}>No matching records in this sample. Broaden one or more filters.</div>}</div>
          {(selectedCompany || selectedContact) && <div className={styles.detail} aria-live="polite"><div className={styles.detailHead}><div><span className={styles.overline}>LINKED PROFILE</span><h4>{selectedCompany?.name ?? selectedContact?.name}</h4></div><button type="button" onClick={() => setSelected(null)} aria-label="Close profile">×</button></div>{selectedCompany ? <><p>{selectedCompany.description}</p><div className={styles.detailFacts}><span>{selectedCompany.industry}</span><span>{selectedCompany.city}</span><span>{selectedCompany.size} employees</span></div><strong>People at {selectedCompany.name}</strong><div className={styles.linked}>{contacts.filter(item => item.companyId === selectedCompany.id).map(person => <button type="button" key={person.id} onClick={() => { setTab('contacts'); setSelected({ kind: 'contact', id: person.id }); }}>{person.name}<small>{person.role} →</small></button>)}</div></> : selectedContact && <><p>{selectedContact.role} contact linked to the company record.</p><strong>Company relationship</strong><div className={styles.linked}><button type="button" onClick={() => { setTab('companies'); setSelected({ kind: 'company', id: selectedContact.companyId }); }}>{companies.find(item => item.id === selectedContact.companyId)?.name}<small>View company →</small></button></div></>}</div>}
        </div></div><p className={styles.disclosure}>This interface uses a small local sample to illustrate the Growstack question-to-filter workflow. It makes no live ClickHouse query or performance measurement.</p>
    </main>
  </div>;
}
