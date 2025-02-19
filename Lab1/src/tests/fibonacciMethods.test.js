import { fibonacciFastDoubling } from "../fastDoubling";
import { fibonacciIterative } from "../inPlaceMethod";

describe("performance test of algorithms", () => {
  test("performance of fibonacci fast doubling", () => {
    var results = [];
    var testedN = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
    testedN.forEach((el) => {
      var start = performance.now();

      fibonacciFastDoubling(el);

      var end = performance.now();

      results.push(end - start);
    });
    console.table(results);
  });

  test("performance of fibonacci iterative method", () => {
    var results = [];
    var testedN = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
    testedN.forEach((el) => {
      var start = performance.now();

      fibonacciIterative(el);

      var end = performance.now();

      results.push(end - start);
    });
    console.table(results);
  });

  test("performance of fibonacci method with memoization", () => {
    var results = [];
    var testedN = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];
    testedN.forEach((el) => {
      var start = performance.now();

      fibonacciIterative(el);

      var end = performance.now();

      results.push(end - start);
    });
    console.table(results);
  });
});
