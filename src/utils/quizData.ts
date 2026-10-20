export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'short';
  question: string;
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'In a binary tree, what is the maximum number of children a node can have?',
    options: ['1', '2', '3', 'Unlimited'],
    correctAnswer: 1,
    explanation: 'A binary tree, by definition, allows each node to have at most 2 children (left and right).'
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Which property must a complete binary tree satisfy?',
    options: [
      'All levels are completely full',
      'All levels are full except possibly the last, which is filled from left to right',
      'Every parent is greater than its children',
      'The tree is perfectly balanced'
    ],
    correctAnswer: 1,
    explanation: 'A complete binary tree has all levels fully filled except possibly the last level, which must be filled from left to right without gaps.'
  },
  {
    id: 3,
    type: 'mcq',
    question: 'In a max-heap, which element is always at the root?',
    options: ['The smallest element', 'The largest element', 'The median element', 'The first inserted element'],
    correctAnswer: 1,
    explanation: 'In a max-heap, every parent is greater than or equal to its children, so the maximum element is always at the root.'
  },
  {
    id: 4,
    type: 'mcq',
    question: 'For a zero-indexed array representing a binary heap, what is the index of the left child of node at index i?',
    options: ['2 * i', '2 * i + 1', '2 * i + 2', '2 * i - 1'],
    correctAnswer: 1,
    explanation: 'The left child of a node at index i is at index 2*i + 1. The right child is at 2*i + 2.'
  },
  {
    id: 5,
    type: 'mcq',
    question: 'What is the index of the parent of a node at index 7 in a zero-indexed array?',
    options: ['2', '3', '4', '5'],
    correctAnswer: 1,
    explanation: 'Parent index = floor((i - 1) / 2) = floor((7 - 1) / 2) = floor(3) = 3.'
  },
  {
    id: 6,
    type: 'mcq',
    question: 'During Heap Sort, after swapping the root with the last element, what happens next?',
    options: [
      'The entire array is re-heapified from scratch',
      'The sorted element is excluded and sift-down restores the heap on the remaining elements',
      'The array is reversed',
      'A new heap is built from the remaining elements'
    ],
    correctAnswer: 1,
    explanation: 'After extracting the maximum (swapping it to the end), we reduce the active heap size by 1 and sift-down the new root to restore the heap property in the remaining active portion.'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'What is the time complexity of building a heap from an unsorted array using bottom-up construction?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Bottom-up heap construction is O(n), not O(n log n). Although individual sift-downs can take O(log n), most nodes are near the bottom and require very few swaps. The mathematical sum works out to O(n).'
  },
  {
    id: 8,
    type: 'mcq',
    question: 'What is the time complexity of Heap Sort in the worst case?',
    options: ['O(n)', 'O(n log n)', 'O(n\u00b2)', 'O(log n)'],
    correctAnswer: 1,
    explanation: 'Heap Sort has O(n log n) time complexity in all cases (best, average, and worst). Building the heap is O(n), and each of the n extractions takes O(log n).'
  },
  {
    id: 9,
    type: 'mcq',
    question: 'A Priority Queue is best described as:',
    options: [
      'A sorted array',
      'An abstract data type where elements are served based on priority',
      'A type of binary tree',
      'A sorting algorithm'
    ],
    correctAnswer: 1,
    explanation: 'A Priority Queue is an abstract data type that defines behavior: elements are removed according to their priority, not their insertion order. It can be implemented using various data structures, commonly a binary heap.'
  },
  {
    id: 10,
    type: 'mcq',
    question: 'What is the time complexity of inserting an element into a binary heap?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'Insertion adds the element at the end and sifts it up. The sift-up traverses at most the height of the tree, which is O(log n) for a complete binary tree.'
  },
  {
    id: 11,
    type: 'mcq',
    question: 'Which statement about heaps is TRUE?',
    options: [
      'A heap is the same as a sorted array',
      'In a max-heap, the left child must always be greater than the right child',
      'A heap must be a complete binary tree',
      'There is only one valid max-heap for any given set of numbers'
    ],
    correctAnswer: 2,
    explanation: 'A heap must be a complete binary tree (all levels full except possibly the last, filled left to right) AND satisfy the heap ordering property. A heap is NOT a sorted array, siblings need not be ordered, and multiple valid heaps can exist for the same set of values.'
  },
  {
    id: 12,
    type: 'mcq',
    question: 'What is the key difference between Heap Sort and a Priority Queue?',
    options: [
      'They are the same thing',
      'Heap Sort is a sorting algorithm; a Priority Queue is an abstract data type',
      'A Priority Queue sorts data; Heap Sort does not',
      'Heap Sort uses a priority queue internally'
    ],
    correctAnswer: 1,
    explanation: 'Heap Sort is a concrete sorting algorithm that uses a heap data structure to sort an array. A Priority Queue is an abstract data type that defines operations (insert, extract-max/min) and can be implemented using a heap. They are related but distinct concepts.'
  },
  {
    id: 13,
    type: 'mcq',
    question: 'In ascending Heap Sort, we use a max-heap. Why?',
    options: [
      'Because max-heaps are faster',
      'Because extracting the maximum repeatedly places elements in ascending order from the end',
      'Because min-heaps cannot sort',
      'Because max-heaps use less memory'
    ],
    correctAnswer: 1,
    explanation: 'In ascending Heap Sort with a max-heap, we repeatedly extract the maximum and place it at the end of the array. Each extraction puts the next-largest element in its correct final position, building the sorted portion from right to left.'
  },
  {
    id: 14,
    type: 'mcq',
    question: 'What is the auxiliary space complexity of conventional in-place Heap Sort?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctAnswer: 2,
    explanation: 'Conventional in-place Heap Sort uses O(1) auxiliary space because it rearranges elements within the input array itself, without needing additional data structures proportional to the input size.'
  },
  {
    id: 15,
    type: 'mcq',
    question: 'Given array [50, 30, 40, 10, 20, 35], what is the parent of the element at index 4 (value 20)?',
    options: ['Index 0 (value 50)', 'Index 1 (value 30)', 'Index 2 (value 40)', 'Index 3 (value 10)'],
    correctAnswer: 1,
    explanation: 'Parent of index 4 = floor((4-1)/2) = floor(1.5) = 1. The element at index 1 is 30.'
  }
];
