'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Moon, Sun, Menu, X, Pause, Play } from 'lucide-react';
export function Header() {
  const [theme,setTheme]=useState('light');
  const [menu,setMenu]=useState(false);
  const [paused,setPaused]=useState(false);
  const changing=useRef(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    const root=document.documentElement;setTheme(root.dataset.theme||'light');
    const mq=matchMedia('(prefers-color-scheme: dark)');
    const onSystem=()=>{try{if(localStorage.getItem('portfolio-theme'))return;}catch{}const next=mq.matches?'dark':'light';root.dataset.theme=next;setTheme(next);};
    try{const saved=localStorage.getItem('portfolio-motion')==='paused';setPaused(saved);root.dataset.motion=saved?'paused':'running';}catch{}
    mq.addEventListener('change',onSystem);return()=>mq.removeEventListener('change',onSystem);
  },[]);
  useEffect(()=>{if(menu)document.querySelector<HTMLAnchorElement>('#main-navigation a')?.focus();const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'&&menu){setMenu(false);menuButton.current?.focus();}};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);},[menu]);
  async function toggleTheme(e:React.MouseEvent<HTMLButtonElement>){
    if(changing.current)return;
    const next=theme==='light'?'dark':'light';const root=document.documentElement;
    const rect=e.currentTarget.getBoundingClientRect();const x=e.clientX||rect.x+rect.width/2;const y=e.clientY||rect.y+rect.height/2;
    const update=()=>{root.dataset.theme=next;setTheme(next);try{localStorage.setItem('portfolio-theme',next);}catch{}};
    if(!document.startViewTransition||matchMedia('(prefers-reduced-motion: reduce)').matches||paused){update();return;}
    changing.current=true;
    try{const transition=document.startViewTransition(update);await transition.ready;const radius=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));await root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${radius}px at ${x}px ${y}px)`]},{duration:650,easing:'cubic-bezier(.4,0,.2,1)',pseudoElement:'::view-transition-new(root)'}).finished;await transition.finished;}catch{update();}finally{changing.current=false;}
  }
  function toggleMotion(){const next=!paused;setPaused(next);document.documentElement.dataset.motion=next?'paused':'running';try{localStorage.setItem('portfolio-motion',next?'paused':'running');}catch{}}
  return <header className="site-header" id="top"><a className="brand" href="#top" aria-label="Priyansh home">pd<span aria-hidden="true">✳</span></a><nav id="main-navigation" className={menu?'is-open':''} aria-label="Main navigation">{['Work','About','Experience','Contact'].map(label=><a key={label} href={`#${label.toLowerCase()}`} onClick={()=>setMenu(false)}>{label}</a>)}</nav><div className="header-tools"><button className="icon-button motion-toggle" onClick={toggleMotion} aria-label={paused?'Resume animations':'Pause animations'} aria-pressed={paused} title={paused?'Resume animations':'Pause animations'}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme==='light'?'night':'day'} mode`} title={`Switch to ${theme==='light'?'night':'day'} mode`}><span className="theme-track"><Sun className="theme-sun" size={14}/><Moon className="theme-moon" size={13}/><span className="theme-knob"/></span></button><a className="nav-contact" href="#contact">Let’s talk <ArrowUpRight size={16}/></a><button ref={menuButton} className="icon-button menu-toggle" aria-expanded={menu} aria-controls="main-navigation" aria-label={menu?'Close menu':'Open menu'} onClick={()=>setMenu(!menu)}>{menu?<X size={21}/>:<Menu size={21}/>}</button></div></header>;
}
