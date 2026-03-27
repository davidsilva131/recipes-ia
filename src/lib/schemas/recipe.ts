import { z } from 'zod'

export const recipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  ingredients: z.array(z.string().min(1)).min(1, 'Al menos un ingrediente'),
  steps: z.array(z.string().min(1)).min(1, 'Al menos un paso'),
  category: z.enum(['desayuno', 'almuerzo', 'cena', 'postre', 'snack']),
  prepTime: z.number().int().positive('Debe ser un número positivo'),
  servings: z.number().int().positive('Debe ser un número positivo'),
  difficulty: z.enum(['fácil', 'media', 'difícil']).optional(),
  calories: z.number().int().positive().optional(),
  tips: z.array(z.string()).optional(),
})

export type Recipe = z.infer<typeof recipeSchema>

export const createRecipeSchema = recipeSchema.omit({ id: true })
export type CreateRecipe = z.infer<typeof createRecipeSchema>

export const updateRecipeSchema = createRecipeSchema.partial()
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>
