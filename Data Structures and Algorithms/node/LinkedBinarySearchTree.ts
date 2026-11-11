// import { assert } from "node:console";
import BinaryTree from "./BinaryTree.ts";
import LinkedBinaryTree, { LinkedBinaryTreeNode } from "./LinkedBinaryTree.ts";

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

export default class LinkedBinarySearchTree<T> extends LinkedBinaryTree<T> {
    // insert() {

    // }

    // override left?: LinkedBinarySearchTree<T> = undefined;
    // override right?: LinkedBinarySearchTree<T> = undefined;

    insert(elem: T) {
        // if (elem <= this.data) {
        //     if (this.left) {
        //         this.left.insert(elem);
        //     } else {
        //         this.left = new LinkedBinarySearchTree(elem);
        //     }
        // } else {
        //     if (this.right) {
        //         this.right.insert(elem);
        //     } else {
        //         this.right = new LinkedBinarySearchTree(elem);
        //     }
        // }

        const newNode = new LinkedBinaryTreeNode(elem);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        let cursor = this.root;

        while (true) {
            if (elem <= cursor.data) {
                if (!cursor.left) {
                    cursor.left = newNode;
                    return;
                }

                cursor = cursor.left;
            } else {
                if (!cursor.right) {
                    cursor.right = newNode;
                    return;
                }

                cursor = cursor.right;
            }
        }
    }

    // search(elem: T, _acc: Path = []): Path | null {
    //     // assert();

    //     if (elem < this.data) {
    //         _acc.push(0);
    //         // return this.left?.search(elem, _acc + 1) ?? -1;
    //         return this.left?.search(elem, _acc) ?? null;
    //     } else if (elem > this.data) {
    //         // return this.right?.search(elem, _acc + 1) ?? -1;
    //         _acc.push(1);
    //         return this.right?.search(elem, _acc) ?? null;
    //     }

    //     return _acc;
    // }

    search(elem: T): Path | null {
        const path: (0 | 1)[] = [];

        if (!this.root)
            return null;

        let cursor = this.root;

        while (elem !== cursor.data) {
            // if (elem === cursor.data) {
            //     return path;
            // }

            if (elem < cursor.data) {
                path.push(0);

                if (!cursor.left)
                    return null;

                cursor = cursor.left;
            }
            
            if (elem > cursor.data) {
                path.push(1);

                if (!cursor.right)
                    return null;

                cursor = cursor.right;
            }
        }

        return path;
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

    private static appendRightRecursively<T>(
        root: LinkedBinaryTreeNode<T>,
        newChild: LinkedBinaryTreeNode<T>,
    ): void {
        // if (root.right) {
        //     // return root.right.appendRight(subtree);
        //     return LinkedBinarySearchTree.appendRightRecursively(root.right, subtree);
        //     // this.right?.appendRight
        // } else {
        //     root.right = subtree;
        // }

        // if (!root.right) {
        //     root.right = newChild;
        // } else {
        //     return LinkedBinarySearchTree.appendRightRecursively(root.right, newChild);
        // }

        while (root.right) {
            root = root.right;
        }

        root.right = newChild;
    }

    /**
     * 
     * @param cursor 
     * @param elem 
     * @returns Appropriate replacement for `cursor` (or `null` for deleted value)
     */
    private static recursiveDelete<T>(cursor: LinkedBinaryTreeNode<T>, elem: T): LinkedBinaryTreeNode<T> | null {
        if (elem < cursor.data) {
            if (cursor.left)
                cursor.left = LinkedBinarySearchTree.recursiveDelete(cursor.left, elem);

            return cursor;
        } else if (elem > cursor.data) {
            if (cursor.right)
                cursor.right = LinkedBinarySearchTree.recursiveDelete(cursor.right, elem);

            return cursor;
        }

        // if (elem === cursor.data) {
        if (!cursor.left)
            return cursor.right;

        if (!cursor.right)
            return cursor.left;

        const newRoot = cursor.left;

        // newRoot.appendRight(cursor.right);

        LinkedBinarySearchTree.appendRightRecursively(newRoot, cursor.right);

        return newRoot;
        // }
    }

    delete(elem: T): LinkedBinaryTreeNode<T> | null {
        if (!this.root)
            return null;

        return LinkedBinarySearchTree.recursiveDelete(this.root, elem);
    }

    // delete(elem: T): LinkedBinaryTreeNode<T> | null {
    //     let cursor = this.root;

    //     if (!cursor)
    //         return null;

    //     // if (elem < cursor.data) {
    //     //     if (cursor.left && cursor.left > )
    //     // }

    //     let result;

    //     while (true) {
    //         if (elem < cursor.data) {
    //             if (!cursor.left)
    //                 return null;

    //             if (elem === cursor.left) {
    //                 cursor.left = null;
    //             }

    //             cursor = cursor.left;
    //         }
            
    //         if (elem > cursor.data) {
    //             if (!cursor.right)
    //                 return null;
                
    //             if (elem === cursor.right) {
    //                 cursor.right = null;
    //                 return true;
    //             }

    //             cursor = cursor.right;
    //         }
    //     }
    // }
}
