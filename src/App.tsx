import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeapSortLab } from './components/HeapSortLab';
import { PriorityQueueLab } from './components/PriorityQueueLab';
import { Quiz } from './components/Quiz';
import { TreeVisualization } from './components/TreeVisualization';
import { heapSort } from './utils/heapSort';

const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'prereqs', label: 'Prerequisites' },
  { id: 'trees', label: 'Trees & Heaps' },
  { id: 'maxmin', label: 'Max & Min Heap' },
  { id: 'heapsort', label: 'Heap Sort' },
  { id: 'lab', label: 'Sort Lab' },
  { id: 'pq', label: 'Priority Queues' },
  { id: 'pqlab', label: 'PQ Lab' },
  { id: 'compare', label: 'Comparison' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'revision', label: 'Revision' },
];

// Expandable component
const Expandable: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="expandable">
      <button className="expandable-header" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span>{open ? '[-]' : '[+]'}</span>
      </button>
      <div className={`expandable-content ${open ? '' : 'collapsed'}`}>{children}</div>
    </div>
  );
};

// Code block component
const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="code-block"><code>{code}</code></pre>
);

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [presentationMode, setPresentationMode] = useState(false);
  const [presentingIndex, setPresentingIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);

      // Update active section
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts for presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;

      if (presentationMode) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          setPresentingIndex(prev => Math.min(prev + 1, SECTIONS.length - 1));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setPresentingIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Escape') {
          setPresentationMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const enterPresentation = () => {
    setPresentationMode(true);
    const idx = SECTIONS.findIndex(s => s.id === activeSection);
    setPresentingIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">Heap Sort & Priority Queues</div>
          <div className="nav-links">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`nav-link ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => { scrollToSection(s.id); }}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="nav-controls">
            <button className="btn btn-sm" onClick={enterPresentation}>Present</button>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      {!presentationMode && <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>}

      {/* Main content */}
      <div className={`main-content ${presentationMode ? 'presentation-mode' : ''}`} ref={mainRef}>

        {/* Section 1: Introduction */}
        <section id="intro" className={`section ${presentationMode && presentingIndex === 0 ? 'presenting' : ''}`}>
          <h2 className="section-title">Heap Sort & Priority Queues</h2>
          <p className="section-subtitle">Understanding how heaps organize data and make important operations efficient.</p>

          <div className="card">
            <h4>The Central Problem</h4>
            <ul>
              <li>How do we sort a collection of numbers efficiently?</li>
              <li>How can a computer repeatedly find the highest- or lowest-priority item?</li>
              <li>What data structure can help with both problems?</li>
            </ul>
            <p><strong>Heap Sort</strong> is a comparison-based sorting algorithm that uses a binary heap data structure. A <strong>Priority Queue</strong> is an abstract data type where each element has a priority and elements are served according to that priority. Heaps are the most common way to implement efficient priority queues.</p>
          </div>

          <div className="card">
            <h4>Learning Objectives</h4>
            <ul>
              <li>Understand binary trees and heaps</li>
              <li>Build max-heaps and min-heaps</li>
              <li>Trace Heap Sort step by step</li>
              <li>Understand priority queue operations</li>
              <li>Compare their time complexities</li>
              <li>Explain the concepts in an exam or classroom presentation</li>
            </ul>
          </div>

          <div className="card">
            <h4>Quick Preview</h4>
            <p>Here is how a collection of numbers can become a max-heap:</p>
            <TreeVisualization data={[4, 10, 3, 5, 1]} highlights={{ root: 0 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Notice how the largest value (10) rises to the root. This is the fundamental property of a max-heap.</p>
          </div>
        </section>

        {/* Section 2: Prerequisites */}
        <section id="prereqs" className={`section ${presentationMode && presentingIndex === 1 ? 'presenting' : ''}`}>
          <h2 className="section-title">Prerequisites</h2>
          <p className="section-subtitle">Essential concepts you need before learning about heaps.</p>

          <div className="card">
            <h4>Core Definitions</h4>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Term</th><th>Definition</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Array</strong></td><td>A sequence of elements stored at indexed positions (0, 1, 2, ...)</td></tr>
                  <tr><td><strong>Index</strong></td><td>The position number used to access an element in an array</td></tr>
                  <tr><td><strong>Binary Tree</strong></td><td>A tree where each node has at most two children</td></tr>
                  <tr><td><strong>Parent</strong></td><td>A node directly above another node in the tree</td></tr>
                  <tr><td><strong>Child</strong></td><td>A node directly below another node in the tree</td></tr>
                  <tr><td><strong>Root</strong></td><td>The topmost node of the tree (no parent)</td></tr>
                  <tr><td><strong>Leaf</strong></td><td>A node with no children</td></tr>
                  <tr><td><strong>Sorting</strong></td><td>Arranging values in a chosen order (ascending or descending)</td></tr>
                  <tr><td><strong>Algorithm</strong></td><td>A finite sequence of well-defined steps to solve a problem</td></tr>
                  <tr><td><strong>Time Complexity</strong></td><td>How an algorithm's running time grows as input size increases</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Arrays as Binary Trees</h4>
            <p>A complete binary tree can be stored in a plain array without separate node objects. For a <strong>zero-indexed array</strong>, the relationships are:</p>
            <div className="code-block">{`Parent of index i:    Math.floor((i - 1) / 2)    [when i > 0]
Left child of index i: 2 * i + 1
Right child of index i: 2 * i + 2`}</div>

            <p>Consider the array <code>[50, 30, 40, 10, 20, 35]</code>:</p>
            <div className="array-container">
              {[50, 30, 40, 10, 20, 35].map((v, i) => (
                <div key={i} className="array-cell">
                  <div className="array-value">{v}</div>
                  <span className="array-index">[{i}]</span>
                </div>
              ))}
            </div>
            <TreeVisualization data={[50, 30, 40, 10, 20, 35]} highlights={{ root: 0 }} />

            <p style={{ fontSize: '0.85rem' }}>
              Index 0 (50): parent = none (root), left child = index 1 (30), right child = index 2 (40)<br/>
              Index 1 (30): parent = index 0 (50), left child = index 3 (10), right child = index 4 (20)<br/>
              Index 2 (40): parent = index 0 (50), left child = index 5 (35), right child = none
            </p>
          </div>

          <InteractiveIndexSelector />
        </section>

        {/* Section 3: Trees and Heaps */}
        <section id="trees" className={`section ${presentationMode && presentingIndex === 2 ? 'presenting' : ''}`}>
          <h2 className="section-title">Understanding Trees and Heaps</h2>
          <p className="section-subtitle">What makes a binary heap special among binary trees.</p>

          <div className="card">
            <h4>Binary Heap Definition</h4>
            <p>A <strong>binary heap</strong> is a <strong>complete binary tree</strong> that satisfies a particular ordering rule (the heap property).</p>
            <p><strong>Completeness:</strong> All levels are completely full except possibly the last level, and the last level is filled from left to right with no gaps.</p>
          </div>

          <div className="card">
            <h4>Three Types of Trees Compared</h4>
            <p><strong>1. Arbitrary binary tree</strong> - nodes can be placed anywhere:</p>
            <TreeVisualization data={[10, 5, 20, null, 8, null, null, 3]} />

            <p style={{ marginTop: '1rem' }}><strong>2. Complete binary tree</strong> - all levels full except last, filled left to right:</p>
            <TreeVisualization data={[10, 5, 20, 3, 8, 15, 25]} />

            <p style={{ marginTop: '1rem' }}><strong>3. Binary heap</strong> - complete binary tree + heap ordering property:</p>
            <TreeVisualization data={[25, 10, 20, 3, 8, 15, 5]} highlights={{ root: 0 }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This is a valid max-heap: every parent is greater than or equal to its children.</p>
          </div>

          <div className="card">
            <h4>Important Distinction</h4>
            <p>A complete binary tree does <strong>not</strong> automatically satisfy the heap property. Consider:</p>
            <TreeVisualization data={[10, 20, 15, 5, 8, 12, 25]} />
            <p>This is complete, but <strong>not</strong> a valid max-heap because 20 (index 1) is greater than its parent 10 (index 0).</p>
          </div>

          <Expandable title="Why must a heap be complete?">
            <p>Completeness guarantees the tree height is O(log n), which ensures all operations (insert, extract) run in O(log n) time. It also allows us to store the heap in a simple array with predictable index formulas, without wasting space.</p>
          </Expandable>
        </section>

        {/* Section 4: Max-Heap and Min-Heap */}
        <section id="maxmin" className={`section ${presentationMode && presentingIndex === 3 ? 'presenting' : ''}`}>
          <h2 className="section-title">Max-Heap and Min-Heap</h2>
          <p className="section-subtitle">The two types of binary heaps and their ordering rules.</p>

          <MaxMinHeapDemo />
        </section>

        {/* Section 5: Heap Sort */}
        <section id="heapsort" className={`section ${presentationMode && presentingIndex === 4 ? 'presenting' : ''}`}>
          <h2 className="section-title">Heap Sort</h2>
          <p className="section-subtitle">A comparison-based sorting algorithm built on the heap data structure.</p>

          <div className="card">
            <h4>Everyday Analogy</h4>
            <p>Imagine you have a pile of graded exams and you want to arrange them from lowest to highest score. You repeatedly find the highest-scoring exam and place it at the end of your sorted pile. A max-heap makes finding the highest score very fast -- it is always at the top.</p>
          </div>

          <div className="card">
            <h4>How Heap Sort Works (Ascending Order)</h4>
            <p>Using example array: <code>[4, 10, 3, 5, 1]</code></p>

            <h4>Step 1: Build a Max-Heap</h4>
            <p>Rearrange the array so it satisfies the max-heap property. We process internal nodes from the last parent toward the root (bottom-up). The last parent is at index <code>floor(n/2) - 1</code>.</p>
            <p>After building: <code>[10, 5, 3, 4, 1]</code> -- the maximum (10) is at the root.</p>

            <h4>Step 2: Extract the Maximum</h4>
            <p>Swap the root (maximum) with the last element in the active heap. The maximum is now in its final sorted position.</p>

            <h4>Step 3: Reduce the Active Heap</h4>
            <p>Decrease the heap size by 1. The swapped element is now in the sorted portion and excluded from further heap operations.</p>

            <h4>Step 4: Restore the Heap Property</h4>
            <p>The new root may violate the heap property. Apply <strong>sift-down</strong> (also called heapify-down): compare the root with its children and swap with the larger child if needed. Repeat until the heap property is restored.</p>

            <h4>Step 5: Repeat</h4>
            <p>Continue steps 2-4 until the active heap contains only one element. The array is now fully sorted.</p>
          </div>

          <div className="card">
            <h4>Why Max-Heap for Ascending Order?</h4>
            <p>We extract the maximum and place it at the end. Each extraction puts the next-largest element in its correct final position, building the sorted portion from right to left. For descending order, we would use a min-heap.</p>
          </div>

          <Expandable title="Pseudocode">
            <CodeBlock code={`function heapSort(arr):
    n = length of arr

    // Phase 1: Build max-heap (bottom-up)
    for i = floor(n/2) - 1 down to 0:
        siftDown(arr, n, i)

    // Phase 2: Extract elements one by one
    for i = n - 1 down to 1:
        swap arr[0] with arr[i]    // Move max to end
        siftDown(arr, i, 0)        // Restore heap on remaining

function siftDown(arr, heapSize, i):
    while true:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < heapSize and arr[left] > arr[largest]:
            largest = left
        if right < heapSize and arr[right] > arr[largest]:
            largest = right

        if largest == i:
            break    // Heap property satisfied

        swap arr[i] with arr[largest]
        i = largest    // Continue sifting down`} />
          </Expandable>

          <Expandable title="JavaScript Implementation">
            <CodeBlock code={`function heapSort(arr) {
  const a = [...arr]; // Don't mutate original
  const n = a.length;
  if (n <= 1) return a;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(a, n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    siftDown(a, i, 0);
  }

  return a;
}

function siftDown(arr, heapSize, i) {
  while (true) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < heapSize && arr[left] > arr[largest])
      largest = left;
    if (right < heapSize && arr[right] > arr[largest])
      largest = right;

    if (largest === i) break;
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    i = largest;
  }
}`} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              This implementation handles empty arrays, single elements, duplicates, negative numbers, and already-sorted or reverse-sorted arrays. It does not mutate the original input.
            </p>
          </Expandable>

          <div className="card">
            <h4>Verify the Algorithm</h4>
            <p>Test result for <code>[4, 10, 3, 5, 1]</code>: <code>[{heapSort([4, 10, 3, 5, 1]).join(', ')}]</code></p>
            <p>Test result for <code>[3, -1, 7, 3, 0]</code>: <code>[{heapSort([3, -1, 7, 3, 0]).join(', ')}]</code></p>
          </div>
        </section>

        {/* Section 6: Interactive Heap Sort Lab */}
        <section id="lab" className={`section ${presentationMode && presentingIndex === 5 ? 'presenting' : ''}`}>
          <h2 className="section-title">Interactive Heap Sort Lab</h2>
          <p className="section-subtitle">Visualize every step of Heap Sort in real time.</p>
          <HeapSortLab />
        </section>

        {/* Section 7: Priority Queues */}
        <section id="pq" className={`section ${presentationMode && presentingIndex === 6 ? 'presenting' : ''}`}>
          <h2 className="section-title">Priority Queues</h2>
          <p className="section-subtitle">An abstract data type for managing elements by priority.</p>

          <div className="card">
            <h4>Everyday Analogy</h4>
            <p>A hospital emergency department prioritizes patients by severity. A critical patient may be seen before someone with a minor injury, even if the critical patient arrived later. The department processes people by <strong>priority</strong>, not by arrival order.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(This illustrates priority-based processing, not a claim about universal triage policy.)</p>
          </div>

          <div className="card">
            <h4>Definition</h4>
            <p>A <strong>Priority Queue</strong> is an abstract data type in which each element has a priority, and elements are removed according to their priority rather than their insertion order.</p>
            <ul>
              <li><strong>Priority</strong> is a numeric value associated with each element that determines its serving order.</li>
              <li>A priority queue differs from an ordinary queue (FIFO) because it does not serve elements in insertion order.</li>
              <li>It differs from a stack (LIFO) for the same reason.</li>
              <li><strong>Max-priority queue:</strong> highest priority value is served first.</li>
              <li><strong>Min-priority queue:</strong> lowest priority value is served first.</li>
              <li>Elements with equal priority may be served in any order unless the implementation specifies stable tie-breaking (by insertion order).</li>
            </ul>
          </div>

          <div className="card">
            <h4>Abstract Data Type vs. Implementation</h4>
            <p>A priority queue <strong>defines behavior</strong> (what operations it supports). It does not prescribe how those operations are implemented. Possible implementations include:</p>
            <ul>
              <li><strong>Unsorted array:</strong> Insert O(1), Extract O(n)</li>
              <li><strong>Sorted array:</strong> Insert O(n), Extract O(1)</li>
              <li><strong>Binary heap:</strong> Insert O(log n), Extract O(log n)</li>
            </ul>
            <p>The binary heap is the most common efficient implementation.</p>
          </div>

          <div className="card">
            <h4>Core Operations</h4>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Operation</th><th>Description</th><th>Complexity (with binary heap)</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>insert(value, priority)</code></td><td>Add an element with a given priority</td><td>O(log n)</td></tr>
                  <tr><td><code>peek() / top()</code></td><td>View the highest-priority element without removing it</td><td>O(1)</td></tr>
                  <tr><td><code>extractMax() / extractMin()</code></td><td>Remove and return the highest/lowest-priority element</td><td>O(log n)</td></tr>
                  <tr><td><code>size()</code></td><td>Return the number of elements</td><td>O(1)</td></tr>
                  <tr><td><code>isEmpty()</code></td><td>Check if the queue has no elements</td><td>O(1)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 8: Interactive Priority Queue Lab */}
        <section id="pqlab" className={`section ${presentationMode && presentingIndex === 7 ? 'presenting' : ''}`}>
          <h2 className="section-title">Interactive Priority Queue Lab</h2>
          <p className="section-subtitle">Insert, peek, and extract elements from a working priority queue.</p>
          <PriorityQueueLab />
        </section>

        {/* Section 9: Comparison */}
        <section id="compare" className={`section ${presentationMode && presentingIndex === 8 ? 'presenting' : ''}`}>
          <h2 className="section-title">Heap Sort vs. Priority Queues</h2>
          <p className="section-subtitle">Understanding their relationship without confusing them.</p>

          <div className="card">
            <h4>The Relationship</h4>
            <ul>
              <li><strong>Heap Sort</strong> is a sorting algorithm that uses a heap as part of its implementation.</li>
              <li>A <strong>Priority Queue</strong> is an abstract data type that defines behavior (insert, extract, peek).</li>
              <li>A <strong>heap</strong> is a data structure that can efficiently support priority queue operations.</li>
            </ul>
            <p>They are related concepts, not interchangeable terms.</p>
          </div>

          <div className="card">
            <h4>Comparison Table</h4>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Aspect</th><th>Heap Sort</th><th>Priority Queue</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>Purpose</strong></td><td>Sort a collection</td><td>Manage elements by priority</td></tr>
                  <tr><td><strong>Returns</strong></td><td>A sorted array</td><td>Individual elements on demand</td></tr>
                  <tr><td><strong>Operations</strong></td><td>Build heap, then extract repeatedly</td><td>Insert, peek, extract</td></tr>
                  <tr><td><strong>Heap usage</strong></td><td>Built and consumed during sorting</td><td>Maintained across operations</td></tr>
                  <tr><td><strong>Keeps collection sorted?</strong></td><td>Yes, as its final output</td><td>No, only guarantees the top element</td></tr>
                  <tr><td><strong>Applications</strong></td><td>Sorting numbers, finding k-th element</td><td>Job scheduling, event simulation, Dijkstra's algorithm</td></tr>
                  <tr><td><strong>Time complexity</strong></td><td>O(n log n) overall</td><td>O(log n) per insert/extract</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Practical Use Cases</h4>
            <ul>
              <li><strong>Heap Sort:</strong> Sorting a list of numbers when you need guaranteed O(n log n) with O(1) extra space.</li>
              <li><strong>Priority Queue:</strong> Scheduling jobs by priority, selecting the next event in a discrete-event simulation, processing tasks in order of importance.</li>
              <li><strong>Heap-based selection:</strong> Repeatedly retrieving the top-k elements from a large dataset.</li>
            </ul>
          </div>
        </section>

        {/* Section 10: Time Complexity */}
        <section id="complexity" className={`section ${presentationMode && presentingIndex === 9 ? 'presenting' : ''}`}>
          <h2 className="section-title">Time Complexity</h2>
          <p className="section-subtitle">Understanding how heap operations scale with input size.</p>

          <div className="card">
            <h4>Big O Notation (Brief Review)</h4>
            <p>Big O describes the <strong>upper bound</strong> of how an algorithm's running time grows as the input size n increases. We focus on the dominant term and ignore constants.</p>
            <ul>
              <li><strong>O(1):</strong> Constant time -- does not depend on input size.</li>
              <li><strong>O(log n):</strong> Logarithmic -- grows very slowly; halving the problem reduces work by a constant.</li>
              <li><strong>O(n):</strong> Linear -- grows proportionally with input size.</li>
              <li><strong>O(n log n):</strong> Linearithmic -- slightly more than linear; typical for efficient sorting.</li>
            </ul>
          </div>

          <div className="card">
            <h4>Complexity Table</h4>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Operation</th><th>Time Complexity</th></tr>
                </thead>
                <tbody>
                  <tr><td>Access heap root</td><td>O(1)</td></tr>
                  <tr><td>Insert into binary heap</td><td>O(log n)</td></tr>
                  <tr><td>Peek at the root</td><td>O(1)</td></tr>
                  <tr><td>Extract root</td><td>O(log n)</td></tr>
                  <tr><td>Build heap (bottom-up)</td><td>O(n)</td></tr>
                  <tr><td>Heap Sort (best case)</td><td>O(n log n)</td></tr>
                  <tr><td>Heap Sort (average case)</td><td>O(n log n)</td></tr>
                  <tr><td>Heap Sort (worst case)</td><td>O(n log n)</td></tr>
                  <tr><td>Heap Sort (auxiliary space)</td><td>O(1) for in-place implementation</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h4>Why is the Height O(log n)?</h4>
            <p>A complete binary tree with n nodes has height floor(log2(n)). Each level doubles the maximum number of nodes. So log2(n) levels suffice for n nodes. Since sift-up and sift-down traverse at most the height, they take O(log n) time.</p>
          </div>

          <Expandable title="Why is build-heap O(n) and not O(n log n)?">
            <p>Although a single sift-down can take O(log n), most nodes during bottom-up construction are near the bottom of the tree and need very few swaps. The mathematical analysis shows:</p>
            <div className="code-block">{`At height h, there are at most n/2^(h+1) nodes.
Each sift-down from height h takes at most h steps.
Total work = sum over h from 0 to log(n) of:
  (n / 2^(h+1)) * h
= n * sum(h / 2^(h+1))
= n * O(1)    [the series converges]
= O(n)`}</div>
            <p>The infinite series sum(h / 2^h) converges to 2, so the total is bounded by a constant times n.</p>
          </Expandable>

          <ComplexityChart />
        </section>

        {/* Section 11: Common Mistakes */}
        <section id="mistakes" className={`section ${presentationMode && presentingIndex === 10 ? 'presenting' : ''}`}>
          <h2 className="section-title">Common Mistakes</h2>
          <p className="section-subtitle">Frequent misconceptions and how to avoid them.</p>

          <MistakeCard
            num={1}
            wrong="A heap is the same as a sorted array."
            right="A heap only guarantees the root is the extreme value. Siblings and subtrees are not sorted relative to each other."
            example="In max-heap [25, 10, 20, 3, 8], the left subtree (10, 3, 8) is not sorted."
          />
          <MistakeCard
            num={2}
            wrong="The left child must always be smaller (or larger) than the right child."
            right="The heap property only constrains parent-child relationships. Siblings can be in any order."
            example="Both [25, 10, 20] and [25, 20, 10] are valid max-heaps."
          />
          <MistakeCard
            num={3}
            wrong="Any binary tree with the heap property is a heap."
            right="A heap must also be a complete binary tree. Gaps in the last level (not filled left to right) disqualify it."
            example="[10, null, 5, 3] is not complete -- index 1 is missing."
          />
          <MistakeCard
            num={4}
            wrong="Using wrong index formulas (e.g., parent = i/2 or children = 2i, 2i+1 for zero-indexed)."
            right="For zero-indexed arrays: parent = floor((i-1)/2), left = 2i+1, right = 2i+2."
            example="For i=3: parent = floor(2/2) = 1, not 3/2 = 1.5."
          />
          <MistakeCard
            num={5}
            wrong="Forgetting to reduce the heap size after extracting the maximum."
            right="After swapping the root to position i, the active heap size must decrease. Otherwise, sorted elements get re-heapified."
            example="After placing max at index n-1, heapSize becomes n-1, not n."
          />
          <MistakeCard
            num={6}
            wrong="Including sorted elements in later heapify operations."
            right="The sorted suffix (indices heapSize to n-1) must be excluded from sift-down operations."
            example="When heapSize = 3, only indices 0, 1, 2 are part of the active heap."
          />
          <MistakeCard
            num={7}
            wrong="Confusing Heap Sort with a Priority Queue."
            right="Heap Sort is a sorting algorithm. A Priority Queue is an abstract data type. They use the same underlying structure but serve different purposes."
            example="Heap Sort sorts an entire array. A PQ serves elements one at a time on demand."
          />
          <MistakeCard
            num={8}
            wrong="Claiming every heap operation is O(1)."
            right="Only peek and root access are O(1). Insert and extract require O(log n) due to sift-up/sift-down."
            example="Inserting into a heap of 1 million elements takes about 20 steps (log2 of 1M), not 1."
          />
          <MistakeCard
            num={9}
            wrong="Claiming bottom-up heap construction takes O(n log n)."
            right="Bottom-up build-heap is O(n). The key insight is that most nodes are near the bottom and need very few swaps."
            example="In a heap of 1000 elements, about 500 are leaves (0 swaps), 250 need at most 1 swap, etc."
          />
          <MistakeCard
            num={10}
            wrong="Assuming every priority queue must use a heap."
            right="A priority queue is an abstract type. It can be implemented with arrays, linked lists, heaps, or other structures, each with different trade-offs."
            example="An unsorted array PQ has O(1) insert but O(n) extract. A heap PQ has O(log n) for both."
          />
        </section>

        {/* Section 12: Quiz */}
        <section id="quiz" className={`section ${presentationMode && presentingIndex === 11 ? 'presenting' : ''}`}>
          <h2 className="section-title">Practice Quiz</h2>
          <p className="section-subtitle">Test your understanding. Answers are revealed after you respond.</p>
          <Quiz />
        </section>

        {/* Section 13: Revision */}
        <section id="revision" className={`section ${presentationMode && presentingIndex === 12 ? 'presenting' : ''}`}>
          <h2 className="section-title">Final Revision & Key Takeaways</h2>
          <p className="section-subtitle">A concise summary of everything covered.</p>

          <div className="card">
            <h4>Key Definitions</h4>
            <ul>
              <li><strong>Binary Heap:</strong> A complete binary tree satisfying the heap ordering property.</li>
              <li><strong>Max-Heap:</strong> Every parent is greater than or equal to its children. Root = maximum.</li>
              <li><strong>Min-Heap:</strong> Every parent is less than or equal to its children. Root = minimum.</li>
              <li><strong>Heap Sort:</strong> A sorting algorithm that builds a max-heap, then repeatedly extracts the maximum.</li>
              <li><strong>Priority Queue:</strong> An abstract data type where elements are served by priority, commonly implemented with a binary heap.</li>
            </ul>
          </div>

          <div className="card">
            <h4>Array Index Formulas (Zero-Indexed)</h4>
            <div className="code-block">{`Parent(i)     = floor((i - 1) / 2)     for i > 0
LeftChild(i)  = 2 * i + 1
RightChild(i) = 2 * i + 2`}</div>
          </div>

          <div className="card">
            <h4>Heap Sort in 5 Steps</h4>
            <ol>
              <li>Build a max-heap from the input array (bottom-up, O(n)).</li>
              <li>Swap the root (maximum) with the last element in the active heap.</li>
              <li>Reduce the active heap size by 1 (the max is now sorted).</li>
              <li>Sift-down the new root to restore the heap property.</li>
              <li>Repeat steps 2-4 until the heap has 1 element. Array is sorted.</li>
            </ol>
          </div>

          <div className="card">
            <h4>Priority Queue Operations</h4>
            <ul>
              <li><strong>Insert:</strong> Add element at end, sift-up. O(log n).</li>
              <li><strong>Peek:</strong> Return root. O(1).</li>
              <li><strong>Extract:</strong> Remove root, move last to root, sift-down. O(log n).</li>
            </ul>
          </div>

          <div className="card">
            <h4>Essential Time Complexities</h4>
            <ul>
              <li>Peek / Access root: O(1)</li>
              <li>Insert: O(log n)</li>
              <li>Extract: O(log n)</li>
              <li>Build heap: O(n)</li>
              <li>Heap Sort: O(n log n) in all cases</li>
              <li>Heap Sort space: O(1) auxiliary (in-place)</li>
            </ul>
          </div>

          <div className="card">
            <h4>The Relationship</h4>
            <p><strong>Heap</strong> = data structure (complete binary tree + ordering property)<br/>
            <strong>Heap Sort</strong> = algorithm that uses a heap to sort<br/>
            <strong>Priority Queue</strong> = abstract data type, commonly implemented using a heap</p>
          </div>

          <div className="card">
            <h4>Self-Check Questions</h4>
            <SelfCheckQuestion
              question="What makes a binary heap different from a sorted array?"
              answer="A heap only guarantees the root is the extreme value (max or min). The rest of the elements are not fully sorted -- siblings and subtrees can be in any order as long as the parent-child heap property holds. A sorted array has every element in its correct position relative to all others."
            />
            <SelfCheckQuestion
              question="Why does ascending Heap Sort use a max-heap?"
              answer="A max-heap always has the largest element at the root. By repeatedly extracting the maximum and placing it at the end of the array, we build the sorted portion from right to left in ascending order."
            />
            <SelfCheckQuestion
              question="Why must the active heap shrink after extracting the maximum?"
              answer="The extracted maximum is placed in its final sorted position. If we don't reduce the heap size, the sift-down operation would include this already-sorted element, potentially moving it back into the unsorted portion and corrupting the result."
            />
            <SelfCheckQuestion
              question="Why is bottom-up heap construction O(n)?"
              answer="Most nodes in a complete binary tree are near the bottom (leaves need 0 swaps, nodes one level up need at most 1 swap). The mathematical sum of work across all levels converges to a constant times n, giving O(n) total, not O(n log n)."
            />
            <SelfCheckQuestion
              question="How does a binary heap help implement a Priority Queue?"
              answer="A binary heap keeps the highest (or lowest) priority element at the root, accessible in O(1). Insertion adds at the end and sifts up in O(log n). Extraction removes the root and sifts down in O(log n). This makes both core operations efficient."
            />
          </div>

          <div className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
            <h4>60-Second Presentation Summary</h4>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              "A binary heap is a complete binary tree where every parent satisfies an ordering relationship with its children. In a max-heap, every parent is greater than or equal to its children, so the maximum is always at the root. Heap Sort uses this property: first, it builds a max-heap from the input in O(n) time using bottom-up construction. Then, it repeatedly swaps the root with the last element, reduces the heap size, and sifts down to restore the heap property. After n-1 extractions, the array is sorted in O(n log n) time with O(1) extra space. A Priority Queue is an abstract data type that serves elements by priority. A binary heap is the most common efficient implementation, providing O(log n) insert and extract operations. While Heap Sort consumes the heap to produce a sorted array, a priority queue maintains the heap for ongoing use. They share the same underlying structure but serve different purposes."
            </p>
          </div>
        </section>
      </div>

      {/* Presentation mode controls */}
      {presentationMode && (
        <div className="presentation-controls">
          <button className="btn btn-sm" onClick={() => setPresentingIndex(prev => Math.max(prev - 1, 0))}>
            Previous
          </button>
          <span style={{ fontSize: '0.85rem', padding: '0 0.5rem' }}>
            {presentingIndex + 1} / {SECTIONS.length}
          </span>
          <button className="btn btn-sm" onClick={() => setPresentingIndex(prev => Math.min(prev + 1, SECTIONS.length - 1))}>
            Next
          </button>
          <button className="btn btn-sm" onClick={() => setPresentationMode(false)}>
            Exit
          </button>
        </div>
      )}
    </div>
  );
}

// Sub-components

const InteractiveIndexSelector: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const data = [50, 30, 40, 10, 20, 35];
  const parent = selected > 0 ? Math.floor((selected - 1) / 2) : -1;
  const left = 2 * selected + 1 < data.length ? 2 * selected + 1 : -1;
  const right = 2 * selected + 2 < data.length ? 2 * selected + 2 : -1;

  return (
    <div className="card">
      <h4>Interactive Index Selector</h4>
      <p>Select an index to see its parent and children:</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
        {data.map((_, i) => (
          <button key={i} className={`btn btn-sm ${selected === i ? 'btn-primary' : ''}`} onClick={() => setSelected(i)}>
            [{i}]
          </button>
        ))}
      </div>
      <div className="array-container">
        {data.map((v, i) => {
          let cls = 'array-value';
          if (i === selected) cls += ' root';
          else if (i === parent) cls += ' active';
          else if (i === left || i === right) cls += ' comparing';
          return (
            <div key={i} className="array-cell">
              <div className={cls}>{v}</div>
              <span className="array-index">[{i}]</span>
            </div>
          );
        })}
      </div>
      <TreeVisualization
        data={data}
        highlights={{
          root: selected,
          comparing: [left, right].filter(x => x >= 0),
          active: parent >= 0 ? [parent] : undefined
        }}
      />
      <div style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
        <strong>Index {selected}</strong> (value {data[selected]}):
        {parent >= 0 && <span> Parent = index {parent} (value {data[parent]})</span>}
        {parent < 0 && <span> Root (no parent)</span>}
        {left >= 0 && <span> | Left child = index {left} (value {data[left]})</span>}
        {left < 0 && <span> | No left child</span>}
        {right >= 0 && <span> | Right child = index {right} (value {data[right]})</span>}
        {right < 0 && <span> | No right child</span>}
      </div>
    </div>
  );
};

const MaxMinHeapDemo: React.FC = () => {
  const [isMax, setIsMax] = useState(true);
  const numbers = [7, 3, 9, 1, 5, 8, 2];

  // Build actual heaps
  const buildMaxHeap = (arr: number[]): number[] => {
    const a = [...arr];
    const n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let current = i;
      while (true) {
        let largest = current;
        const l = 2 * current + 1, r = 2 * current + 2;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest === current) break;
        [a[current], a[largest]] = [a[largest], a[current]];
        current = largest;
      }
    }
    return a;
  };

  const buildMinHeap = (arr: number[]): number[] => {
    const a = [...arr];
    const n = a.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      let current = i;
      while (true) {
        let smallest = current;
        const l = 2 * current + 1, r = 2 * current + 2;
        if (l < n && a[l] < a[smallest]) smallest = l;
        if (r < n && a[r] < a[smallest]) smallest = r;
        if (smallest === current) break;
        [a[current], a[smallest]] = [a[smallest], a[current]];
        current = smallest;
      }
    }
    return a;
  };

  const heapData = isMax ? buildMaxHeap(numbers) : buildMinHeap(numbers);

  return (
    <div className="card">
      <h4>Max-Heap vs. Min-Heap</h4>
      <p>Using the same numbers: <code>[{numbers.join(', ')}]</code></p>

      <div className="toggle-group" style={{ margin: '1rem 0' }}>
        <button className={`toggle-btn ${isMax ? 'active' : ''}`} onClick={() => setIsMax(true)}>Max-Heap</button>
        <button className={`toggle-btn ${!isMax ? 'active' : ''}`} onClick={() => setIsMax(false)}>Min-Heap</button>
      </div>

      <div className="array-container">
        {heapData.map((v, i) => (
          <div key={i} className="array-cell">
            <div className={`array-value ${i === 0 ? 'root' : ''}`}>{v}</div>
            <span className="array-index">[{i}]</span>
          </div>
        ))}
      </div>

      <TreeVisualization data={heapData} highlights={{ root: 0 }} />

      <div style={{ marginTop: '1rem' }}>
        <p><strong>{isMax ? 'Max-Heap' : 'Min-Heap'}:</strong> <code>[{heapData.join(', ')}]</code></p>
        <ul>
          <li><strong>Root property:</strong> The root ({heapData[0]}) is the {isMax ? 'maximum' : 'minimum'} value.</li>
          <li><strong>Heap property:</strong> Every parent is {isMax ? 'greater than or equal to' : 'less than or equal to'} its children.</li>
          <li><strong>Siblings:</strong> The left and right children of a node do not need to be sorted relative to each other.</li>
          <li><strong>Not fully sorted:</strong> A heap is not the same as a sorted array. Only the root is guaranteed to be extreme.</li>
          <li><strong>Multiple valid heaps:</strong> Different valid heap arrangements can exist for the same set of numbers.</li>
        </ul>
      </div>
    </div>
  );
};

const MistakeCard: React.FC<{ num: number; wrong: string; right: string; example: string }> = ({ num, wrong, right, example }) => (
  <div className="mistake-card">
    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Mistake #{num}</div>
    <div className="mistake-wrong">Wrong: {wrong}</div>
    <div className="mistake-right">Correct: {right}</div>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Example: {example}</div>
  </div>
);

const SelfCheckQuestion: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
      <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{question}</div>
      {revealed ? (
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {answer}
          <button className="btn btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => setRevealed(false)}>Hide</button>
        </div>
      ) : (
        <button className="btn btn-sm" onClick={() => setRevealed(true)}>Reveal Answer</button>
      )}
    </div>
  );
};

const ComplexityChart: React.FC = () => {
  const [n, setN] = useState(100);

  const o1 = 1;
  const oLogN = Math.log2(n);
  const oN = n;
  const oNLogN = n * Math.log2(n);

  const maxVal = oNLogN;
  const scale = (v: number) => (v / maxVal) * 100;

  return (
    <div className="chart-container">
      <h4 style={{ marginBottom: '0.75rem' }}>Growth Rate Comparison</h4>
      <div style={{ marginBottom: '1rem' }}>
        <label className="input-label" htmlFor="complexity-n">Input size (n):</label>
        <input
          id="complexity-n"
          type="range"
          min="10"
          max="1000"
          step="10"
          value={n}
          onChange={e => setN(Number(e.target.value))}
          style={{ width: '200px', accentColor: 'var(--accent)' }}
        />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>n = {n}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '80px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>O(1)</span>
          <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '4px', height: '24px', position: 'relative' }}>
            <div style={{ width: `${Math.max(scale(o1), 2)}%`, height: '100%', background: 'var(--accent)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ width: '60px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{o1}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '80px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>O(log n)</span>
          <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '4px', height: '24px', position: 'relative' }}>
            <div style={{ width: `${Math.max(scale(oLogN), 2)}%`, height: '100%', background: 'var(--success)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ width: '60px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{oLogN.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '80px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>O(n)</span>
          <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '4px', height: '24px', position: 'relative' }}>
            <div style={{ width: `${Math.max(scale(oN), 2)}%`, height: '100%', background: 'var(--active)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ width: '60px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{oN}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '80px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>O(n log n)</span>
          <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: '4px', height: '24px', position: 'relative' }}>
            <div style={{ width: `${Math.max(scale(oNLogN), 2)}%`, height: '100%', background: 'var(--comparing)', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ width: '60px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{oNLogN.toFixed(0)}</span>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Relative operations count for n = {n}. O(1) and O(log n) remain small even as n grows.
      </div>
    </div>
  );
};
