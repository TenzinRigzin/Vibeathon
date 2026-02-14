import { Injectable, signal, computed, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * useScroll equivalent: tracks window scroll, exposes scrollY and progress (0-1).
 * Use with ScrollMotionService.transform() for useTransform-style range mapping.
 */
@Injectable({ providedIn: 'root' })
export class ScrollProgressService {
  private platformId = inject(PLATFORM_ID);
  private scrollY = signal(0);
  private maxScroll = signal(1);

  readonly progress = computed(() => {
    const y = this.scrollY();
    const max = this.maxScroll();
    if (max <= 0) return 0;
    return Math.min(1, y / max);
  });

  /** 0–1 over first half of scroll (for sticky viz: nodes connecting, glow) */
  readonly vizProgress = computed(() => Math.min(1, this.progress() * 2));

  /** 0–1 over first ~500px (hero scale down, text fade, gradient shift) */
  readonly heroProgress = computed(() => Math.min(1, this.scrollY() / 500));

  readonly scrollYValue = this.scrollY.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.onScroll = this.onScroll.bind(this);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    }
  }

  private onScroll(): void {
    const y = window.scrollY ?? document.documentElement.scrollTop ?? document.body.scrollTop;
    const doc = document.documentElement;
    const max = Math.max(
      0,
      (doc.scrollHeight - window.innerHeight) || (document.body.scrollHeight - window.innerHeight)
    );
    this.scrollY.set(y);
    this.maxScroll.set(max);
  }

}
