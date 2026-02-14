import { Component, inject, viewChild, signal, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CareerAgentService } from '../../services/career-agent.service';
import type { RoadmapWeek, RoadmapDay } from '../../models/career';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roadmap.component.html',
  styleUrl: './roadmap.component.css'
})
export class RoadmapComponent implements AfterViewInit, OnDestroy {
  protected readonly agent = inject(CareerAgentService);
  private readonly roadmapSectionRef = viewChild<ElementRef<HTMLElement>>('roadmapSection');
  readonly sectionProgress = signal(0);
  private scrollListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    const el = this.roadmapSectionRef()?.nativeElement;
    if (!el) return;
    const update = (): void => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      this.sectionProgress.set(Math.max(0, Math.min(1, progress)));
    };
    this.scrollListener = update;
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  ngOnDestroy(): void {
    if (this.scrollListener)
      window.removeEventListener('scroll', this.scrollListener);
  }

  weekReveal(weekNum: number): boolean {
    const total = this.agent.roadmap().length;
    const threshold = (weekNum - 0.3) / (total + 1);
    return this.sectionProgress() >= threshold;
  }

  markDone(wk: RoadmapWeek, day: RoadmapDay): void {
    const wi = this.agent.roadmap().indexOf(wk);
    const di = wk.days.indexOf(day);
    this.agent.markDayComplete(wi, di);
  }
}
