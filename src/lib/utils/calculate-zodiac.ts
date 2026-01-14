import type { Answer, SignScore, ZodiacResult, ZodiacSign } from '../types/zodiac';
import { questions } from '../data/questions';

const ZODIAC_SIGNS: ZodiacSign[] = [
  'aries',
  'tauro',
  'geminis',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'escorpio',
  'sagitario',
  'capricornio',
  'acuario',
  'piscis',
];

export function calculateZodiacSign(answers: Answer[]): ZodiacResult {
  const scores: SignScore = initializeScores();

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const option = question.options.find((opt) => opt.key === answer.selectedOption);
    if (!option) return;

    option.scores.forEach(({ sign, value }) => {
      scores[sign] = (scores[sign] || 0) + value;
    });
  });

  const maxScore = Math.max(...Object.values(scores));
  const topSigns = ZODIAC_SIGNS.filter((sign) => scores[sign] === maxScore);

  const winningSign = topSigns.length > 1 ? tieBreaker(topSigns, answers) : topSigns[0];

  const categoryScores = calculateCategoryScores(answers);

  const sortedSigns = ZODIAC_SIGNS.sort((a, b) => scores[b] - scores[a]);

  return {
    sign: winningSign,
    scores,
    categoryScores,
    topSigns: sortedSigns.slice(0, 3),
  };
}

function initializeScores(): SignScore {
  const scores: SignScore = {};
  ZODIAC_SIGNS.forEach((sign) => {
    scores[sign] = 0;
  });
  return scores;
}

function tieBreaker(tiedSigns: ZodiacSign[], answers: Answer[]): ZodiacSign {
  const tieScores: SignScore = {};

  tiedSigns.forEach((sign) => {
    tieScores[sign] = 0;
  });

  answers.reverse().forEach((answer, index) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const option = question.options.find((opt) => opt.key === answer.selectedOption);
    if (!option) return;

    option.scores.forEach(({ sign, value }) => {
      if (tiedSigns.includes(sign)) {
        tieScores[sign] += value * (1 + index * 0.1);
      }
    });
  });

  const maxTieScore = Math.max(...Object.values(tieScores));
  const winner = tiedSigns.find((sign) => tieScores[sign] === maxTieScore);

  return winner || tiedSigns[0];
}

function calculateCategoryScores(answers: Answer[]): {
  ahorro: number;
  inversion: number;
  controlGastos: number;
  planificacion: number;
  educacionFinanciera: number;
} {
  const categoryMap = {
    ahorro: ['tauro', 'cancer', 'capricornio', 'virgo'],
    inversion: ['escorpio', 'aries', 'acuario', 'geminis'],
    controlGastos: ['virgo', 'capricornio', 'tauro', 'libra'],
    planificacion: ['capricornio', 'virgo', 'cancer', 'tauro'],
    educacionFinanciera: ['virgo', 'geminis', 'acuario', 'libra'],
  };

  const scores = {
    ahorro: 0,
    inversion: 0,
    controlGastos: 0,
    planificacion: 0,
    educacionFinanciera: 0,
  };

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const option = question.options.find((opt) => opt.key === answer.selectedOption);
    if (!option) return;

    option.scores.forEach(({ sign, value }) => {
      Object.entries(categoryMap).forEach(([category, signs]) => {
        if (signs.includes(sign)) {
          const categoryKey = category as keyof typeof scores;
          scores[categoryKey] += value;
        }
      });
    });
  });

  const maxScore = Math.max(...Object.values(scores));

  const normalizedScores = Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key as keyof typeof scores] = Math.round((value / maxScore) * 10);
    return acc;
  }, {} as typeof scores);

  return normalizedScores;
}

export function getProgressPercentage(currentStep: number, totalSteps: number): number {
  return Math.round((currentStep / totalSteps) * 100);
}

export function validateAnswers(answers: Answer[]): boolean {
  if (answers.length !== questions.length) return false;

  return answers.every((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return false;

    return question.options.some((opt) => opt.key === answer.selectedOption);
  });
}
