'use client';

import { useEffect, useState } from 'react';
import { demoStyles as styles } from './demo-tailwind';

type Node = { id: string; label: string; system: string; purpose: string; output: string; subflow?: string[] };
type Scenario = { id: string; label: string; inbound: string; vehicle?: string; nodes: Node[]; reply: string; approval?: 'reply' | 'handoff' };

const carStart: Node[] = [
  { id: 'webhook', label: 'Webhook', system: 'n8n', purpose: 'Receives an inbound sample lead message.', output: 'Message and lead ID normalized' },
  { id: 'vehicle', label: 'Customer Vehicle', system: 'GoHighLevel', purpose: 'Adds synthetic vehicle and conversation context.', output: 'Sample vehicle and prior enquiry loaded' },
  { id: 'agent', label: 'AI Agent', system: 'n8n coordinator', purpose: 'Routes the enquiry to a service-specific workflow.', output: 'Specialist selected' },
];
function carScenario(id: string, label: string, inbound: string, specialist: string, purpose: string, output: string, reply: string, subflow: string[]): Scenario {
  return { id, label, inbound, vehicle: '2022 Meridian Sport · synthetic lead', nodes: [
    ...carStart,
    { id: specialist.toLowerCase().replaceAll(' ', '-'), label: specialist, system: 'n8n subworkflow', purpose, output, subflow },
    { id: 'reply', label: 'Message From Customer', system: 'GoHighLevel draft', purpose: 'Builds a contextual response from the specialist result.', output: 'Drafted lead reply' },
  ], reply };
}
const carScenarios: Scenario[] = [
  carScenario('availability', 'Vehicle availability', 'Is the Meridian Sport available this weekend?', 'Availability', 'Checks the sample inventory path and prepares a viewing answer.', 'One sample vehicle available', 'The sample Meridian Sport is available for a viewing. Would you like a weekend slot?', ['Receive vehicle ID', 'Inspect synthetic inventory', 'Return availability and next step']),
  carScenario('ppf', 'Wrap & PPF', 'What paint protection options fit my car?', 'Wrap & PPF', 'Selects protection options for the vehicle context.', 'Front-end and full-body PPF examples', 'For the sample Meridian Sport, we can discuss front-end or full-body PPF. An advisor can confirm fit and pricing.', ['Read service notes', 'Compare PPF coverage', 'Return a reviewed recommendation']),
  carScenario('coating', 'Ceramic coating', 'Does ceramic coating help with maintenance?', 'Ceramic Coating', 'Finds service information for coating questions.', 'Coating information fixture', 'Ceramic coating can make routine cleaning easier. An advisor can confirm preparation and maintenance for your vehicle.', ['Read coating reference', 'Select relevant care details', 'Prepare contextual answer']),
  carScenario('tint', 'Window tint', 'What tint options can I discuss?', 'Window Tint', 'Routes the enquiry to tint product information.', 'Tint options fixture', 'We can discuss several tint options. A specialist should confirm fit and local requirements before a recommendation.', ['Read tint reference', 'Identify vehicle context', 'Prepare consultation handoff']),
  carScenario('warranty', 'Warranty terms', 'What warranty covers the service?', 'Warranty Terms', 'Retrieves warranty reference material.', 'Warranty reference fixture', 'Warranty terms depend on the service. I can ask an advisor to explain the relevant coverage and exclusions.', ['Read warranty document', 'Find relevant section', 'Request advisor confirmation']),
  { id: 'escalation', label: 'Human escalation', inbound: 'Please have an advisor call me.', vehicle: '2022 Meridian Sport · synthetic lead', nodes: [...carStart, { id: 'handoff', label: 'Human handoff', system: 'CRM note', purpose: 'Prepares a reviewable handoff with the lead context.', output: 'Advisor follow-up pending' }], reply: 'An advisor handoff was recorded in local preview state.' },
];

const hotelScenarios: Scenario[] = [
  { id: 'enquiry', label: 'Room enquiry', inbound: 'Do you have rooms for next weekend?', nodes: [
    { id: 'webhook', label: 'Webhook', system: 'Meta event', purpose: 'Receives a synthetic social comment.', output: 'Comment captured' },
    { id: 'normalize', label: 'Normalize Input', system: 'n8n', purpose: 'Standardizes author, channel, and message fields.', output: 'Normalized enquiry' },
    { id: 'rules', label: 'Pre-Filter', system: 'Rules', purpose: 'Identifies a booking question that needs a response draft.', output: 'Draft path' },
    { id: 'generate', label: 'Generate', system: 'AI draft', purpose: 'Prepares a contextual reply for human review.', output: 'Draft waiting for approval' },
    { id: 'approval', label: 'Slack: Post Approval', system: 'Human review', purpose: 'Waits for an editor to approve or reject the draft.', output: 'Decision required' },
    { id: 'reply', label: 'GHL: Write Reply', system: 'CRM and social action', purpose: 'Would record the approved reply in the connected workflow.', output: 'Simulated reply recorded' },
  ], reply: 'Thanks for asking! Share your dates and guest count so our team can check availability.', approval: 'reply' },
  { id: 'praise', label: 'Positive guest comment', inbound: 'We enjoyed our stay—thank you!', nodes: [
    { id: 'webhook', label: 'Webhook', system: 'Meta event', purpose: 'Receives a synthetic positive comment.', output: 'Comment captured' },
    { id: 'normalize', label: 'Normalize Input', system: 'n8n', purpose: 'Standardizes channel and author details.', output: 'Normalized praise' },
    { id: 'rules', label: 'Pre-Filter', system: 'Rules', purpose: 'Routes positive feedback to a thank-you draft.', output: 'Thank-you path' },
    { id: 'generate', label: 'Generate', system: 'AI draft', purpose: 'Writes a concise sample response.', output: 'Draft waiting for approval' },
    { id: 'approval', label: 'Slack: Post Approval', system: 'Human review', purpose: 'Waits for an editor to approve or reject.', output: 'Decision required' },
    { id: 'reply', label: 'GHL: Write Reply', system: 'CRM and social action', purpose: 'Would record the approved reply.', output: 'Simulated reply recorded' },
  ], reply: 'Thank you for staying with us! We are glad you enjoyed your visit.', approval: 'reply' },
  { id: 'complaint', label: 'Complaint escalation', inbound: 'I need someone to help with a problem during my stay.', nodes: [
    { id: 'webhook', label: 'Webhook', system: 'Meta event', purpose: 'Receives a synthetic complaint.', output: 'Comment captured' },
    { id: 'normalize', label: 'Normalize Input', system: 'n8n', purpose: 'Standardizes the complaint context.', output: 'Normalized complaint' },
    { id: 'rules', label: 'Pre-Filter', system: 'Rules', purpose: 'Identifies a sensitive issue requiring a person.', output: 'Escalation path' },
    { id: 'approval', label: 'Slack: Post Approval', system: 'Human review', purpose: 'Holds the public response and prepares a staff handoff.', output: 'Staff review pending' },
  ], reply: 'This complaint stays with a human reviewer. No public response was sent.', approval: 'handoff' },
];

function WorkflowExplorer({ kind }: { kind: 'cars' | 'hotel' }) {
  const scenarios = kind === 'cars' ? carScenarios : hotelScenarios;
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [selectedNode, setSelectedNode] = useState(0);
  const [running, setRunning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [draft, setDraft] = useState(scenarios[0].reply);
  const [subflowOpen, setSubflowOpen] = useState(false);
  const current = scenarios[scenarioIndex];
  const last = current.nodes.length - 1;
  const approvalIndex = current.nodes.findIndex(node => node.id === 'approval');
  const waiting = step === approvalIndex && approvalIndex >= 0 && !approved && !rejected;
  const complete = step === last && (current.approval !== 'handoff' || approved);

  useEffect(() => {
    if (!running || failed || rejected || waiting || complete) return;
    const timer = window.setTimeout(() => {
      const next = step + 1;
      setStep(next); setSelectedNode(next); setSubflowOpen(false);
      if (next === last || next === approvalIndex) setRunning(false);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [running, failed, rejected, waiting, complete, step, last, approvalIndex]);

  function reset(index = scenarioIndex) {
    setRunning(false); setScenarioIndex(index); setStep(-1); setSelectedNode(0);
    setFailed(false); setApproved(false); setRejected(false); setDraft(scenarios[index].reply); setSubflowOpen(false);
  }
  function next() {
    if (failed || rejected || waiting || complete) return;
    const target = Math.min(step + 1, last);
    setStep(target); setSelectedNode(target); setSubflowOpen(false);
  }
  const node = current.nodes[selectedNode];
  return <div className={styles.grid}>
    <div className={styles.card}>
      <h3>{kind === 'cars' ? 'Sales conversation' : 'Social inbox'} → n8n workflow</h3>
      <label className={styles.label} htmlFor={`${kind}-scenario`}>Sample branch</label><select id={`${kind}-scenario`} className={styles.select} value={scenarioIndex} onChange={event => reset(Number(event.target.value))}>{scenarios.map((item, index) => <option value={index} key={item.id}>{item.label}</option>)}</select>
      <p className={styles.output}>{kind === 'cars' ? 'Customer' : 'Guest'}: {current.inbound}{current.vehicle ? `\nVehicle context: ${current.vehicle}` : ''}</p>
      <div className={styles.actions}><button className={styles.primary} type="button" disabled={running || failed || rejected || waiting || complete} onClick={() => setRunning(true)}>{step < 0 ? 'Run scenario' : 'Continue run'}</button><button className={styles.button} type="button" disabled={running || failed || rejected || waiting || complete} onClick={next}>{step < 0 ? 'Start step mode' : 'Next node'}</button><button className={styles.button} type="button" disabled={!running} onClick={() => setRunning(false)}>Pause</button><button className={styles.button} type="button" onClick={() => reset()}>Reset run</button></div>
      <div className={styles.graph} aria-label="Interactive workflow nodes">{current.nodes.map((item, index) => <button className={styles.node} type="button" key={item.id} data-active={selectedNode === index} aria-current={step === index ? 'step' : undefined} onClick={() => { setSelectedNode(index); setSubflowOpen(false); }}>{index + 1}. {item.label}<span>{index < step ? 'Completed' : index === step ? failed ? 'Failed' : waiting ? 'Awaiting approval' : complete ? 'Completed' : approved ? 'Approved' : 'Active' : 'Waiting'}</span></button>)}</div>
      <p className={styles.hint}>This is a safe, curated view of the source workflow. Select a node for its role, sample output, and subworkflow detail.</p>
      <ol className={styles.timeline} aria-label="Execution timeline">{current.nodes.slice(0, step + 1).map((item, index) => <li key={item.id} data-current={step === index}>{item.label} · {index === step && failed ? 'failed' : index === step && waiting ? 'awaiting approval' : 'completed'}</li>)}</ol>
    </div>
    <div className={styles.card}>
      <h3>{node.label}</h3><p>{node.purpose}</p><p><strong>System:</strong> {node.system}</p><p><strong>Sanitized sample output:</strong> {node.output}</p>
      {node.subflow && <><button className={styles.button} type="button" onClick={() => setSubflowOpen(value => !value)} aria-expanded={subflowOpen}>{subflowOpen ? 'Back to parent node' : 'Inspect subworkflow'}</button>{subflowOpen && <ol className={styles.list}>{node.subflow.map(item => <li key={item}>{item}</li>)}</ol>}</>}
      {step >= 0 && !waiting && !complete && !rejected && <div className={styles.actions}><button className={styles.button} type="button" disabled={failed} onClick={() => { setRunning(false); setFailed(true); }}>Simulate node failure</button>{failed && <button className={styles.primary} type="button" onClick={() => setFailed(false)}>Retry node</button>}</div>}
      {waiting && <><label className={styles.label} htmlFor={`${kind}-draft`}>{current.approval === 'handoff' ? 'Handoff note' : 'Review reply draft'}</label><textarea id={`${kind}-draft`} className={styles.textarea} value={draft} maxLength={300} onChange={event => setDraft(event.target.value)}/><div className={styles.actions}><button className={styles.primary} type="button" disabled={!draft.trim()} onClick={() => setApproved(true)}>{current.approval === 'handoff' ? 'Confirm handoff locally' : 'Approve reply locally'}</button><button className={styles.button} type="button" onClick={() => setRejected(true)}>Reject</button></div></>}
      {approved && current.approval === 'reply' && !complete && <p role="status">Approved locally. Continue to the reply node to see the simulated action.</p>}
      {rejected && <p role="status">Rejected. No reply or handoff was recorded. Reset to try another version.</p>}
      {complete && <div className={styles.output} role="status"><strong>{current.approval === 'handoff' ? 'Human handoff recorded locally' : 'Scenario complete'}</strong><br/>{draft}</div>}
      <p className={styles.hint}>No provider API, CRM write, Slack post, social reply, or customer message leaves this browser.</p>
    </div>
  </div>;
}

export function WorkflowDemos({ slug }: { slug: string }) { return <WorkflowExplorer kind={slug === 'top-cars-n8n' ? 'cars' : 'hotel'} />; }
