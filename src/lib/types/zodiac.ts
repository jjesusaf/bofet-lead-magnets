export type ZodiacSign =
  | 'aries'
  | 'tauro'
  | 'geminis'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'escorpio'
  | 'sagitario'
  | 'capricornio'
  | 'acuario'
  | 'piscis';

export type QuestionCategory =
  | 'habitos_compra'
  | 'ahorro_inversion'
  | 'gastos_emocionales'
  | 'prioridades_financieras';

export type OptionKey = 'a' | 'b' | 'c' | 'd';

export interface ScorePoint {
  sign: ZodiacSign;
  value: number;
}

export interface QuestionOption {
  key: OptionKey;
  text: string;
  scores: ScorePoint[];
}

export interface Question {
  id: string;
  category: QuestionCategory;
  question: string;
  options: QuestionOption[];
}

export interface Answer {
  questionId: string;
  selectedOption: OptionKey;
}

export interface SignScore {
  [key: string]: number;
}

export interface AIGeneratedAnalysis {
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  characteristics: string[];
}

export interface ZodiacResult {
  sign: ZodiacSign;
  scores: SignScore;
  categoryScores: {
    ahorro: number;
    inversion: number;
    controlGastos: number;
    planificacion: number;
    educacionFinanciera: number;
  };
  topSigns: ZodiacSign[];
  aiAnalysis?: AIGeneratedAnalysis;
}

export interface ZodiacSignInfo {
  name: string;
  tagline: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  compatibleSigns: ZodiacSign[];
  avoidSigns: ZodiacSign[];
  color: string;
  emoji: string;
}

export interface EmailSubmission {
  email: string;
  zodiacSign: ZodiacSign;
  wantsNewsletter: boolean;
  answers: Answer[];
  scores: SignScore;
  timestamp: Date;
}
