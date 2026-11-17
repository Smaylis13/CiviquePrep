import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, inject } from '@angular/core';
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
  get answeredCount(): number { return this.answers.filter(a => a.selectedIndex !== null).length; }
  get correctCount(): number { return this.answers.filter(a => a.selectedIndex === a.question.correctIndex).length; }
  get scorePercent(): number { return this.answers.length ? Math.round(this.correctCount / this.answers.length * 100) : 0; }
  get passed(): boolean { return this.correctCount >= Math.ceil(this.answers.length * 0.8); }
  get unansweredCount(): number { return this.answers.filter(a => a.selectedIndex === null).length; }

  ngOnDestroy(): void { this.stopTimer(); }

  openSetup(): void { this.screen = 'setup'; this.error = ''; }

  startExam(): void {
    this.loading = true;
    this.error = '';
    this.http.get<Question[]>(`assets/data/${this.examType.toLowerCase()}.json`).subscribe({
      next: (bank) => {
        if (bank.length < this.questionCount) {
          this.error = `La banque contient ${bank.length} questions, impossible d'en tirer ${this.questionCount}.`;
          this.loading = false;
          return;
        }
        this.questions = this.shuffle([...bank]).slice(0, this.questionCount);
        this.answers = this.questions.map(question => ({ question, selectedIndex: null }));
        this.currentIndex = 0;
        this.secondsLeft = this.questionCount === 40 ? 45 * 60 : 22 * 60 + 30;
        this.screen = 'exam';
        this.loading = false;
        this.startTimer();
      },
      error: () => {
        this.error = 'Impossible de charger les questions. Vérifiez les fichiers JSON.';
        this.loading = false;
      }
    });
  }

  selectOption(index: number): void {
    if (!this.answers[this.currentIndex]) return;
    this.answers[this.currentIndex].selectedIndex = index;
  }

  previous(): void { if (this.currentIndex > 0) this.currentIndex--; }

  next(): void {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
    else this.finishExam();
  }

  finishExam(): void {
    this.stopTimer();
    this.screen = 'results';
  }

  confirmFinish(): void {
    if (confirm('Terminer définitivement cet examen et afficher le résultat ?')) this.finishExam();
  }

  restart(): void {
    this.stopTimer();
    this.screen = 'home';
    this.questions = [];
    this.answers = [];
    this.currentIndex = 0;
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerId = setInterval(() => {
      if (this.secondsLeft > 0) this.secondsLeft--;
      else this.finishExam();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
  }

  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  trackById(_: number, item: AnswerRecord): string { return item.question.id; }
}
