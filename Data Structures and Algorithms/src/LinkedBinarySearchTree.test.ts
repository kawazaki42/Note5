import LinkedBinarySearchTree from "./LinkedBinarySearchTree.ts"
import { describe, it } from 'node:test';

describe('linked binary search tree', () => {
    it('inserts', () => {
        const root = new LinkedBinarySearchTree();

        const elems = [5, 7, 2, 8, 6, 3, 1, 9, 4, 0];

        elems.forEach(it => root.insert(it));

        // console.debug(root.flattenBroad({}));
        console.debug(root);
        // console.debug(JSON.stringify(root));
    });
});

// Deno.test(
//     'xz che',
//     () => {

//     },
// )
