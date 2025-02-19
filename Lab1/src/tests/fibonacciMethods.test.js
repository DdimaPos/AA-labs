import { fibonacciFastDoubling } from "../fastDoubling";
import { fibonacciIterative } from "../inPlaceMethod";

describe("performance test of algorithms", () => {
  var testedN = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
  var nOfTests = 100;

  test("performance of fibonacci fast doubling", () => {
    var results = [];
    testedN.forEach((el) => {
      var start = performance.now();

      for (let i = 0; i < nOfTests; i++) {
        fibonacciFastDoubling(el);
      }

      var end = performance.now();

      results.push((end - start) / nOfTests);
    });
    console.table(results);
  });

  test("performance of fibonacci iterative method", () => {
    var results = [];
    testedN.forEach((el) => {
      var start = performance.now();

      for (let i = 0; i < nOfTests; i++) {
        fibonacciIterative(el);
      }
      var end = performance.now();

      results.push((end - start) / nOfTests);
    });
    console.table(results);
  });

  test("performance of fibonacci method with memoization", () => {
    var results = [];
    testedN.forEach((el) => {
      var start = performance.now();
      for (let i = 0; i < nOfTests; i++) {
        fibonacciIterative(el);
      }
      var end = performance.now();

      results.push((end - start) / nOfTests);
    });
    console.table(results);
  });
});
