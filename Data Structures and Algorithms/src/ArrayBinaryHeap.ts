import { ArrayTreeRelatives as R } from "./ArrayTree";

function present<T>(it: T | null | undefined) {
  return it !== null && it !== undefined;
}

export default class ArrayBinaryHeap<T> {
  flatData: T[] = [];

  insert(newElement: T): void {
    this.flatData.push(newElement);

    // a path in this tree must always be an increasing sequence

    let newIdx = this.flatData.length - 1;

    while (true) {
      const parentIdx = R.parent(newIdx);
      const parentData = this.flatData[parentIdx];

      // if (parent === -1)
      if (parentData === undefined || parentData === null) return;

      if (newElement < parentData) {
        // swap
        this.flatData[parentIdx] = newElement;
        this.flatData[newIdx] = parentData;

        newIdx = parentIdx;
      } else return;
    }
  }

  popRoot(): T | null {
    // const substVal = this.flatData.pop();
    const substitute: ChildInfo<T> = {
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

      // if both children's data is greater
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

  private children(idx: number): [ChildInfo<T>, ChildInfo<T>] {
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

type ChildInfo<T> = {
  index: number;
  value: T | undefined;
};
