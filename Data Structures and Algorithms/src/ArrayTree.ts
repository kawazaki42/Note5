export const ArrayTreeRelatives = {
  parent: (index: number) => Math.floor((index - 1) / 2),
  leftChildOf: (index: number) => index * 2 + 1,
  rightChildOf: (index: number) => index * 2 + 2,
};

export function* layers<T>(flatData: T[]): Generator<T[]> {
  let take = 1;
  const todo = flatData.slice();

  while (true) {
    const level = todo.splice(0, take);

    if (level.every((it) => it === undefined)) break;
    yield level;

    take *= 2;
  }
}
