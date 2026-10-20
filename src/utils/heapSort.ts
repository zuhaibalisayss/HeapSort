export interface HeapSortStep {
  array: number[];
  heapSize: number;
  phase: 'build' | 'extract' | 'sift' | 'done';
  phaseDescription: string;
  operation: string;
  explanation: string;
  highlights: {
    root?: number;
    comparing?: number[];
    swapping?: number[];
    sorted?: number[];
    active?: number[];
    current?: number;
  };
  stepNumber: number;
}

export function generateHeapSortSteps(input: number[]): HeapSortStep[] {
  const steps: HeapSortStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let stepNum = 0;

  if (n <= 1) {
    steps.push({
      array: [...arr],
      heapSize: n,
      phase: 'done',
      phaseDescription: n === 0 ? 'Empty array' : 'Single element',
      operation: 'No sorting needed',
      explanation: n === 0 ? 'An empty array is already sorted.' : 'A single-element array is already sorted.',
      highlights: { sorted: n === 1 ? [0] : [] },
      stepNumber: stepNum++
    });
    return steps;
  }

  // Initial state
  steps.push({
    array: [...arr],
    heapSize: n,
    phase: 'build',
    phaseDescription: 'Initial array',
    operation: 'Starting Heap Sort',
    explanation: `We begin with the array [${arr.join(', ')}]. First, we build a max-heap.`,
    highlights: {},
    stepNumber: stepNum++
  });

  // Build max-heap (bottom-up)
  const lastParent = Math.floor(n / 2) - 1;
  steps.push({
    array: [...arr],
    heapSize: n,
    phase: 'build',
    phaseDescription: 'Building max-heap',
    operation: 'Bottom-up heap construction',
    explanation: `We start heapifying from the last parent node at index ${lastParent} (value ${arr[lastParent]}) and work backwards to the root.`,
    highlights: { current: lastParent },
    stepNumber: stepNum++
  });

  for (let i = lastParent; i >= 0; i--) {
    siftDown(arr, i, n, steps, stepNum, 'build');
    stepNum = steps.length;
  }

  // Heap built
  steps.push({
    array: [...arr],
    heapSize: n,
    phase: 'build',
    phaseDescription: 'Max-heap built',
    operation: 'Heap construction complete',
    explanation: `The max-heap is built. The maximum value (${arr[0]}) is now at the root (index 0).`,
    highlights: { root: 0 },
    stepNumber: stepNum++
  });

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root with last element
    steps.push({
      array: [...arr],
      heapSize: i + 1,
      phase: 'extract',
      phaseDescription: 'Extracting maximum',
      operation: `Swap root with last element`,
      explanation: `Swap the root (max value ${arr[0]}) with the last element in the active heap (index ${i}, value ${arr[i]}). The max value goes to its final sorted position.`,
      highlights: { root: 0, swapping: [0, i], sorted: Array.from({length: n - i - 1}, (_, k) => n - 1 - k) },
      stepNumber: stepNum++
    });

    // Perform swap
    [arr[0], arr[i]] = [arr[i], arr[0]];

    steps.push({
      array: [...arr],
      heapSize: i + 1,
      phase: 'extract',
      phaseDescription: 'After swap',
      operation: 'Swap complete',
      explanation: `After the swap, value ${arr[i]} is now in its final sorted position at index ${i}. The active heap now has ${i} elements (indices 0 to ${i - 1}).`,
      highlights: { swapping: [0, i], sorted: Array.from({length: n - i}, (_, k) => n - 1 - k) },
      stepNumber: stepNum++
    });

    // Restore heap property
    if (i > 1) {
      steps.push({
        array: [...arr],
        heapSize: i,
        phase: 'sift',
        phaseDescription: 'Restoring heap property',
        operation: `Sift-down from root`,
        explanation: `The new root (${arr[0]}) may violate the heap property. We sift it down to restore the max-heap for the remaining ${i} elements.`,
        highlights: { root: 0, active: Array.from({length: i}, (_, k) => k), sorted: Array.from({length: n - i}, (_, k) => n - 1 - k) },
        stepNumber: stepNum++
      });

      siftDown(arr, 0, i, steps, stepNum, 'extract', Array.from({length: n - i}, (_, k) => n - 1 - k));
      stepNum = steps.length;
    }
  }

  // Final state
  steps.push({
    array: [...arr],
    heapSize: 0,
    phase: 'done',
    phaseDescription: 'Sorting complete',
    operation: 'Array is sorted',
    explanation: `Heap Sort is complete. The array is now sorted in ascending order: [${arr.join(', ')}].`,
    highlights: { sorted: Array.from({length: n}, (_, k) => k) },
    stepNumber: stepNum++
  });

  return steps;
}

function siftDown(
  arr: number[],
  i: number,
  heapSize: number,
  steps: HeapSortStep[],
  _stepNum: number,
  phase: 'build' | 'extract',
  sortedIndices: number[] = []
): void {
  let current = i;

  while (true) {
    const left = 2 * current + 1;
    const right = 2 * current + 2;
    let largest = current;

    const comparing: number[] = [current];

    if (left < heapSize) {
      comparing.push(left);
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      comparing.push(right);
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest === current) {
      // No swap needed
      steps.push({
        array: [...arr],
        heapSize,
        phase,
        phaseDescription: phase === 'build' ? 'Building max-heap' : 'Restoring heap property',
        operation: `Node ${arr[current]} is in correct position`,
        explanation: `Value ${arr[current]} at index ${current} is greater than or equal to its children. No swap needed. Sift-down complete.`,
        highlights: { comparing, root: 0, sorted: sortedIndices, active: Array.from({length: heapSize}, (_, k) => k).filter(k => !sortedIndices.includes(k)) },
        stepNumber: steps.length
      });
      break;
    }

    // Show comparison
    steps.push({
      array: [...arr],
      heapSize,
      phase,
      phaseDescription: phase === 'build' ? 'Building max-heap' : 'Restoring heap property',
      operation: `Comparing: ${arr[current]} vs children`,
      explanation: `Compare ${arr[current]} (index ${current}) with left child ${left < heapSize ? arr[left] : 'none'} and right child ${right < heapSize ? arr[right] : 'none'}. Largest is ${arr[largest]} at index ${largest}.`,
      highlights: { comparing, root: 0, sorted: sortedIndices, active: Array.from({length: heapSize}, (_, k) => k).filter(k => !sortedIndices.includes(k)) },
      stepNumber: steps.length
    });

    // Swap
    [arr[current], arr[largest]] = [arr[largest], arr[current]];

    steps.push({
      array: [...arr],
      heapSize,
      phase,
      phaseDescription: phase === 'build' ? 'Building max-heap' : 'Restoring heap property',
      operation: `Swap ${arr[largest]} and ${arr[current]}`,
      explanation: `Swap values at indices ${current} and ${largest}. Now ${arr[current]} is at index ${current} and ${arr[largest]} is at index ${largest}.`,
      highlights: { swapping: [current, largest], root: 0, sorted: sortedIndices, active: Array.from({length: heapSize}, (_, k) => k).filter(k => !sortedIndices.includes(k)) },
      stepNumber: steps.length
    });

    current = largest;
  }
}

export function heapSort(input: number[]): number[] {
  const arr = [...input];
  const n = arr.length;
  if (n <= 1) return arr;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDownSimple(arr, i, n);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    siftDownSimple(arr, 0, i);
  }

  return arr;
}

function siftDownSimple(arr: number[], i: number, heapSize: number): void {
  let current = i;
  while (true) {
    const left = 2 * current + 1;
    const right = 2 * current + 2;
    let largest = current;

    if (left < heapSize && arr[left] > arr[largest]) largest = left;
    if (right < heapSize && arr[right] > arr[largest]) largest = right;

    if (largest === current) break;
    [arr[current], arr[largest]] = [arr[largest], arr[current]];
    current = largest;
  }
}
