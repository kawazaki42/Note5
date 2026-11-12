import test, { describe, it } from "node:test";
import { BTree4 } from "./BTree.ts";

describe("2-3-4-tree", () => {
  it("inserts", () => {
    const tree = new BTree4();

    [1, 2, 3, 4, 5].forEach((it) => tree.insert(it));

    console.debug(tree);
  });
});
