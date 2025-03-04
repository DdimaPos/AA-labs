// HeapSortVisualizer.tsx
import { Button } from '@/components/ui/button';
import React, { JSX, useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
 // Adjust the path as needed

interface Step {
  array: number[];
  swapIndices: [number, number] | null;
  swapPhase: 'pre' | 'post' | null;
}

interface HeapSortVisualizerProps {
  initialArray: number[];
}

const HeapSortVisualizer: React.FC<HeapSortVisualizerProps> = ({ initialArray }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const generatedSteps = generateHeapSortSteps(initialArray);
    setSteps(generatedSteps);
  }, [initialArray]);

  if (steps.length === 0) {
    return <div className="text-center">Loading...</div>;
  }

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const getNodeClass = (index: number): string => {
    const base = "px-3 py-1 border border-black rounded inline-block text-center m-2";
    if (currentStep.swapIndices && (currentStep.swapIndices[0] === index || currentStep.swapIndices[1] === index)) {
      if (currentStep.swapPhase === 'pre') return `${base} bg-green-300`;
      else if (currentStep.swapPhase === 'post') return `${base} bg-yellow-300`;
    }
    return base;
  };

  const renderTree = (index: number): JSX.Element | null => {
    if (index >= currentStep.array.length) return null;
    return (
      <TreeNode label={<div className={getNodeClass(index)}>{currentStep.array[index]}</div>}>
        {renderTree(2 * index + 1)}
        {renderTree(2 * index + 2)}
      </TreeNode>
    );
  };

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Heap Sort Visualizer</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">Original Array</h3>
        <div>{initialArray.join(', ')}</div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Current Array (Step {currentStepIndex + 1} of {steps.length})
        </h3>
        <div>{currentStep.array.join(', ')}</div>
        {currentStep.swapIndices && (
          <div className="mt-2">
            {currentStep.swapPhase === 'pre'
              ? `About to swap indices: ${currentStep.swapIndices[0]} and ${currentStep.swapIndices[1]}`
              : `Swapped indices: ${currentStep.swapIndices[0]} and ${currentStep.swapIndices[1]}`}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Heap Tree</h3>
        <Tree
          lineWidth={'2px'}
          lineColor={'green'}
          lineBorderRadius={'10px'}
          label={<div className={getNodeClass(0)}>{currentStep.array[0]}</div>}
        >
          {renderTree(1)}
          {renderTree(2)}
        </Tree>
      </div>

      <div className="flex space-x-4">
        <Button onClick={handlePrev} disabled={currentStepIndex === 0}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={currentStepIndex === steps.length - 1}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default HeapSortVisualizer;

// --- Heap Sort Algorithm with Step Recording --- //

function generateHeapSortSteps(array: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...array];
  // Record initial state with no swap highlighting.
  steps.push({ array: [...arr], swapIndices: null, swapPhase: null });

  // Build max heap.
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i, steps);
  }
  // Record state after building the max heap.
  steps.push({ array: [...arr], swapIndices: null, swapPhase: null });

  // Heap sort: extract elements from the heap.
  for (let i = arr.length - 1; i > 0; i--) {
    // Record pre-swap state for swap between root and element i.
    steps.push({ array: [...arr], swapIndices: [0, i], swapPhase: 'pre' });
    swap(arr, 0, i);
    // Record post-swap state.
    steps.push({ array: [...arr], swapIndices: [0, i], swapPhase: 'post' });
    heapify(arr, i, 0, steps);
  }
  return steps;
}

function heapify(arr: number[], n: number, i: number, steps: Step[]) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== i) {
    // Record pre-swap state.
    steps.push({ array: [...arr], swapIndices: [i, largest], swapPhase: 'pre' });
    swap(arr, i, largest);
    // Record post-swap state.
    steps.push({ array: [...arr], swapIndices: [i, largest], swapPhase: 'post' });
    heapify(arr, n, largest, steps);
  }
}

function swap(arr: number[], i: number, j: number) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
