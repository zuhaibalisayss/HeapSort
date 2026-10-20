import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateHeapSortSteps, HeapSortStep } from '../utils/heapSort';
import { TreeVisualization } from './TreeVisualization';

const EXAMPLES = [
  { label: '[4, 10, 3, 5, 1]', values: [4, 10, 3, 5, 1] },
  { label: '[12, 7, 20, 15, 3, 9]', values: [12, 7, 20, 15, 3, 9] },
  { label: '[5, 3, 8, 1, 9, 2, 7]', values: [5, 3, 8, 1, 9, 2, 7] },
];

export const HeapSortLab: React.FC = () => {
  const [input, setInput] = useState('4, 10, 3, 5, 1');
  const [error, setError] = useState('');
  const [steps, setSteps] = useState<HeapSortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parseInput = useCallback((val: string): number[] | null => {
    const trimmed = val.trim();
    if (!trimmed) return [];
    const parts = trimmed.split(',').map(s => s.trim());
    const nums: number[] = [];
    for (const p of parts) {
      if (p === '') continue;
      const n = Number(p);
      if (isNaN(n) || !Number.isInteger(n)) {
        setError(`"${p}" is not a valid integer.`);
        return null;
      }
      nums.push(n);
    }
    if (nums.length > 15) {
      setError('Maximum 15 elements allowed for readability.');
      return null;
    }
    setError('');
    return nums;
  }, []);

  const buildSteps = useCallback((arr: number[]) => {
    const newSteps = generateHeapSortSteps(arr);
    setSteps(newSteps);
    setCurrentStep(0);
    setInitialArray([...arr]);
    setIsPlaying(false);
  }, []);

  const handleStart = () => {
    const arr = parseInput(input);
    if (arr === null) return;
    buildSteps(arr);
  };

  const handleReset = () => {
    if (initialArray.length > 0) {
      setSteps(generateHeapSortSteps(initialArray));
      setCurrentStep(0);
      setIsPlaying(false);
    }
  };

  const handleRandom = () => {
    const len = Math.floor(Math.random() * 6) + 4;
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 50) + 1);
    setInput(arr.join(', '));
    buildSteps(arr);
  };

  const handleExample = (values: number[]) => {
    setInput(values.join(', '));
    buildSteps(values);
  };

  const stepForward = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        stepForward();
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed, stepForward]);

  const current = steps[currentStep];

  return (
    <div className="card">
      <h3 className="card-title">Interactive Heap Sort Lab</h3>

      {/* Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="input-label" htmlFor="heap-input">Enter comma-separated integers (max 15):</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            id="heap-input"
            className="input"
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            placeholder="e.g. 4, 10, 3, 5, 1"
            style={{ flex: 1, minWidth: '200px' }}
          />
          <button className="btn btn-primary" onClick={handleStart}>Sort</button>
        </div>
        {error && <div className="error-msg">{error}</div>}
      </div>

      {/* Controls */}
      <div className="btn-group">
        <button className="btn btn-sm" onClick={() => handleExample(EXAMPLES[0].values)}>{EXAMPLES[0].label}</button>
        <button className="btn btn-sm" onClick={() => handleExample(EXAMPLES[1].values)}>{EXAMPLES[1].label}</button>
        <button className="btn btn-sm" onClick={() => handleExample(EXAMPLES[2].values)}>{EXAMPLES[2].label}</button>
        <button className="btn btn-sm" onClick={handleRandom}>Random</button>
        <button className="btn btn-sm" onClick={handleReset}>Reset</button>
      </div>

      {/* Playback controls */}
      {steps.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', margin: '1rem 0' }}>
            <button className="btn btn-sm" onClick={stepBackward} disabled={currentStep === 0}>Prev</button>
            <button className="btn btn-sm btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button className="btn btn-sm" onClick={stepForward} disabled={currentStep >= steps.length - 1}>Next</button>
            <div className="speed-control">
              <label htmlFor="speed-slider">Speed:</label>
              <input
                id="speed-slider"
                type="range"
                min="200"
                max="2000"
                step="100"
                value={2200 - speed}
                onChange={e => setSpeed(2200 - Number(e.target.value))}
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{speed}ms</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Step {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Legend */}
          <div className="legend">
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent)' }}></div>
              <span>Root</span>
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'var(--comparing-light)', borderColor: 'var(--comparing)' }}></div>
              <span>Comparing</span>
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'var(--error-light)', borderColor: 'var(--error)' }}></div>
              <span>Swapping</span>
            </div>
            <div className="legend-item">
              <div className="legend-swatch" style={{ background: 'var(--sorted-light)', borderColor: 'var(--sorted)' }}></div>
              <span>Sorted</span>
            </div>
          </div>

          {/* Step info */}
          <div className="step-info">
            <div className="step-info-label">Phase: {current.phaseDescription}</div>
            <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{current.operation}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{current.explanation}</div>
          </div>

          {/* Array visualization */}
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Array:</div>
            <div className="array-container">
              {current.array.map((val, i) => {
                let className = 'array-value';
                if (current.highlights.sorted?.includes(i)) className += ' sorted';
                else if (current.highlights.swapping?.includes(i)) className += ' swapping';
                else if (current.highlights.comparing?.includes(i)) className += ' comparing';
                else if (current.highlights.root === i) className += ' root';
                else if (current.highlights.current === i) className += ' active';
                return (
                  <div key={i} className="array-cell">
                    <div className={className}>{val}</div>
                    <span className="array-index">{i}</span>
                  </div>
                );
              })}
            </div>
            {current.heapSize > 0 && current.heapSize < current.array.length && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Active heap: indices 0 to {current.heapSize - 1} | Sorted: indices {current.heapSize} to {current.array.length - 1}
              </div>
            )}
          </div>

          {/* Tree visualization */}
          <div style={{ margin: '1rem 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              Tree (active heap: indices 0 to {Math.min(current.heapSize, current.array.length) - 1}):
            </div>
            <TreeVisualization
              data={current.array.slice(0, current.heapSize || current.array.length)}
              highlights={current.highlights}
            />
          </div>
        </>
      )}

      {steps.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Enter an array and click "Sort" to begin the visualization.
        </div>
      )}
    </div>
  );
};
