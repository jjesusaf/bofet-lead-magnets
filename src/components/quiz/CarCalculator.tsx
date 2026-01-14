import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Car, Calendar, CheckCircle, AlertCircle, Mail, ChevronDown } from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido'),
});

export function CarCalculator() {
  const [carPrice, setCarPrice] = useState(500000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(8);

  // Display values for formatted inputs
  const [carPriceDisplay, setCarPriceDisplay] = useState('$500,000');
  const [currentSavingsDisplay, setCurrentSavingsDisplay] = useState('$50,000');

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [results, setResults] = useState({
    monthsNeeded: 0,
    yearsNeeded: 0,
    totalContributions: 0,
    totalInterest: 0,
    finalAmount: 0,
    monthlyDetails: [] as Array<{
      month: number;
      contribution: number;
      balanceBeforeInterest: number;
      interest: number;
      balanceAfterInterest: number;
    }>,
  });

  const [showMonthlyDetails, setShowMonthlyDetails] = useState(false);

  useEffect(() => {
    calculateResults();
  }, [carPrice, currentSavings, monthlyContribution, annualReturn]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('calculator-email');
    if (savedEmail) {
      setHasSubmitted(true);
    }

    // Initialize display values on mount
    const formatter = new Intl.NumberFormat('es-MX');
    setCarPriceDisplay('$' + formatter.format(carPrice));
    setCurrentSavingsDisplay('$' + formatter.format(currentSavings));
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

    if (!isValid) return;

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
          source: 'car-calculator',
          carPrice,
          currentSavings,
          monthlyContribution,
          annualReturn,
          results,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log('✅ Email enviado a Formspree desde calculadora');
    } catch (error) {
      console.error('Error enviando a Formspree:', error);
    } finally {
      localStorage.setItem('calculator-email', JSON.stringify({ email }));
      setHasSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const calculateResults = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const targetAmount = carPrice;

    // Edge case: Already have enough savings
    if (currentSavings >= targetAmount) {
      setResults({
        monthsNeeded: 0,
        yearsNeeded: 0,
        totalContributions: currentSavings,
        totalInterest: 0,
        finalAmount: targetAmount,
        monthlyDetails: [],
      });
      return;
    }

    // Calculate iteratively: (balance + contribution) * (1 + rate) each month
    let balance = currentSavings;
    let months = 0;
    let totalContributed = currentSavings;
    const monthlyDetails: Array<{
      month: number;
      contribution: number;
      balanceBeforeInterest: number;
      interest: number;
      balanceAfterInterest: number;
    }> = [];

    // Iterate month by month until we reach the target
    while (balance < targetAmount && months < 600) {
      // Add monthly contribution FIRST
      balance = balance + monthlyContribution;
      totalContributed += monthlyContribution;

      const balanceBeforeInterest = balance;

      // Then apply interest to the total
      balance = balance * (1 + monthlyRate);

      const interestEarned = balance - balanceBeforeInterest;

      months++;

      // Store monthly detail
      monthlyDetails.push({
        month: months,
        contribution: monthlyContribution,
        balanceBeforeInterest: balanceBeforeInterest,
        interest: interestEarned,
        balanceAfterInterest: balance,
      });
    }

    const years = months / 12;

    // Sum all the interest earned month by month
    const totalInterest = monthlyDetails.reduce((sum, detail) => sum + detail.interest, 0);

    // Final amount is the actual balance reached (might be slightly over target)
    const finalAmount = balance;

    setResults({
      monthsNeeded: months,
      yearsNeeded: years,
      totalContributions: totalContributed,
      totalInterest: totalInterest,
      finalAmount: finalAmount,
      monthlyDetails: monthlyDetails,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseFormattedNumber = (value: string) => {
    // Remove everything except digits
    const numbers = value.replace(/[^\d]/g, '');
    return numbers === '' ? 0 : parseInt(numbers, 10);
  };

  const handleCarPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCarPriceDisplay(value);
    const numericValue = parseFormattedNumber(value);
    setCarPrice(numericValue);
  };

  const handleCarPriceFocus = () => {
    // Show only numbers when focused
    setCarPriceDisplay(carPrice === 0 ? '' : carPrice.toString());
  };

  const handleCarPriceBlur = () => {
    // Format with $ and commas when unfocused
    if (carPrice === 0) {
      setCarPrice(100000);
      setCarPriceDisplay('$' + formatNumber(100000));
    } else {
      setCarPriceDisplay('$' + formatNumber(carPrice));
    }
  };

  const handleCurrentSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentSavingsDisplay(value);
    const numericValue = parseFormattedNumber(value);
    setCurrentSavings(numericValue);
  };

  const handleCurrentSavingsFocus = () => {
    // Show only numbers when focused
    setCurrentSavingsDisplay(currentSavings === 0 ? '' : currentSavings.toString());
  };

  const handleCurrentSavingsBlur = () => {
    // Format with $ and commas when unfocused
    if (currentSavings === 0) {
      setCurrentSavingsDisplay('$0');
    } else {
      setCurrentSavingsDisplay('$' + formatNumber(currentSavings));
    }
  };

  const progressPercentage = Math.min((currentSavings / carPrice) * 100, 100);
  const isEmailValid = email.length > 0 && !emailError;

  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      {/* Header with Instructions */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8 text-foreground" />
            <h2 className="text-3xl font-bold">Calculadora del Auto Soñado</h2>
          </div>
          <p className="text-muted-foreground">
            Descubre cuánto tiempo necesitas para alcanzar tu meta financiera
          </p>
        </div>

        <Card className="flex-shrink-0 p-5 bg-secondary/30 max-w-md">
          <h3 className="text-sm font-semibold mb-2">Instrucciones</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Ingresa el precio del auto que deseas comprar</li>
            <li>• Indica cuánto dinero tienes ahorrado actualmente</li>
            <li>• Ajusta cuánto puedes ahorrar cada mes</li>
            <li>• Define el rendimiento anual esperado de tu inversión</li>
          </ul>
        </Card>
      </div>

      {/* Two Column Layout - 70/30 */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - Inputs (70%) */}
        <div className="w-full md:w-[70%] space-y-4">
          {/* Car Price */}
          <Card className="p-5">
            <Label htmlFor="carPrice" className="text-sm font-semibold mb-2 block">
              Precio del Auto
            </Label>
            <div className="relative">
              <Input
                id="carPrice"
                type="text"
                inputMode="numeric"
                value={carPriceDisplay}
                onChange={handleCarPriceChange}
                onFocus={handleCarPriceFocus}
                onBlur={handleCarPriceBlur}
                placeholder="$0"
                className="text-lg font-semibold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                MXN
              </div>
            </div>
          </Card>

          {/* Current Savings */}
          <Card className="p-5">
            <Label htmlFor="currentSavings" className="text-sm font-semibold mb-2 block">
              Ahorros Actuales
            </Label>
            <div className="relative">
              <Input
                id="currentSavings"
                type="text"
                inputMode="numeric"
                value={currentSavingsDisplay}
                onChange={handleCurrentSavingsChange}
                onFocus={handleCurrentSavingsFocus}
                onBlur={handleCurrentSavingsBlur}
                placeholder="$0"
                className="text-lg font-semibold"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                MXN
              </div>
            </div>
          </Card>

          {/* Monthly Contribution */}
          <Card className="p-5">
            <Label className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span>Ahorro Mensual</span>
              <span className="text-primary">{formatCurrency(monthlyContribution)}</span>
            </Label>
            <Slider
              value={[monthlyContribution]}
              onValueChange={(value) => setMonthlyContribution(value[0])}
              min={1000}
              max={50000}
              step={500}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$1,000</span>
              <span>$50,000</span>
            </div>
          </Card>

          {/* Annual Return */}
          <Card className="p-5">
            <Label className="text-sm font-semibold mb-3 flex items-center justify-between">
              <span>Rendimiento Anual Esperado</span>
              <span className="text-primary">{annualReturn}%</span>
            </Label>
            <Slider
              value={[annualReturn]}
              onValueChange={(value) => setAnnualReturn(value[0])}
              min={0}
              max={20}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>20%</span>
            </div>
          </Card>

        </div>

        {/* Right Section - Results (30%) */}
        <div className="w-full md:w-[30%] relative">
          {/* Results - Always rendered in background */}
          <div className={`space-y-4 ${!hasSubmitted ? 'blur-sm pointer-events-none' : ''}`}>
            {/* Main Result */}
            <Card className="p-6">
              <div className="text-center space-y-3">
                <Calendar className="w-10 h-10 mx-auto text-foreground" />
                <div>
                  <div className="text-3xl font-bold">
                    {results.yearsNeeded < 1
                      ? `${results.monthsNeeded}`
                      : `${Math.floor(results.yearsNeeded)}`
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {results.yearsNeeded < 1
                      ? `${results.monthsNeeded === 1 ? 'mes' : 'meses'}`
                      : `${Math.floor(results.yearsNeeded) === 1 ? 'año' : 'años'}`
                    }
                    {results.yearsNeeded >= 1 && results.monthsNeeded % 12 > 0 && (
                      <span> y {results.monthsNeeded % 12} meses</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress Bar */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Progreso Actual</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Completado</span>
                  <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Financial Breakdown */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Desglose</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ahorro inicial</span>
                  <span className="font-semibold">{formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Aportes mensuales</span>
                  <span className="font-semibold">{formatCurrency(results.totalContributions - currentSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Intereses ganados</span>
                  <span className="font-semibold text-primary">
                    +{formatCurrency(results.totalInterest)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total final</span>
                    <span className="text-primary">{formatCurrency(results.finalAmount)}</span>
                  </div>
                  {currentSavings > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Tu ahorro inicial te ayuda a llegar {results.monthsNeeded > 0 ? Math.round((currentSavings / monthlyContribution)) : 0} meses más rápido
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Composition Chart */}
            <Card className="p-5">
              <h3 className="text-sm font-semibold mb-3">Composición</h3>
              <div className="space-y-3">
                <div className="h-6 bg-secondary rounded overflow-hidden flex">
                  <div
                    className="bg-foreground/80 transition-all duration-500"
                    style={{ width: `${(currentSavings / results.finalAmount) * 100}%` }}
                    title="Inicial"
                  />
                  <div
                    className="bg-foreground/60 transition-all duration-500"
                    style={{ width: `${((results.totalContributions - currentSavings) / results.finalAmount) * 100}%` }}
                    title="Aportaciones"
                  />
                  <div
                    className="bg-primary transition-all duration-500"
                    style={{ width: `${(results.totalInterest / results.finalAmount) * 100}%` }}
                    title="Intereses"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground/80" />
                      <span className="text-muted-foreground">Inicial</span>
                    </div>
                    <span className="font-medium">{formatCurrency(currentSavings)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground/60" />
                      <span className="text-muted-foreground">Mensual</span>
                    </div>
                    <span className="font-medium">{formatCurrency(results.totalContributions - currentSavings)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">Intereses</span>
                    </div>
                    <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Monthly Details - Collapsible */}
            {results.monthlyDetails.length > 0 && (
              <Card className="p-5">
                <button
                  onClick={() => setShowMonthlyDetails(!showMonthlyDetails)}
                  className="w-full flex items-center justify-between text-sm font-semibold mb-3 hover:text-primary transition-colors"
                >
                  <span>Detalle Mensual ({results.monthlyDetails.length} meses)</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showMonthlyDetails ? 'rotate-180' : ''}`}
                  />
                </button>

                {showMonthlyDetails && (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {results.monthlyDetails.map((detail) => (
                      <div
                        key={detail.month}
                        className="border border-border rounded-lg p-3 text-xs space-y-1 bg-background/50"
                      >
                        <div className="font-semibold text-primary mb-2">
                          Mes {detail.month}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aportación:</span>
                          <span className="font-medium">{formatCurrency(detail.contribution)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance:</span>
                          <span className="font-medium">{formatCurrency(detail.balanceBeforeInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Interés ganado:</span>
                          <span className="font-medium text-green-600">+{formatCurrency(detail.interest)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 mt-1">
                          <span className="text-muted-foreground font-semibold">Total al final:</span>
                          <span className="font-semibold">{formatCurrency(detail.balanceAfterInterest)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Email Form Overlay - Positioned absolutely on top */}
          {!hasSubmitted && (
            <div className="absolute inset-0 flex items-start justify-center pt-4 pointer-events-none">
              <Card className="p-6 bg-background/95 backdrop-blur-md border-primary/20 shadow-2xl pointer-events-auto w-full mx-4">
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex items-start gap-3 mb-4">
                    <Mail className="w-6 h-6 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1">
                        Desbloquea tu análisis
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ingresa tu email para ver los resultados completos
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="calc-email" className="text-sm">Email</Label>
                      <div className="relative mt-1">
                        <Input
                          id="calc-email"
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting || (emailTouched && !!emailError)}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Ver Resultados
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Recibirás tips exclusivos para alcanzar tu meta
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
