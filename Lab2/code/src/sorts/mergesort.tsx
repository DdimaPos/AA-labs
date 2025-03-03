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
  const [initialArray, setInitialArray] = useState<number[]>(generateArray(16));
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

