export type ProfileSource = 'github' | 'linkedin' | 'resume';

export interface UserProfile {
  source: ProfileSource;
  rawText?: string;
  githubUsername?: string;
  linkedInUrl?: string;
  skills: string[];
  experience: string;
  education: string;
  extractedAt?: string;
}

export interface DreamRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  level: 'entry' | 'mid' | 'senior';
}

export interface SkillGap {
  skill: string;
  category: 'technical' | 'soft' | 'tool';
  importance: 'critical' | 'high' | 'medium';
  currentLevel: number; // 0-5
  targetLevel: number;
  reason: string;
}

export interface RoadmapDay {
  day: number;
  title: string;
  description: string;
  resources: { label: string; url: string }[];
  checkpoint: string;
  completed?: boolean;
}

export interface RoadmapWeek {
  week: number;
  theme: string;
  days: RoadmapDay[];
}

export interface AgentState {
  profile: UserProfile | null;
  dreamRole: DreamRole | null;
  skillGaps: SkillGap[];
  roadmap: RoadmapWeek[];
  lastUpdated: string | null;
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
  message?: string;
  at?: string;
}
