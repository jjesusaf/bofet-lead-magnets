import type { Question } from '../types/zodiac';

export const questions: Question[] = [
  // Categoría 1: Hábitos de Compra (4 preguntas)
  {
    id: 'q1',
    category: 'habitos_compra',
    question: 'Ves algo que te gusta en una tienda, ¿qué haces?',
    options: [
      {
        key: 'a',
        text: 'Lo compro inmediatamente, no quiero que se agote',
        scores: [
          { sign: 'aries', value: 3 },
          { sign: 'leo', value: 2 },
          { sign: 'sagitario', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Lo pienso 24 horas antes de decidir',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'tauro', value: 2 },
        ],
      },
      {
        key: 'c',
        text: 'Comparo precios en varias tiendas y online',
        scores: [
          { sign: 'geminis', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'virgo', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Solo compro si está en descuento o promoción',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'cancer', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q2',
    category: 'habitos_compra',
    question: '¿Cuántas apps de delivery de comida tienes instaladas?',
    options: [
      {
        key: 'a',
        text: '5+ y todas con suscripciones premium',
        scores: [
          { sign: 'leo', value: 3 },
          { sign: 'aries', value: 2 },
          { sign: 'sagitario', value: 1 },
        ],
      },
      {
        key: 'b',
        text: '2-3, pero solo uso cupones y promociones',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'c',
        text: '1, casi nunca pido comida a domicilio',
        scores: [
          { sign: 'capricornio', value: 3 },
          { sign: 'tauro', value: 2 },
          { sign: 'virgo', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Ninguna, prefiero cocinar en casa',
        scores: [
          { sign: 'cancer', value: 3 },
          { sign: 'tauro', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q3',
    category: 'habitos_compra',
    question: 'Cuando compras ropa, ¿qué te motiva?',
    options: [
      {
        key: 'a',
        text: 'Las últimas tendencias y marcas de moda',
        scores: [
          { sign: 'leo', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Calidad y durabilidad, que dure años',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'virgo', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Mejor relación calidad-precio',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Solo lo necesario, no me importa mucho la ropa',
        scores: [
          { sign: 'acuario', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'cancer', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q4',
    category: 'habitos_compra',
    question: '¿Cómo haces tus compras del supermercado?',
    options: [
      {
        key: 'a',
        text: 'Sin lista, compro lo que veo y me gusta',
        scores: [
          { sign: 'piscis', value: 3 },
          { sign: 'aries', value: 2 },
          { sign: 'leo', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Con lista detallada y presupuesto exacto',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'cancer', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Lista general pero flexible para ofertas',
        scores: [
          { sign: 'libra', value: 3 },
          { sign: 'geminis', value: 2 },
          { sign: 'tauro', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Compro solo básicos y en tiendas económicas',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'cancer', value: 1 },
        ],
      },
    ],
  },

  // Categoría 2: Ahorro e Inversiones (4 preguntas)
  {
    id: 'q5',
    category: 'ahorro_inversion',
    question: '¿Qué porcentaje de tu sueldo ahorras mensualmente?',
    options: [
      {
        key: 'a',
        text: '0-5%, vivo al día o me sobra muy poco',
        scores: [
          { sign: 'sagitario', value: 2 },
          { sign: 'piscis', value: 2 },
          { sign: 'leo', value: 1 },
        ],
      },
      {
        key: 'b',
        text: '10-20%, el estándar recomendado',
        scores: [
          { sign: 'libra', value: 3 },
          { sign: 'geminis', value: 2 },
          { sign: 'virgo', value: 1 },
        ],
      },
      {
        key: 'c',
        text: '25-40%, ahorro es prioridad',
        scores: [
          { sign: 'capricornio', value: 3 },
          { sign: 'virgo', value: 2 },
          { sign: 'tauro', value: 2 },
        ],
      },
      {
        key: 'd',
        text: 'Más del 40%, soy muy austero',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'cancer', value: 2 },
          { sign: 'capricornio', value: 2 },
        ],
      },
    ],
  },
  {
    id: 'q6',
    category: 'ahorro_inversion',
    question: 'Tu inversión ideal es:',
    options: [
      {
        key: 'a',
        text: 'Criptomonedas, NFTs y activos digitales',
        scores: [
          { sign: 'escorpio', value: 3 },
          { sign: 'acuario', value: 2 },
          { sign: 'aries', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Bienes raíces y propiedades',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'cancer', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Fondos indexados y ETFs diversificados',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Negocio propio o startups',
        scores: [
          { sign: 'aries', value: 3 },
          { sign: 'sagitario', value: 2 },
          { sign: 'leo', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q7',
    category: 'ahorro_inversion',
    question: '¿Cuánto tiempo investigas antes de invertir?',
    options: [
      {
        key: 'a',
        text: 'Poco o nada, confío en mi instinto',
        scores: [
          { sign: 'aries', value: 3 },
          { sign: 'piscis', value: 2 },
          { sign: 'leo', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Leo reviews y opiniones de expertos',
        scores: [
          { sign: 'geminis', value: 3 },
          { sign: 'libra', value: 2 },
          { sign: 'acuario', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Hago análisis exhaustivo, semanas o meses',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'escorpio', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Solo invierto en lo que conozco bien',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'cancer', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q8',
    category: 'ahorro_inversion',
    question: '¿Qué haces cuando una inversión baja de precio?',
    options: [
      {
        key: 'a',
        text: 'Vendo inmediatamente para evitar más pérdidas',
        scores: [
          { sign: 'cancer', value: 3 },
          { sign: 'piscis', value: 2 },
          { sign: 'libra', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Compro más, es una oportunidad',
        scores: [
          { sign: 'escorpio', value: 3 },
          { sign: 'aries', value: 2 },
          { sign: 'acuario', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Analizo las razones y decido con datos',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Mantengo, invierto a largo plazo',
        scores: [
          { sign: 'tauro', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'libra', value: 1 },
        ],
      },
    ],
  },

  // Categoría 3: Gastos Emocionales (4 preguntas)
  {
    id: 'q9',
    category: 'gastos_emocionales',
    question: 'Cuando estás triste o estresado:',
    options: [
      {
        key: 'a',
        text: 'Hago compras para sentirme mejor (retail therapy)',
        scores: [
          { sign: 'piscis', value: 3 },
          { sign: 'aries', value: 2 },
          { sign: 'leo', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Viajo o planifico un escape',
        scores: [
          { sign: 'sagitario', value: 3 },
          { sign: 'acuario', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Salgo a cenar/beber con amigos',
        scores: [
          { sign: 'leo', value: 3 },
          { sign: 'geminis', value: 2 },
          { sign: 'libra', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Me quedo en casa, no gasto dinero',
        scores: [
          { sign: 'cancer', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'virgo', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q10',
    category: 'gastos_emocionales',
    question: '¿Cuánto gastas en regalos para otros?',
    options: [
      {
        key: 'a',
        text: 'Soy muy generoso, a veces demasiado',
        scores: [
          { sign: 'piscis', value: 3 },
          { sign: 'leo', value: 2 },
          { sign: 'sagitario', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Lo justo y necesario para ocasiones especiales',
        scores: [
          { sign: 'libra', value: 3 },
          { sign: 'virgo', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Tengo presupuesto específico para regalos',
        scores: [
          { sign: 'capricornio', value: 3 },
          { sign: 'virgo', value: 2 },
          { sign: 'tauro', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Prefiero regalos hechos a mano o experiencias',
        scores: [
          { sign: 'acuario', value: 3 },
          { sign: 'cancer', value: 2 },
          { sign: 'piscis', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q11',
    category: 'gastos_emocionales',
    question: '¿Cómo te sientes después de una compra grande?',
    options: [
      {
        key: 'a',
        text: 'Emocionado y satisfecho',
        scores: [
          { sign: 'aries', value: 3 },
          { sign: 'leo', value: 2 },
          { sign: 'sagitario', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Tranquilo si lo planifiqué bien',
        scores: [
          { sign: 'virgo', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'libra', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Un poco culpable o ansioso',
        scores: [
          { sign: 'cancer', value: 3 },
          { sign: 'piscis', value: 2 },
          { sign: 'tauro', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Neutral, es solo una transacción',
        scores: [
          { sign: 'acuario', value: 3 },
          { sign: 'capricornio', value: 2 },
          { sign: 'geminis', value: 1 },
        ],
      },
    ],
  },
  {
    id: 'q12',
    category: 'gastos_emocionales',
    question: '¿Cuánto influyen las redes sociales en tus compras?',
    options: [
      {
        key: 'a',
        text: 'Mucho, sigo influencers y compro lo que recomiendan',
        scores: [
          { sign: 'geminis', value: 3 },
          { sign: 'leo', value: 2 },
          { sign: 'libra', value: 1 },
        ],
      },
      {
        key: 'b',
        text: 'Un poco, me sirve para conocer opciones',
        scores: [
          { sign: 'libra', value: 3 },
          { sign: 'geminis', value: 2 },
          { sign: 'acuario', value: 1 },
        ],
      },
      {
        key: 'c',
        text: 'Muy poco, no me dejo influenciar',
        scores: [
          { sign: 'capricornio', value: 3 },
          { sign: 'virgo', value: 2 },
          { sign: 'tauro', value: 1 },
        ],
      },
      {
        key: 'd',
        text: 'Nada, ni siquiera tengo redes sociales',
        scores: [
          { sign: 'cancer', value: 3 },
          { sign: 'escorpio', value: 2 },
          { sign: 'capricornio', value: 1 },
        ],
      },
    ],
  },
];
