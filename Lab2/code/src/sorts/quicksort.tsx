import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Step {
  mainArray: number[];
  activeIndices: number[];
  pivotIndex?: number;
  leftIndex?: number;
  rightIndex?: number;
  description: string;
  action?: "compare" | "swap" | "pivotPlacement";
}

const generateArray = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
};

const QuickSortVisualizer: React.FC = () => {
  const initialArray = generateArray(16);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [started, setStarted] = useState(false);

  /**
   * Generates an array of steps recording the quick sort process.
   * Each step captures the current state of the main array and highlights:
   * - The pivot (in red)
   * - The left boundary (in green)
   * - The right boundary (in purple)
   * - Elements being compared (orange) or swapped (yellow)
   */
  const generateQuickSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const main = [...arr];

    const recordStep = (
      description: string,
      activeIndices: number[] = [],
      pivotIndex?: number,
      leftIndex?: number,
      rightIndex?: number,
      action?: "compare" | "swap" | "pivotPlacement"
    ) => {
      steps.push({
        mainArray: [...main],
        activeIndices,
        pivotIndex,
        leftIndex,
        rightIndex,
        description,
        action,
      });
    };

    const swap = (i: number, j: number) => {
      [main[i], main[j]] = [main[j], main[i]];
      recordStep(
        `Swapped elements at indices ${i} and ${j}`,
        [i, j],
        undefined,
        undefined,
        undefined,
        "swap"
      );
    };

    const quickSort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    const partition = (low: number, high: number): number => {
      const pivot = main[high];
      // Highlight the pivot (red), left margin (low, green) and right margin (high, purple)
      recordStep(`Choosing pivot ${pivot} at index ${high}`, [], high, low, high);
      let i = low - 1;
      for (let j = low; j < high; j++) {
        // Highlight current element being compared (orange) along with pivot and margins.
        recordStep(
          `Comparing element at index ${j} (${main[j]}) with pivot ${pivot}`,
          [j],
          high,
          low,
          high,
          "compare"
        );
        if (main[j] < pivot) {
          i++;
          recordStep(
            `Element at index ${j} (${main[j]}) is less than pivot. Swapping with element at index ${i} (${main[i]})`,
            [i, j],
            high,
            low,
            high,
            "swap"
          );
          swap(i, j);
        }
      }
      recordStep(
        `Placing pivot in correct position by swapping index ${i + 1} and pivot index ${high}`,
        [i + 1, high],
        high,
        low,
        high,
        "swap"
      );
      swap(i + 1, high);
      recordStep(`Pivot is now at index ${i + 1}`, [i + 1], i + 1);
      return i + 1;
    };

    quickSort(0, main.length - 1);
    return steps;
  };

  const startQuickSort = () => {
    const generatedSteps = generateQuickSortSteps(initialArray);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setStarted(true);
  };

  // If not started, show the initial state with instructions.
  const current: Step =
    started && steps.length > 0
      ? steps[currentStep]
      : {
          mainArray: initialArray,
          activeIndices: [],
          description: "Click 'Start Quick Sort' to begin the visualization.",
        };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Quick Sort Visualization</h2>
        <p>{current.description}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Array</h3>
        <div className="flex space-x-2">
          {current.mainArray.map((value, index) => {
            // Determine background based on role and action.
            let bgColor = "bg-blue-500"; // Default color
            if (index === current.pivotIndex) {
              bgColor = "bg-red-500"; // Pivot highlighted in red
            } else if (current.action === "swap" && current.activeIndices.includes(index)) {
              bgColor = "bg-yellow-500"; // Swapped elements highlighted in yellow
            } else if (current.action === "compare" && current.activeIndices.includes(index)) {
              bgColor = "bg-orange-500"; // Compared elements highlighted in orange
            } else if (index === current.leftIndex) {
              bgColor = "bg-green-500"; // Left boundary highlighted in green
            } else if (index === current.rightIndex) {
              bgColor = "bg-purple-500"; // Right boundary highlighted in purple
            }

            return (
              <div key={index} className="relative">
                <motion.div
                  layout
                  className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors duration-300 ${bgColor}`}
                >
                  {value}
                </motion.div>
                {/* Overlay labels */}
                {index === current.pivotIndex && (
                  <span className="absolute top-0 left-0 text-[10px] text-white bg-black bg-opacity-50 px-1 rounded">
                    Pivot
                  </span>
                )}
                {current.action === "compare" && current.activeIndices.includes(index) && (
                  <span className="absolute bottom-0 left-0 text-[10px] text-white bg-black bg-opacity-50 px-1 rounded">
                    Cmp
                  </span>
                )}
                {current.action === "swap" && current.activeIndices.includes(index) && (
                  <span className="absolute bottom-0 left-0 text-[10px] text-white bg-black bg-opacity-50 px-1 rounded">
                    Swp
                  </span>
                )}
                {index === current.leftIndex && (
                  <span className="absolute top-0 right-0 text-[10px] text-white bg-black bg-opacity-50 px-1 rounded">
                    L
                  </span>
                )}
                {index === current.rightIndex && (
                  <span className="absolute bottom-0 right-0 text-[10px] text-white bg-black bg-opacity-50 px-1 rounded">
                    R
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Controls */}
      <div className="flex space-x-2 mb-4">
        {!started && (
          <Button onClick={startQuickSort}>
            Start Quick Sort
          </Button>
        )}
        {started && (
          <>
            <Button
              onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentStep((prev) =>
                  prev < steps.length - 1 ? prev + 1 : prev
                )
              }
              disabled={currentStep === steps.length - 1}
            >
              Next
            </Button>
          </>
        )}
      </div>
      {/* Legend */}
      <div className="text-sm">
        <p>
          <span className="inline-block w-4 h-4 bg-red-500 mr-1"></span> Pivot
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-orange-500 mr-1"></span> Comparing (Cmp)
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-yellow-500 mr-1"></span> Swapped (Swp)
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-green-500 mr-1"></span> Left Boundary (L)
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-purple-500 mr-1"></span> Right Boundary (R)
        </p>
      </div>
    </div>
  );
};

export default QuickSortVisualizer;
