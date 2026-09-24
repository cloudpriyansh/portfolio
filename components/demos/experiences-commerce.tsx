'use client';

import { useState } from 'react';
import { demoStyles as styles } from './demo-tailwind';
import { Zyberon as SourceZyberon } from './zyberon';

const products = [
  { id: 'tote', name: 'Everyday Canvas Tote', price: 1499, feature: 'recycled fabric' },
  { id: 'lamp', name: 'Minimal Desk Lamp', price: 3299, feature: 'adjustable warm light' },
  { id: 'bottle', name: 'Travel Bottle', price: 899, feature: 'leak-resistant lid' },
];
type Request = { id: number; product: string; goal: string; audience: string; copy: string; status: 'accepted' };
function Zyberon() {
  const [productId, setProductId] = useState(products[0].id);
  const [goal, setGoal] = useState('Awareness');
  const [audience, setAudience] = useState('People interested in sustainable products');
  const [copy, setCopy] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [limited, setLimited] = useState(false);
  const [message, setMessage] = useState('Choose a product and prepare a draft.');
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportReply, setSupportReply] = useState('');
  const [approvedReply, setApprovedReply] = useState('');
  const product = products.find(item => item.id === productId) ?? products[0];
  const quota = 2;

  function submit() {
    if (!copy.trim() || !audience.trim()) { setMessage('Add audience and ad copy before submitting.'); return; }
    if (limited || requests.length >= quota) { setMessage('Sample account limit reached. Change the limit scenario or reset the workspace to try again.'); return; }
    setRequests(items => [{ id: items.length + 1, product: product.name, goal, audience: audience.trim(), copy: copy.trim(), status: 'accepted' }, ...items]);
    setMessage('Campaign request accepted in local preview state. No external platform was contacted.');
  }

  return <div className={styles.grid}>
    <div className={styles.card}>
      <h3>Connected commerce workspace</h3>
      <div className={styles.metrics}><div className={styles.metric}>Products<strong>{products.length}</strong></div><div className={styles.metric}>Requests used<strong>{requests.length} / {quota}</strong></div><div className={styles.metric}>Mode<strong>Simulation</strong></div></div>
      <label className={styles.label} htmlFor="store-product">Shopify sample product</label>
      <select className={styles.select} id="store-product" value={productId} onChange={event => { setProductId(event.target.value); setCopy(''); setMessage('Product changed. Prepare a new draft.'); }}>{products.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}</select>
      <div className={styles.two}><div><label className={styles.label} htmlFor="campaign-goal">Campaign goal</label><select className={styles.select} id="campaign-goal" value={goal} onChange={event => setGoal(event.target.value)}><option>Awareness</option><option>Product visits</option><option>Customer engagement</option></select></div><div><label className={styles.label} htmlFor="campaign-audience">Audience</label><input className={styles.input} id="campaign-audience" maxLength={80} value={audience} onChange={event => setAudience(event.target.value)} /></div></div>
      <label className={styles.label} htmlFor="campaign-copy">Review and edit ad copy</label>
      <textarea className={styles.textarea} id="campaign-copy" maxLength={280} value={copy} placeholder={`Meet the ${product.name}: ${product.feature}.`} onChange={event => setCopy(event.target.value)} />
      <div className={styles.actions}><button className={styles.button} type="button" onClick={() => { setCopy(`Meet the ${product.name}: ${product.feature}. Designed for everyday use.`); setMessage('Sample draft created. Review it before submitting.'); }}>Create sample draft</button><button className={styles.primary} type="button" disabled={!copy.trim() || !audience.trim()} onClick={submit}>Simulate campaign request</button></div>
      <button className={styles.button} type="button" onClick={() => { setLimited(value => !value); setMessage(limited ? 'Sample limit removed.' : 'Sample account limit turned on.'); }}>{limited ? 'Remove sample limit' : 'Try limit scenario'}</button>
      <p role="status" className={styles.hint}>{message}</p>
    </div>
    <div className={styles.card}>
      <h3>Review & activity</h3><p><strong>{product.name}</strong> · ₹{product.price} · {product.feature}</p><p>Goal: {goal}</p><div className={styles.output}>{copy || 'Your draft appears here as you edit it.'}</div>
      <h3>Campaign requests</h3>{requests.length ? <ol className={styles.list}>{requests.map(item => <li key={item.id}><span className={styles.status}>{item.status}</span> {item.product} · {item.goal}<br/><small>Audience: {item.audience}</small></li>)}</ol> : <p>No requests submitted yet.</p>}
      <div className={styles.divider}/><button className={styles.button} type="button" onClick={() => { setSupportOpen(value => !value); if (!supportReply) setSupportReply(`The ${product.name} is ₹${product.price} and features ${product.feature}. How can I help?`); }}>{supportOpen ? 'Close support example' : 'Explore shared store context'}</button>
      {supportOpen && <><label className={styles.label} htmlFor="support-reply">Product-informed support reply</label><textarea className={styles.textarea} id="support-reply" value={supportReply} maxLength={280} onChange={event => setSupportReply(event.target.value)}/><button className={styles.primary} type="button" disabled={!supportReply.trim()} onClick={() => setApprovedReply(supportReply.trim())}>Approve sample reply</button>{approvedReply && <p role="status">Approved locally: “{approvedReply}”</p>}</>}
      <p className={styles.hint}>No Shopify, Meta, Stripe, n8n, or support message is sent.</p>
    </div>
  </div>;
}

const pets = [{ name: 'Milo', kind: 'dog', icon: '🐕' }, { name: 'Luna', kind: 'cat', icon: '🐈' }];
const stylesList = [
  { id: 'watercolor', label: 'Watercolor', asset: '/demos/sketchapaw/watercolor.webp' },
  { id: 'storybook', label: 'Pop art', asset: '/demos/sketchapaw/pop-art.webp' },
  { id: 'ink', label: 'Ink sketch', asset: '/demos/sketchapaw/black-white-sketch.webp' },
];
const stages = ['Pet', 'Style & background', 'Personalize', 'Review', 'Complete'];
function SketchAPaw() {
  const [petIndex, setPetIndex] = useState(0);
  const [style, setStyle] = useState(stylesList[0].id);
  const [background, setBackground] = useState('garden');
  const [caption, setCaption] = useState('');
  const [format, setFormat] = useState('Digital artwork');
  const [stage, setStage] = useState(0);
  const pet = pets[petIndex];

  return <div className={styles.grid}>
    <div className={styles.card}>
      <p className={styles.eyebrow}>STEP {Math.min(stage + 1, 5)} OF 5</p><h3>Build a pet portrait</h3>
      <div className={styles.choices} aria-label="Build progress">{stages.map((label, index) => <button className={styles.choice} data-active={stage === index} type="button" key={label} disabled={index > stage || stage === 4} onClick={() => setStage(index)}>{index + 1}. {label}</button>)}</div>
      {stage === 0 && <><label className={styles.label} htmlFor="demo-pet">Choose a sample pet</label><select className={styles.select} id="demo-pet" value={petIndex} onChange={event => setPetIndex(Number(event.target.value))}>{pets.map((item, index) => <option value={index} key={item.name}>{item.name} the {item.kind}</option>)}</select><p className={styles.hint}>This sample-only journey keeps visitor photos private by asking for no upload.</p></>}
      {stage === 1 && <><p className={styles.label}>Art style · source project examples</p><div className={styles.choices}>{stylesList.map(item => <button className={styles.choice} data-active={style === item.id} type="button" key={item.id} onClick={() => setStyle(item.id)}><img src={item.asset} width="110" height="110" alt={`${item.label} style example from SketchAPaw`} loading="lazy" style={{ display: 'block', width: 110, height: 110, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}/>{item.label}</button>)}</div><label className={styles.label} htmlFor="demo-background">Background</label><select className={styles.select} id="demo-background" value={background} onChange={event => setBackground(event.target.value)}><option value="garden">Garden</option><option value="starry">Starry sky</option><option value="plain">Plain studio</option></select></>}
      {stage === 2 && <><label className={styles.label} htmlFor="pet-caption">Optional portrait caption</label><input className={styles.input} id="pet-caption" maxLength={45} value={caption} onChange={event => setCaption(event.target.value)}/><label className={styles.label} htmlFor="pet-format">Format</label><select className={styles.select} id="pet-format" value={format} onChange={event => setFormat(event.target.value)}><option>Digital artwork</option><option>Printed portrait</option></select></>}
      {stage === 3 && <><p>Review the local composition and selected format. A real SketchAPaw preview would generate artwork from an uploaded pet image; this workspace uses a sample illustration.</p><button className={styles.primary} type="button" onClick={() => setStage(4)}>Create simulated order</button></>}
      {stage === 4 && <div className={styles.output} role="status"><strong>Sample order SAMPLE-001 created.</strong><br/>{pet.name} · {stylesList.find(item => item.id === style)?.label} · {format}. No payment or artwork job was started.</div>}
      <div className={styles.actions}><button className={styles.button} type="button" disabled={stage === 0 || stage === 4} onClick={() => setStage(value => value - 1)}>Back</button><button className={styles.primary} type="button" disabled={stage >= 3} onClick={() => setStage(value => value + 1)}>Next</button></div>
    </div>
    <div className={styles.card}>
      <h3>Live composition</h3><div className={styles.visualPreview} data-background={background} data-style={style} role="img" aria-label={`${pet.name} the ${pet.kind} in ${style} style against a ${background} background`}><img src={stylesList.find(item => item.id === style)?.asset} alt=""/></div>
      <p><strong>{pet.name}</strong> · {stylesList.find(item => item.id === style)?.label} · {background === 'plain' ? 'Plain studio' : background === 'starry' ? 'Starry sky' : 'Garden'}</p>{caption && <p>“{caption}”</p>}<p>Format: {format}</p><p className={styles.hint}>The large preview is an illustrative composition. Style cards are product examples; they are not generated from this sample pet.</p>
    </div>
  </div>;
}

export function CommerceDemos({ slug }: { slug: string }) { return slug === 'zyberon' ? <SourceZyberon /> : <SketchAPaw />; }
