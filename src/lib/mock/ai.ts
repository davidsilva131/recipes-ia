import type { Recipe } from '@/lib/schemas/recipe'
import type { Filter } from '@/lib/types/chat'

const BASE_RECIPES: Recipe[] = [
  {
    id: 'mock-1',
    title: 'Pollo al Limón con Arroz Aromático',
    description: 'Un clásico reconfortante con notas cítricas perfectamente equilibradas.',
    ingredients: [
      '2 pechugas de pollo (300g)',
      '200g de arroz basmati',
      '1 limón (zumo y ralladura)',
      '3 dientes de ajo',
      '2 cdas de aceite de oliva virgen extra',
      '1 cdta de romero fresco',
      'Sal y pimienta negra al gusto',
    ],
    steps: [
      'Marina el pollo con zumo de limón, ajo picado y romero durante 15 minutos.',
      'Calienta 2 cdas de aceite en una sartén a fuego medio-alto.',
      'Dora el pollo 6-7 minutos por cada lado hasta que esté bien cocinado.',
      'Mientras tanto, cuece el arroz en agua con sal según las instrucciones del paquete.',
      'Sirve el pollo sobre el arroz con ralladura de limón y hierbas frescas.',
    ],
    category: 'almuerzo',
    prepTime: 35,
    servings: 2,
  },
  {
    id: 'mock-2',
    title: 'Bowl Vegano de Quinoa y Verduras',
    description: 'Nutritivo, colorido y listo en 20 minutos. El bowl perfecto para cualquier momento.',
    ingredients: [
      '200g de quinoa',
      '1 boniato mediano',
      '100g de garbanzos cocidos',
      '2 puñados de espinacas frescas',
      '1 aguacate maduro',
      '2 cdas de tahini',
      'Zumo de medio limón',
      'Sal, pimienta y comino',
    ],
    steps: [
      'Cuece la quinoa en agua con sal durante 15 minutos.',
      'Corta el boniato en cubos y ásalo a 200°C durante 20 minutos.',
      'Saltea los garbanzos con comino y aceite hasta que estén crujientes.',
      'Prepara el aliño mezclando tahini, zumo de limón y un chorrito de agua.',
      'Monta el bowl: quinoa, boniato, garbanzos, espinacas y aguacate laminado.',
      'Añade el aliño de tahini justo antes de servir.',
    ],
    category: 'almuerzo',
    prepTime: 25,
    servings: 2,
  },
  {
    id: 'mock-3',
    title: 'Pasta Aglio e Olio Express',
    description: 'El plato italiano más sencillo y satisfactorio. Listo en menos de 20 minutos.',
    ingredients: [
      '300g de espaguetis',
      '6 dientes de ajo laminados',
      '80ml de aceite de oliva virgen extra',
      '1 guindilla seca',
      'Un puñado de perejil fresco',
      'Parmesano recién rallado',
      'Sal marina',
    ],
    steps: [
      'Cuece los espaguetis al dente en agua abundante y bien salada.',
      'Dora suavemente el ajo laminado con la guindilla en aceite a fuego bajo.',
      'Reserva 1 vaso del agua de cocción antes de escurrir la pasta.',
      'Mezcla los espaguetis con el aceite aromatizado fuera del fuego.',
      'Añade el agua de cocción poco a poco hasta conseguir una salsa sedosa.',
      'Sirve con perejil fresco picado y queso parmesano generoso.',
    ],
    category: 'cena',
    prepTime: 18,
    servings: 2,
  },
]

export async function generateMockRecipe(
  ingredients: string[],
  filters: Filter[]
): Promise<Recipe> {
  await new Promise((r) => setTimeout(r, 2200))

  if (filters.includes('vegan')) return { ...BASE_RECIPES[1], id: crypto.randomUUID() }
  if (filters.includes('quick')) return { ...BASE_RECIPES[2], id: crypto.randomUUID() }

  const allText = ingredients.join(' ').toLowerCase()
  if (allText.includes('pollo')) return { ...BASE_RECIPES[0], id: crypto.randomUUID() }
  if (['pasta', 'espagueti', 'fideo'].some((p) => allText.includes(p)))
    return { ...BASE_RECIPES[2], id: crypto.randomUUID() }

  const main = capitalize(ingredients[0] ?? 'verduras')
  const second = ingredients[1] ? `con ${capitalize(ingredients[1])}` : ''
  return {
    id: crypto.randomUUID(),
    title: `${main} ${second} al estilo casero`.trim(),
    description: 'Receta generada con tus ingredientes. Simple, sabrosa y lista en poco tiempo.',
    ingredients: [
      ...ingredients.map((i) => `${capitalize(i)} al gusto`),
      'Aceite de oliva virgen extra',
      'Sal y pimienta negra',
      'Ajo en polvo',
    ],
    steps: [
      'Lava y prepara todos los ingredientes antes de empezar.',
      `Calienta una sartén con aceite a fuego medio.`,
      `Añade ${ingredients[0] ?? 'los ingredientes'} y cocina 6-7 minutos.`,
      'Incorpora el resto de ingredientes y mezcla bien.',
      'Sazona al gusto y cocina 10 minutos más a fuego bajo.',
      '¡Listo! Sirve caliente y disfruta.',
    ],
    category: 'almuerzo',
    prepTime: filters.includes('quick') ? 15 : 25,
    servings: 2,
  }
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
