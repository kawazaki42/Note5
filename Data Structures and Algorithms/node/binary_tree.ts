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

    // flatten(options: {
    //     deep: true,
    //     order: DeepTraverseOrder,
    // } | {
    //     deep: false,
    //     inverseHorizontal: boolean,
    // }): T[] {
    //     const result: T[] = [];
    //     const action = (it: T) => result.push(it);

    //     // switch (options.deep) {
    //     //     case true: {
    //     //         const { order } = options
    //     //     }

    //     // }

    //     // options.deep ??= true;

    //     if (options.deep) {
    //         const { order } = options;
    //         this.traverseDeep({ action, order });
    //     } else {
    //         const { inverseHorizontal } = options;
    //         this.traverseBroad({ action, inverseHorizontal });
    //     }

    //     return result;
    // }
}

type Action<T> = (element: T) => void

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
    }: {
        action: Action<T>,
        inverseHorizontal: boolean,
    }): void {
        // Global root (head)
        action(this.data);

        this.traverseBroadHeadless(action, inverseHorizontal);
    }
}
