import { Injectable, signal, computed } from '@angular/core';
import {
  UserProfile,
  DreamRole,
  SkillGap,
  RoadmapWeek,
  AgentState,
  ProfileSource,
  AgentStep
} from '../models/career';

const DREAM_ROLES: DreamRole[] = [
  {
    id: 'fe-1',
    title: 'Frontend Developer',
    description: 'Build responsive web apps with modern frameworks.',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React', 'TypeScript', 'Git'],
    preferredSkills: ['Angular', 'Testing', 'Accessibility'],
    level: 'mid'
  },
  {
    id: 'be-1',
    title: 'Backend Developer',
    description: 'Design APIs and server-side logic.',
    requiredSkills: ['Python', 'SQL', 'REST APIs', 'Git', 'Linux'],
    preferredSkills: ['Node.js', 'Docker', 'AWS'],
    level: 'mid'
  },
  {
    id: 'full-1',
    title: 'Full-Stack Engineer',
    description: 'End-to-end product development.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git'],
    preferredSkills: ['GraphQL', 'Docker', 'CI/CD'],
    level: 'mid'
  },
  {
    id: 'ds-1',
    title: 'Data Scientist',
    description: 'Analyze data and build ML models.',
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Pandas'],
    preferredSkills: ['TensorFlow', 'PyTorch', 'AWS'],
    level: 'mid'
  },
  {
    id: 'pm-1',
    title: 'Product Manager',
    description: 'Define product strategy and roadmap.',
    requiredSkills: ['Agile', 'Stakeholder Management', 'Analytics', 'User Research'],
    preferredSkills: ['SQL', 'A/B Testing', 'Roadmapping'],
    level: 'mid'
  }
];

@Injectable({ providedIn: 'root' })
export class CareerAgentService {
  private state = signal<AgentState>({
    profile: null,
    dreamRole: null,
    skillGaps: [],
    roadmap: [],
    lastUpdated: null
  });

  profile = computed(() => this.state().profile);
  dreamRole = computed(() => this.state().dreamRole);
  skillGaps = computed(() => this.state().skillGaps);
  roadmap = computed(() => this.state().roadmap);
  lastUpdated = computed(() => this.state().lastUpdated);
  hasProfile = computed(() => !!this.state().profile);
  hasDreamRole = computed(() => !!this.state().dreamRole);
  isReady = computed(() => !!this.state().profile && !!this.state().dreamRole);

  private agentSteps = signal<AgentStep[]>([]);
  readonly steps = this.agentSteps.asReadonly();

  getDreamRoles(): DreamRole[] {
    return DREAM_ROLES;
  }

  setProfile(source: ProfileSource, payload: Partial<UserProfile>): void {
    this.agentSteps.set([
      { id: '1', label: 'Skill extraction', status: 'active', message: 'Parsing profile...', at: new Date().toISOString() }
    ]);
    const profile: UserProfile = {
      source,
      skills: payload.skills ?? [],
      experience: payload.experience ?? '',
      education: payload.education ?? '',
      ...payload
    };
    this.state.update(s => ({
      ...s,
      profile,
      lastUpdated: new Date().toISOString()
    }));
    this.agentSteps.update(steps =>
      steps.map(s => s.id === '1' ? { ...s, status: 'done' as const, message: `Extracted ${profile.skills.length} skills` } : s)
    );
    this.recomputeGapsAndRoadmap();
  }

  setDreamRole(role: DreamRole): void {
    this.state.update(s => ({
      ...s,
      dreamRole: role,
      lastUpdated: new Date().toISOString()
    }));
    this.recomputeGapsAndRoadmap();
  }

  private recomputeGapsAndRoadmap(): void {
    const { profile, dreamRole } = this.state();
    if (!profile || !dreamRole) return;

    this.agentSteps.update(steps => [
      ...steps,
      { id: '2', label: 'Market alignment', status: 'active', message: 'Mapping to role requirements...', at: new Date().toISOString() }
    ]);
    const profileSkills = new Set(profile.skills.map(s => s.toLowerCase()));
    const gaps: SkillGap[] = [];

    for (const skill of dreamRole.requiredSkills) {
      const level = profileSkills.has(skill.toLowerCase()) ? 3 : 0;
      if (level < 4) {
        gaps.push({
          skill,
          category: 'technical',
          importance: 'critical',
          currentLevel: level,
          targetLevel: 4,
          reason: `Required for ${dreamRole.title}.`
        });
      }
    }
    for (const skill of dreamRole.preferredSkills) {
      if (!profileSkills.has(skill.toLowerCase())) {
        gaps.push({
          skill,
          category: 'technical',
          importance: 'high',
          currentLevel: 0,
          targetLevel: 3,
          reason: `Preferred for ${dreamRole.title}.`
        });
      }
    }

    this.agentSteps.update(steps =>
      steps.map(s => s.id === '2' ? { ...s, status: 'done' as const, message: `Found ${gaps.length} gaps` } : s)
    );
    this.agentSteps.update(steps => [
      ...steps,
      { id: '3', label: 'Agentic planning', status: 'active', message: 'Building 30-day roadmap...', at: new Date().toISOString() }
    ]);
    const roadmap = this.build30DayRoadmap(gaps, dreamRole.title);
    this.state.update(s => ({
      ...s,
      skillGaps: gaps,
      roadmap,
      lastUpdated: new Date().toISOString()
    }));
    this.agentSteps.update(steps =>
      steps.map(s => s.id === '3' ? { ...s, status: 'done' as const, message: 'Roadmap generated' } : s)
    );
  }

  private build30DayRoadmap(gaps: SkillGap[], roleTitle: string): RoadmapWeek[] {
    const weeks: RoadmapWeek[] = [];
    const gapSkills = gaps.slice(0, 8).map(g => g.skill);
    const themes = ['Foundation', 'Core skills', 'Projects', 'Polish & interview'];

    for (let w = 0; w < 4; w++) {
      const weekNum = w + 1;
      const theme = themes[w] ?? 'Growth';
      const days = [];
      const daysPerWeek = w === 3 ? 8 : 7;
      for (let d = 1; d <= daysPerWeek; d++) {
        const dayNum = (w * 7) + d;
        const skill = gapSkills[(dayNum - 1) % gapSkills.length] ?? 'Professional skills';
        days.push({
          day: dayNum,
          title: `Day ${dayNum}: ${skill}`,
          description: `Focus on ${skill} with hands-on practice and small deliverables.`,
          resources: [
            { label: 'Documentation', url: '#' },
            { label: 'Tutorial', url: '#' }
          ],
          checkpoint: `Complete one small task or exercise in ${skill}.`
        });
      }
      weeks.push({ week: weekNum, theme, days });
    }
    return weeks;
  }

  markDayComplete(weekIndex: number, dayIndex: number): void {
    this.state.update(s => {
      const roadmap = s.roadmap.map((wk, wi) => {
        if (wi !== weekIndex) return wk;
        return {
          ...wk,
          days: wk.days.map((d, di) =>
            di === dayIndex ? { ...d, completed: true } : d
          )
        };
      });
      return { ...s, roadmap, lastUpdated: new Date().toISOString() };
    });
  }

  reset(): void {
    this.state.set({
      profile: null,
      dreamRole: null,
      skillGaps: [],
      roadmap: [],
      lastUpdated: null
    });
    this.agentSteps.set([]);
  }
}
