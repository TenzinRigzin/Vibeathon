import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CareerAgentService } from '../../services/career-agent.service';
import type { DreamRole } from '../../models/career';

@Component({
  selector: 'app-onboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './onboard.component.html',
  styleUrl: './onboard.component.css'
})
export class OnboardComponent {
  activeTab = signal<'github' | 'linkedin' | 'resume'>('resume');
  githubUsername = '';
  linkedInUrl = '';
  resumeText = '';
  selectedRole: DreamRole | null = null;
  saved = signal(false);

  constructor(protected agent: CareerAgentService) {}

  get roles(): DreamRole[] {
    return this.agent.getDreamRoles();
  }

  setTab(t: 'github' | 'linkedin' | 'resume'): void {
    this.activeTab.set(t);
  }

  selectRole(role: DreamRole): void {
    this.selectedRole = role;
  }

  saveProfile(): void {
    const tab = this.activeTab();
    if (tab === 'github' && this.githubUsername.trim()) {
      this.agent.setProfile('github', {
        githubUsername: this.githubUsername.trim(),
        skills: ['JavaScript', 'TypeScript', 'Git', 'HTML', 'CSS'],
        experience: 'From GitHub profile',
        education: ''
      });
    } else if (tab === 'linkedin' && this.linkedInUrl.trim()) {
      this.agent.setProfile('linkedin', {
        linkedInUrl: this.linkedInUrl.trim(),
        skills: ['Communication', 'Teamwork', 'Project Management'],
        experience: 'From LinkedIn profile',
        education: ''
      });
    } else if (tab === 'resume' && this.resumeText.trim()) {
      const skills = this.parseSkillsFromResume(this.resumeText);
      this.agent.setProfile('resume', {
        rawText: this.resumeText,
        skills,
        experience: this.resumeText.slice(0, 500),
        education: ''
      });
    }

    if (this.selectedRole) {
      this.agent.setDreamRole(this.selectedRole);
    }
    this.saved.set(true);
  }

  private parseSkillsFromResume(text: string): string[] {
    const common = ['JavaScript', 'TypeScript', 'Python', 'React', 'Angular', 'Node.js', 'Git', 'SQL', 'HTML', 'CSS', 'Agile', 'Communication'];
    const found: string[] = [];
    const lower = text.toLowerCase();
    for (const s of common) {
      if (lower.includes(s.toLowerCase())) found.push(s);
    }
    return found.length ? found : ['General experience'];
  }
}
