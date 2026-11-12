import { LinkedBinaryTreeNode } from "../src/LinkedBinaryTree.ts";
import type { DeepTraverseOptions } from "../src/BinaryTree.ts";
import { describe, it, expect, test } from "bun:test";

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

function irregularTree() {
  return LinkedBinaryTreeNode.fromRecursiveArray([
    "F",
    ["B", ["A"], ["D", ["C"], ["E"]]],
    ["G", undefined, ["I", ["H"], undefined]],
  ]);
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
    label: "h-flipped, parent last",
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

describe("linked binary tree", () => {
  describe("deep traverse", () => {
    test.each(deepTests)("$label", ({ label: _, expected, ...options }) => {
      expect(sample().flattenDeep(options)).toEqual(expected);
    });
  });

  describe("broad traverse", () => {
    test.each(broadTests)("$label", ({ expected, ...options }) => {
      expect(irregularTree().flattenBroad(options)).toEqual(expected.split(""));
    });
  });
});
