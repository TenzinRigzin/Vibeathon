/**
 * Scroll-driven animation: GSAP ScrollTrigger for 300vh section + Angular scroll for hero/narrative.
 */
import {
  Component,
  inject,
  viewChild,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { CareerAgentService } from '../../services/career-agent.service';
import { ScrollProgressService } from '../../services/scroll-progress.service';
import { ScrollMotionService } from '../../services/scroll-motion.service';
import { NarrativeVizComponent } from '../../components/narrative-viz/narrative-viz.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NarrativeVizComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  protected readonly agent = inject(CareerAgentService);
  protected readonly scroll = inject(ScrollProgressService);
  protected readonly motion = inject(ScrollMotionService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly section1Ref = viewChild<ElementRef<HTMLElement>>('section1');
  private readonly section2Ref = viewChild<ElementRef<HTMLElement>>('section2');
  private readonly section3Ref = viewChild<ElementRef<HTMLElement>>('section3');
  private readonly scrollStoryRef = viewChild<ElementRef<HTMLElement>>('scrollStory');

  readonly activeSection = signal(0);
  readonly section1Progress = signal(0);
  readonly section2Progress = signal(0);
  readonly section3Progress = signal(0);

  private scrollListener: (() => void) | null = null;
  private rafId: number | null = null;
  private vizEl: HTMLElement | null = null;
  private lineEl: HTMLElement | null = null;

  ngAfterViewInit(): void {
    const section = this.scrollStoryRef()?.nativeElement;
    if (section) {
      this.vizEl = section.querySelector<HTMLElement>('.scroll-story-viz');
      this.lineEl = section.querySelector<HTMLElement>('.scroll-story-progress-line');
      if (this.vizEl) gsap.set(this.vizEl, { scale: 1, opacity: 1, y: 0, rotation: 0 });
      if (this.lineEl) gsap.set(this.lineEl, { height: '0%' });
      this.tick();
    }
    this.scrollListener = () => this.updateScrollState();
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    if (typeof document !== 'undefined') {
      const main = document.querySelector('.main');
      if (main) main.addEventListener('scroll', this.scrollListener, { passive: true });
    }
    this.updateScrollState();
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      const main = document.querySelector('.main');
      if (main) main.removeEventListener('scroll', this.scrollListener);
    }
  }

  /** Drive scroll-story animation from section position every frame (works with any scroll container) */
  private tick = (): void => {
    const section = this.scrollStoryRef()?.nativeElement;
    if (!section || !this.vizEl) {
      this.rafId = requestAnimationFrame(this.tick);
      return;
    }
    const vh = window.innerHeight;
    const r = section.getBoundingClientRect();
    const denom = r.height - vh;
    const p = denom > 0 ? Math.max(0, Math.min(1, -r.top / denom)) : 0;
    this.applyScrollStoryProgress(p);
    this.rafId = requestAnimationFrame(this.tick);
  };

  private applyScrollStoryProgress(p: number): void {
    if (this.vizEl) {
      gsap.set(this.vizEl, {
        scale: 1 - p * 0.3,
        opacity: 1 - p * 0.7,
        y: -60 * p,
        rotation: 20 * p
      });
    }
    if (this.lineEl) gsap.set(this.lineEl, { height: `${p * 100}%` });
  }

  private updateScrollState(): void {
    const vh = window.innerHeight;

    const s1 = this.section1Ref()?.nativeElement;
    const s2 = this.section2Ref()?.nativeElement;
    const s3 = this.section3Ref()?.nativeElement;
    if (!s1 || !s2 || !s3) return;

    const r1 = s1.getBoundingClientRect();
    const r2 = s2.getBoundingClientRect();
    const r3 = s3.getBoundingClientRect();

    // Per-section progress: 0 when section bottom at viewport top, 1 when section top at viewport bottom
    const sectionProgress = (r: DOMRect) =>
      this.motion.clamp((vh - r.top) / (vh + r.height));

    this.section1Progress.set(sectionProgress(r1));
    this.section2Progress.set(sectionProgress(r2));
    this.section3Progress.set(sectionProgress(r3));

    const centerY = vh * 0.4;
    const inView = (r: DOMRect) => r.top < centerY && r.bottom > centerY;
    if (inView(r1)) this.activeSection.set(0);
    else if (inView(r2)) this.activeSection.set(1);
    else if (inView(r3)) this.activeSection.set(2);
    else if (r2.top > centerY) this.activeSection.set(0);
    else if (r3.top > centerY) this.activeSection.set(1);
    else this.activeSection.set(2);
  }

  /** Hero: scale, y, opacity driven by scroll (useTransform-style) */
  heroScale(): number {
    const p = this.scroll.heroProgress();
    return this.motion.transform(p, [0, 0.5, 1], [1, 0.92, 0.85]);
  }

  heroY(): number {
    const p = this.scroll.heroProgress();
    return this.motion.transform(p, [0, 1], [0, 24]);
  }

  heroOpacity(): number {
    const p = this.scroll.heroProgress();
    return this.motion.transform(p, [0, 0.6, 1], [1, 0.85, 0.7]);
  }

  heroTextOpacity(): number {
    const p = this.scroll.heroProgress();
    return this.motion.transform(p, [0, 0.7, 1], [1, 0.88, 0.75]);
  }

  /** Section visibility: opacity and y from section scroll progress */
  sectionOpacity(progress: number): number {
    return this.motion.transform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.98]);
  }

  sectionY(progress: number): number {
    return this.motion.transform(progress, [0, 0.2, 1], [28, 0, 0]);
  }
}
