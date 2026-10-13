import BinaryTree, { Action, DeepTraverseOptions } from "./BinaryTree.ts";

type RecursiveArray<T> = [
    T,
    RecursiveArray<T> | undefined,
    RecursiveArray<T> | undefined,
] | [T];

export default class LinkedBinaryTree<T> extends BinaryTree<T> {
    data: T;
    left?: LinkedBinaryTree<T>;
    right?: LinkedBinaryTree<T>;

    constructor(
        data: T,
        left?: LinkedBinaryTree<T>,
        right?: LinkedBinaryTree<T>,
    ) {
        super();

        this.data = data;
        this.left = left;
        this.right = right;
    }

    static fromRecursiveArray<T>([data, left, right]: RecursiveArray<T>): LinkedBinaryTree<T> {
        const left_ = left ? LinkedBinaryTree.fromRecursiveArray(left) : undefined;
        const right_ = right ? LinkedBinaryTree.fromRecursiveArray(right) : undefined;
        return new LinkedBinaryTree(data, left_, right_);
    }

    override traverseDeep({
        inverseHorizontal,
        putParentAt,
        action,
    }: DeepTraverseOptions & {
        action: Action<T>,
    }): void {
        const subtrees = [this.left, this.right];

        if (inverseHorizontal)
            subtrees.reverse();

        subtrees.splice(putParentAt ?? 0, 0, this);

        for (const sub of subtrees) {
            if (sub === this) {
                action(this.data);
                continue;
            }

            sub?.traverseDeep({ action, inverseHorizontal, putParentAt });
        }
    }

    override flattenBroad({ inverseHorizontal, inverseVertical, }: { inverseHorizontal?: boolean; inverseVertical?: boolean; }): T[] {
        if (inverseVertical) {
            return this.flattenBroad({ inverseHorizontal: !inverseHorizontal }).reverse();
        } else {
            return super.flattenBroad({ inverseVertical, inverseHorizontal });
        }
    }

    override traverseBroad({
        action,
        inverseHorizontal = false,
        inverseVertical = false,
    }: {
        action: Action<T>,
        inverseHorizontal: boolean,
        inverseVertical: boolean,
    }): void {
        if (inverseVertical) {
            // O(n) space algorithm
            return this
                .flattenBroad({ inverseVertical })
                .forEach(action);
        }

        let order: LinkedBinaryTree<T>[] = [this];
        let more: LinkedBinaryTree<T>[] = [];

        while (order.length) {
            // console.log(order.map(it => it.data));

            for (const node of order) {
                const children = inverseHorizontal
                    ? [node.right, node.left]
                    : [node.left, node.right];

                children.forEach(it => it ? more.push(it) : undefined);

                action(node.data);
            }

            order = more;
            more = [];
        }
    }
}
