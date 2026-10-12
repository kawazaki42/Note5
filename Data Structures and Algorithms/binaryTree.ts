enum Direction {
    center,
    left,
    right,
}

interface BinaryTree<T> {
    traverseDeep(
        action: (element: T) => void,
        order: [Direction, Direction, Direction],
    ): void;
}

class LinkedBinaryTree<T> implements BinaryTree<T> {
    data: T;
    left?: LinkedBinaryTree<T>;
    right?: LinkedBinaryTree<T>;

    constructor(
        data: T,
        left?: LinkedBinaryTree<T>,
        right?: LinkedBinaryTree<T>,
    ) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

    // static fromBredth<T>(array: T[]) {
    //     for (const element of array) {
            
    //     }
    // }

    traverseDeep(
        action: (element: T) => void,
        order = [Direction.left, Direction.center, Direction.right],
    ): void {
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
            subtree?.traverseDeep(action, order);
        }
    }
}

const root = new LinkedBinaryTree(1);

root.left = new LinkedBinaryTree(2);
root.right = new LinkedBinaryTree(3);

root.left.left = new LinkedBinaryTree(4);
root.left.right = new LinkedBinaryTree(5);

root.right.left = new LinkedBinaryTree(6);
root.right.right = new LinkedBinaryTree(7);

const result: number[] = [];

root.traverseDeep(it => result.push(it));
// root.traverseDeep(console.log);

console.log(result);
