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

    flattenDeep(order: DeepTraverseOrder = DEFAULT_ORDER): T[] {
        const result: T[] = [];
        this.traverseDeep({ order, action: it => result.push(it) });
        return result;
    }
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
}
