import BinaryTree from "./BinaryTree.ts";
import LinkedBinaryTree from "./LinkedBinaryTree.ts";

// class BinarySearchTree<T> {
//     private raw: BinaryTree<T>

//     constructor(from: BinaryTree<T>) {
//         this.raw = from
//     }
// }

class LinkedBinarySearchTree<T> extends LinkedBinaryTree<T> {
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

    search(elem: T, _acc = 0): number {
        if (elem < this.data) {
            return this.left?.search(elem, _acc + 1) ?? -1;
        }
        
        if (elem > this.data) {
            return this.right?.search(elem, _acc + 1) ?? -1;
        }

        return _acc;
    }
}
