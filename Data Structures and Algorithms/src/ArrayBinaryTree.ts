import BinaryTree from "./BinaryTree.ts";
import type { Action, DeepTraverseOptions } from "./BinaryTree.ts";

export default class ArrayBinaryTree<T> {
  flatData: T[] = [];

  static leftChildOf = (index: number) => index * 2 + 1;
  static rightChildOf = (index: number) => index * 2 + 2;

  insert(element: T): void {
    let index = 0;

    while (true) {
      const other = this.flatData[index];

      if (other === undefined || other === null) {
        this.flatData[index] = element;
        return;
      }

      if (element < other)
        index = ArrayBinaryTree.leftChildOf(index);
      else
        index = ArrayBinaryTree.rightChildOf(index);
    }
  }
}
