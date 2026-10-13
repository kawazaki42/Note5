export enum Direction {
    center,
    left,
    right,
}

export type DeepTraverseOrder = [Direction, Direction, Direction];

// const DEFAULT_ORDER: DeepTraverseOrder = [
//     Direction.center,
//     Direction.left,
//     Direction.right,
// ];

export interface DeepTraverseOptions {
    inverseHorizontal?: boolean,
    putParentAt?: 0 | 1 | 2,
}

abstract class BinaryTree<T> {
    // abstract traverseDeep(options: {
    //     order: DeepTraverseOrder,
    //     action: Action<T>,
    // }): void;

    abstract traverseDeep(
        options: DeepTraverseOptions & {
            action: Action<T>,
    }): void;

    abstract traverseBroad(options: {
        action: Action<T>,
        inverseHorizontal: boolean,
        inverseVertical: boolean,
    }): void;

    // flattenDeep(order: DeepTraverseOrder = DEFAULT_ORDER): T[] {
    flattenDeep(options: DeepTraverseOptions): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        // this.traverseDeep({ order, action });
        this.traverseDeep({ ...options, action });
        return result;
    }

    flattenBroad({
        inverseHorizontal = false,
        inverseVertical = false,
    }: {
        inverseHorizontal?: boolean,
        inverseVertical?: boolean,
    }): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        this.traverseBroad({ action, inverseHorizontal, inverseVertical });
        return result
    }
}

type Action<T> = (element: T) => void;

type RecursiveArray<T> = [
    T,
    RecursiveArray<T> | undefined,
    RecursiveArray<T> | undefined,
] | [T];

export class LinkedBinaryTree<T> extends BinaryTree<T> {
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

    // override traverseDeep({order = DEFAULT_ORDER, action}: {
    //     order?: DeepTraverseOrder,
    //     action: Action<T>,
    // }): void {
    override traverseDeep({
        inverseHorizontal,
        putParentAt,
        action,
    }: DeepTraverseOptions & {
        action: Action<T>,
    }): void {
        const order = [Direction.left, Direction.right];

        if (inverseHorizontal)
            order.reverse();

        order.splice(putParentAt ?? 0, 0, Direction.center);

        for (const d of order) {
            let subtree: LinkedBinaryTree<T> | undefined;
            switch (d) {
                case Direction.center:
                    action(this.data);
                    break;
                case Direction.left:
                    subtree = this.left;
                    break;
                case Direction.right:
                    subtree = this.right;
                    break;
            }
            subtree?.traverseDeep({ action, inverseHorizontal, putParentAt });
        }
    }

    private traverseBroadHeadless(
        action: Action<T>,
        inverseHorizontal: boolean,
    ) {
        const subtrees = inverseHorizontal
            ? [this.right, this.left]
            : [this.left, this.right];

        // Subtree roots (heads) first
        subtrees.forEach(it => it ? action(it.data) : undefined);

        // Next, subtrees' subtrees
        subtrees.forEach(it => {
            it?.traverseBroadHeadless(action, inverseHorizontal)
        });
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

            // const inverseHorizontal: boolean = !inverseHorizontal;
            // this
            //     .flattenBroad({
            //         inverseHorizontal: !inverseHorizontal,
            //     })
            //     .reverse()
            return this
                .flattenBroad({ inverseVertical })
                .forEach(action);
        }

        // // Global root (head)
        // action(this.data);

        // this.traverseBroadHeadless(action, inverseHorizontal);

        let order: LinkedBinaryTree<T>[] = [this];
        let more: LinkedBinaryTree<T>[] = [];

        // const next = order.shift();
        // if (next)
        //     action(next.data);

        while (order.length) {
            // console.log(order.map(it => it.data));

            for (const node of order) {
                const children = inverseHorizontal
                    ? [node.right, node.left]
                    : [node.left, node.right];

                children.forEach(it => it ? more.push(it) : undefined);

                // if (node.left)
                //     more.push(node.left);

                // if (node.right)
                //     more.push(node.right);

                action(node.data);
            }

            order = more;
            more = [];

            // const more = [];

            // order.push(...more);
        }

        // let more = [];

        // order.forEach(it => it.left ? order.push(it.left));
    }
}
