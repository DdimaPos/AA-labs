import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Step {
  mainArray: number[];
  buckets: number[][];
  countArray: number[];
  activeMainIndices: number[];
  activeBucketIndices: number[];
  rebuildingIndices: number[];
  description?: string;
}

const generateArray = (size: number): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
};

const RadixSortVisualizer: React.FC = () => {
  const [initialArray, setInitialArray] = useState<number[]>(generateArray(10));
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [sorting, setSorting] = useState(false);

  const generateRadixSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    let main = [...arr];
    const maxNum = Math.max(...arr);
    const maxDigits = maxNum.toString().length;
    let placeValue = 1;

    for (let d = 0; d < maxDigits; d++) {
      let buckets: number[][] = Array.from({ length: 10 }, () => []);
      let countArray: number[] = Array(10).fill(0);

      for (let i = 0; i < main.length; i++) {
        let digit = Math.floor((main[i] / placeValue) % 10);
        buckets[digit].push(main[i]);
        countArray[digit]++;
        steps.push({
          mainArray: [...main],
          buckets: buckets.map((b) => [...b]),
          countArray: [...countArray],
          activeMainIndices: [i],
          activeBucketIndices: [digit],
          rebuildingIndices: [],
          description: `Placing ${main[i]} in bucket ${digit}`,
        });
      }

      let flatIndex = 0;
      for (let bucketIdx = 0; bucketIdx < 10; bucketIdx++) {
        for (let val of buckets[bucketIdx]) {
          steps.push({
            mainArray: [...main],
            buckets: buckets.map((b) => [...b]),
            countArray: [...countArray],
            activeMainIndices: [],
            activeBucketIndices: [bucketIdx],
            rebuildingIndices: [flatIndex],
            description: `Moving ${val} from bucket ${bucketIdx} to main array at index ${flatIndex}`,
          });
          main[flatIndex++] = val;
        }
      }

      steps.push({
        mainArray: [...main],
        buckets: buckets.map((b) => []),
        countArray: Array(10).fill(0),
        activeMainIndices: [],
        activeBucketIndices: [],
        rebuildingIndices: [],
        description: `Rebuilt main array for next digit`,
      });

      placeValue *= 10;
    }

    return steps;
  };

  const startRadixSort = () => {
    const generatedSteps = generateRadixSortSteps(initialArray);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setSorting(true);
  };

  useEffect(() => {
    if (sorting && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sorting, currentStep, steps]);

  const current: Step =
    steps[currentStep - 1] || {
      mainArray: initialArray,
      buckets: Array.from({ length: 10 }, () => []),
      countArray: Array(10).fill(0),
      activeMainIndices: [],
      activeBucketIndices: [],
      rebuildingIndices: [],
      description: "Click 'Start Radix Sort' to begin the visualization.",
    };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Radix Sort Visualization</h2>
      <p>{current.description}</p>
      
      <div className="mb-4">
        <h3 className="text-md font-semibold">Main Array</h3>
        <div className="flex space-x-2">
          {current.mainArray.map((value, index) => (
            <motion.div
              key={index}
              layout
              className={`w-12 h-12 flex items-center justify-center text-white rounded transition-colors duration-300 ${
                current.activeMainIndices.includes(index)
                  ? "bg-green-500"
                  : current.rebuildingIndices.includes(index)
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            >
              {value}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-md font-semibold">Buckets</h3>
        <div className="grid grid-cols-10 gap-2">
          {current.buckets.map((bucket, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="font-bold text-lg">{index}</span>
              <div className="flex space-x-1">
                {bucket.map((value, bIndex) => (
                  <motion.div
                    key={bIndex}
                    layout
                    className={`w-10 h-10 flex items-center justify-center text-white rounded transition-colors duration-300 ${
                      current.activeBucketIndices.includes(index)
                        ? "bg-orange-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={startRadixSort}>Start Radix Sort</Button>
    </div>
  );
};

export default RadixSortVisualizer;
