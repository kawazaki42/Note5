import { treeOfLayers } from "../src/tournament-sort";

const tree = treeOfLayers([5, 4, 3, 2, 1]);

const treeStr = Bun.YAML.stringify(tree, null, 2);

console.log(treeStr);

const result = [];

const { data } = tree;
