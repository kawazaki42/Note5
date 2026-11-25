import LinkedBinaryTree, {
  LinkedBinaryTreeNode as Node,
} from "./LinkedBinaryTree";

function* pairMaxes<T>(data: Node<T>[]): Iterable<Node<T>> {
  for (let i = 0; i < data.length; i += 2) {
    const a = data[i];
    const b = data[i + 1];

    let max;

    // if ((a === undefined) && (b === undefined))

    if (a === undefined || a === null) {
      // if (b === undefined || b === null)
      throw Error("wtf?!");

      // yield b;
      // continue;
    }

    if (b === undefined || b === null) {
      // yield new Node(a.data, a, b);
      // yield null;
      // continue;
      max = a.data;
    } else {
      max = b.data < a.data ? b.data : a.data;
    }

    yield new Node(max, a, b);
  }
}

export function treeOfLayers<T>(data: T[]): Node<T> {
  // const layers: (T | null)[][] = [data];
  // const layers = [data.map(it => new Node(it))];
  let last = data.map((it) => new Node(it));

  while (true) {
    const next = [...pairMaxes(last)];

    // layers.push(next);
    last = next;

    if (next.length === 1) return next[0]!;
    // break;
  }

  // return layers

  // const tree = new LinkedBinaryTree();
}

// export function treeOfLayers<T>(layers: T[][]): LinkedBinaryTreeNode<T> {

//     for (const l of layers)

//     const result = new LinkedBinaryTreeNode<T>(layers[0]![0]!);
// }
