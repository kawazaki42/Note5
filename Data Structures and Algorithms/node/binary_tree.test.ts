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

const deepTests: {
    label: string,
    order: DeepTraverseOrder,
    expected: number[]
}[] = [
    {
        label: 'direct',
        order: [center, left, right],
        expected: [1, 2, 4, 5, 3, 6, 7],
    },
    {
        label: 'reverse',
        order: [left, right, center],
        expected: [4, 5, 2, 6, 7, 3, 1],
    },
    {
        label: 'right direct',
        order: [center, right, left],
        expected: [1, 3, 7, 6, 2, 5, 4],
    },
    {
        label: 'right reverse',
        order: [right, left, center],
        expected: [7, 6, 3, 5, 4, 2, 1],
    },
    {
        label: 'symmetric',
        order: [left, center, right],
        expected: [4, 2, 5, 1, 6, 3, 7],
    },
    {
        label: 'symmetric right',
        order: [right, center, left],
        expected: [7, 3, 6, 1, 5, 2, 4],
    },
]

Deno.test.each(deepTests)(
    "deep traverse ($label)",
    ({ order, expected }) => {
        assertEquals(sample().flattenDeep(order), expected);
});

Deno.test({
    name: "broad traverse",
    fn() {
        assertEquals(sample().flattenBroad(), [1, 2, 3, 4, 5, 6, 7])
    },
});

Deno.test({
    name: "broad traverse right",
    fn() {
        assertEquals(sample().flattenBroad(true), [1, 3, 2, 7, 6, 5, 4])
    },
});

function modifiedSample() {
    const result = sample();
    result.left!.right!.left = new LinkedBinaryTree(8);
    return result;
}

// function anotherSample() {

// }

Deno.test({
    name: 'broad traverse: unusual tree',
    fn() {
        // console.log(modifiedSample().flattenBroad());
        const result = LinkedBinaryTree.fromRecursiveArray([
            'F',
            ['B',
                ['A'],
                ['D',
                    ['C'],
                    ['E']]],
            ['G',
                undefined,
                ['I',
                    ['H'],
                    undefined]],
        ]).flattenBroad();

        assertEquals(result, 'FBGADICEH'.split(''));
        // console.log(result);
    },
})
