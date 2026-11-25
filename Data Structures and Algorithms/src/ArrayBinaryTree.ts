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

  delete(element: T): void {
    // let index = 0;
    
    const index = this.flatData.indexOf(element);
    
    if (index === -1)
      return;

    const result = new ArrayBinaryTree<T>();

    result.flatData = this.flatData.slice(0, index);

    for (let i = index + 1; i < this.flatData.length; i++) {
      const item = this.flatData[i];
      if (item !== undefined)
        result.insert(item);
    }

    this.flatData = result.flatData;

    // while (true) {
    //   const other = this.flatData[index];

    //   // if (other === undefined || other === null) {
    //   //   continue;
    //   // }

    //   // if (other === element) {
    //   //   delete this.flatData[index];
    //   //   return;
    //   // } else {

    //   // }

    //   if (element < other)
    //     index = ArrayBinaryTree.leftChildOf(index);
    //   else
    //     index = ArrayBinaryTree.rightChildOf(index);
    // }
  }
}
