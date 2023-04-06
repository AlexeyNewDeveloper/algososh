const MAX_LENGTH: number = 4;

interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => void;
  peak: () => T | null;
  isEmpty: () => boolean;
  getSize: () => number;
  getLength: () => number;
  getHeadIndex: () => number;
  getTailIndex: () => number;
  isFilled: () => boolean;
  clear: () => void;
}

export class Queue<T> implements IQueue<T> {
  private container: (T | null)[] = [];
  private head = 0;
  private tail = 0;
  private readonly size: number = 0;
  private length: number = 0;

  constructor(size: number) {
    this.size = size;
    this.container = Array(size);
  }

  enqueue = (item: T) => {
    if (this.length >= this.size) {
      throw new Error("Maximum length exceeded");
    }

    this.container[this.tail % this.size] = item;
    this.tail++;
    this.length++;
  };

  dequeue = () => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }

    this.container[this.head % this.size] = null;
    if (this.head < this.size - 1) {
      this.head++;
    }

    this.length -= 1;
  };

  peak = (): T | null => {
    if (this.isEmpty()) {
      throw new Error("No elements in the queue");
    }
    if (this.length) {
      return this.container[this.head % this.size];
    }
    return null;
  };

  isEmpty = () => this.length === 0;

  getSize = () => this.size;

  getLength = () => this.length;

  getHeadIndex = () => this.head;

  getTailIndex = () => this.tail;

  isFilled = () => this.tail === this.size;

  clear = () => {
    this.container = [];
    this.head = 0;
    this.tail = 0;
    this.length = 0;
  };
}
