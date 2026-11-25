import { ArrayTreeRelatives as R } from "./ArrayTree";

function present<T>(it: T | null | undefined) {
  return it !== null && it !== undefined;
}

export default class ArrayBinaryHeap<T> {
  flatData: T[] = [];

  // a path in this tree must always be an increasing sequence
  insert(newElement: T): void {
    this.flatData.push(newElement);

    const newNode: ArrayTreeNode<T> = {
      index: this.flatData.length - 1,
      value: newElement,
    };

    while (true) {
      const parent = this.parentOf(newNode.index);

      if (!present(parent.value)) return;

      if (newNode.value! < parent.value) {
        this.swap(parent, newNode);
      } else return;
    }
  }

  popRoot(): T | null {
    const substitute: ArrayTreeNode<T> = {
      index: 0,
      value: this.flatData.pop(),
    };

    const saved = this.flatData[substitute.index];

    if (!present(substitute.value) || !present(saved)) return null;

    this.flatData[substitute.index] = substitute.value;

    while (true) {
      let min = substitute;

      for (const child of this.childrenOf(substitute.index)) {
        if (present(child.value) && child.value < min.value!) {
          min = child;
        }
      }

      // if we're already minimum
      if (substitute.value <= min.value!) return saved;

      this.swap(substitute, min);
    }
  }

  *sort(): Generator<T> {
    while (true) {
      const min = this.popRoot();

      if (min === null) return;

      yield min;
    }
  }

  /** make sure that a and b have a value! */
  private swap(a: ArrayTreeNode<T>, b: ArrayTreeNode<T>): void {
    this.flatData[a.index] = b.value!;
    this.flatData[b.index] = a.value!;

    [a.index, b.index] = [b.index, a.index];
  }

  private parentOf(index: number): ArrayTreeNode<T> {
    const parentIdx = R.parent(index);
    const value = this.flatData[parentIdx];

    return {
      index: parentIdx,
      value,
    };
  }

  private childrenOf(idx: number): [ArrayTreeNode<T>, ArrayTreeNode<T>] {
    const leftIdx = R.leftChildOf(idx);
    const rightIdx = R.rightChildOf(idx);

    const left = this.flatData[leftIdx];
    const right = this.flatData[rightIdx];

    return [
      {
        index: leftIdx,
        value: left,
      },
      {
        index: rightIdx,
        value: right,
      },
    ];
  }
}

type ArrayTreeNode<T> = {
  index: number;
  value: T | undefined;
};
