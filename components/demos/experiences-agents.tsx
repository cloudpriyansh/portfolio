'use client';

import { useState } from 'react';
import URecruitsAgent from './urecruits-agent';
import { demoStyles as styles } from './demo-tailwind';

const workforceScenarios = [
  { name: 'Research a product launch', agents: ['Router', 'Research agent', 'Planning agent', 'Writer agent'], context: ['Classify a product launch request', 'Synthetic audience and competitor notes', 'Launch milestones and constraints', 'Final draft assembled from reviewed notes'] },
  { name: 'Handle a support escalation', agents: ['Router', 'Support agent', 'Policy agent', 'Human review'], context: ['Identify an urgent request', 'Summarize a synthetic customer issue', 'Check response boundaries', 'Hold the external response for review'] },
  { name: 'Unsupported task', agents: ['Router', 'Human review'], context: ['No suitable specialist found', 'Return a bounded handoff instead of looping'] },
];
function Workforce() {
  const [scenario, setScenario] = useState(0);
  const [step, setStep] = useState(-1);
  const [failure, setFailure] = useState(false);
  const current = workforceScenarios[scenario];
  const finished = step === current.agents.length - 1;
  return <div className={styles.grid}>
    <div className={styles.card}><h3>Agent workforce router</h3><label className={styles.label} htmlFor="workforce-task">Choose a sample task</label><select id="workforce-task" className={styles.select} value={scenario} onChange={event => { setScenario(Number(event.target.value)); setStep(-1); setFailure(false); }}>{workforceScenarios.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select>
      <div className={styles.actions}><button className={styles.primary} type="button" disabled={finished || failure} onClick={() => setStep(value => value + 1)}>{step < 0 ? 'Start route' : 'Next handoff'}</button><button className={styles.button} type="button" disabled={step < 0 || finished || failure} onClick={() => setFailure(true)}>Simulate tool failure</button><button className={styles.button} type="button" onClick={() => { setStep(-1); setFailure(false); }}>Restart run</button></div>
      <ol className={styles.timeline}>{current.agents.map((agent, index) => <li key={`${agent}-${index}`} data-current={index === step}><span className={styles.status}>{index < step ? 'Completed' : index === step ? failure ? 'Needs retry' : 'Active' : 'Waiting'}</span> <strong>{agent}</strong><br/>{current.context[index]}</li>)}</ol>
    </div>
    <div className={styles.card}><h3>Scoped context</h3>{step < 0 ? <p>Start the run to inspect each handoff.</p> : <><p><strong>Current specialist:</strong> {current.agents[step]}</p><div className={styles.output}>{current.context[step]}{failure && '\nThe sample tool failed. Resolve this step before routing onward.'}</div></>}{failure && <button className={styles.primary} type="button" onClick={() => setFailure(false)}>Retry this step</button>}{finished && <p role="status">{scenario === 2 ? 'No matching specialist; handed to a person.' : 'Sample task finished with a traceable route.'}</p>}<p className={styles.hint}>Synthetic context only. The actual service manages routing, memory, and agent tools; this page calls none of them.</p></div>
  </div>;
}

const calls = [
  { name: 'Connected and interested', transcript: ['Call started for a synthetic lead.', 'Agent: Is this a good time to discuss your enquiry?', 'Prospect: Yes, I would like to learn more.', 'Agent: I can reserve a sample follow-up slot.'], outcome: 'Qualified for follow-up' },
  { name: 'No answer', transcript: ['Call started for a synthetic lead.', 'No answer recorded.', 'Callback suggested.'], outcome: 'Callback needed' },
  { name: 'Opt out', transcript: ['Call started for a synthetic lead.', 'Prospect: Please do not contact me again.', 'Agent: Understood. No follow-up will be scheduled.'], outcome: 'Do not contact' },
];
function Voice() {
  const [scenario, setScenario] = useState(0);
  const [line, setLine] = useState(-1);
  const [slot, setSlot] = useState('');
  const [booked, setBooked] = useState(false);
  const [callback, setCallback] = useState(false);
  const [conflict, setConflict] = useState(false);
  const call = calls[scenario];
  const complete = line === call.transcript.length - 1;
  function restart() { setLine(-1); setSlot(''); setBooked(false); setCallback(false); setConflict(false); }
  return <div className={styles.grid}>
    <div className={styles.card}><h3>Outbound call lifecycle</h3><label className={styles.label} htmlFor="call-scenario">Choose an outcome</label><select className={styles.select} id="call-scenario" value={scenario} onChange={event => { setScenario(Number(event.target.value)); restart(); }}>{calls.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select>
      <div className={styles.actions}><button className={styles.primary} type="button" disabled={complete} onClick={() => setLine(value => value + 1)}>{line < 0 ? 'Start simulated call' : 'Next turn'}</button><button className={styles.button} type="button" disabled={line < 0} onClick={restart}>Stop / restart</button></div>
      <ol className={styles.timeline} aria-live="polite">{call.transcript.slice(0, line + 1).map((text, index) => <li key={index} data-current={index === line}>{text}</li>)}</ol>{complete && <p role="status"><span className={styles.status}>{call.outcome}</span></p>}
    </div>
    <div className={styles.card}><h3>Follow-up state</h3>{scenario === 0 ? <><label className={styles.label} htmlFor="call-slot">Sample appointment slot</label><select className={styles.select} id="call-slot" disabled={!complete || booked} value={slot} onChange={event => { setSlot(event.target.value); setConflict(false); }}><option value="">Choose a slot</option><option value="Tuesday 11:00">Tuesday 11:00</option><option value="Thursday 15:00">Thursday 15:00</option></select><div className={styles.actions}><button className={styles.primary} type="button" disabled={!complete || !slot || booked || conflict} onClick={() => setBooked(true)}>Confirm sample booking</button><button className={styles.button} type="button" disabled={!complete || !slot || booked} onClick={() => setConflict(true)}>Try conflict</button></div><p role="status">{booked ? `Booked locally for ${slot}.` : conflict ? 'That fixture slot is unavailable. Choose another slot to recover.' : complete ? 'Choose and confirm a sample slot.' : 'Complete the call before booking.'}</p></> : scenario === 1 ? <><button className={styles.primary} type="button" disabled={!complete || callback} onClick={() => setCallback(true)}>Queue local callback</button><p role="status">{callback ? 'Callback added to the sample queue.' : complete ? 'No callback queued.' : 'Finish the call before queueing a callback.'}</p></> : <p>{complete ? 'Opted out. Follow-up controls are intentionally unavailable.' : 'Complete the call to see the outcome.'}</p>}<p className={styles.hint}>No phone number is dialed, and no appointment or callback is sent externally.</p></div>
  </div>;
}

export function AgentDemos({ slug }: { slug: string }) {
  switch (slug) {
    case 'urecruits': return <URecruitsAgent />;
    case 'workforce-engine': return <Workforce />;
    case 'voice-agent': return <Voice />;
    default: return null;
  }
}
