'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './project-tour.module.css';

type Scene = { title: string; body: string; metric: string; label: string; status: string; rows: [string, string, string] };
type Tour = { brand: string; eyebrow: string; problem: string; outcome: string; accent: string; steps: [Scene, Scene, Scene, Scene] };
const s = (title: string, body: string, metric: string, label: string, status: string, rows: [string, string, string]): Scene => ({ title, body, metric, label, status, rows });

const tours: Record<string, Tour> = {
  growstack: { brand: 'Growstack', eyebrow: 'CONVERSATIONAL ANALYTICS', problem: 'Business teams should not need to hand-write database filters to find their next market.', outcome: 'A question becomes inspectable filters and linked company and contact results.', accent: '#6b5ce7', steps: [
    s('Ask a business question', 'A user describes the companies they want. The Python service classifies the intent before producing structured criteria.', '01', 'Natural-language request', 'Question received', ['SaaS companies in Europe', '50–500 employees', 'Recently funded']),
    s('Inspect the filter plan', 'A LangGraph filter agent makes the extracted criteria explicit instead of hiding them in a generated answer.', '03', 'Structured filters', 'Ready to refine', ['Industry · SaaS', 'Region · Europe', 'Headcount · 50–500']),
    s('Explore matching records', 'ClickHouse filtering narrows the company set while the interface exposes every applied condition.', '128', 'Matching records', 'Filters applied', ['Northstar Labs · 220 employees', 'Meridian Cloud · 84 employees', 'SignalWorks · 410 employees']),
    s('Follow linked data', 'Each matching company opens into its related people records so a user can move across the dataset without losing the active filters.', '12', 'Linked contacts', 'Relationships ready', ['Company profile', 'Contact role', 'Back to company']),
  ] },
  zyberon: { brand: 'Zyberon', eyebrow: 'SHOPIFY OPERATIONS', problem: 'Merchants work across disconnected support, campaign, content, and store tools.', outcome: 'One dashboard carries store context into reviewable AI and automation workflows.', accent: '#7b58dc', steps: [
    s('Connect store context', 'Products, orders, and account permissions give each workflow a common starting point.', '01', 'Connected store', 'Store context ready', ['Shopify product catalog', 'Order and customer context', 'Account feature access']),
    s('Create a campaign brief', 'Select a product, creative source, audience, countries, and budget before requesting generation.', '04', 'Brief sections', 'Draft ready', ['Product · Everyday bottle', 'Audience · Fitness buyers', 'Creative · Product image']),
    s('Check limits and dispatch', 'The server action checks account availability before accepting an asynchronous n8n campaign request.', '01', 'Pending request', 'Accepted locally', ['Feature quota checked', 'Request queued', 'Campaign status pending']),
    s('Review the outcome', 'The dashboard surfaces generation status, campaign identifiers, and failures for the seller to inspect.', '03', 'Review states', 'Human review', ['Creative generated', 'Meta campaign status', 'Support and profit modules']),
  ] },
  'voice-agent': { brand: 'Voice operations', eyebrow: 'AI OUTBOUND CALLING', problem: 'First contact with a lead can stall before qualification or scheduling.', outcome: 'Call outcomes lead to a booking, callback, or opt-out path with saved state.', accent: '#e16985', steps: [
    s('Choose a campaign lead', 'The campaign and prospect services select a sample lead and prepare the call context.', '01', 'Prospect selected', 'Ready to call', ['Campaign · Home services', 'Lead · Sample prospect', 'Context · Requested quote']),
    s('Start the voice call', 'The backend initiates a Retell call and tracks the resulting conversation state.', '00:42', 'Sample call duration', 'In conversation', ['Agent greeting', 'Prospect intent', 'Qualification questions']),
    s('Branch on the outcome', 'A connected prospect can move to scheduling; no-answer and opt-out outcomes take different routes.', '03', 'Possible outcomes', 'Outcome classified', ['Interested · booking', 'No answer · callback', 'Opt out · no follow-up']),
    s('Close the loop', 'Calendly and callback jobs turn the outcome into a visible next step while preserving prospect state.', '01', 'Follow-up action', 'Recorded locally', ['Sample appointment', 'Callback queue', 'Recovery on retry']),
  ] },
  mychatpdf: { brand: 'MyChatPDF', eyebrow: 'DOCUMENT INTELLIGENCE', problem: 'A useful answer from a long PDF needs a path back to the original passage.', outcome: 'Document-scoped retrieval puts the answer and its source side by side.', accent: '#6172d7', steps: [
    s('Build a document library', 'A file is organized in a workspace while processing extracts searchable text.', '03', 'Sample documents', 'Indexed locally', ['Investor brief.pdf', 'Product spec.pdf', 'Policy notes.pdf']),
    s('Ask a precise question', 'The chat request retains the selected document context, so retrieval can target the relevant file.', '01', 'Selected document', 'Question received', ['What is the renewal term?', 'Search in Policy notes.pdf', 'Conversation context retained']),
    s('Retrieve supporting passages', 'A vector search provides candidate passages for the answer rather than an unsupported free-form claim.', '02', 'Supporting passages', 'Sources found', ['Page 4 · renewal clause', 'Page 5 · notice period', 'Citation links prepared']),
    s('Open the evidence', 'The answer cites a passage the reader can jump to in the document preview.', 'p. 4', 'Source location', 'Answer with citation', ['Renewal term summary', 'Citation · Policy notes.pdf', 'Preview opens at the source']),
  ] },
  'workforce-engine': { brand: 'AI Workforce', eyebrow: 'MULTI-AGENT RUNTIME', problem: 'A general assistant cannot safely own every industry task or tool decision.', outcome: 'Specialized agents share bounded context and escalate uncertain work to a person.', accent: '#2d9a96', steps: [
    s('Classify the request', 'A FastAPI router identifies the industry, role, and permitted tools for the task.', '01', 'Active route', 'Router selected', ['Task · product research', 'Industry · commerce', 'Role · research specialist']),
    s('Load scoped context', 'Declarative role files and Redis/Qdrant memory provide the context needed by the selected agent.', '02', 'Memory scopes', 'Context loaded', ['Session context', 'Customer lifecycle context', 'Role-specific instructions']),
    s('Execute a bounded handoff', 'A specialist works through the pipeline and passes structured findings to the next role.', '03', 'Agent steps', 'Handoff visible', ['Research agent', 'Planning agent', 'Writer agent']),
    s('Escalate when needed', 'Low confidence, keywords, or tool failure can stop automation and hand the case to a reviewer.', '01', 'Human checkpoint', 'Review required', ['Confidence check', 'Tool failure recovery', 'Human escalation']),
  ] },
  'top-cars-n8n': { brand: 'Top Cars', eyebrow: 'N8N SALES AUTOMATION', problem: 'A static sales reply loses vehicle, service, and conversation context.', outcome: 'A coordinator sends each question to a specialist workflow and records a CRM-aware reply.', accent: '#ea8057', steps: [
    s('Receive a lead message', 'The n8n webhook normalizes an inbound enquiry and fetches customer vehicle and CRM history.', '01', 'Inbound message', 'Webhook received', ['Vehicle · Meridian Sport', 'Customer question', 'Conversation notes']),
    s('Route to a specialist', 'The main AI agent selects an availability, PPF, coating, tint, warranty, or escalation branch.', '06', 'Service branches', 'Route selected', ['Availability', 'Wrap & PPF', 'Warranty terms']),
    s('Ground the answer', 'A sub-workflow reads its service reference and returns a bounded recommendation or handoff.', '01', 'Sub-workflow result', 'Reference checked', ['Service notes', 'Vehicle fit context', 'Advisor review flag']),
    s('Reply and update CRM', 'Conditional nodes prepare the customer reply and decide whether CRM notes or follow-up are needed.', '02', 'Final actions', 'Simulated reply', ['Contextual customer reply', 'CRM conversation note', 'Human escalation if needed']),
  ] },
  'hotel-social-n8n': { brand: 'Hotel Social', eyebrow: 'N8N SOCIAL AUTOMATION', problem: 'Social messages need a consistent response path without auto-publishing sensitive replies.', outcome: 'Rules triage obvious cases; uncertain drafts wait for human approval.', accent: '#bc70ac', steps: [
    s('Normalize every channel', 'An n8n webhook brings comments and messages into one common event shape.', '02', 'Sample channels', 'Event normalized', ['Meta comment', 'Direct message', 'CRM conversation']),
    s('Use rules first', 'Known cases are filtered before an LLM is asked to draft language.', '01', 'Rule decision', 'Triage complete', ['Enquiry · draft reply', 'Praise · thank-you', 'Complaint · escalation']),
    s('Prepare a reviewable draft', 'The workflow combines channel context and conversation notes into a proposed response.', '01', 'Draft waiting', 'Approval required', ['Guest message', 'Suggested wording', 'Linked CRM context']),
    s('Approve or escalate', 'A Slack interaction confirms, edits, or rejects the action before any public response path.', '01', 'Human decision', 'Held for review', ['Approve reply', 'Reject draft', 'Staff handoff']),
  ] },
  'epulse-discovery': { brand: 'EPulse', eyebrow: 'EVENT RESEARCH', problem: 'Finding relevant future events takes repetitive search and manual deduplication.', outcome: 'A sourced candidate list gives researchers a faster review starting point.', accent: '#5d9e77', steps: [
    s('Set the research category', 'The pipeline generates search queries from a target industry or event category.', '04', 'Search prompts', 'Discovery started', ['Clean energy expos', 'Regional conferences', 'Trade associations']),
    s('Extract event details', 'Public pages are reduced to structured title, date, location, and source fields.', '12', 'Candidate pages', 'Fields extracted', ['Event title', 'Dates and venue', 'Source URL']),
    s('Validate and deduplicate', 'Likely duplicates and incomplete records are flagged before they enter the review list.', '03', 'Duplicates flagged', 'Review needed', ['Date conflict', 'Missing venue', 'Similar event name']),
    s('Send to the review sheet', 'Google Sheets receives records with confidence and source links for a person to verify.', '09', 'Review candidates', 'Sample sheet ready', ['Source URL retained', 'Confidence level', 'Human correction path']),
  ] },
  'trading-engine': { brand: 'Trading Engine', eyebrow: 'EXECUTION INFRASTRUCTURE', problem: 'Backtest decisions can diverge from live broker and market data.', outcome: 'Visible readiness gates and reconciliation make each execution decision inspectable.', accent: '#5785c7', steps: [
    s('Capture market evidence', 'The engine collects ticks and refreshes candidate candles from the broker source before a live decision.', '240', 'Sample ticks', 'Feed captured', ['Tick journal', 'Candidate candle', 'Official refresh']),
    s('Run readiness gates', 'Live execution requires eligible account state, broker connectivity, market-data preflight, and a leader lease.', '04/04', 'Required gates', 'Ready locally', ['Account eligible', 'Feed preflight', 'Leader lease held']),
    s('Evaluate a strategy signal', 'A candidate entry is checked against the strategy and parity conditions. The default path remains execution-disabled.', '01', 'Candidate signal', 'Gate decision', ['Strategy condition', 'Candle parity', 'Live-mode flag']),
    s('Reconcile the broker book', 'Order callbacks and broker records are matched to engine-owned IDs before the ledger is considered settled.', '00', 'Unmatched fills', 'Reconciled sample', ['Order correlation', 'Duplicate callback guard', 'Durable execution state']),
  ] },
  sketchapaw: { brand: 'SketchAPaw', eyebrow: 'PERSONALIZED COMMERCE', problem: 'Custom pet art needs a safe path from reference photo to preview, payment, and production review.', outcome: 'A guided storefront connects the customer’s choices to a traceable artwork job.', accent: '#d7856d', steps: [
    s('Choose a pet and style', 'The customer selects an art style, background, caption, and format in a guided build flow.', '05', 'Builder stages', 'Design in progress', ['Pet reference', 'Art style', 'Format choice']),
    s('Validate the reference', 'The preview route checks file type, dimensions, pet context, and requester ownership before work starts.', '04', 'Input checks', 'Sample accepted', ['Image bytes', 'Subject validation', 'Guest/customer scope']),
    s('Review the preview', 'An image-generation job returns a preview for the customer to inspect before checkout.', '01', 'Preview job', 'Illustrative only', ['Selected style', 'Background composition', 'Revision decision']),
    s('Complete production review', 'A verified paid-order event unlocks final artwork; staff can inspect the job in a QA queue.', '01', 'Review checkpoint', 'Order simulated', ['Payment event verified', 'Final entitlement', 'Staff QA queue']),
  ] },
};

function PreviewVisual({ slug, step }: { slug: string; step: number }) {
  if (slug === 'sketchapaw') return <div className={styles.artVisual} aria-hidden="true"><Image src="/demos/sketchapaw/watercolor.webp" alt="" fill sizes="220px"/><span>STYLE PREVIEW</span></div>;
  if (slug === 'top-cars-n8n' || slug === 'hotel-social-n8n') return <div className={styles.flowVisual} aria-hidden="true"><span>Webhook</span><i>→</i><span>{step === 0 ? 'Normalize' : step === 1 ? 'Route' : step === 2 ? 'Specialist' : 'Review'}</span><i>→</i><span>Action</span></div>;
  if (slug === 'mychatpdf') return <div className={styles.docVisual} aria-hidden="true"><span>PDF · p. 04</span><i/><i/><i/><i/><i/><b>Source passage</b><i/></div>;
  if (slug === 'trading-engine') return <div className={styles.candleVisual} aria-hidden="true">{[38, 56, 43, 70, 53, 81, 60].map((height, index) => <i key={index} style={{ height: `${height}%` }} data-up={index % 3 !== 1}/>)}</div>;
  if (slug === 'voice-agent') return <div className={styles.waveVisual} aria-hidden="true">{[12, 35, 60, 30, 76, 44, 91, 51, 25, 65, 35, 14].map((height, index) => <i key={index} style={{ height: `${height}%` }}/>)}</div>;
  if (slug === 'zyberon') return <div className={styles.adVisual} aria-hidden="true"><span>STORE PRODUCT</span><div/><b>Campaign draft</b><small>Creative · audience · budget</small></div>;
  if (slug === 'workforce-engine') return <div className={styles.agentVisual} aria-hidden="true"><span>Router</span><div><b>Research</b><b>Planning</b><b>Review</b></div></div>;
  if (slug === 'epulse-discovery') return <div className={styles.eventVisual} aria-hidden="true"><strong>EVENTS</strong><span>12</span><small>candidates · sourced</small></div>;
  return <div className={styles.signal} aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>;
}

export function ProjectTour({ slug, onExplore }: { slug: string; onExplore: () => void }) {
  const tour = tours[slug];
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced && document.documentElement.dataset.motion !== 'paused') setPlaying(true);
    const observer = new MutationObserver(() => { if (document.documentElement.dataset.motion === 'paused') setPlaying(false); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !tour) return;
    if (step >= tour.steps.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep(value => value + 1), 3500);
    return () => window.clearTimeout(timer);
  }, [playing, step, tour]);
  if (!tour) return <p>Tour unavailable for this project.</p>;
  const scene = tour.steps[step];
  return <div className={styles.tour} style={{ '--tour-accent': tour.accent } as React.CSSProperties}>
    <div className={styles.story}><div><span className={styles.eyebrow}>{tour.eyebrow} · GUIDED TOUR</span><h3>{scene.title}<span>.</span></h3><p className={styles.storyBody}>{scene.body}</p><div className={styles.why}><small>THE PROBLEM</small><p>{tour.problem}</p><small>THE BENEFIT</small><p>{tour.outcome}</p></div></div>
      <div className={styles.controls}><div className={styles.progress} aria-label={`Step ${step + 1} of ${tour.steps.length}`}>{tour.steps.map((item, index) => <button type="button" key={item.title} className={index === step ? styles.current : ''} aria-label={`Show step ${index + 1}: ${item.title}`} aria-current={index === step ? 'step' : undefined} onClick={() => { setStep(index); setPlaying(false); }}/>)}</div><div className={styles.controlButtons}><button type="button" disabled={step === 0} onClick={() => { setStep(value => value - 1); setPlaying(false); }}>← Back</button><button type="button" onClick={() => { if (step === tour.steps.length - 1) setStep(0); setPlaying(value => !value); }}>{playing ? 'Pause' : step === tour.steps.length - 1 ? 'Replay' : 'Play'}</button><button type="button" disabled={step === tour.steps.length - 1} onClick={() => { setStep(value => value + 1); setPlaying(false); }}>Next →</button></div><button type="button" className={styles.explore} onClick={onExplore}>Try the interactive workspace ↗</button></div>
    </div>
    <div className={styles.app} key={`${slug}-${step}`}><div className={styles.appRail}><div className={styles.appLogo}>{tour.brand.slice(0, 1)}</div><strong>{tour.brand}</strong><small>PROJECT WORKSPACE</small><nav aria-label="Tour sections">{tour.steps.map((item, index) => <button type="button" key={item.title} data-current={step === index} onClick={() => { setStep(index); setPlaying(false); }}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</button>)}</nav><div className={styles.railFoot}>LOCAL · SAMPLE DATA</div></div>
      <div className={styles.appMain}><div className={styles.appTop}><span>Workspace / {scene.title}</span><span className={styles.liveDot}>● {scene.status}</span></div><div className={styles.appHeading}><div><small>WORKFLOW {String(step + 1).padStart(2, '0')} / 04</small><h4>{scene.title}</h4></div><span className={styles.windowIcon} aria-hidden="true">↗</span></div><div className={styles.metricGrid}><div className={styles.metric}><small>{scene.label}</small><strong>{scene.metric}</strong><span>{scene.status}</span></div><PreviewVisual slug={slug} step={step}/></div><div className={styles.sampleCard}><div><strong>Sample workflow detail</strong><span>Illustrative data</span></div>{scene.rows.map((row, index) => <div className={styles.sampleRow} key={row}><span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span><span>{row}</span><span className={styles.rowCheck}>✓</span></div>)}</div><div className={styles.appFooter}><span>{tour.eyebrow}</span><span>STEP {step + 1} OF 4</span></div></div>
    </div><p className={styles.disclosure}>Animated, source-informed illustration. Data and outcomes are synthetic; this tour makes no backend or provider calls. Use “Try the interactive workspace” for hands-on controls.</p>
  </div>;
}
