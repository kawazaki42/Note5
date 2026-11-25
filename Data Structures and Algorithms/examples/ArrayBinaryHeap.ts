import ArrayBinaryHeap from "../src/ArrayBinaryHeap";
import { layers } from "../src/ArrayTree";

const tree = new ArrayBinaryHeap();

[4, 2, 1, 3, 6, 5, 7, 8, 9].forEach((it) => tree.insert(it));

layers(tree.flatData).forEach(console.log);

// tree.sort().forEach(console.log);

for (const item of tree.sort()) {
    console.log(item);
    layers(tree.flatData).forEach(console.log);
}
