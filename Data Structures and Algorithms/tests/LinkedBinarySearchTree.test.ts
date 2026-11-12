import LinkedBinarySearchTree from "../src/LinkedBinarySearchTree.ts";
import { describe, it } from "node:test";

describe("linked binary search tree", () => {
  it("inserts", () => {
    const tree = new LinkedBinarySearchTree();

    const elems = [5, 7, 2, 8, 6, 3, 1, 9, 4, 0];

    elems.forEach((it) => tree.insert(it));

    // console.debug(root.flattenBroad({}));
    // console.debug(tree);
    // console.debug(JSON.stringify(root));

    const debugString = Bun.YAML.stringify(tree, null, 2);

    console.debug(debugString);

    // Bun.stderr.
    // Bun.write
    // Blob
  });
});
