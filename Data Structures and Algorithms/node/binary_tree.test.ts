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
    {
        order: [center, right, left],
        label: 'right direct',
        expected: [1, 3, 7, 6, 2, 5, 4],
    },
    {
        order: [right, left, center],
        label: 'right reverse',
        expected: [7, 6, 3, 5, 4, 2, 1],
    },
    {
        order: [left, center, right],
        label: 'symmetric',
        expected: [4, 2, 5, 1, 6, 3, 7],
    },
    {
        order: [right, center, left],
        label: 'symmetric right',
        expected: [7, 3, 6, 1, 5, 2, 4],
    },
] as {
    order: DeepTraverseOrder,
    label: string,
    expected: number[]
}[])("deep traverse ($label)", ({ order, expected }) => {
    assertEquals(sample().flattenDeep(order), expected);
});
