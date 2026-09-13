'use client';
import { useEffect,useRef } from 'react';
import { usePathname } from 'next/navigation';
export function Effects(){
  const pathname = usePathname();
  const cursor=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');
    let scrollFrame=0,pointerFrame=0,pointerX=0,pointerY=0,heroVisible=true,aboutVisible=false;
    const hero=document.querySelector<HTMLElement>('.hero-stage'),about=document.querySelector<HTMLElement>('.about-statement'),ticker=document.querySelector<HTMLElement>('.ticker-track');
    const words=Array.from(document.querySelectorAll<HTMLElement>('.about-word'));
    const stopped=()=>reduce.matches||root.dataset.motion==='paused';
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');reveal.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el=>{if(!stopped()&&el.getBoundingClientRect().top>innerHeight*.95){el.classList.add('will-reveal');reveal.observe(el);}});
    const visibility=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.target===hero){heroVisible=e.isIntersecting;hero?.classList.toggle('offscreen',!e.isIntersecting);}if(e.target===about)aboutVisible=e.isIntersecting;}));
    if(hero)visibility.observe(hero);if(about)visibility.observe(about);
    const paintScroll=()=>{scrollFrame=0;const max=root.scrollHeight-innerHeight;root.style.setProperty('--scroll-progress',`${max>0?scrollY/max:0}`);if(stopped())return;
      if(heroVisible&&hero)hero.style.setProperty('--hero-offset',`${Math.min(scrollY*.12,70)}px`);
      if(ticker)ticker.style.transform=`translate3d(${-((scrollY*.1)%200)}px,0,0)`;
      if(aboutVisible&&about){const r=about.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.9-r.top)/(innerHeight*.5+r.height*.5)));words.forEach((w,i)=>w.style.opacity=p>i/words.length?'1':'.35');}
    };
    const onScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(paintScroll);};
    const onPointer=(e:PointerEvent)=>{if(!fine.matches||stopped())return;pointerX=e.clientX;pointerY=e.clientY;cursor.current?.classList.add('visible');cursor.current?.classList.toggle('interactive',Boolean((e.target as Element).closest('a,button,summary')));if(!pointerFrame)pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;if(cursor.current)cursor.current.style.transform=`translate3d(${pointerX}px,${pointerY}px,0)`;});};
    const leave=()=>cursor.current?.classList.remove('visible');
    const onPreference=()=>{if(stopped()){hero?.style.setProperty('--hero-offset','0px');if(ticker)ticker.style.transform='';words.forEach(w=>w.style.opacity='1');document.querySelectorAll('.will-reveal').forEach(el=>el.classList.add('revealed'));leave();}onScroll();};
    const preferences=new MutationObserver(onPreference);preferences.observe(root,{attributes:true,attributeFilter:['data-motion']});
    reduce.addEventListener('change',onPreference);window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});window.addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('pointerleave',leave);paintScroll();
    return()=>{reveal.disconnect();visibility.disconnect();preferences.disconnect();cancelAnimationFrame(scrollFrame);cancelAnimationFrame(pointerFrame);reduce.removeEventListener('change',onPreference);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);window.removeEventListener('pointermove',onPointer);document.removeEventListener('pointerleave',leave);};
  },[pathname]);
  return <><div className="reading-progress" aria-hidden="true"/><div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div></>;
}
