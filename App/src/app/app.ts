import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AgentActivityPanelComponent } from './components/agent-activity-panel/agent-activity-panel.component';
import { ScrollProgressService } from './services/scroll-progress.service';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgentActivityPanelComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly scroll = inject(ScrollProgressService);
  protected readonly router = inject(Router);
  private sub?: Subscription;

  ngOnInit(): void {
    this.updateBodyClass();
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.updateBodyClass());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (typeof document !== 'undefined' && document.body)
      document.body.classList.remove('story-layout-scroll');
  }

  private updateBodyClass(): void {
    if (typeof document !== 'undefined' && document.body)
      document.body.classList.toggle('story-layout-scroll', this.isHome());
  }

  isHome(): boolean {
    const url = this.router.url;
    return url === '/' || url === '';
  }
}
