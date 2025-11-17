export interface WritingCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface WritingFeedback {
  score: number;
  feedback: string;
  corrections: WritingCorrection[];
}
