export default class LinkedListNode<T> {
    data: T;
    next: LinkedListNode<T> | null = null;

    constructor(data: T, next: LinkedListNode<T> | null = null) {
        this.data = data;
        this.next = next;
    }
}

export class LinkedListIterator<T> {
    current: LinkedListNode<T> | null;
    begin: LinkedListNode<T>;

    constructor(begin: LinkedListNode<T>) {
        this.current = begin;
        this.begin = begin;
    }

    next(): T | null {
        // if (!this.hasNext())
        //     throw new Error();

        if (this.current !== null) {
            const result = this.current.data;
            this.current = this.current.next;
            return result;
        }

        return null;
    }

    skip(count: number): T | null {
        for (let i = 0; i < count; i++) {
            this.next();
        }

        return this.next();
    }

    // hasNext(): boolean {
    //     return this.current !== null;
    // }

    reset(): void {
        this.current = this.begin;
    }

    nthAbsolute(n: number): T | null {
        this.reset();
        return this.skip(n);
    }
}
