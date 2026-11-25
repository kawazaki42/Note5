import { describe, expect, it, test } from "bun:test";
import { BTree4, BTree4Node } from "../src/BTree.ts";

describe("2-3-4-tree", () => {
  it("inserts", () => {
    const tree = new BTree4();

    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((it) => tree.insert(it));

    console.debug(tree.toYaml());
  });

  test("node split algorithm", () => {
    const node = new BTree4Node([1, 2, 3], [null, null, null, null]);

    // console.debug(node.split());
    // expect(node.split()).toMatchObject({
    //   data: [2],
    //   children: [
    //     {
    //       data: [1],
    //       children: [null, null],
    //     },
    //     {
    //       data: [2],
    //       children: [null, null],
    //     },
    //   ],
    // });

    const result = node.split();

    expect(result).not.toBeNil();

    const [center, left, right] = result!;

    expect(center).toBe(2);

    expect(left).toMatchObject({
      data: [1],
      children: [null, null],
    });

    expect(right).toMatchObject({
      data: [3],
      children: [null, null],
    });

    // expect(result?.data).toHaveProperty("data", [2]);
  });
});
