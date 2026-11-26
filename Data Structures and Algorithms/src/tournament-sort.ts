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

export function popRoot<T>(tree: Node<T>): T {
  const result = tree.data;

  // let cursor: ChildInfo<T> = {node: tree, parentLink: 'left', parent: null};

  const path: ChildInfo<T>[] = [{ node: tree, parentLink: "left" }];

  while (true) {
    // const {left, right} = cursor;

    const cursor = path.at(-1)!;

    if (cursor.node.left?.data === result)
      path.push({
        node: cursor.node.left,
        parentLink: "left",
      });
    // cursor = {
    //   node: cursor.node.left,
    //   parent: cursor.node,
    //   parentLink: 'left',
    // };
    // cursor = cursor.node.left;
    else if (cursor.node.right?.data === result)
      path.push({
        node: cursor.node.right,
        parentLink: "right",
      });
    // cursor = {
    //   node: cursor.node.right,
    //   parent: cursor.node,
    //   parentLink: 'right',
    // };
    // cursor = cursor.right;
    else {
      const parent = path.at(-2);
      parent!.node[cursor.parentLink] = null;
      path.pop(); // removed node
      replay(path);
      return cursor.node.data;
    }
  }
}

function replay<T>(path: ChildInfo<T>[]): void {
  while (true) {
    const cursor = path.pop();
    const parent = path.at(-1);

    if (cursor === undefined) return;

    // const {left, right} = cursor.node;
    const comp = compareChildren(cursor.node);

    let newData: Node<T>;

    if ("only" in comp) newData = comp.only;
    else if ("min" in comp) newData = comp.min;
    else {
      if (present(parent)) parent.node[cursor.parentLink] = null;
      continue;
    }
    // throw Error();

    if (present(parent)) cursor.node.data = newData.data;
  }
}

type ComparisonResult<T> =
  | {
      min: Node<T>;
      max: Node<T>;
    }
  | {
      only: Node<T>;
    }
  | {};

function present<T>(value: T | null | undefined) {
  return value !== undefined && value !== null;
}

function compareChildren<T>(node: Node<T>): ComparisonResult<T> {
  if (present(node.left) && present(node.right)) {
    return {
      min: node.left.data < node.right.data ? node.left : node.right,
      max: node.left.data < node.right.data ? node.right : node.left,
    };
  }

  if (present(node.left)) {
    return { only: node.left };
  }

  if (present(node.right)) {
    return { only: node.right };
  }

  // if (!present(node.left) && !present(node.right))
  return {};
}

type ChildInfo<T> = {
  // parent: Node<T> | null,
  parentLink: "left" | "right";
  node: Node<T>;
};
