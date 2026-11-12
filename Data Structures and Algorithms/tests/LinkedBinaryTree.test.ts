import { LinkedBinaryTreeNode } from "../src/LinkedBinaryTree.ts";
import type { DeepTraverseOptions } from "../src/BinaryTree.ts";
// import { assertEquals } from "@std/assert";
import { describe, it, expect } from "bun:test";

function sample() {
  const root = new LinkedBinaryTreeNode(1);

  root.left = new LinkedBinaryTreeNode(2);
  root.right = new LinkedBinaryTreeNode(3);

  root.left.left = new LinkedBinaryTreeNode(4);
  root.left.right = new LinkedBinaryTreeNode(5);

  root.right.left = new LinkedBinaryTreeNode(6);
  root.right.right = new LinkedBinaryTreeNode(7);

  return root;
}

const deepTests: (DeepTraverseOptions & {
  label: string;
  expected: number[];
})[] = [
  {
    label: "direct",
    expected: [1, 2, 4, 5, 3, 6, 7],
  },
  {
    label: "parent-last",
    putParentAt: 2,
    expected: [4, 5, 2, 6, 7, 3, 1],
  },
  {
    label: "h-flipped",
    inverseHorizontal: true,
    expected: [1, 3, 7, 6, 2, 5, 4],
  },
  {
    label: "h-filpped, parent last",
    inverseHorizontal: true,
    putParentAt: 2,
    expected: [7, 6, 3, 5, 4, 2, 1],
  },
  {
    label: "symmetric",
    putParentAt: 1,
    expected: [4, 2, 5, 1, 6, 3, 7],
  },
  {
    label: "symmetric h-flipped",
    inverseHorizontal: true,
    putParentAt: 1,
    expected: [7, 3, 6, 1, 5, 2, 4],
  },
];

describe("linked binary tree", () => {
  it.each(deepTests)(
    "does deep traverse: $label",
    ({ label: _, expected, ...options }) => {
      // assert(sample().flattenDeep(options), expected);
      expect(sample().flattenDeep(options)).toEqual(expected);
    },
  );

  it.each(broadTests)(
    "does broad traverse: $label",
    ({ expected, ...options }) => {
      expect(irregularTree().flattenBroad(options)).toEqual(expected.split(""));
    },
  );
});

// Deno.test.each(deepTests)(
//     "deep traverse ($label)",
//     ({ label: _, expected, ...options }) => {
//         assertEquals(sample().flattenDeep(options), expected);
// });

function irregularTree() {
  return LinkedBinaryTreeNode.fromRecursiveArray([
    "F",
    ["B", ["A"], ["D", ["C"], ["E"]]],
    ["G", undefined, ["I", ["H"], undefined]],
  ]);
}

const broadTests = [
  {
    expected: "FBGADICEH",
    label: "direct",
  },
  {
    inverseHorizontal: true,
    label: "h-flipped",
    expected: "FGBIDAHEC",
  },
  {
    inverseVertical: true,
    label: "v-flipped",
    expected: "CEHADIBGF",
  },
  {
    inverseHorizontal: true,
    inverseVertical: true,
    label: "hv-flipped",
    expected: "HECIDAGBF",
  },
];

// Deno.test.each(broadTests)('broad traverse: unusual tree ($label)', ({expected, ...options}) => {
//     assertEquals(irregularTree().flattenBroad(options), expected.split(''));
// });
