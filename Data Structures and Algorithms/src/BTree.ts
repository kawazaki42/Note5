import { assert } from "node:console";

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

    const leftNode = new BTree4Node([left], [ll, lr]);
    const rightNode = new BTree4Node([right], [rl, rr]);

    return [center, leftNode, rightNode];
  }

  childFor(element: T): ChildInfo<T> {
    for (let i = 0; i < this.data.length; i++) {
      const cur = this.data[i];
      const child = this.children[i];

      if (!cur) throw Error();

      if (child === undefined) throw Error();

      if (element < cur) {
        return {
          link: i,
          node: child,
        };
      }
    }

    const node = this.children.at(-1);

    if (node === undefined) throw Error();

    return {
      link: this.children.length - 1,
      node,
    };
  }
}

interface ChildInfo<T> {
  node: BTree4Node<T> | null;
  link: number;
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

    interface ParentInfo<T> {
      node: BTree4Node<T>;
      backLink: number;
    }

    let parent: ParentInfo<T> | null = null;
    let cursor = this.root;

    while (true) {
      const split = cursor.split();

      if (split) {
        const [center, left, right] = split;

        if (parent) {
          const { node, backLink: link } = parent;

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

      // TODO: not needed?
      if (!node) {
        cursor.children[link] = new BTree4Node([element], [null, null]);
        return;
      }

      parent = { node: cursor, backLink: link };
      cursor = node;
    }
  }
}
