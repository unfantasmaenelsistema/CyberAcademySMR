import { describe, expect, test } from 'bun:test';
import { buildQuizOptionOrders, shuffledIndices } from './quiz';
import { SMR_THEORY_SHEETS } from '../data/smrCurriculum';

// Generador determinista para las pruebas
const seeded = (seed: number) => () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

describe('shuffledIndices', () => {
  test('devuelve una permutación completa de 0..n-1', () => {
    for (const n of [0, 1, 3, 4]) {
      const order = shuffledIndices(n, seeded(n + 7));
      expect([...order].sort()).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  test('la posición de una opción concreta varía entre partidas', () => {
    const random = seeded(42);
    const positions = new Set<number>();
    for (let i = 0; i < 60; i++) positions.add(shuffledIndices(3, random).indexOf(1));
    expect(positions).toEqual(new Set([0, 1, 2]));
  });
});

describe('tests de teoría', () => {
  test('cada misión tiene una respuesta correcta válida', () => {
    for (const sheet of Object.values(SMR_THEORY_SHEETS)) {
      const { options, correctIndex } = sheet.examQuestion;
      expect(correctIndex).toBeGreaterThanOrEqual(0);
      expect(correctIndex).toBeLessThan(options.length);
    }
  });

  test('hay un orden barajado para cada misión con todas sus opciones', () => {
    const counts = Object.fromEntries(
      Object.entries(SMR_THEORY_SHEETS).map(([m, s]) => [m, s.examQuestion.options.length])
    );
    const orders = buildQuizOptionOrders(counts, seeded(3));
    for (const [m, s] of Object.entries(SMR_THEORY_SHEETS)) {
      expect([...orders[Number(m)]].sort()).toEqual(s.examQuestion.options.map((_, i) => i));
    }
  });
});
