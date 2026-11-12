export interface DeepTraverseOptions {
    inverseHorizontal?: boolean,
    putParentAt?: 0 | 1 | 2,
}

export type Action<T> = (element: T) => void;

export default abstract class BinaryTree<T> {
    abstract traverseDeep(
        options: DeepTraverseOptions & {
            action: Action<T>,
    }): void;

    abstract traverseBroad(options: {
        action: Action<T>,
        inverseHorizontal: boolean,
        inverseVertical: boolean,
    }): void;

    flattenDeep(options: DeepTraverseOptions): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        this.traverseDeep({ ...options, action });
        return result;
    }

    flattenBroad({
        inverseHorizontal = false,
        inverseVertical = false,
    }: {
        inverseHorizontal?: boolean,
        inverseVertical?: boolean,
    }): T[] {
        const result: T[] = [];
        const action = (it: T) => result.push(it);

        this.traverseBroad({ action, inverseHorizontal, inverseVertical });
        return result
    }
}
