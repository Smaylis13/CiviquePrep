export type ExamType = 'CSP' | 'CR' | 'NAT';

export interface Question {
  id: string;
  theme: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceType: 'pedagogical';
}

export interface AnswerRecord {
  question: Question;
  selectedIndex: number | null;
}
