import test, { describe, it } from "node:test";
import { BTree4, BTree4Node } from "../src/BTree.ts";

describe("2-3-4-tree", () => {
  it("inserts", () => {
    const tree = new BTree4();

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((it) => tree.insert(it));

    console.debug(tree.toYaml());
  });

  describe("node split algorithm", () => {
    const node = new BTree4Node([1, 2, 3], [null, null, null, null]);

    console.debug(node.split());
  });
});
