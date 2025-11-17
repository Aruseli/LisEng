export interface DailyPlanAiSummary {
  summary: string;
  focus: string[];
  motivation: string;
  aiTasks: Array<{
    type: string;
    prompt: string;
    context: string;
  }>;
  recommendations?: any;
  reviewReminders?: string[];
  fallbackUsed?: boolean;
}

// Placeholder types to satisfy the import in daily-plan-service.ts
export interface DailyPlan {
  [key: string]: any;
}

export interface EnrichedDailyPlan extends DailyPlan {
  [key: string]: any;
}
