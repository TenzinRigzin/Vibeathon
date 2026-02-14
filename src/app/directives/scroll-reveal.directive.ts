import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';

/**
 * Adds a reveal-in class when the element enters the viewport.
 * Use with .section-reveal / .reveal-in for fade-in, slide-up, and scale.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  @Input() appScrollRevealThreshold = 0.12;
  @Input() appScrollRevealRootMargin = '0px 0px -8% 0px';

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      {
        threshold: this.appScrollRevealThreshold,
        rootMargin: this.appScrollRevealRootMargin,
        root: null,
      }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
