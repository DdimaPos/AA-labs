//Imports
import mergeSort from "./algorithms/mergesort.js"
import {heapSort} from "./algorithms/heapsort.js"
import {quickSortWrapper} from "./algorithms/quicksort.js"
import {radixSort} from "./algorithms/radixsort.js"
import * as fs from "node:fs"

const ARRAY_SIZES = [1000, 5000, 10000, 30000, 50000, 70000, 100000, 200000, 400000, 700000, 1000000];

function generateRandomArray(size) {
    return Array.from({ length: size }, (_, i) => (i % 1000000) + 1).sort((a, b) => a - b);
}

function benchmarkSort(sortFunction, name) {
    let results = [];
    for (let size of ARRAY_SIZES) {
        let arr = generateRandomArray(size);
        let start = process.hrtime.bigint();
        sortFunction([...arr]); // Sorting copy of the array
        sortFunction([...arr]); // Sorting copy of the array
        sortFunction([...arr]); // Sorting copy of the array
        sortFunction([...arr]); // Sorting copy of the array
        sortFunction([...arr]); // Sorting copy of the array
        let end = process.hrtime.bigint();
        results.push((Number(end - start) / 1e6) / 5); // Convert to milliseconds
    }
    return results;
}

const quickSortResults = benchmarkSort(quickSortWrapper, "Quick Sort");
const mergeSortResults = benchmarkSort(mergeSort, "Merge Sort");
const heapSortResults = benchmarkSort(heapSort, "Heap Sort");
const radixSortResults = benchmarkSort(radixSort, "Radix Sort");

const output = `Array sizes\n${JSON.stringify(ARRAY_SIZES)}\n\n` +
    `Merge Sort res\n${JSON.stringify(mergeSortResults)}\n\n`+
    `Quick Sort res\n${JSON.stringify(quickSortResults)}\n\n` +
    `Heap Sort res\n${JSON.stringify(heapSortResults)}\n\n` +
    `Radix Sort res\n${JSON.stringify(radixSortResults)}\n`;

fs.writeFileSync("ascending1_1000000.txt", output, "utf-8");

console.log("Benchmark completed. Results saved in random1_100.txt");
