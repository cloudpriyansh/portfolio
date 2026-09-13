'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; length?: number };

export function SiteThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = svgRef.current, path = pathRef.current, tip = tipRef.current;
    const page = svg?.closest<HTMLElement>('.portfolio-flow');
    if (!svg || !path || !tip || !page) return;
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, needsMeasure = true, disposed = false;
    let width = 0, height = 0, pageTop = 0, maxScroll = 0, length = 0;
    let samples: Required<Point>[] = [];
    const stopped = () => reduced.matches || root.dataset.motion === 'paused';
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const measure = () => {
      width = root.clientWidth; height = innerHeight;
      pageTop = page.getBoundingClientRect().top + scrollY;
      maxScroll = Math.max(0, root.scrollHeight - height);
      const rect = (selector: string) => {
        const box = page.querySelector<HTMLElement>(selector)!.getBoundingClientRect();
        return { top: box.top + scrollY - pageTop, bottom: box.bottom + scrollY - pageTop, height: box.height, left: box.left, right: box.right };
      };
      const hero = rect('.hero'), work = rect('#work'), about = rect('#about');
      const skills = rect('.skills-section'), experience = rect('#experience');
      const contact = rect('#contact'), footer = rect('.site-footer');
      const mobile = width <= 760;
      const gutter = mobile ? 9 : Math.max(18, (width - Math.min(1304, width - (width <= 1100 ? 64 : 112))) / 2 - 26);
      const left = gutter, right = width - gutter;
      const swing = mobile ? 4 : 13;
      const sidebar = mobile ? left : about.left + Math.min(width * .22, 310);
      const points: Point[] = [
        { x: mobile ? right : width * .82, y: hero.top + 18 },
        { x: right - swing, y: hero.top + hero.height * .32 },
        { x: right, y: hero.bottom - 25 },
        { x: right, y: work.top + 12 },
        { x: left, y: work.top + (mobile ? 47 : 72) },
        ...[.22, .42, .62, .82].map((fraction, i) => ({ x: left + (i % 2 ? swing : -swing * .4), y: work.top + work.height * fraction })),
        { x: left, y: about.top + 20 },
        { x: left, y: about.top + Math.min(180, about.height * .3) },
        { x: sidebar, y: about.top + about.height * .52 },
        { x: mobile ? left + swing : sidebar * .48, y: about.top + about.height * .74 },
        { x: left, y: about.bottom - (mobile ? 25 : 38) },
        { x: right, y: skills.top + (mobile ? 34 : 50) },
        { x: right - swing, y: skills.top + skills.height * .45 },
        { x: right, y: skills.bottom - 22 },
        { x: left, y: experience.top + (mobile ? 32 : 48) },
        { x: left + swing, y: experience.top + experience.height * .48 },
        { x: left, y: experience.bottom - 24 },
        { x: right, y: contact.top + (mobile ? 35 : 53) },
        { x: right - swing, y: contact.top + contact.height * .48 },
        { x: right, y: contact.bottom - 15 },
        { x: width * .56, y: footer.top + 15 },
      ];
      // Increasing Y keeps the drawing tip aligned with the reading position.
      const route = points.reduce<Point[]>((result, point) => {
        if (!result.length || point.y > result[result.length - 1].y) result.push(point);
        return result;
      }, []);
      const [start] = route;
      const d = route.slice(1).reduce((result, point, i) => {
        const previous = route[i], middle = (previous.y + point.y) / 2;
        return `${result} C${previous.x},${middle} ${point.x},${middle} ${point.x},${point.y}`;
      }, `M${start.x},${start.y}`);
      path.setAttribute('d', d);
      length = path.getTotalLength();
      path.style.strokeDasharray = String(length);
      // Sample only when layout changes. Scrolling uses this cached lookup;
      // there are no section measurements or SVG geometry queries per frame.
      const count = clamp(Math.ceil(length / 12), 240, 1200);
      samples = Array.from({ length: count + 1 }, (_, i) => {
        const distance = length * i / count, point = path.getPointAtLength(distance);
        return { x: point.x, y: point.y, length: distance };
      });
      svg.dataset.ready = 'true';
    };

    const paint = () => {
      frame = 0;
      if (needsMeasure) { needsMeasure = false; measure(); }
      if (!samples.length) return;
      const position = scrollY;
      // A viewport-sized SVG avoids a page-height compositing surface.
      svg.setAttribute('viewBox', `0 ${position - pageTop} ${width} ${height}`);
      const finish = clamp((position - maxScroll + height * .25) / (height * .25), 0, 1);
      const targetY = position - pageTop + height * (.7 + finish * .3);
      let low = 0, high = samples.length - 1;
      while (low < high) {
        const middle = (low + high) >> 1;
        if (samples[middle].y < targetY) low = middle + 1; else high = middle;
      }
      const end = samples[low], start = samples[Math.max(0, low - 1)];
      const fraction = end.y === start.y ? 0 : clamp((targetY - start.y) / (end.y - start.y), 0, 1);
      const distance = start.length + (end.length - start.length) * fraction;
      path.style.strokeDashoffset = String(stopped() ? 0 : length - distance);
      tip.setAttribute('cx', String(start.x + (end.x - start.x) * fraction));
      tip.setAttribute('cy', String(start.y + (end.y - start.y) * fraction));
      svg.dataset.progress = (distance / length).toFixed(4);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const scheduleMeasure = () => { needsMeasure = true; schedule(); };
    const size = new ResizeObserver(scheduleMeasure);
    size.observe(page);
    page.querySelectorAll('main > section, .ticker, .site-footer').forEach(el => size.observe(el));
    const preference = new MutationObserver(scheduleMeasure);
    preference.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    reduced.addEventListener('change', scheduleMeasure);
    document.fonts.ready.then(() => { if (!disposed) scheduleMeasure(); });
    schedule();
    return () => {
      disposed = true; cancelAnimationFrame(frame); size.disconnect(); preference.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', scheduleMeasure);
      reduced.removeEventListener('change', scheduleMeasure);
    };
  }, []);

  return <svg ref={svgRef} className="site-thread" aria-hidden="true" focusable="false" preserveAspectRatio="none">
    <path ref={pathRef} className="site-thread-path" fill="none"/>
    <circle ref={tipRef} className="site-thread-tip" r="4.5"/>
  </svg>;
}
