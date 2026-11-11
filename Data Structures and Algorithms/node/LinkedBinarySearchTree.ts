// import { assert } from "node:console";
import BinaryTree from "./BinaryTree.ts";
import { LinkedBinaryTreeNode } from "./LinkedBinaryTree.ts";

// class BinarySearchTree<T> {
//     private raw: BinaryTree<T>

//     constructor(from: BinaryTree<T>) {
//         this.raw = from
//     }
// }

export type Path = (0 | 1)[];

// export type OperationData = {
//     path: Path,
// } | null;

export default class LinkedBinarySearchTree<T> extends LinkedBinaryTreeNode<T> {
    // insert() {

    // }

    override left?: LinkedBinarySearchTree<T> = undefined;
    override right?: LinkedBinarySearchTree<T> = undefined;

    insert(elem: T) {
        if (elem <= this.data) {
            if (this.left) {
                this.left.insert(elem);
            } else {
                this.left = new LinkedBinarySearchTree(elem);
            }
        } else {
            if (this.right) {
                this.right.insert(elem);
            } else {
                this.right = new LinkedBinarySearchTree(elem);
            }
        }
    }

    search(elem: T, _acc: Path = []): Path | null {
        // assert();

        if (elem < this.data) {
            _acc.push(0);
            // return this.left?.search(elem, _acc + 1) ?? -1;
            return this.left?.search(elem, _acc) ?? null;
        } else if (elem > this.data) {
            // return this.right?.search(elem, _acc + 1) ?? -1;
            _acc.push(1);
            return this.right?.search(elem, _acc) ?? null;
        }

        return _acc;
    }
    
    // delete(elem: T, _acc: Path = []): Path | null {
    //     if (elem === this.data) {

    //     }

    //     if (elem < this.data) {
    //         _acc.push(0);
    //         return this.left?.delete(elem) ?? null;
    //     } else if (elem > this.data) {
    //         _acc.push(1);
    //         return this.right?.delete(elem) ?? null;
    //     }

    //     return _acc;
    // }

    private appendRight(subtree: LinkedBinarySearchTree<T>): void {
        if (this.right) {
            return this.right.appendRight(subtree);
            // this.right?.appendRight
        } else {
            this.right = subtree;
        }
    }

    delete(elem: T): LinkedBinarySearchTree<T> | null {
        if (elem < this.data) {
            if (this.left)
                this.left = this.left.delete(elem) ?? undefined;

            return this;
        } else if (elem > this.data) {
            if (this.right)
                this.right = this.right.delete(elem) ?? undefined;

            return this;
        }

        // if (elem === this.data) {
        if (!this.left)
            return this.right ?? null;

        if (!this.right)
            return this.left ?? null;

        const newRoot = this.left;

        newRoot.appendRight(this.right);

        return newRoot;
        // }
    }
}
