import { Component, input } from '@angular/core';

/**
 * Sticky right-side visual — scroll-driven motion (Framer Motion–style).
 * Nodes connecting, progress bars filling, timeline revealing bound to section scroll progress.
 */
@Component({
  selector: 'app-narrative-viz',
  standalone: true,
  imports: [],
  templateUrl: './narrative-viz.component.html',
  styleUrl: './narrative-viz.component.css'
})
export class NarrativeVizComponent {
  /** 0 = skill extraction, 1 = gap analysis, 2 = roadmap generation */
  activeSection = input(0);
  /** Per-section scroll progress (0–1): drives line drawing, bar fill, timeline reveal */
  section1Progress = input(0);
  section2Progress = input(0);
  section3Progress = input(0);

  readonly lineLen1 = Math.hypot(50, 40);
  readonly bars = [
    { name: 'Technical' },
    { name: 'Soft skills' },
    { name: 'Tools' },
    { name: 'Experience' }
  ];
  readonly timeline = ['Week 1 — Foundation', 'Week 2 — Core skills', 'Week 3 — Projects', 'Week 4 — Polish'];

  /** Line drawing: stroke-dashoffset from section 1 progress */
  lineOffset(): number {
    return this.lineLen1 * (1 - this.section1Progress());
  }

  /** Progress bar width from section 2 progress (staggered) */
  getBarWidth(index: number): number {
    const p = this.section2Progress();
    return Math.min(100, p * 100 * (0.6 + (index + 1) * 0.15));
  }

  /** Timeline item reveal: opacity/visibility from section 3 progress */
  timelineReveal(index: number): boolean {
    return this.section3Progress() >= (index + 1) / (this.timeline.length + 1);
  }
}
