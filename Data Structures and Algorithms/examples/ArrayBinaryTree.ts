import ArrayBinarySearchTree from "../src/ArrayBinarySearchTree";

const tree = new ArrayBinarySearchTree();

const result = [4, 2, 1, 3, 6, 5, 7, 8, 9].forEach((it) => tree.insert(it));

// console.log(tree.flatData);

showLayered(tree);
console.log(tree.followPath([]));
console.log(tree.followPath([1, 0]));

tree.delete(6);

showLayered(tree);

function showLayered<T>(tree: ArrayBinarySearchTree<T>): void {
  let take = 1;
  const todo = tree.flatData.slice();

  while (true) {
    const level = todo.splice(0, take);
    console.log(level);

    if (level.every((it) => it === undefined)) break;

    take *= 2;
  }
}
