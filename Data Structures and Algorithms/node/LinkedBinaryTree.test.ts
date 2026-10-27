import LinkedBinaryTree from "./LinkedBinaryTree.ts";
import { DeepTraverseOptions } from "./BinaryTree.ts";
import { assertEquals } from "@std/assert";

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

const deepTests: (DeepTraverseOptions & {label: string, expected: number[]})[] = [
    {
        label: 'direct',
        expected: [1, 2, 4, 5, 3, 6, 7],
    },
    {
        label: 'reverse',
        putParentAt: 2,
        expected: [4, 5, 2, 6, 7, 3, 1],
    },
    {
        label: 'right direct',
        inverseHorizontal: true,
        expected: [1, 3, 7, 6, 2, 5, 4],
    },
    {
        label: 'right reverse',
        inverseHorizontal: true,
        putParentAt: 2,
        expected: [7, 6, 3, 5, 4, 2, 1],
    },
    {
        label: 'symmetric',
        putParentAt: 1,
        expected: [4, 2, 5, 1, 6, 3, 7],
    },
    {
        label: 'symmetric right',
        inverseHorizontal: true,
        putParentAt: 1,
        expected: [7, 3, 6, 1, 5, 2, 4],
    },
];

Deno.test.each(deepTests)(
    "deep traverse ($label)",
    ({ label: _, expected, ...options }) => {
        assertEquals(sample().flattenDeep(options), expected);
});

function irregularTree() {
    return LinkedBinaryTree.fromRecursiveArray([
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
        ]);
}

const broadTests = [
    {
        expected: 'FBGADICEH',
        label: 'direct',
    },
    {
        inverseHorizontal: true,
        label: 'h-flip',
        expected: 'FGBIDAHEC',
    },
    {
        inverseVertical: true,
        label: 'v-flip',
        expected: 'CEHADIBGF',
    },
    {
        inverseHorizontal: true,
        inverseVertical: true,
        label: 'hv-flip',
        expected: 'HECIDAGBF'
    }
];

Deno.test.each(broadTests)('broad traverse: unusual tree ($label)', ({expected, ...options}) => {
    assertEquals(irregularTree().flattenBroad(options), expected.split(''));
});
