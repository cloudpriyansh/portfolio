'use client';
import { useEffect, useRef, type ReactNode } from 'react';

export function ToolkitScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>('.toolkit-stage')!;
    const rail = section.querySelector<HTMLElement>('.toolkit-track')!;
    const windowEl = section.querySelector<HTMLElement>('.toolkit-window')!;
    const cards = [...rail.querySelectorAll<HTMLElement>('.toolkit-card')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let cardOffsets: number[] = [], cardWidths: number[] = [], viewportWidth = 0;
    let frame = 0, enabled = false, visible = true, travel = 0, padding = 0, top = 24, disposed = false;
    const clamp = (n: number) => Math.max(0, Math.min(1, n));
    const paint = () => {
      frame = 0;
      if (!enabled || !visible) return;
      const progress = clamp((top - section.getBoundingClientRect().top - padding) / travel);
      rail.style.transform = `translate3d(${-progress * travel}px,0,0)`;
      section.style.setProperty('--toolkit-progress', String(progress));
      cards.forEach((card, index) => {
        const entry = clamp((cardOffsets[index] - progress * travel + cardWidths[index] - viewportWidth) / (cardWidths[index] * .8));
        card.style.setProperty('--card-entry', String(entry));
      });
    };
    const schedule = () => { if (enabled && visible && !frame) frame = requestAnimationFrame(paint); };
    const measure = () => {
      enabled = innerWidth > 900 && innerHeight > 740 && !reduced.matches && document.documentElement.dataset.motion !== 'paused';
      section.dataset.horizontal = String(enabled);
      if (enabled) {
        const stageHeight = stage.offsetHeight;
        if (stageHeight + 40 > innerHeight) { enabled = false; section.dataset.horizontal = 'false'; }
        else {
          viewportWidth = windowEl.clientWidth;
          cardOffsets = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
          cardWidths = cards.map(card => card.offsetWidth);
          travel = Math.max(1, cardOffsets[cards.length - 1] + cardWidths[cards.length - 1] - viewportWidth);
          padding = parseFloat(getComputedStyle(section).paddingTop);
          top = Math.max(24, (innerHeight - stageHeight) / 2);
          section.style.setProperty('--toolkit-top', `${top}px`);
          section.style.height = `${stageHeight + travel + padding * 2}px`;
        }
      }
      if (!enabled) {
        section.style.height = '';
        rail.style.transform = '';
        cards.forEach(card => card.style.removeProperty('--card-entry'));
        section.style.setProperty('--toolkit-progress', '1');
      }
      schedule();
    };
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { rootMargin: '100px' });
    visibility.observe(section);
    const size = new ResizeObserver(measure);
    size.observe(stage);
    const preferences = new MutationObserver(measure);
    preferences.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    reduced.addEventListener('change', measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    measure();
    return () => {
      disposed = true; cancelAnimationFrame(frame); visibility.disconnect(); size.disconnect(); preferences.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); reduced.removeEventListener('change', measure);
    };
  }, []);
  return <section ref={ref} id="toolkit" className="section toolkit-story" aria-labelledby="skills-title"><div className="container toolkit-stage">{children}</div></section>;
}
