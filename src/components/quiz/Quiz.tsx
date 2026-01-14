import { useState, useEffect } from 'react';
import { questions } from '@/lib/data/questions';
import { calculateZodiacSign } from '@/lib/utils/calculate-zodiac';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { Answer } from '@/lib/types/zodiac';
import { CarCalculator } from './CarCalculator';

export function Quiz() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [isInQuizSection, setIsInQuizSection] = useState(true);

  const totalQuestions = questions.length;
  const answeredCount = answers.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount === totalQuestions;

  useEffect(() => {
    const saved = localStorage.getItem('quiz-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setAnswers(state.answers || []);
      } catch (e) {
        console.error('Error loading quiz state:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quiz-state', JSON.stringify({ answers }));
  }, [answers]);

  const handleAnswer = (questionId: string, selectedOption: 'a' | 'b' | 'c' | 'd') => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, selectedOption };
    } else {
      newAnswers.push({ questionId, selectedOption });
    }
    setAnswers(newAnswers);
    
    // Auto scroll to next question
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        const nextQuestion = document.getElementById(`question-${questions[currentIndex + 1].id}`);
        nextQuestion?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId);
  };

  const handleFinish = () => {
    if (!allAnswered) return;
    const calculatedResult = calculateZodiacSign(answers);
    localStorage.setItem('quiz-result', JSON.stringify(calculatedResult));
    localStorage.setItem('quiz-answers', JSON.stringify(answers));
    localStorage.removeItem('quiz-email');
    window.location.href = '/resultado';
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveQuestion(entry.target.id.replace('question-', ''));
          }
        });
      },
      { threshold: 0.5 }
    );

    questions.forEach((q) => {
      const element = document.getElementById(`question-${q.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const calculatorElement = document.getElementById('car-calculator-section');
    if (!calculatorElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInQuizSection(!entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(calculatorElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Sticky Progress Header - Only show in quiz section */}
      {isInQuizSection && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-sm px-8 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-medium">
              {answeredCount} de {totalQuestions} respondidas
            </span>
          </div>
          <span className="text-xs font-semibold text-primary">
            {progress}%
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Section - Quiz (70%) */}
        <div className="w-full md:w-[70%] p-8 space-y-3">
        {questions.map((question, index) => {
          const answer = getAnswer(question.id);
          const isAnswered = answer !== undefined;
          const isActive = activeQuestion === question.id;

          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={`transition-all duration-300 ${
                isActive ? 'scale-[1.005]' : 'scale-100 opacity-95'
              }`}
            >
              <Card className={`relative overflow-hidden transition-all duration-200 ${
                isAnswered 
                  ? 'border-green-500/50 bg-green-50/5' 
                  : isActive 
                  ? 'border-primary shadow-md shadow-primary/5' 
                  : 'border-border'
              }`}>
                {/* Question Number Badge */}
                <div className="absolute top-3 right-3 z-10">
                  {isAnswered ? (
                    <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                      {index + 1}/{totalQuestions}
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-5">
                  {/* Question Text */}
                  <h3 className="text-base md:text-lg font-bold mb-3 pr-16 leading-snug">
                    {question.question}
                  </h3>

                  {/* Select Dropdown */}
                  <Select
                    value={answer?.selectedOption}
                    onValueChange={(value) => handleAnswer(question.id, value as 'a' | 'b' | 'c' | 'd')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border">
                      {question.options.map((option) => (
                        <SelectItem key={option.key} value={option.key}>
                          <span className="font-bold text-primary mr-2">{option.key.toUpperCase()}.</span>
                          {option.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            </div>
          );
        })}

        {/* Finish Button - At the end of quiz */}
        {allAnswered && (
          <div className="mt-6 flex justify-center animate-in slide-in-from-bottom duration-500">
            <Button
              onClick={handleFinish}
              size="lg"
              className="h-12 px-6 text-base font-semibold shadow-2xl shadow-primary/50 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Ver mi Resultado
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
        </div>

        {/* Right Section (30%) */}
        <div className="hidden md:block md:w-[30%] md:border-l border-border md:min-h-screen">
          {/* Empty section */}
        </div>
      </div>

      {/* Car Calculator Section - Below Quiz */}
      <div id="car-calculator-section" className="border-t mt-12">
        <CarCalculator />
      </div>
    </div>
  );
}
