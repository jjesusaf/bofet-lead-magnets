import type { Answer, ZodiacResult } from './types/zodiac';

const STORAGE_KEY = 'quiz-state';

export interface QuizState {
  currentStep: number;
  answers: Answer[];
  result: ZodiacResult | null;
}

export const quizStore = {
  getState(): QuizState {
    if (typeof window === 'undefined') {
      return { currentStep: 0, answers: [], result: null };
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { currentStep: 0, answers: [], result: null };
      }
    }
    return { currentStep: 0, answers: [], result: null };
  },

  setState(state: Partial<QuizState>): void {
    if (typeof window === 'undefined') return;

    const current = this.getState();
    const newState = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

    // Dispatch custom event for reactive updates
    window.dispatchEvent(new CustomEvent('quiz-state-change', { detail: newState }));
  },

  setAnswer(questionId: string, selectedOption: 'a' | 'b' | 'c' | 'd'): void {
    const state = this.getState();
    const existingIndex = state.answers.findIndex(a => a.questionId === questionId);

    if (existingIndex >= 0) {
      state.answers[existingIndex] = { questionId, selectedOption };
    } else {
      state.answers.push({ questionId, selectedOption });
    }

    this.setState({ answers: state.answers });
  },

  getAnswer(questionId: string): Answer | undefined {
    const state = this.getState();
    return state.answers.find(a => a.questionId === questionId);
  },

  nextStep(): void {
    const state = this.getState();
    this.setState({ currentStep: state.currentStep + 1 });
  },

  previousStep(): void {
    const state = this.getState();
    if (state.currentStep > 0) {
      this.setState({ currentStep: state.currentStep - 1 });
    }
  },

  goToStep(step: number): void {
    this.setState({ currentStep: step });
  },

  setResult(result: ZodiacResult): void {
    this.setState({ result });
  },

  reset(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      this.setState({ currentStep: 0, answers: [], result: null });
    }
  },
};
