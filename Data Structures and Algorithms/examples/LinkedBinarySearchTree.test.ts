import LinkedBinarySearchTree from "../src/LinkedBinarySearchTree.ts";
import { describe, it, expect } from "bun:test";

function sample(): LinkedBinarySearchTree<number> {
  const tree = new LinkedBinarySearchTree<number>();

  const elems = [5, 7, 2, 8, 6, 3, 1, 9, 4, 0];

  elems.forEach((it) => tree.insert(it));

  return tree;
}

function dumpYaml<T>(tree: LinkedBinarySearchTree<T>): void {
  const debugString = Bun.YAML.stringify(tree.repr(), null, 2);

  console.debug(debugString);
}

describe("linked binary search tree", () => {
  it("inserts", () => {
    // expect(sample).not.toThrow();

    const tree = sample();

    // console.debug(root.flattenBroad({}));
    // console.debug(tree);
    // console.debug(JSON.stringify(root));

    dumpYaml(tree);

    // Bun.stderr.
    // Bun.write
    // Blob
  });

  it("deletes", () => {
    const tree = sample();

    tree.delete(5);

    dumpYaml(tree);
  });

  it("searches", () => {
    const tree = sample();

    console.debug(tree.search(3));
  });
});
