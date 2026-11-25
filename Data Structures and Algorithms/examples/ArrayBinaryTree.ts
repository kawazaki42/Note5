import ArrayBinarySearchTree from "../src/ArrayBinarySearchTree";
import { layers } from "../src/ArrayTree";

const tree = new ArrayBinarySearchTree();

const result = [4, 2, 1, 3, 6, 5, 7, 8, 9].forEach((it) => tree.insert(it));

// console.log(tree.flatData);

// showLayered(tree);

layers(tree.flatData).forEach(console.log);

console.log(tree.followPath([]));
console.log(tree.followPath([1, 0]));

tree.delete(6);

layers(tree.flatData).forEach(console.log);
