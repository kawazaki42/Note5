import { assert } from "node:console";

// function ()

// export abstract class BTreeNode<T> {
//     data: T[];
//     children: (BTreeNode<T> | null)[];

//     constructor(data: T[], children: (BTreeNode<T> | null)[]) {
//         if (children.length - data.length !== 1)
//             throw TypeError();

//         this.data = data;
//         this.children = children;
//     }

//     // insertFlat(element: T) {

//     // }

//     isLeaf(): boolean {
//         return !this.children.some(it => it !== null);
//     }
// }

type Repr<T> = {
  data: string;
  children: (Repr<T> | "null")[];
};

export class BTree4Node<T> {
  data: T[];
  children: (BTree4Node<T> | null)[];

  constructor(data: T[], children: (BTree4Node<T> | null)[]) {
    if (children.length - data.length !== 1) throw TypeError();

    this.data = data;
    this.children = children;
  }

  repr(): Repr<T> {
    const result: Repr<T> = {
      data: JSON.stringify(this.data),
      children: this.children.map((it) => it?.repr() ?? "null"),
    };

    return result;
  }

  isLeaf(): boolean {
    return !this.children.some((it) => it !== null);
  }

  private validate(): void {
    assert(this.children.length <= 4);
    assert(this.children.length >= 2);
  }

  split(): [T, BTree4Node<T>, BTree4Node<T>] | null {
    this.validate();

    if (this.children.length !== 4) return null;

    // const newRootData = [this.data[1]];

    assert(this.data.length === 3);
    assert(!this.data.some((it) => it === undefined));
    assert(!this.children.some((it) => it === undefined));

    const [left, center, right] = this.data as [T, T, T];
    const [ll, lr, rl, rr] = this.children as [
      BTree4Node<T>,
      BTree4Node<T>,
      BTree4Node<T>,
      BTree4Node<T>,
    ];

    // assert(ll, lr, rl, rr);

    const leftNode = new BTree4Node([left], [ll, lr]);
    const rightNode = new BTree4Node([right], [rl, rr]);

    // const newRoot = new BTree4Node([center], [leftNode, rightNode]);
    // return newRoot;

    return [center, leftNode, rightNode];
  }

  // canInsertAt(element: T): number {
  //     let rightBound = 0;

  //     while (element > this.data[rightBound]) {
  //         rightBound++;
  //     }

  //     return rightBound;
  // }

  childFor(element: T): ChildInfo<T> {
    // let rightBound = 0;

    // while (element > this.data[rightBound]) {
    //     rightBound++;
    // }

    // return rightBound;

    for (let i = 0; i < this.data.length; i++) {
      const cur = this.data[i];
      const child = this.children[i];

      if (!cur) throw Error();

      if (child === undefined) throw Error();

      if (element < cur) {
        return {
          link: i,
          // node: this.children[i] as (BTree4Node<T> | null),
          node: child,
        };
      }
    }

    const node = this.children.at(-1);

    if (node === undefined) throw Error();

    return {
      link: this.children.length - 1,
      // node: this.children[3] as (BTree4Node<T> | null),
      node,
    };
  }

  // insertFlat(element: T) {
  //     if (this.children.length >= 4)
  //         throw Error();

  // }

  // maybeSplit(): BTree4Node<T> | null {
  //     this.validate();

  //     if (this.children.length !== 4)
  //         return this;

  //     // const newRootData = [this.data[1]];

  //     const [left, center, right] = this.data;
  //     const [ll, lr, rl, rr] = this.children;

  //     const leftNode = new BTree4Node([left], [ll, lr]);
  //     const rightNode = new BTree4Node([right], [rl, rr]);

  //     const newRoot = new BTree4Node([center], [leftNode, rightNode]);

  //     return newRoot;
  // }

  // insert(element: T) {
  //     // let rightBound = 0;

  //     // while (element < this.data[rightBound]) {
  //     //     rightBound++;
  //     // }

  //     // this.validate()

  //     // if (this.children.length === 4) {

  //     // }

  //     const split = this.split();

  //     // if (split) {
  //     //     // const [center, leftNode, rightNode] = split;
  //     //     return split;
  //     // }
  // }
}

interface ChildInfo<T> {
  node: BTree4Node<T> | null;
  link: number;
}

interface PathElement<T> {
  node: BTree4Node<T>;
  link: 0 | 1 | 2;
}

export class BTree4<T> {
  root: BTree4Node<T> | null = null;

  toYaml(): string {
    if (!this.root) return "empty";

    return Bun.YAML.stringify(this.root.repr(), null, 2);
  }

  insert(element: T) {
    if (!this.root) {
      this.root = new BTree4Node([element], [null, null]);
      return;
    }

    // const parents: BTree4Node<T>[] = [];
    // const path: (0 | 1 | 2)[] = [];
    // const path: PathElement<T>[] = [];
    // let parent: BTree4Node<T> | null = null;
    // let parentLink: number | null = null;

    let parent: ParentInfo<T> | null = null;
    let cursor = this.root;

    interface ParentInfo<T> {
      node: BTree4Node<T>;
      backLink: number;
    }

    while (true) {
      const split = cursor.split();

      if (split) {
        const [center, left, right] = split;

        // const parent = path.pop();
        if (parent) {
          const { node, backLink: link } = parent;
          // const node = parent;
          // const link = parentLink;

          assert(node.children.length < 4);

          node.data.splice(link, 0, center);
          node.children.splice(link, 1, left, right);

          cursor = node;
        } else {
          this.root = new BTree4Node([center], [left, right]);
          cursor = this.root;
        }
      }

      if (cursor.isLeaf()) {
        cursor.data.push(element);
        cursor.children.push(null);
        cursor.data.sort();
        return;
      }

      const { node, link } = cursor.childFor(element);

      // console.debug("!!!");
      if (!node) {
        cursor.children[link] = new BTree4Node([element], [null, null]);
        return;
      }

      // path.push({ node, link: link as 0 | 1 | 2 });
      // parent = cursor;
      // parentLink = link;
      parent = { node: cursor, backLink: link };
      cursor = node;
    }

    // cursor = node;

    // cursor = cursor.children[childLink];

    // if (split) {
    //     const [center, left, right] = split;

    //     if (cursor === this.root) {
    //         this.root = new BTree4Node([center], [left, right]);
    //     } else {

    //     }
    // }

    // this.root = this.root.maybeSplit() ?? this.root;

    // if (element )

    // this.root.data.push(element);
    // this.root.children.push(null);

    // if (this.root.children.length === 4) {
    //     const newRootData = this.root.
    // }
  }
}
