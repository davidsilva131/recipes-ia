# RecetasIA 🍳

Generador de recetas conversacional con IA. Habla con un chef virtual, guarda tus recetas favoritas y aprovecha lo que tienes en la nevera.

## Demo rápido

1. Escribe lo que necesitas en lenguaje natural: *"Tengo pollo y arroz, algo sencillo"*
2. El chef IA responde con una receta completa
3. Modifica conversacionalmente: *"Hazla vegana"* o *"para solo 1 persona"*
4. Guarda en favoritos y consulta el detalle en cualquier momento

## Stack

| Categoría | Tecnología |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Routing | TanStack Router v1 (file-based) |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Estado | Zustand v5 + persist middleware |
| IA | Vercel AI SDK v6 + `@ai-sdk/groq` |
| Modelo | `llama-3.3-70b-versatile` (Groq) |
| Validación | Zod v4 |
| Fuente | Inter Variable |

## Funcionalidades

### Chat conversacional
- Textarea auto-redimensionable con envío por `Enter`
- Historial de conversación completo pasado a la IA — recuerda y adapta recetas anteriores
- Filtros rápidos: **Vegano**, **Rápido (<20 min)**, **Económico**
- Animaciones de entrada en cada burbuja
- Scroll automático al último mensaje

### Recetas
- Título, descripción, ingredientes con cantidades, pasos numerados
- Badges de metadatos: tiempo, porciones, categoría, dificultad, calorías (opcional)
- Sección "Consejos del chef" con tips prácticos

### Favoritos
- Panel lateral persistido en `localStorage`
- Búsqueda en tiempo real por nombre
- Filtro por categoría (pills: Todas / Desayuno / Almuerzo / Cena…)
- Scrollbar personalizado integrado al diseño
- Botón "Vaciar todos" con confirmación de 3 segundos

### Detalle de receta (Sheet)
- Ajuste de porciones con stepper `[−] N [+]` — re-escala cantidades en tiempo real
- Botón copiar receta (texto plano al portapapeles)
- Botón copiar lista de compra (`☐ ingrediente`)
- Botón compartir (Web Share API, con fallback a portapapeles)
- Notas personales guardadas por receta en el store

### Modo Nevera 🧊
- Panel inferior donde añades los ingredientes que tienes disponibles
- La IA genera la mejor receta posible usando **solo** esos ingredientes
- Tags removibles por ingrediente

### UX
- Modo oscuro / claro (toggle en el sidebar, persiste en `localStorage`)
- Badge de contador de favoritos en el botón de menú mobile
- Botón "Nueva conversación" con confirmación de 2 pasos
- Toasts con `sonner` para feedback de acciones
- Diseño responsivo — sidebar como drawer en mobile, estático en desktop

## Instalación

```bash
# Clonar e instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Añade tu clave de Groq en VITE_GROQ_API_KEY

# Desarrollo
pnpm dev

# Build
pnpm build
```

## Variables de entorno

```env
VITE_GROQ_API_KEY=tu_clave_aqui
```

Obtén una clave gratuita en [console.groq.com](https://console.groq.com).

## Estructura del proyecto

```
src/
├── routes/              # TanStack Router (file-based)
│   ├── __root.tsx       # Layout raíz + Toaster
│   └── index.tsx        # Ruta principal → ChatLayout
├── stores/
│   └── chatStore.ts     # Estado global (Zustand + persist)
├── hooks/
│   ├── useRecipeGenerator.ts   # Hook IA principal
│   ├── useFridgeMode.ts        # Hook Modo Nevera
│   └── useTheme.ts             # Toggle dark/light
├── lib/
│   ├── ai/
│   │   ├── client.ts    # Instancia Groq
│   │   ├── prompts.ts   # System prompt + builder
│   │   ├── schemas.ts   # Zod schema para la IA
│   │   └── sanitize.ts  # Saneamiento anti-inyección
│   ├── schemas/
│   │   └── recipe.ts    # Zod schema de Recipe
│   └── types/
│       └── chat.ts      # Tipos de mensajes y filtros
└── components/
    ├── molecules/        # ChatBubble, RecipeCardItem, ThinkingIndicator…
    ├── organisms/        # ChatMessages, ChatInputBar, FavoritesSidebar,
    │                     # RecipeDisplay, RecipeDetailSheet, FridgeModeSheet
    ├── templates/        # ChatLayout
    └── ui/               # shadcn/ui components
```

## Decisiones técnicas

- **`generateText` en lugar de `generateObject`** — Groq no soporta `response_format: json_schema`. Se extrae JSON con regex + parse Zod manual con saneamiento de caracteres de control.
- **Historial completo a la IA** — `buildMessages()` serializa todos los mensajes anteriores como `CoreMessage[]` para que el modelo adapte recetas en lugar de regenerar desde cero.
- **Atomic Design** — componentes organizados en molecules / organisms / templates para máxima reusabilidad.
- **Calorías opcionales** — el campo `calories` es `optional()` porque los LLMs pueden alucinar valores nutricionales; solo se muestra si la IA lo proporciona con confianza.


## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
