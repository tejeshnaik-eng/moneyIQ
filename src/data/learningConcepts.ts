import { LearningConcept } from '../types/learning';
import { technicalConcepts } from './concepts/technical';
import { fundamentalConcepts } from './concepts/fundamental';
import { portfolioConcepts } from './concepts/portfolio';

export const allLearningConcepts: LearningConcept[] = [
  ...technicalConcepts,
  ...fundamentalConcepts,
  ...portfolioConcepts
];
