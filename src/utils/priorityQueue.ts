export interface PQElement {
  id: number;
  value: string;
  priority: number;
}

export interface PQOperation {
  type: 'insert' | 'extract' | 'peek';
  element?: PQElement;
  description: string;
  arrayBefore: (PQElement | null)[];
  arrayAfter: (PQElement | null)[];
}

let nextId = 1;
export function resetPQIds(): void {
  nextId = 1;
}

export function createPQElement(value: string, priority: number): PQElement {
  return { id: nextId++, value, priority };
}

export class BinaryHeap {
  private data: PQElement[] = [];
  private isMax: boolean;

  constructor(isMax: boolean = true) {
    this.isMax = isMax;
  }

  get array(): PQElement[] {
    return [...this.data];
  }

  get size(): number {
    return this.data.length;
  }

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  private compare(a: PQElement, b: PQElement): boolean {
    return this.isMax ? a.priority > b.priority : a.priority < b.priority;
  }

  private shouldSwap(parent: PQElement, child: PQElement): boolean {
    return this.isMax ? parent.priority < child.priority : parent.priority > child.priority;
  }

  insert(element: PQElement): PQOperation {
    const arrayBefore = this.array;
    this.data.push(element);
    this.siftUp(this.data.length - 1);
    const arrayAfter = this.array;

    return {
      type: 'insert',
      element,
      description: `Inserted "${element.value}" (priority ${element.priority}). Sift-up to maintain heap property.`,
      arrayBefore,
      arrayAfter
    };
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.shouldSwap(this.data[parent], this.data[index])) {
        [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
        index = parent;
      } else {
        break;
      }
    }
  }

  peek(): PQElement | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  extract(): PQOperation | null {
    if (this.data.length === 0) return null;

    const arrayBefore = this.array;
    const extracted = this.data[0];

    if (this.data.length === 1) {
      this.data = [];
    } else {
      this.data[0] = this.data[this.data.length - 1];
      this.data.pop();
      this.siftDown(0);
    }

    const arrayAfter = this.array;

    return {
      type: 'extract',
      element: extracted,
      description: `Extracted "${extracted.value}" (priority ${extracted.priority}). Last element moved to root, sift-down to restore heap.`,
      arrayBefore,
      arrayAfter
    };
  }

  private siftDown(index: number): void {
    const n = this.data.length;
    while (true) {
      let target = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.shouldSwap(this.data[target], this.data[left])) {
        target = left;
      }
      if (right < n && this.shouldSwap(this.data[target], this.data[right])) {
        target = right;
      }

      if (target === index) break;
      [this.data[index], this.data[target]] = [this.data[target], this.data[index]];
      index = target;
    }
  }

  clear(): void {
    this.data = [];
  }

  setIsMax(isMax: boolean): void {
    if (this.isMax !== isMax) {
      this.isMax = isMax;
      // Rebuild heap with new ordering
      this.rebuild();
    }
  }

  private rebuild(): void {
    const elements = [...this.data];
    this.data = [];
    for (const el of elements) {
      this.data.push(el);
      this.siftUp(this.data.length - 1);
    }
  }
}

// Helper to get parent/child indices
export function getParentIndex(i: number): number {
  return i > 0 ? Math.floor((i - 1) / 2) : -1;
}

export function getLeftChildIndex(i: number): number {
  return 2 * i + 1;
}

export function getRightChildIndex(i: number): number {
  return 2 * i + 2;
}
