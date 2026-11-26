import BinaryTree from "./BinaryTree.ts";
// import type { Action, DeepTraverseOptions } from "./BinaryTree.ts";

type RecursiveArray<T> =
  [T, RecursiveArray<T> | undefined, RecursiveArray<T> | undefined] | [T];

type Repr<T> = {
  data: T;
  left?: Repr<T>;
  right?: Repr<T>;
};

type DeepTraverseOptions = {
  horizontal?: false;
  flipHorizontal?: boolean;
  putParentAt?: 0 | 1 | 2;
};

type BroadTraverseOptions = {
  horizontal: true;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
};

export type TraverseOptions = DeepTraverseOptions | BroadTraverseOptions;

export default class LinkedBinaryTree<T> {
  public root: LinkedBinaryTreeNode<T> | null = null;

  // override flattenBroad(options: {
  //   inverseHorizontal?: boolean;
  //   inverseVertical?: boolean;
  // }): T[] {
  //   return this.root?.flattenBroad(options) ?? [];
  // }

  // override flattenDeep(options: DeepTraverseOptions): T[] {
  //   return this.root?.flattenDeep(options) ?? [];
  // }

  *elements(options: TraverseOptions): IteratorObject<T> {
    if (!this.root) return;

    yield* this.root.elements(options);
  }

  // override traverseBroad(options: {
  //   action: Action<T>;
  //   inverseHorizontal: boolean;
  //   inverseVertical: boolean;
  // }): void {
  //   return this.root?.traverseBroad(options);
  // }

  // override traverseDeep(
  //   options: DeepTraverseOptions & { action: Action<T> },
  // ): void {
  //   return this.root?.traverseDeep(options);
  // }

  repr(): Repr<T> | string {
    return this.root?.repr() ?? "empty";
  }
}

export class LinkedBinaryTreeNode<T> {
  data: T;
  left: LinkedBinaryTreeNode<T> | null = null;
  right: LinkedBinaryTreeNode<T> | null = null;

  constructor(
    data: T,
    left?: LinkedBinaryTreeNode<T>,
    right?: LinkedBinaryTreeNode<T>,
  ) {
    // super();

    this.data = data;
    this.left = left ?? null;
    this.right = right ?? null;
  }

  elements(options: TraverseOptions): IteratorObject<T> {
    return this.nodes(options).map((node) => node.data);
  }

  nodes(options: TraverseOptions): Generator<LinkedBinaryTreeNode<T>> {
    if (options.horizontal) return this.traverseBroad(options);
    else return this.traverseDeep(options);
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

  *traverseDeep({
    flipHorizontal,
    putParentAt,
    // action,
  }: DeepTraverseOptions): Generator<LinkedBinaryTreeNode<T>> {
    const subtrees = [this.left, this.right];

    if (flipHorizontal) subtrees.reverse();

    // insert
    subtrees.splice(putParentAt ?? 0, 0, this);

    for (const sub of subtrees) {
      if (sub === this) {
        // action(this.data);
        yield this;
        continue;
      }

      // sub?.traverseDeep({ action, flipHorizontal, putParentAt });
      yield* sub?.traverseDeep({ flipHorizontal, putParentAt }) ?? [];
    }
  }

  // flattenBroad({
  //   inverseHorizontal,
  //   inverseVertical,
  // }: {
  //   inverseHorizontal?: boolean;
  //   inverseVertical?: boolean;
  // }): T[] {
  //   if (inverseVertical) {
  //     return this.flattenBroad({
  //       inverseHorizontal: !inverseHorizontal,
  //     }).reverse();
  //   } else {
  //     return super.flattenBroad({ inverseVertical, inverseHorizontal });
  //   }
  // }

  *traverseBroad({
    // action,
    flipHorizontal = false,
    flipVertical = false,
  }: {
    // action: Action<T>;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
  }): Generator<LinkedBinaryTreeNode<T>> {
    if (flipVertical) {
      // O(n) space algorithm
      // return this.flattenBroad({ inverseVertical }).forEach(action);
      yield* this.traverseBroad({
        flipVertical: false,
        flipHorizontal: !flipHorizontal,
      })
        .toArray()
        .reverse();
      return;
    }

    let order: LinkedBinaryTreeNode<T>[] = [this];
    let more: LinkedBinaryTreeNode<T>[] = [];

    while (order.length !== 0) {
      // console.log(order.map(it => it.data));

      for (const node of order) {
        const children = flipHorizontal
          ? [node.right, node.left]
          : [node.left, node.right];

        children.forEach((it) => (it ? more.push(it) : void 0));

        // action(node.data);
        yield node;
      }

      order = more;
      more = [];
    }
  }

  /**
   * Helper for serialization e.g. YAML
   */
  repr(): Repr<T> {
    const result: Repr<T> = {
      data: this.data,
    };

    if (this.left) result.left = this.left.repr();

    if (this.right) result.right = this.right.repr();

    return result;
  }
}
