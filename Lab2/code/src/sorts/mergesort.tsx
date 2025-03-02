//import { useState, useEffect } from "react";
//import { Button } from "@/components/ui/button";
//import { motion } from "framer-motion";
//
//const generateArray = (size: number): number[] => {
//  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
//};
//
//const MergeSortVisualizer: React.FC = () => {
//  const [array, setArray] = useState<number[]>(generateArray(50));
//  const [animations, setAnimations] = useState<{ arr: number[]; activeIndices: number[] }[]>([]);
//  const [sorting, setSorting] = useState<boolean>(false);
//  const [currentActive, setCurrentActive] = useState<number[]>([]);
//
//  useEffect(() => {
//    if (animations.length > 0) {
//      let i = 0;
//      const interval = setInterval(() => {
//        if (i >= animations.length) {
//          clearInterval(interval);
//          setSorting(false);
//          return;
//        }
//        setArray([...animations[i].arr]);
//        setCurrentActive(animations[i].activeIndices);
//        i++;
//      }, 200);
//      return () => clearInterval(interval);
//    }
//  }, [animations]);
//
//  const mergeSort = (arr: number[]): { arr: number[]; activeIndices: number[] }[] => {
//    let tempAnimations: { arr: number[]; activeIndices: number[] }[] = [];
//
//    const merge = (left: number[], right: number[], startIdx: number): number[] => {
//      let sorted: number[] = [];
//      let i = 0, j = 0;
//
//      while (i < left.length && j < right.length) {
//        if (left[i] < right[j]) {
//          sorted.push(left[i++]);
//        } else {
//          sorted.push(right[j++]);
//        }
//      }
//      sorted = [...sorted, ...left.slice(i), ...right.slice(j)];
//
//      // Copy back to the original array position
//      for (let k = 0; k < sorted.length; k++) {
//        arr[startIdx + k] = sorted[k];
//      }
//
//      // Store snapshot with active elements highlighted
//      const activeIndices = Array.from({ length: sorted.length }, (_, idx) => startIdx + idx);
//      tempAnimations.push({ arr: [...arr], activeIndices });
//
//      return sorted;
//    };
//
//    const sort = (arr: number[], startIdx: number): number[] => {
//      if (arr.length <= 1) return arr;
//      let mid = Math.floor(arr.length / 2);
//      let left = sort(arr.slice(0, mid), startIdx);
//      let right = sort(arr.slice(mid), startIdx + mid);
//      return merge(left, right, startIdx);
//    };
//
//    sort([...arr], 0);
//    return tempAnimations;
//  };
//
//  const handleSort = () => {
//    setSorting(true);
//    setAnimations(mergeSort([...array]));
//  };
//
//  return (
//    <div className="flex flex-col items-center p-4">
//      <div className="flex gap-1 mb-4 items-end">
//        {array.map((value, index) => (
//          <motion.div
//            key={index}
//            className={`rounded ${currentActive.includes(index) ? "bg-green-500" : "bg-blue-500"}`}
//            style={{ width: 20, height: value * 3 }}
//            animate={{ scale: sorting ? 1.1 : 1 }}
//          />
//        ))}
//      </div>
//      <div className="flex gap-2">
//        <Button onClick={handleSort} disabled={sorting}>Sort</Button>
//        <Button onClick={() => setArray(generateArray(20))} disabled={sorting}>Reset</Button>
//      </div>
//    </div>
//  );
//};
//
//export default MergeSortVisualizer;




//import React, { useState, useEffect } from "react";
//import { motion } from "framer-motion";
//// Adjust the import path for your shadcn Button component as needed.
//import { Button } from "@/components/ui/button";
//
//interface Step {
//  array: number[];
//  activeIndices: number[];
//}
//const generateArray = (size: number): number[] => {
//  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
//};
//const MergeSortVisualizer: React.FC = () => {
//  // Initial unsorted array; feel free to randomize or pass as a prop.
//  const initialArray = generateArray(20);
//  const [array, setArray] = useState<number[]>([...initialArray]);
//  const [activeIndices, setActiveIndices] = useState<number[]>([]);
//  const [steps, setSteps] = useState<Step[]>([]);
//  const [currentStep, setCurrentStep] = useState(0);
//  const [sorting, setSorting] = useState(false);
//
//  /**
//   * Generates steps for merge sort.
//   *
//   * The algorithm works on a copy of the array (named aux) and records:
//   * - A snapshot before starting a merge.
//   * - Each comparison by highlighting the indices being compared.
//   * - Every time a value is copied into a temporary array.
//   * - Each step of copying the merged segment back.
//   *
//   * The steps array is then used to animate the visualization.
//   */
//  const generateMergeSortSteps = (arr: number[]): Step[] => {
//    const steps: Step[] = [];
//    const aux = [...arr];
//
//    function mergeSort(l: number, r: number) {
//      if (r - l <= 1) return;
//      const m = Math.floor((l + r) / 2);
//      mergeSort(l, m);
//      mergeSort(m, r);
//      merge(l, m, r);
//    }
//
//    function merge(l: number, m: number, r: number) {
//      let left = l;
//      let right = m;
//      const temp: number[] = [];
//
//      // Record state before starting the merge.
//      steps.push({ array: [...aux], activeIndices: [] });
//
//      // Merge while highlighting comparisons.
//      while (left < m && right < r) {
//        steps.push({ array: [...aux], activeIndices: [left, right] });
//        if (aux[left] <= aux[right]) {
//          temp.push(aux[left]);
//          left++;
//        } else {
//          temp.push(aux[right]);
//          right++;
//        }
//      }
//      // Process remaining left elements.
//      while (left < m) {
//        steps.push({ array: [...aux], activeIndices: [left] });
//        temp.push(aux[left]);
//        left++;
//      }
//      // Process remaining right elements.
//      while (right < r) {
//        steps.push({ array: [...aux], activeIndices: [right] });
//        temp.push(aux[right]);
//        right++;
//      }
//      // Copy sorted values back and record each update.
//      for (let i = l; i < r; i++) {
//        aux[i] = temp[i - l];
//        // Highlight the entire merged segment.
//        const mergedIndices = Array.from({ length: r - l }, (_, idx) => l + idx);
//        steps.push({ array: [...aux], activeIndices: mergedIndices });
//      }
//    }
//
//    mergeSort(0, aux.length);
//    return steps;
//  };
//
//  const startMergeSort = () => {
//    const generatedSteps = generateMergeSortSteps([...initialArray]);
//    setSteps(generatedSteps);
//    setCurrentStep(0);
//    setSorting(true);
//  };
//
//  // Step through the generated steps with a delay.
//  useEffect(() => {
//    if (sorting && currentStep < steps.length) {
//      const timer = setTimeout(() => {
//        setArray(steps[currentStep].array);
//        setActiveIndices(steps[currentStep].activeIndices);
//        setCurrentStep(currentStep + 1);
//      }, 500); // Adjust delay as needed.
//      return () => clearTimeout(timer);
//    }
//  }, [sorting, currentStep, steps]);
//
//  return (
//    <div className="p-4">
//      <div className="flex space-x-2 mb-4">
//        {array.map((value, index) => (
//          <motion.div
//            key={index}
//            layout
//            className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors duration-300 ${
//              activeIndices.includes(index) ? "bg-green-500" : "bg-blue-500"
//            }`}
//          >
//            {value}
//          </motion.div>
//        ))}
//      </div>
//      <Button onClick={startMergeSort}>Start Merge Sort</Button>
//    </div>
//  );
//};
//
//export default MergeSortVisualizer;


import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Step {
  mainArray: number[];
  tempArray: number[];
  activeMainIndices: number[];
  activeTempIndices: number[];
  description?: string;
}
const generateArray = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};
const MergeSortVisualizer: React.FC = () => {
  // You can change the initial array or randomize it as needed.
  const initialArray = generateArray(16)//[50, 30, 80, 10, 60, 20, 90, 40];
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [sorting, setSorting] = useState(false);

  /**
   * Generates an array of steps recording the merge sort process.
   * Each step contains:
   * - The current state of the main array.
   * - The current state of the temporary array.
   * - Which indices in each array are active (highlighted).
   * - A short description of the operation.
   */
  const generateMergeSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const main = [...arr];

    function mergeSort(l: number, r: number) {
      if (r - l <= 1) return;
      const m = Math.floor((l + r) / 2);
      mergeSort(l, m);
      mergeSort(m, r);
      merge(l, m, r);
    }

    function merge(l: number, m: number, r: number) {
      let left = l,
        right = m;
      const temp: number[] = [];

      // Record starting the merge operation.
      steps.push({
        mainArray: [...main],
        tempArray: [...temp],
        activeMainIndices: [],
        activeTempIndices: [],
        description: `Merging subarray indices [${l}, ${r})`,
      });

      // While both subarrays have elements, compare and append the smaller one.
      while (left < m && right < r) {
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [left, right],
          activeTempIndices: [],
          description: `Comparing main[${left}] (${main[left]}) and main[${right}] (${main[right]})`,
        });
        if (main[left] <= main[right]) {
          temp.push(main[left]);
          steps.push({
            mainArray: [...main],
            tempArray: [...temp],
            activeMainIndices: [left],
            activeTempIndices: [temp.length - 1],
            description: `Appending main[${left}] (${main[left]}) to temp`,
          });
          left++;
        } else {
          temp.push(main[right]);
          steps.push({
            mainArray: [...main],
            tempArray: [...temp],
            activeMainIndices: [right],
            activeTempIndices: [temp.length - 1],
            description: `Appending main[${right}] (${main[right]}) to temp`,
          });
          right++;
        }
      }

      // Process any remaining elements from the left half.
      while (left < m) {
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [left],
          activeTempIndices: [],
          description: `Taking remaining main[${left}] (${main[left]})`,
        });
        temp.push(main[left]);
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [left],
          activeTempIndices: [temp.length - 1],
          description: `Appending main[${left}] (${main[left]}) to temp`,
        });
        left++;
      }

      // Process any remaining elements from the right half.
      while (right < r) {
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [right],
          activeTempIndices: [],
          description: `Taking remaining main[${right}] (${main[right]})`,
        });
        temp.push(main[right]);
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [right],
          activeTempIndices: [temp.length - 1],
          description: `Appending main[${right}] (${main[right]}) to temp`,
        });
        right++;
      }

      // Copy the merged (temporary) array back into the main array.
      for (let i = l; i < r; i++) {
        main[i] = temp[i - l];
        steps.push({
          mainArray: [...main],
          tempArray: [...temp],
          activeMainIndices: [i],
          activeTempIndices: [i - l],
          description: `Copying temp[${i - l}] (${temp[i - l]}) to main[${i}]`,
        });
      }
    }

    mergeSort(0, main.length);
    return steps;
  };

  const startMergeSort = () => {
    const generatedSteps = generateMergeSortSteps(initialArray);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setSorting(true);
  };

  // Step through the recorded steps with a delay.
  useEffect(() => {
    if (sorting && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000); // Adjust delay (in ms) between steps as needed.
      return () => clearTimeout(timer);
    }
  }, [sorting, currentStep, steps]);

  // Get the current step to display. If no step yet, show initial state.
  const current: Step =
    steps[currentStep - 1] || {
      mainArray: initialArray,
      tempArray: [],
      activeMainIndices: [],
      activeTempIndices: [],
      description: "Click 'Start Merge Sort' to begin the visualization.",
    };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Merge Sort Visualization</h2>
        <p>{current.description}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Main Array</h3>
        <div className="flex space-x-2">
          {current.mainArray.map((value, index) => (
            <motion.div
              key={index}
              layout
              className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors duration-300 ${
                current.activeMainIndices.includes(index)
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Temporary Array</h3>
        <div className="flex space-x-2">
          {current.tempArray.map((value, index) => (
            <motion.div
              key={index}
              layout
              className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors duration-300 ${
                current.activeTempIndices.includes(index)
                  ? "bg-orange-500"
                  : "bg-gray-500"
              }`}
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>
      <Button onClick={startMergeSort}>Start Merge Sort</Button>
    </div>
  );
};

export default MergeSortVisualizer;

