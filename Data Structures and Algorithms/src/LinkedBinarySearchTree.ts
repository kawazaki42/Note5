import LinkedBinaryTree, { LinkedBinaryTreeNode } from "./LinkedBinaryTree.ts";

export type Path = (0 | 1)[];

export default class LinkedBinarySearchTree<T> extends LinkedBinaryTree<T> {
    insert(elem: T) {
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

    search(elem: T): Path | null {
        const path: (0 | 1)[] = [];

        if (!this.root)
            return null;

        let cursor = this.root;

        while (elem !== cursor.data) {
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
    
    private static appendRightRecursively<T>(
        root: LinkedBinaryTreeNode<T>,
        newChild: LinkedBinaryTreeNode<T>,
    ): void {
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

        // if (elem === cursor.data)

        if (!cursor.left)
            return cursor.right;

        if (!cursor.right)
            return cursor.left;

        const newRoot = cursor.left;

        LinkedBinarySearchTree.appendRightRecursively(newRoot, cursor.right);

        return newRoot;
    }

    // delete(elem: T): LinkedBinaryTreeNode<T> | null {
    delete(elem: T): void {
        if (!this.root)
            return;

        this.root = LinkedBinarySearchTree.recursiveDelete(this.root, elem);
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
