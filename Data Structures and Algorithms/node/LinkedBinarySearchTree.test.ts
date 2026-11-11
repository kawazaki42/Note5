import LinkedBinarySearchTree from "./LinkedBinarySearchTree.ts"

Deno.test(
    'xz che',
    () => {
        const root = new LinkedBinarySearchTree();

        const elems = [5, 7, 2, 8, 6, 3, 1, 9, 4, 0];

        elems.forEach(it => root.insert(it));

        // console.debug(root.flattenBroad({}));
        console.debug(root);
        // console.debug(JSON.stringify(root));
    },
)
