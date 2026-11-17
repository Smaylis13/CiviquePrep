import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { Question, ExamType, AnswerRecord } from './models/question.model';

type Screen = 'home' | 'setup' | 'exam' | 'results';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  screen: Screen = 'home';
  examType: ExamType = 'CSP';
  questionCount: 20 | 40 = 20;
  questions: Question[] = [];
  answers: AnswerRecord[] = [];
  currentIndex = 0;
  secondsLeft = 0;
  timerId: ReturnType<typeof setInterval> | null = null;
  loading = false;
  error = '';

  readonly examNames: Record<ExamType, string> = {
    CSP: 'Carte de séjour pluriannuelle',
    CR: 'Carte de résident',
    NAT: 'Naturalisation'
  };

  get current(): Question | undefined { return this.questions[this.currentIndex]; }
  get progress(): number { return this.questions.length ? ((this.currentIndex + 1) / this.questions.length) * 100 : 0; }
  get timeLabel(): string {
    const m = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
    const s = (this.secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
