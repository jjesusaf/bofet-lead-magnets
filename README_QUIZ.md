# Quiz de Signo Financiero

Este proyecto contiene un quiz interactivo para descubrir tu signo financiero (personalidad financiera tipo zodíaco).

## Características

- ✅ Quiz de 12 preguntas en la ruta raíz (`/`)
- ✅ Componentes con shadcn/ui
- ✅ Modal de email antes de mostrar resultado
- ✅ Resultado con blur hasta que se ingresa el email
- ✅ Integración con Formspree (sin base de datos)
- ✅ Sin descarga de PDF
- ✅ Sin landing page

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Formspree

1. Ve a [https://formspree.io/](https://formspree.io/) y crea una cuenta
2. Crea un nuevo formulario
3. Copia el endpoint del formulario (ejemplo: `https://formspree.io/f/xrbzdpzg`)
4. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

5. Edita el archivo `.env` y agrega tu endpoint:

```
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/TU_FORM_ID
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:4321](http://localhost:4321)

## Estructura del Proyecto

```
/
├── src/
│   ├── components/
│   │   ├── quiz/
│   │   │   ├── Quiz.tsx          # Componente principal del quiz
│   │   │   └── ResultView.tsx    # Vista de resultados con blur y modal
│   │   └── ui/                   # Componentes de shadcn/ui
│   ├── lib/
│   │   ├── data/
│   │   │   ├── questions.ts      # Preguntas del quiz
│   │   │   └── zodiac-signs.ts   # Información de signos
│   │   ├── types/
│   │   │   └── zodiac.ts         # Tipos TypeScript
│   │   └── utils/
│   │       └── calculate-zodiac.ts # Lógica de cálculo
│   ├── pages/
│   │   ├── index.astro           # Página principal (quiz)
│   │   └── resultado.astro       # Página de resultados
│   └── styles/
│       └── global.css            # Estilos globales con Tailwind
└── .env                          # Variables de entorno (Formspree)
```

## Flujo de Usuario

1. Usuario entra a la página principal (`/`)
2. Responde las 12 preguntas del quiz
3. Al finalizar, se redirige a `/resultado`
4. El resultado aparece con blur
5. Se muestra un modal solicitando el email
6. Al ingresar el email:
   - Se envía a Formspree
   - Se guarda en localStorage
   - Se quita el blur y se muestra el resultado completo
7. El usuario puede ver su signo financiero completo con recomendaciones

## Datos Guardados

Los datos se guardan en:
- **Formspree**: Email, respuestas del quiz, signo financiero resultante
- **localStorage**: Estado del quiz, resultado calculado, email ingresado (para evitar pedir email de nuevo)

NO se guarda en base de datos.

## Construir para Producción

```bash
npm run build
```

El build se generará en la carpeta `dist/` y estará listo para ser desplegado en cualquier hosting estático.
