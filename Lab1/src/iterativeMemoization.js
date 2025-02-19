const memoryStack = new Map([[0, 0], [1, 1]]);
export function fibonacciMemo(n, memo = memoryStack) {
  if (memo.has(n)) return memo.get(n);
  for (let i = 2; i <= n; i++) {
    if (!memo.has(i)) {
      memo.set(i, memo.get(i - 1) + memo.get(i - 2));
    }
  }
  return memo.get(n);
}
