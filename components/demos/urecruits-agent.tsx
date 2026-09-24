'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './urecruits-agent.module.css';

type Tab = 'jobs' | 'workflows' | 'assessment' | 'scheduler' | 'ai-prescreening';
type Turn = { role: 'sent' | 'received'; text: string; source?: string };
type Tour = { id: string; tab: Tab; label: string; agent: string; request: string; turns: Turn[]; result: string; tool: string };
const exchange = (request: string, response: string, follow?: string, final?: string, source?: string): Turn[] => [
  { role: 'sent', text: request }, { role: 'received', text: response, source },
  ...(follow && final ? [{ role: 'sent' as const, text: follow }, { role: 'received' as const, text: final }] : []),
];
const tours: Tour[] = [
  { id: 'job-create', tab: 'jobs', label: 'Create a job draft', agent: 'job-agent', request: 'Create a Frontend Engineer job in Bengaluru', turns: exchange('Create a Frontend Engineer job in Bengaluru', 'I found the position and location. Should this role be remote, hybrid, or on-site?', 'Hybrid. Save it as a draft.', 'Frontend Engineer · Bengaluru · Hybrid is ready as a sample draft.'), result: 'Frontend Engineer · Draft · Bengaluru', tool: 'get_position → get_location → create_job_draft' },
  { id: 'job-list', tab: 'jobs', label: 'Search and filter jobs', agent: 'job-agent', request: 'Show my draft engineering jobs', turns: exchange('Show my draft engineering jobs', 'I found 2 matching draft jobs in this sample company. Open a result to inspect it.'), result: '2 sample engineering drafts', tool: 'list_company_jobs → get_job_details' },
  { id: 'job-update', tab: 'jobs', label: 'Edit or publish a job', agent: 'job-agent', request: 'Update the Frontend Engineer job and publish it', turns: exchange('Update the Frontend Engineer job and publish it', 'I found the sample job. I can update its details and prepare a publish step for review.', 'Review and publish.', 'The sample job status is now Published in this walkthrough.'), result: 'Frontend Engineer · Published', tool: 'update_job → create_job_publish' },
  { id: 'workflow-create', tab: 'workflows', label: 'Build a hiring workflow', agent: 'workflow-agent', request: 'Create a workflow with an assessment and interview', turns: exchange('Create a workflow with an assessment and interview', 'I found a sample TypeScript assessment. I will place it before the interview stage.', 'Save the workflow.', 'The two-stage sample workflow is ready.'), result: 'Assessment → Interview', tool: 'list_domain_assessments → create_workflow' },
  { id: 'workflow-manage', tab: 'workflows', label: 'Find or update workflows', agent: 'workflow-agent', request: 'Find the engineering workflow and change its stages', turns: exchange('Find the engineering workflow and change its stages', 'I found its current stages. The selected workflow stays in this specialist’s session.', 'Move recruiter screen before the assessment.', 'The sample stage order is updated.'), result: 'Recruiter screen → Assessment → Interview', tool: 'list_available_workflows → get_workflow_details → update_workflow' },
  { id: 'assessment-domain', tab: 'assessment', label: 'Domain assessment', agent: 'assessment-agent', request: 'Create a domain assessment for TypeScript', turns: exchange('Create a domain assessment for TypeScript', 'A domain assessment can include scored single-choice, multiple-choice, and text questions.', 'Use a 45-minute sample.', 'The sample TypeScript domain assessment is ready.'), result: 'TypeScript domain · 45 min', tool: 'list_domain_assessments_full → create_domain_assessment' },
  { id: 'assessment-coding', tab: 'assessment', label: 'Live coding or take-home', agent: 'assessment-agent', request: 'Prepare a live coding exercise', turns: exchange('Prepare a live coding exercise', 'I can prepare live coding or take-home work with instructions and starter code.', 'Use a TypeScript exercise.', 'The sample live coding exercise is ready for review.'), result: 'TypeScript live coding · Draft', tool: 'list_coding_assessments → create_live_coding / create_take_home' },
  { id: 'assessment-update', tab: 'assessment', label: 'List and update assessments', agent: 'assessment-agent', request: 'Find and update the TypeScript assessment', turns: exchange('Find and update the TypeScript assessment', 'I found its type and current details. What would you change?', 'Change the duration to 60 minutes.', 'The sample assessment now shows 60 minutes.'), result: 'TypeScript assessment · 60 min', tool: 'list_domain_assessments_full → get_domain_assessment_detail → update_domain_assessment' },
  { id: 'interview-book', tab: 'scheduler', label: 'Book an interview', agent: 'interview-scheduling-agent', request: 'Schedule Maya for a Frontend Engineer interview', turns: exchange('Schedule Maya for a Frontend Engineer interview', 'I matched Maya to the job, checked her workflow round, and found sample availability.', 'Use Tuesday at 11:00.', 'The sample interview is booked for Tuesday at 11:00.'), result: 'Maya · Interview · Tuesday 11:00', tool: 'job_search → candidate_search → rounds_fetch → availability_matching → book_appointment' },
  { id: 'interview-change', tab: 'scheduler', label: 'Reschedule or cancel', agent: 'interview-scheduling-agent', request: 'Reschedule Maya’s interview', turns: exchange('Reschedule Maya’s interview', 'I found her scheduled round. I can search new availability or cancel after confirmation.', 'Move it to Thursday at 15:00.', 'The sample interview now shows Thursday at 15:00.'), result: 'Maya · Rescheduled · Thursday 15:00', tool: 'get_scheduled_interview → reschedule_interview / cancel_interview' },
  { id: 'interview-cancel', tab: 'scheduler', label: 'Cancel an interview', agent: 'interview-scheduling-agent', request: 'Cancel Maya’s interview', turns: exchange('Cancel Maya’s interview', 'I found the scheduled round. Please confirm that you want to cancel this sample appointment.', 'Yes, cancel it.', 'The sample interview is cancelled in this walkthrough.'), result: 'Maya · Interview cancelled', tool: 'get_scheduled_interview → cancel_interview' },
  { id: 'group-schedule', tab: 'scheduler', label: 'Group self-scheduling', agent: 'interview-scheduling-agent', request: 'Let three candidates pick their interview slots', turns: exchange('Let three candidates pick their interview slots', 'The scheduling graph resolves each candidate and prepares individual pick-a-slot invitations.', 'Proceed with the sample group.', 'Three sample invitations were recorded in this walkthrough.'), result: 'Group scheduling · 3 sample links', tool: 'group_scheduling → send_slots_email' },
  { id: 'prescreen', tab: 'ai-prescreening', label: 'AI pre-screening results', agent: 'interview-scheduling-agent', request: 'Show Maya’s AI pre-screening result', turns: exchange('Show Maya’s AI pre-screening result', 'I found the sample pre-screening status and feedback. A recruiter can use it as context for the next step.'), result: 'Maya · Completed · sample feedback', tool: 'get_ai_prescreening_status' },
  { id: 'prescreen-invite', tab: 'ai-prescreening', label: 'Resend a screening invite', agent: 'interview-scheduling-agent', request: 'Resend Maya’s AI screening invite', turns: exchange('Resend Maya’s AI screening invite', 'I found the candidate’s sample screening status and can prepare a new invitation.', 'Resend the sample invite.', 'The invitation is marked resent in this walkthrough; no email was sent.'), result: 'Maya · Invite resent locally', tool: 'get_ai_prescreening_status → resend_ai_prescreening_invite' },
  { id: 'assistant', tab: 'jobs', label: 'Analytics and guidance', agent: 'assistant-agent', request: 'How many jobs do we have?', turns: exchange('How many jobs do we have?', 'The sample company has 8 jobs: 3 drafts and 5 published. I checked the Jobs data fixture for this answer.', undefined, undefined, 'Jobs data'), result: '8 sample jobs · 3 drafts · 5 published', tool: 'get_jobs_summary' },
  { id: 'upcoming', tab: 'scheduler', label: 'Upcoming interviews', agent: 'assistant-agent', request: 'Show upcoming interviews', turns: exchange('Show upcoming interviews', 'The sample schedule has two upcoming interviews. The read-only assistant fetches these from its interview data tool.', undefined, undefined, 'Upcoming interviews'), result: '2 sample upcoming interviews', tool: 'get_upcoming_interviews' },
  { id: 'plan', tab: 'workflows', label: 'Plan and usage', agent: 'assistant-agent', request: 'Show our subscription usage', turns: exchange('Show our subscription usage', 'I can read current plan usage and guide you to the right screen for changes. This walkthrough uses a sample plan fixture.', undefined, undefined, 'Subscription & usage'), result: 'Sample plan usage · read-only', tool: 'get_subscription_overview' },
  { id: 'navigation', tab: 'workflows', label: 'Find the right screen', agent: 'assistant-agent', request: 'Where do I manage my subscription?', turns: exchange('Where do I manage my subscription?', 'You can manage that on the Subscription screen. I can point you there, but cannot change a plan from read-only chat.', undefined, undefined, 'Navigation map'), result: 'Subscription screen · read-only guidance', tool: 'get_subscription_overview → provide_navigation_link' },
];
const tabs: { id: Tab; label: string }[] = [
  { id: 'jobs', label: 'Jobs' }, { id: 'workflows', label: 'Workflows' }, { id: 'assessment', label: 'Assessment' }, { id: 'scheduler', label: 'Scheduler' }, { id: 'ai-prescreening', label: 'AI Pre-Screening' },
];

export default function URecruitsAgent() {
  const [tourId, setTourId] = useState('job-create');
  const [tab, setTab] = useState<Tab>('jobs');
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState('');
  const [note, setNote] = useState('');
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const tour = tours.find(item => item.id === tourId) ?? tours[0];
  const complete = frame === tour.turns.length;

  useEffect(() => {
    if (!playing || complete) return;
    const timer = window.setTimeout(() => setFrame(value => value + 1), frame === 0 ? 380 : 1450);
    return () => window.clearTimeout(timer);
  }, [playing, complete, frame]);
  useEffect(() => { feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' }); }, [frame, tourId]);

  function choose(id: string, autoplay = true) {
    const next = tours.find(item => item.id === id);
    if (!next) return;
    setTourId(id); setTab(next.tab); setFrame(0); setPlaying(autoplay); setInput(''); setNote(''); setRating(null); setExpanded(id);
  }
  function send() {
    const query = input.trim().toLowerCase();
    if (!query) return;
    const match = tours.find(item => item.request.toLowerCase() === query || item.label.toLowerCase() === query);
    if (match) choose(match.id);
    else setNote('This browser-only walkthrough accepts the suggested requests. Choose a capability to watch its agent route.');
  }
  function newSession() { setFrame(0); setPlaying(false); setInput(''); setNote('New sample session ready. Choose a capability or replay this tour.'); setRating(null); }

  return <div className={styles.shell}>
    <div className={styles.overline}>SOURCE-UI-INSPIRED WALKTHROUGH <span>· sample data · no backend calls</span></div>
    <div className={styles.workspace}>
      <section className={styles.chat} aria-label="uR Agent chat walkthrough">
        <div className={styles.chatHeader}><Image src="/demos/urecruits/ur-agent.webp" alt="uR Agent" width={36} height={36}/><div><strong>uR Agent</strong><small>{playing && !complete ? 'Showing sample conversation…' : 'Your recruiting assistant'}</small></div><span className={styles.demoBadge}>PREVIEW</span></div>
        <div className={styles.feed} ref={feedRef} aria-live="off">
          <div className={styles.welcome}><Image src="/demos/urecruits/ur-agent.webp" alt="" width={48} height={48}/><h3>What can I help you with?</h3><p>Watch the supervisor route a request to the right specialist. Select a capability in the workspace.</p></div>
          {tour.turns.slice(0, frame).map((turn, index) => <div className={`${styles.messageRow} ${turn.role === 'sent' ? styles.sent : ''}`} key={`${tour.id}-${index}`}>
            {turn.role === 'received' && <Image className={styles.avatar} src="/demos/urecruits/ur-agent.webp" alt="" width={35} height={35}/>}
            <div><div className={`${styles.bubble} ${turn.role === 'sent' ? styles.sentBubble : styles.receivedBubble}`}>{turn.text}</div>{turn.source && <small className={styles.source}>Sources: {turn.source}</small>}{turn.role === 'received' && index === tour.turns.length - 1 && complete && <div className={styles.feedback}><button type="button" aria-label="Helpful" aria-pressed={rating === 'up'} onClick={() => setRating('up')}>👍</button><button type="button" aria-label="Not helpful" aria-pressed={rating === 'down'} onClick={() => setRating('down')}>👎</button>{rating && <small>Saved locally</small>}</div>}</div>
            {turn.role === 'sent' && <div className={styles.userAvatar} aria-hidden="true">R</div>}
          </div>)}
          {playing && !complete && frame > 0 && tour.turns[frame]?.role === 'received' && <div className={styles.messageRow}><Image className={styles.avatar} src="/demos/urecruits/ur-agent.webp" alt="" width={35} height={35}/><div className={styles.typing} aria-label="uR Agent is preparing the next turn"><span/><span/><span/></div></div>}
          {frame === 0 && <div className={styles.starters}>{tours.slice(0, 4).map(item => <button type="button" key={item.id} onClick={() => choose(item.id)}>{item.request}</button>)}</div>}
        </div>
        <div className={styles.composer}><label className={styles.srOnly} htmlFor="ur-chat-input">Ask uR Agent</label><textarea id="ur-chat-input" value={input} onChange={event => { setInput(event.target.value); setNote(''); }} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); } }} placeholder="Choose or type a sample request" rows={1}/><button type="button" aria-label="Send sample request" title="Send sample request" disabled={!input.trim()} onClick={send}>➤</button></div>
        {note && <p className={styles.note} role="status">{note}</p>}
        <div className={styles.playback}><button type="button" onClick={() => { setFrame(0); setPlaying(true); setRating(null); }}>↻ Replay</button><button type="button" disabled={complete || frame === 0 && !playing} onClick={() => setPlaying(value => !value)}>{playing ? 'Ⅱ Pause' : '▶ Resume'}</button><button type="button" disabled={complete} onClick={() => { setPlaying(false); setFrame(value => Math.min(tour.turns.length, value + 1)); }}>Next moment →</button><span>{frame}/{tour.turns.length} moments</span></div>
      </section>
      <section className={styles.records} aria-label="uR Agent capability workspace"><div className={styles.recordsHeader}><div><strong>{tabs.find(item => item.id === tab)?.label}</strong><small>Explore what the uR Agent can do</small></div><button type="button" onClick={newSession}>Start New Session</button></div>
        <div className={styles.tabs} role="tablist" aria-label="Agent workspace">{tabs.map(item => <button role="tab" aria-selected={tab === item.id} className={tab === item.id ? styles.activeTab : ''} type="button" key={item.id} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
        <div className={styles.recordScroll} role="tabpanel"><div className={styles.sectionIntro}><strong>{tab === 'jobs' ? 'Job specialist + guidance' : tab === 'workflows' ? 'Workflow specialist + guidance' : tab === 'assessment' ? 'Assessment specialist' : tab === 'scheduler' ? 'Interview scheduling graph' : 'AI pre-screening'}</strong><p>Choose a capability to watch its sample conversation and specialist route.</p></div>
          {tours.filter(item => item.tab === tab).map(item => <article className={styles.recordCard} key={item.id} data-selected={tourId === item.id}>
            <button type="button" className={styles.recordMain} onClick={() => choose(item.id)}><span><strong>{item.label}</strong><small>{item.agent}</small></span><span aria-hidden="true">↗</span></button><p>{item.id === tourId && complete ? item.result : item.request}</p>
            {item.id === tourId && <div className={styles.recordActions}><button type="button" onClick={() => choose(item.id)}>Watch tour</button><button type="button" aria-expanded={expanded === item.id} onClick={() => setExpanded(value => value === item.id ? null : item.id)}>{expanded === item.id ? 'Hide route' : 'View route'}</button></div>}
            {expanded === item.id && <div className={styles.route}><b>Supervisor → {item.agent}</b><br/>{item.tool}<br/><span>Sample result: {item.result}</span></div>}
          </article>)}
        </div>
      </section>
    </div>
    <p className={styles.disclosure}>This adapts the structure and visual language of the source uR Agent `LiveChat` interface. Conversations and records are synthetic. No authentication, LLM, SSE connection, email, booking, or data mutation occurs.</p>
  </div>;
}
