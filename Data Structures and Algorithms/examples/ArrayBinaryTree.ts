import ArrayBinaryTree from "../src/ArrayBinaryTree";

const tree = new ArrayBinaryTree();

const result = [4, 2, 1, 3, 6, 5, 7, 8, 9].forEach(it => tree.insert(it));

// console.log(tree.flatData);

showLayered(tree);

tree.delete(6);

showLayered(tree);

function showLayered<T>(tree: ArrayBinaryTree<T>): void {
  let take = 1;
  const todo = tree.flatData.slice();

  while (true) {
    const level = todo.splice(0, take)
    console.log(level);

    if (level.every(it => it === undefined))
      break;

    take *= 2;
  }
}
