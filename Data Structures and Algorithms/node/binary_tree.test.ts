import { LinkedBinaryTree, Direction, DeepTraverseOrder } from "./binary_tree.ts";
import { assertEquals } from "@std/assert"

function sample() {
    const root = new LinkedBinaryTree(1);

    root.left = new LinkedBinaryTree(2);
    root.right = new LinkedBinaryTree(3);

    root.left.left = new LinkedBinaryTree(4);
    root.left.right = new LinkedBinaryTree(5);

    root.right.left = new LinkedBinaryTree(6);
    root.right.right = new LinkedBinaryTree(7);

    return root;
}

const { center, left, right } = Direction;

Deno.test.each([
    {
        order: [center, left, right],
        label: 'direct',
        expected: [1, 2, 4, 5, 3, 6, 7],
    },
    {
        order: [left, right, center],
        label: 'reverse',
        expected: [4, 5, 2, 6, 7, 3, 1],
    },
] as {
    order: DeepTraverseOrder,
    label: string,
    expected: number[]
}[])("deep traverse ($label)", ({ order, expected }) => {
    // const items: number[] = [];
    // const expectedCopy = expected;

    // sample().traverseDeep({
    //     order,
    //     action: it => items.push(it),
    // });

    assertEquals(sample().flattenDeep(order), expected);
});

// Deno.test({
//     name: "deep traverse (root first)",
//     fn() {
//         const result: number[] = [];
//         sample().traverseDeep({
//             action: it => result.push(it),
//         });

//         assertEquals(result, [1, 2, 4, 5, 3, 6, 7]);
//     }
// });

// Deno.test({
//     name: "deep traverse (children first)",
//     fn() {
//         const { center, left, right } = Direction;

//         const result: number[] = [];
//         sample().traverseDeep({
//             order: [left, right, center],
//             action: it => result.push(it),
//         });

//         assertEquals(result, [4, 5, 2, 6, 7, 3, 1]);
//     }
// });
