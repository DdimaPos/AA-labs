function fibFastDoubling(n) {
  if (n === 0) return [0, 1];
  const [Fk, Fk1] = fibFastDoubling(Math.floor(n / 2));
  const c = Fk * (2 * Fk1 - Fk);
  const d = Fk * Fk + Fk1 * Fk1;
  return n % 2 === 0 ? [c, d] : [d, c + d];
}

export function fibonacciFastDoubling(n) {
  return fibFastDoubling(n)[0];
}
