'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function Effects() {
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(pointer: fine)');
    const hero = document.querySelector<HTMLElement>('.hero-stage');
    const about = document.querySelector<HTMLElement>('.about-statement');
    const ticker = document.querySelector<HTMLElement>('.ticker-track');
    const contact = document.querySelector<HTMLElement>('.contact-main');
    const aboutSection = document.querySelector<HTMLElement>('.about-section');

    const words = Array.from(document.querySelectorAll<HTMLElement>('.about-word'));
    const patterns = Array.from(document.querySelectorAll<SVGSVGElement>('[data-scroll-pattern]')).map(svg => ({
      svg, anchor: document.querySelector<HTMLElement>(svg.dataset.patternAnchor || 'body') || svg,
    }));
    const visible = new Set<Element>();
    let scrollFrame = 0, pointerFrame = 0, pointerX = 0, pointerY = 0;
    const stopped = () => reduce.matches || root.dataset.motion === 'paused';
    const clamp = (value: number) => Math.max(0, Math.min(1, value));

    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveal.unobserve(entry.target); }
    }), { threshold: .08 });
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      if (!stopped() && el.getBoundingClientRect().top > innerHeight * .95) {
        el.classList.add('will-reveal'); reveal.observe(el);
      }
    });

    const paintScroll = () => {
      scrollFrame = 0;
      const max = root.scrollHeight - innerHeight;
      const paused = stopped();
      // Read visible geometry before changing any styles.
      const aboutRect = !paused && about && visible.has(about) ? about.getBoundingClientRect() : null;
      const contactRect = !paused && contact && visible.has(contact) ? contact.getBoundingClientRect() : null;
      const patternProgress = paused ? [] : patterns.filter(({ anchor }) => visible.has(anchor)).map(({ svg, anchor }) => {
        const rect = anchor.getBoundingClientRect();
        const progress = clamp((innerHeight * .9 - rect.top) / (innerHeight * .55 + rect.height * .5));
        return { svg, progress };
      });
      root.style.setProperty('--scroll-progress', String(max > 0 ? scrollY / max : 0));
      if (paused) return;
      if (hero && visible.has(hero)) {
        hero.style.setProperty('--hero-offset', `${Math.min(scrollY * .1, 55)}px`);
        hero.style.setProperty('--hero-scale', String(1 + Math.min(scrollY / innerHeight, 1) * .06));
        hero.style.setProperty('--sky-offset', `${Math.min(scrollY * -.055, 0)}px`);
      }
      if (ticker && visible.has(ticker)) {
        ticker.style.transform = `translate3d(${-scrollY * .14}px,0,0)`;
        ticker.style.setProperty('--ticker-turn', `${scrollY * .12}deg`);
      }
      if (contactRect) contact!.style.setProperty('--contact-scale', String(.9 + clamp((innerHeight - contactRect.top) / (innerHeight * .75)) * .1));
      if (aboutRect) {
        const progress = clamp((innerHeight * .9 - aboutRect.top) / (innerHeight * .5 + aboutRect.height * .5));
        words.forEach((word, index) => { word.style.opacity = progress > index / words.length ? '1' : '.35'; });
        aboutSection?.style.setProperty('--about-turn', `${progress * 150}deg`);
      }
      patternProgress.forEach(({ svg, progress }) => {
        svg.style.setProperty('--path-offset', String(1 - progress));
        svg.style.setProperty('--pattern-turn', `${(progress - .5) * 55}deg`);
        svg.style.setProperty('--pattern-drift', `${(1 - progress) * 24}px`);
        svg.style.setProperty('--pattern-scale', String(.92 + progress * .08));
      });
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target);
        if (entry.target === hero) hero?.classList.toggle('offscreen', !entry.isIntersecting);
      });
      onScroll();
    }, { rootMargin: '80px' });
    [hero, about, ticker, contact, ...patterns.map(({ anchor }) => anchor)].forEach(el => { if (el) visibility.observe(el); });

    const leave = () => cursor.current?.classList.remove('visible');
    const onPointer = (event: PointerEvent) => {
      if (!fine.matches || stopped()) return;
      pointerX = event.clientX; pointerY = event.clientY;
      cursor.current?.classList.add('visible');
      cursor.current?.classList.toggle('interactive', Boolean((event.target as Element).closest('a,button,summary')));
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (cursor.current) cursor.current.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
      });
    };
    const onPreference = () => {
      if (stopped()) {
        hero?.style.setProperty('--hero-offset', '0px');
        hero?.style.setProperty('--hero-scale', '1');
        hero?.style.setProperty('--sky-offset', '0px');
        contact?.style.setProperty('--contact-scale', '1');
        aboutSection?.style.setProperty('--about-turn', '0deg');
        if (ticker) { ticker.style.transform = ''; ticker.style.setProperty('--ticker-turn', '0deg'); }
        words.forEach(word => { word.style.opacity = '1'; });
        document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('revealed'));
        patterns.forEach(({ svg }) => {
          svg.style.setProperty('--path-offset', '0'); svg.style.setProperty('--pattern-turn', '0deg');
          svg.style.setProperty('--pattern-drift', '0px'); svg.style.setProperty('--pattern-scale', '1');
        });
        leave();
      }
      onScroll();
    };
    const preferences = new MutationObserver(onPreference);
    preferences.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    reduce.addEventListener('change', onPreference);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('pointerleave', leave);
    onPreference();
    return () => {
      reveal.disconnect(); visibility.disconnect(); preferences.disconnect();
      cancelAnimationFrame(scrollFrame); cancelAnimationFrame(pointerFrame);
      reduce.removeEventListener('change', onPreference);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', leave);
    };
  }, [pathname]);

  return <><div className="reading-progress" aria-hidden="true"/><div ref={cursor} className="custom-cursor" aria-hidden="true"><span/></div></>;
}
