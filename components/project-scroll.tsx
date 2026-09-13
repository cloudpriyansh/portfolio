'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './project-showcase.module.css';

// Native sticky positioning does the scrolling. JS only updates the retiring
// card's transform, once per frame while this section is near the viewport.
export function ProjectScroll({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = container.current;
    if (!stack) return;
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const steps = Array.from(stack.querySelectorAll<HTMLElement>('[data-project-step]'));
    const cards = steps.map(step => step.querySelector<HTMLElement>('[data-project-card]')!);
    let frame = 0, anchorFrame = 0, visible = true, enabled = false, top = 24;

    const paint = () => {
      frame = 0;
      if (!visible || !enabled) return;
      const positions = steps.map(step => step.getBoundingClientRect().top);
      cards.forEach((card, i) => {
        const progress = i === cards.length - 1 ? 0 : Math.max(0, Math.min(1,
          1 - (positions[i + 1] - top) / Math.min(innerHeight * .65, 500)));
        card.style.setProperty('--covered', String(progress));
      });
    };
    const schedule = () => { if (!frame && visible && enabled) frame = requestAnimationFrame(paint); };
    const measure = () => {
      const height = Math.max(...cards.map(card => card.offsetHeight));
      // Tall cards, short screens, and enlarged text retain ordinary scrolling.
      enabled = !reduced.matches && root.dataset.motion !== 'paused' && height + 64 <= innerHeight;
      top = Math.max(24, Math.round((innerHeight - height) / 2));
      stack.style.setProperty('--stack-top', `${top}px`);
      stack.dataset.stacked = String(enabled);
      cards.forEach(card => card.style.removeProperty('--covered'));
      schedule();
    };
    const scrollToStep = (index: number) => {
      if (index < 0) return;
      const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
      const offset = steps.slice(0, index).reduce((sum, step) => sum + step.offsetHeight + gap, 0);
      window.scrollTo({ top: stack.getBoundingClientRect().top + scrollY + offset - (enabled ? top : 40), behavior: 'instant' });
      schedule();
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!enabled || !target.matches(':focus-visible')) return;
      // Bring a keyboard-focused card above overlapping cards in either direction.
      scrollToStep(steps.findIndex(step => step.contains(target)));
    };
    const onHash = () => {
      const index = steps.findIndex(step => `#${step.id}` === window.location.hash);
      if (index < 0) return;
      cancelAnimationFrame(anchorFrame);
      // Account for sticky spacing added after hydration, including return links.
      anchorFrame = requestAnimationFrame(() => scrollToStep(index));
    };
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    }, { rootMargin: '100px' });
    const size = new ResizeObserver(measure);
    const preferences = new MutationObserver(measure);
    cards.forEach(card => size.observe(card));
    visibility.observe(stack);
    preferences.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('hashchange', onHash);
    reduced.addEventListener('change', measure);
    stack.addEventListener('focusin', onFocus);
    measure();
    onHash();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(anchorFrame);
      visibility.disconnect(); size.disconnect(); preferences.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('hashchange', onHash);
      reduced.removeEventListener('change', measure);
      stack.removeEventListener('focusin', onFocus);
    };
  }, []);

  return <div ref={container} className={styles.stack}>{children}</div>;
}
