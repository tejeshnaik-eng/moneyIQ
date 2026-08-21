export type ConceptCategory = 'Technical Analysis' | 'Fundamental Analysis' | 'Portfolio Strategy';
export type ConceptDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ConceptType = 'lesson' | 'quiz';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface LearningConcept {
  id: string;
  category: ConceptCategory;
  title: string;
  difficulty: ConceptDifficulty;
  durationMinutes: number;
  description: string;
  type: ConceptType;
  
  // For 'lesson' type
  lessonContent?: {
    whatYouWillLearn: string;
    explanation: string;
    chartType?: 'support_resistance' | 'moving_average' | 'candlestick' | 'none';
  };
  
  // For 'quiz' type
  quizContent?: {
    question: string;
    options: QuizOption[];
  };
}
