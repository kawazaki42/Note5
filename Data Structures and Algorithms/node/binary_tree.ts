export enum Direction {
    center,
    left,
    right,
}

export type DeepTraverseOrder = [Direction, Direction, Direction];

const DEFAULT_ORDER: DeepTraverseOrder = [
    Direction.center,
    Direction.left,
    Direction.right,
]

abstract class BinaryTree<T> {
    abstract traverseDeep(options: {
        order: DeepTraverseOrder,
        action: Action<T>,
    }): void;

    abstract traverseBroad(options: {
        action: Action<T>,
        inverseHorizontal: boolean,
    }): void;

    flattenDeep(order: DeepTraverseOrder = DEFAULT_ORDER): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        this.traverseDeep({ order, action });
        return result;
    }

    flattenBroad(inverseHorizontal: boolean = false): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        this.traverseBroad({ action, inverseHorizontal });
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

    // static fromBredth<T>(array: T[]) {
    //     for (const element of array) {
            
    //     }
    // }

    static fromRecursiveArray<T>([data, left, right]: RecursiveArray<T>): LinkedBinaryTree<T> {
        const left_ = left ? LinkedBinaryTree.fromRecursiveArray(left) : undefined;
        const right_ = right ? LinkedBinaryTree.fromRecursiveArray(right) : undefined;
        return new LinkedBinaryTree(data, left_, right_);
    }

    traverseDeep({order = DEFAULT_ORDER, action}: {
        order?: DeepTraverseOrder,
        action: Action<T>,
    }): void {
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
            subtree?.traverseDeep({ action, order });
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

    traverseBroad({
        action,
        inverseHorizontal = false,
        inverseVertical = false,
    }: {
        action: Action<T>,
        inverseHorizontal: boolean,
        inverseVertical: boolean,
    }): void {
        // if (inverseVertical) {

        // }

        // Global root (head)
        action(this.data);

        this.traverseBroadHeadless(action, inverseHorizontal);
    }
}
