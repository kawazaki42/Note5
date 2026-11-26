import { toMermaid, type LinkedBinaryTreeNode } from "../src/LinkedBinaryTree";
import { popRoot, treeOfLayers } from "../src/tournament-sort";

// const tree = treeOfLayers([5, 4, 3, 2, 1]);
const tree = treeOfLayers([4, 2, 1, 3, 6, 5, 7, 8, 9]);

// let treeStr = Bun.YAML.stringify(tree, null, 2);

// const nodes = tree.nodes({ horizontal: true, flipVertical: true });

// const nodesArray: LinkedBinaryTreeNode<number>[] = [];

// class LinkList {
//     // links: [number, number]
// }


// const links =

// let treeStr = linksIn(tree).map(([parent, child, childData]) => `${parent} --> ${child}((${childData}))`).toArray().join('\n');

let treeStr = toMermaid(tree);

// const result = [];

// // let treeStr = nodes.map(function (node) {
// for (const node of nodes) {
//     nodesArray.push(node);
//     const i = nodesArray.length - 1;
//     // const result = [];

//     if (node.left) {
//         let left = nodesArray.indexOf(node.left);
//         if (left === -1) {
//             nodesArray.push(node.left);
//             left = nodesArray.length - 1;
//         }
//         result.push(`${i}((${node.data})) --> ${left}((${node.left.data}))`);
//     }

//     if (node.right) {
//         let right = nodesArray.indexOf(node.right);
//         if (right === -1) {
//             nodesArray.push(node.right);
//             right = nodesArray.length - 1;
//         }
//         result.push(`${i}((${node.data})) --> ${right}((${node.right.data}))`);
//     }

//     // return result.join('\n');
// }
// // ).toArray().join('\n');

// console.log(result.join('\n'))

// const nodesArray = nodes.toArray();

// nodesArray.map((node, i) => )

// for (const n of nodes) {

// }

console.log(treeStr);

// // const result = [];

// // const { data } = tree;

// console.log(popRoot(tree));

// treeStr = Bun.YAML.stringify(tree, null, 2);

// console.log(treeStr);
