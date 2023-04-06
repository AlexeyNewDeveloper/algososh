import { nanoid } from "nanoid";
import { IItemObject } from "../../types/types";

export const MAX_LENGTH: number = 4;

export class Node<T> {
  value: T;
  next: Node<T> | null;
  constructor(value: T, next?: Node<T> | null) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

interface ILinkedList<T> {
  append: (element: T) => void;
  prepend: (element: T) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  toArray: () => Array<T>;
  toLinkedList: () => void;
  addByIndex: (element: T, position: number) => void;
  getElementByindex: (index: number) => Node<T> | null | undefined;
  deleteByIndex: (index: number) => Node<T> | null | undefined;
  getSize: () => number;
  print: () => void;
}

export class LinkedList<T extends IItemObject> implements ILinkedList<T> {
  private head: Node<T> | null;
  private size: number;
  private initialList: Array<any> | undefined;
  constructor(initialList?: Array<any>) {
    this.initialList = initialList;
    this.head = null;
    this.size = 0;
    if (initialList) {
      this.toLinkedList();
    }
  }

  toLinkedList() {
    if (this.initialList) {
      for (let i = 0; i < this.initialList.length; i++) {
        let value = {
          value: this.initialList[i],
          id: nanoid(),
          changing: false,
          modified: false,
        };
        this.append(value as T);
      }
    }
  }

  append(element: T) {
    const node = new Node(element);
    let curr = this.head;
    if (!this.head) {
      this.head = node;
    } else {
      while (curr) {
        if (!curr.next) {
          curr.next = node;
          break;
        } else {
          curr = curr.next;
        }
      }
    }
    this.size++;
  }

  prepend(element: T) {
    const node = new Node(element);
    if (!this.head) {
      this.head = node;
    } else {
      const temp = this.head;
      this.head = node;
      this.head.next = temp;
    }
    this.size++;
  }

  addByIndex(element: T, index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      const node = new Node(element);

      if (index === 0) {
        if (!this.head) {
          this.head = node;
        } else {
          const temp = this.head;
          this.head = node;
          this.head.next = temp;
        }
      } else {
        let curr = this.head;
        let currIndex = 0;

        while (currIndex <= index) {
          if (curr) {
            const tempNextIndex = curr.next;
            currIndex++;
            if (currIndex === index && tempNextIndex) {
              node.next = tempNextIndex;
              curr.next = node;
              break;
            }
            curr = curr.next;
          }
        }
      }

      this.size++;
    }
  }

  getElementByindex(index: number) {
    if (index < 0 || index > this.size) {
      return;
    } else {
      if (index === 0) {
        return this.head;
      } else {
        let curr = this.head;
        let currIndex = 0;

        while (currIndex <= index) {
          if (curr) {
            const tempNextIndex = curr.next;
            currIndex++;
            if (currIndex === index && tempNextIndex) {
              return tempNextIndex;
            }
            curr = curr.next;
          }
        }
      }
    }
  }

  deleteHead() {
    if (this.head) {
      this.head = this.head.next;
      this.size--;
    }
  }

  deleteTail() {
    if (this.head) {
      let curr = this.head;
      let prev;
      if (curr.next) {
        while (curr.next) {
          prev = curr;
          curr = curr.next;
        }
        if (prev) {
          prev.next = null;
        }
      } else {
        this.head = null;
      }
      this.size--;
    }
  }

  deleteByIndex(index: number) {
    if (this.head) {
      let curr: Node<T> | null = this.head;
      let i = 0;
      if (i === index && !curr.next) {
        const temp = curr;
        this.head = null;
        this.size--;
        return temp;
      }
      while (curr) {
        if (i === index) {
          const temp = curr.next;
          const tempDeleteElement = curr;
          this.head = temp;
          this.size--;
          return tempDeleteElement;
        } else {
          curr = curr.next;
          i++;
        }
      }
      return;
    }
  }

  toArray() {
    let arr: Array<T> = [];
    if (this.head) {
      let curr = this.head;
      while (curr) {
        arr.push(curr.value);
        if (curr.next) {
          curr = curr.next;
        } else {
          return arr;
        }
      }
    }
    return [];
  }

  getSize() {
    return this.size;
  }

  print() {
    let curr = this.head;
    let res = "";
    while (curr) {
      res += `${curr.value} `;
      curr = curr.next;
    }
    console.log(res);
  }
}
