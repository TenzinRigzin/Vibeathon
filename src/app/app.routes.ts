import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'onboard', loadComponent: () => import('./pages/onboard/onboard.component').then(m => m.OnboardComponent) },
  { path: 'gaps', loadComponent: () => import('./pages/gaps/gaps.component').then(m => m.GapsComponent) },
  { path: 'roadmap', loadComponent: () => import('./pages/roadmap/roadmap.component').then(m => m.RoadmapComponent) },
  { path: 'how-it-works', loadComponent: () => import('./pages/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent) },
  { path: '**', redirectTo: '' }
];
