// Orden de presentación de las opciones de los tests de teoría.
// En los datos la respuesta correcta puede estar siempre en la misma posición;
// al barajar el orden de presentación el alumno no puede acertar por posición.

/** Devuelve una permutación aleatoria de 0..n-1 (Fisher-Yates). */
export function shuffledIndices(n: number, random: () => number = Math.random): number[] {
  const order = Array.from({ length: Math.max(0, n) }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/** Un orden barajado por misión, calculado una vez por sesión. */
export function buildQuizOptionOrders(
  optionCounts: Record<number, number>,
  random: () => number = Math.random
): Record<number, number[]> {
  const orders: Record<number, number[]> = {};
  for (const [mission, count] of Object.entries(optionCounts)) {
    orders[Number(mission)] = shuffledIndices(count, random);
  }
  return orders;
}
