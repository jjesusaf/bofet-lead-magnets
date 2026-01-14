import { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodiacSignsInfo } from '@/lib/data/zodiac-signs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import type { ZodiacResult, Answer } from '@/lib/types/zodiac';

const emailSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
});

export function ResultView() {
  const [result, setResult] = useState<ZodiacResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(true);
  const [hasSubmittedEmail, setHasSubmittedEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem('quiz-result');
    const savedAnswers = localStorage.getItem('quiz-answers');
    const savedEmail = localStorage.getItem('quiz-email');

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }

    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    if (savedEmail) {
      setHasSubmittedEmail(true);
      setShowEmailModal(false);
    } else {
      setShowEmailModal(true);
    }
  }, []);

  const validateEmail = (value: string) => {
    try {
      emailSchema.parse({ email: value });
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) {
      validateEmail(value);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    validateEmail(email);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setEmailTouched(true);
    const isValid = validateEmail(email);
    
    if (!isValid || !result) return;

    setIsSubmitting(true);

    try {
      const formspreeEndpoint = import.meta.env.PUBLIC_FORMSPREE_ENDPOINT || 'YOUR_FORMSPREE_ENDPOINT';

      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newsletter,
          zodiacSign: result.sign,
          answers,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log('✅ Email enviado a Formspree');
    } catch (error) {
      console.error('Error enviando a Formspree:', error);
    } finally {
      localStorage.setItem('quiz-email', JSON.stringify({ email, newsletter }));
      setHasSubmittedEmail(true);
      setShowEmailModal(false);
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No hay resultados disponibles</p>
          <Button onClick={() => window.location.href = '/'}>
            Realizar el quiz
          </Button>
        </div>
      </div>
    );
  }

  const signInfo = zodiacSignsInfo[result.sign];
  const isBlurred = !hasSubmittedEmail;
  const isEmailValid = email.length > 0 && !emailError;

  return (
    <>
      {/* Email Modal - Cannot be closed */}
      <Dialog open={showEmailModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">¡Tu resultado está listo!</DialogTitle>
            <DialogDescription className="text-center">
              Ingresa tu email para ver tu perfil financiero completo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className={`pr-10 ${
                    emailTouched
                      ? emailError
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : isEmailValid
                        ? 'border-green-500 focus-visible:ring-green-500'
                        : ''
                      : ''
                  }`}
                />
                {emailTouched && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailError ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : isEmailValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {emailTouched && emailError && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="w-4 h-4 text-primary border-input rounded focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
                Quiero recibir tips financieros semanales
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || (emailTouched && !!emailError)}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                'Ver mi Resultado'
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Al continuar, aceptas nuestra política de privacidad
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Result Content with Blur */}


      <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 ${isBlurred ? 'blur-md select-none pointer-events-none' : ''}`}>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full text-6xl mb-4"
                style={{ backgroundColor: signInfo.color + '20' }}
              >
                {signInfo.emoji}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                ¡Eres un {signInfo.name}!
              </h1>
              <p className="text-xl text-muted-foreground italic">
                {signInfo.tagline}
              </p>
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Descripción
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {signInfo.description}
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  Fortalezas Financieras
                </h3>
                <ul className="space-y-2">
                  {signInfo.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  Áreas de Mejora
                </h3>
                <ul className="space-y-2">
                  {signInfo.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-orange-600 dark:text-orange-400 mt-1">!</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                Características Principales
              </h3>
              <ul className="grid md:grid-cols-2 gap-3">
                {signInfo.characteristics.map((char, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recomendaciones Personalizadas
              </h3>
              <ul className="space-y-3">
                {signInfo.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                    <span className="text-primary font-semibold">{index + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Compatibilidad Financiera
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tu pareja financiera ideal:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {signInfo.compatibleSigns.map((sign) => (
                      <span
                        key={sign}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                      >
                        {zodiacSignsInfo[sign].emoji} {sign}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Evita invertir con:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {signInfo.avoidSigns.map((sign) => (
                      <span
                        key={sign}
                        className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium"
                      >
                        {zodiacSignsInfo[sign].emoji} {sign}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="outline" onClick={handleRestart} className="gap-2">
                <RefreshCw className="w-5 h-5" />
                Hacer el test de nuevo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
