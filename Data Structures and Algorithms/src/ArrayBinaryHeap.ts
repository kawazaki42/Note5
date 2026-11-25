import { ArrayTreeRelatives as R } from "./ArrayTree";

function present<T>(it: T | null | undefined) {
  return it !== null && it !== undefined;
}

export default class ArrayBinaryHeap<T> {
  flatData: T[] = [];

  private parent(index: number): ArrayTreeNode<T> {
    const parentIdx = R.parent(index);
    const value = this.flatData[parentIdx];

    return {
      index: parentIdx,
      value,
    };
  }

  insert(newElement: T): void {
    this.flatData.push(newElement);

    // a path in this tree must always be an increasing sequence

    // let newIdx = this.flatData.length - 1;

    const newNode: ArrayTreeNode<T> = {
      index: this.flatData.length - 1,
      value: newElement,
    }

    while (true) {

      // const parentIdx = R.parent(newIdx);
      // const parentData = this.flatData[parentIdx];
      const parent = this.parent(newNode.index);

      // if (parent === -1)
      if (!present(parent.value)) return;

      if (newNode.value! < parent.value) {
        // swap; move the min value closer to root
        this.flatData[parent.index] = newNode.value!;
        this.flatData[newNode.index] = parent.value;

        newNode.index = parent.index;
      } else return;
    }
  }

  popRoot(): T | null {
    // const substVal = this.flatData.pop();
    const substitute: ArrayTreeNode<T> = {
      index: 0,
      value: this.flatData.pop(),
    };

    const saved = this.flatData[substitute.index];

    if (!present(substitute.value) || !present(saved)) return null;

    // let curIdx = 0;
    this.flatData[substitute.index] = substitute.value!;

    // downLevel:
    while (true) {
      const [left, right] = this.children(substitute.index);

      let min = substitute;
      // if (!present(min.value))
      //     throw Error("пэпэ шнэйнэ втфа?");

      for (const child of [left, right]) {
        if (present(child.value) && child.value < min.value!) {
          // substitute.index = child.index;
          min = child;
          // continue downLevel;
        }
      }

      // if we're already minimum
      if (substitute.value <= min.value!) return saved;

      this.flatData[min.index] = substitute.value;
      this.flatData[substitute.index] = min.value!;

      substitute.index = min.index;
    }
  }

  *sort(): Generator<T> {
    while (true) {
      const min = this.popRoot();

      if (min === null) return;

      yield min;
    }
  }

  private children(idx: number): [ArrayTreeNode<T>, ArrayTreeNode<T>] {
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
