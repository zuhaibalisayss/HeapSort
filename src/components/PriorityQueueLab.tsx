import React, { useState, useCallback } from 'react';
import { BinaryHeap, PQOperation, createPQElement, resetPQIds } from '../utils/priorityQueue';
import { TreeVisualization } from './TreeVisualization';

export const PriorityQueueLab: React.FC = () => {
  const [isMax, setIsMax] = useState(true);
  const [heap, setHeap] = useState(() => new BinaryHeap(true));
  const [valueInput, setValueInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<PQOperation[]>([]);
  const [lastOp, setLastOp] = useState<PQOperation | null>(null);

  const updateHeap = useCallback((newHeap: BinaryHeap) => {
    setHeap(newHeap);
  }, []);

  const handleInsert = () => {
    const value = valueInput.trim();
    const priority = Number(priorityInput);
    if (!value) { setError('Please enter a value.'); return; }
    if (isNaN(priority)) { setError('Priority must be a number.'); return; }
    setError('');

    const newHeap = new BinaryHeap(isMax);
    heap.array.forEach(el => { if (el) newHeap.insert(el); });
    const element = createPQElement(value, priority);
    const op = newHeap.insert(element);
    setLastOp(op);
    setHistory(prev => [op, ...prev].slice(0, 20));
    updateHeap(newHeap);
    setValueInput('');
    setPriorityInput('');
  };

  const handleExtract = () => {
    if (heap.isEmpty) { setError('Queue is empty.'); return; }
    setError('');

    const newHeap = new BinaryHeap(isMax);
    heap.array.forEach(el => { if (el) newHeap.insert(el); });
    const op = newHeap.extract();
    if (op) {
      setLastOp(op);
      setHistory(prev => [op, ...prev].slice(0, 20));
      updateHeap(newHeap);
    }
  };

  const handlePeek = () => {
    if (heap.isEmpty) { setError('Queue is empty.'); return; }
    setError('');
    const top = heap.peek();
    if (top) {
      setLastOp({
        type: 'peek',
        element: top,
        description: `Peeked: "${top.value}" with priority ${top.priority}. Element remains in queue.`,
        arrayBefore: heap.array,
        arrayAfter: heap.array
      });
    }
  };

  const handleClear = () => {
    const newHeap = new BinaryHeap(isMax);
    updateHeap(newHeap);
    setHistory([]);
    setLastOp(null);
    setError('');
    resetPQIds();
  };

  const handleToggle = (max: boolean) => {
    setIsMax(max);
    const newHeap = new BinaryHeap(max);
    heap.array.forEach(el => { if (el) newHeap.insert(el); });
    updateHeap(newHeap);
    setLastOp(null);
  };

  const handleLoadExample = () => {
    resetPQIds();
    const newHeap = new BinaryHeap(isMax);
    const examples = [
      { value: 'Task A', priority: 3 },
      { value: 'Task B', priority: 7 },
      { value: 'Task C', priority: 1 },
      { value: 'Task D', priority: 5 },
      { value: 'Task E', priority: 9 },
    ];
    const ops: PQOperation[] = [];
    for (const ex of examples) {
      const el = createPQElement(ex.value, ex.priority);
      const op = newHeap.insert(el);
      ops.push(op);
    }
    setHistory(ops.reverse());
    setLastOp(ops[0]);
    updateHeap(newHeap);
  };

  const array = heap.array;
  const arrayDisplay = array.map(el => el ? `${el.value}(${el.priority})` : null);

  return (
    <div className="card">
      <h3 className="card-title">Interactive Priority Queue Lab</h3>

      {/* Mode toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${isMax ? 'active' : ''}`}
            onClick={() => handleToggle(true)}
          >
            Max-Priority Queue
          </button>
          <button
            className={`toggle-btn ${!isMax ? 'active' : ''}`}
            onClick={() => handleToggle(false)}
          >
            Min-Priority Queue
          </button>
        </div>
      </div>

      {/* Insert controls */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <label className="input-label" htmlFor="pq-value">Value:</label>
          <input
            id="pq-value"
            className="input"
            type="text"
            value={valueInput}
            onChange={e => setValueInput(e.target.value)}
            placeholder="e.g. Task A"
          />
        </div>
        <div style={{ width: '100px' }}>
          <label className="input-label" htmlFor="pq-priority">Priority:</label>
          <input
            id="pq-priority"
            className="input"
            type="number"
            value={priorityInput}
            onChange={e => setPriorityInput(e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <button className="btn btn-primary" onClick={handleInsert}>Insert</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Action buttons */}
      <div className="btn-group">
        <button className="btn btn-sm" onClick={handlePeek}>Peek</button>
        <button className="btn btn-sm" onClick={handleExtract}>Extract</button>
        <button className="btn btn-sm" onClick={handleLoadExample}>Load Example</button>
        <button className="btn btn-sm" onClick={handleClear}>Clear</button>
      </div>

      {/* Last operation */}
      {lastOp && (
        <div className="step-info" style={{ marginTop: '1rem' }}>
          <div className="step-info-label">Last Operation: {lastOp.type}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{lastOp.description}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Time complexity: {lastOp.type === 'insert' ? 'O(log n)' : lastOp.type === 'extract' ? 'O(log n)' : 'O(1)'}
          </div>
        </div>
      )}

      {/* Array representation */}
      <div style={{ margin: '1rem 0' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
          Array representation ({isMax ? 'Max' : 'Min'}-Heap):
        </div>
        {array.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>Empty queue</div>
        ) : (
          <div className="array-container">
            {array.map((el, i) => (
              <div key={el.id} className="array-cell">
                <div className={`array-value ${i === 0 ? 'root' : ''}`} title={`Priority: ${el.priority}`}>
                  {el.priority}
                </div>
                <span className="array-index" style={{ fontSize: '0.65rem' }}>{el.value}</span>
                <span className="array-index">[{i}]</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tree visualization */}
      {array.length > 0 && (
        <div style={{ margin: '1rem 0' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tree:</div>
          <TreeVisualization
            data={arrayDisplay}
            highlights={{ root: 0 }}
          />
        </div>
      )}

      {/* Queue info */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
        Size: {heap.size} | Empty: {heap.isEmpty ? 'Yes' : 'No'}
        {heap.peek() && ` | Next to extract: "${heap.peek()!.value}" (priority ${heap.peek()!.priority})`}
      </div>

      {/* Operation history */}
      {history.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Operation History:</div>
          <div className="op-log">
            {history.map((op, i) => (
              <div key={i} className="op-log-entry">
                [{op.type.toUpperCase()}] {op.element ? `"${op.element.value}" (p:${op.element.priority})` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
