import BinaryTree, { Action, DeepTraverseOptions } from "./BinaryTree.ts";

export default class ArrayBinaryTree<T> extends BinaryTree<T> {
    flatData = [];

    static leftChildOf = (index: number) => index * 2 + 1;
    static rightChildOf = (index: number) => index * 2 + 2;

    override traverseDeep({
        inverseHorizontal,
        putParentAt,
        action,
        startAt: index,
    }: DeepTraverseOptions & {
        action: Action<T>,
        startAt: number,
    }) {
        // action(flatindex);

        if (!(index in this.flatData))
            return;

        action(this.flatData[index]);

        const leftChild = ArrayBinaryTree.leftChildOf(index);
        const rightChild = ArrayBinaryTree.rightChildOf(index);

        const order = [leftChild, rightChild];

        if (inverseHorizontal)
            order.reverse();

        order.splice(putParentAt ?? 0, 0, index);

        for (const index of order) {
            this.traverseDeep({
                inverseHorizontal,
                putParentAt,
                startAt: index,
                action,
            });
        }

        // this.traverseDeep(right, action);
    }

    override traverseBroad({
        action,
        inverseHorizontal,
        inverseVertical,
    }: {
        action: Action<T>;
        inverseHorizontal: boolean;
        inverseVertical: boolean;
    }): void {
        
    }

    // override traverseDeep(options: DeepTraverseOptions & {
    //     action: Action<T>
    // }) {
    //     this.traverseDeepFrom(options);
    // }
}
