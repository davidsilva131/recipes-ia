import { z } from 'zod'

// Schema used for generateObject — no id (it's added client-side)
export const aiRecipeSchema = z.object({
  title: z.string().describe('Nombre atractivo y apetitoso del plato'),
  description: z.string().describe('Descripción breve y apetitosa del plato (1-2 frases)'),
  ingredients: z.array(z.string()).describe('Lista de ingredientes con cantidades aproximadas'),
  steps: z.array(z.string()).describe('Pasos de preparación en orden, claros y concisos'),
  category: z
    .enum(['desayuno', 'almuerzo', 'cena', 'postre', 'snack'])
    .describe('Categoría del plato según el momento del día'),
  prepTime: z.number().describe('Tiempo total de preparación en minutos (número entero)'),
  servings: z.number().describe('Número de personas para las que se cocina'),
  difficulty: z
    .enum(['fácil', 'media', 'difícil'])
    .describe('Nivel de dificultad de la receta'),
  calories: z
    .number()
    .optional()
    .describe('Calorías aproximadas por porción (número entero, puede omitirse si no hay datos fiables)'),
  tips: z
    .array(z.string())
    .describe('Entre 2 y 3 consejos o trucos prácticos para mejorar el resultado'),
})

export type AiRecipe = z.infer<typeof aiRecipeSchema>
