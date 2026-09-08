export interface ShuHaRiTestQuestion {
  question: string;
  type: 'grammar' | 'vocabulary' | 'comprehension' | 'application';
  correct_answer: string;
  skill_id?: string;
  skill_type?: string;
}

export interface ShuHaRiTestResult {
  score: number;
  passed: boolean;
  strengths: string[];
  improvements: string[];
  detailed_feedback: string;
  skills_progress: Array<{
    skill_id: string;
    stage: 'shu' | 'ha' | 'ri';
    passed: boolean;
  }>;
}

