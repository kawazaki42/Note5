import BinaryTree from "./BinaryTree.ts";
import type { Action, DeepTraverseOptions } from "./BinaryTree.ts";

type RecursiveArray<T> =
  [T, RecursiveArray<T> | undefined, RecursiveArray<T> | undefined] | [T];

export default class LinkedBinaryTree<T> extends BinaryTree<T> {
  public root: LinkedBinaryTreeNode<T> | null = null;

  override flattenBroad(options: {
    inverseHorizontal?: boolean;
    inverseVertical?: boolean;
  }): T[] {
    return this.root?.flattenBroad(options) ?? [];
  }

  override flattenDeep(options: DeepTraverseOptions): T[] {
    return this.root?.flattenDeep(options) ?? [];
  }

  override traverseBroad(options: {
    action: Action<T>;
    inverseHorizontal: boolean;
    inverseVertical: boolean;
  }): void {
    return this.root?.traverseBroad(options);
  }

  override traverseDeep(
    options: DeepTraverseOptions & { action: Action<T> },
  ): void {
    return this.root?.traverseDeep(options);
  }
}

export class LinkedBinaryTreeNode<T> extends BinaryTree<T> {
  data: T;
  left: LinkedBinaryTreeNode<T> | null = null;
  right: LinkedBinaryTreeNode<T> | null = null;

  constructor(
    data: T,
    left?: LinkedBinaryTreeNode<T>,
    right?: LinkedBinaryTreeNode<T>,
  ) {
    super();

    this.data = data;
    this.left = left ?? null;
    this.right = right ?? null;
  }

  static fromRecursiveArray<T>([
    data,
    left,
    right,
  ]: RecursiveArray<T>): LinkedBinaryTreeNode<T> {
    const left_ = left
      ? LinkedBinaryTreeNode.fromRecursiveArray(left)
      : undefined;
    const right_ = right
      ? LinkedBinaryTreeNode.fromRecursiveArray(right)
      : undefined;
    return new LinkedBinaryTreeNode(data, left_, right_);
  }

  override traverseDeep({
    inverseHorizontal,
    putParentAt,
    action,
  }: DeepTraverseOptions & {
    action: Action<T>;
  }): void {
    const subtrees = [this.left, this.right];

    if (inverseHorizontal) subtrees.reverse();

    subtrees.splice(putParentAt ?? 0, 0, this);

    for (const sub of subtrees) {
      if (sub === this) {
        action(this.data);
        continue;
      }

      sub?.traverseDeep({ action, inverseHorizontal, putParentAt });
    }
  }

  override flattenBroad({
    inverseHorizontal,
    inverseVertical,
  }: {
    inverseHorizontal?: boolean;
    inverseVertical?: boolean;
  }): T[] {
    if (inverseVertical) {
      return this.flattenBroad({
        inverseHorizontal: !inverseHorizontal,
      }).reverse();
    } else {
      return super.flattenBroad({ inverseVertical, inverseHorizontal });
    }
  }

  override traverseBroad({
    action,
    inverseHorizontal = false,
    inverseVertical = false,
  }: {
    action: Action<T>;
    inverseHorizontal: boolean;
    inverseVertical: boolean;
  }): void {
    if (inverseVertical) {
      // O(n) space algorithm
      return this.flattenBroad({ inverseVertical }).forEach(action);
    }

    let order: LinkedBinaryTreeNode<T>[] = [this];
    let more: LinkedBinaryTreeNode<T>[] = [];

    while (order.length) {
      // console.log(order.map(it => it.data));

      for (const node of order) {
        const children = inverseHorizontal
          ? [node.right, node.left]
          : [node.left, node.right];

        children.forEach((it) => (it ? more.push(it) : undefined));

        action(node.data);
      }

      order = more;
      more = [];
    }
  }
}
