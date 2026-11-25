import { ArrayTreeRelatives } from "./ArrayTree";

export default class ArrayBinaryHeap<T> {
    flatData: T[] = [];

    insert(newElement: T): void {
        this.flatData.push(newElement);

        // a path in this tree must always be an increasing sequence
        
        let newIdx = this.flatData.length -1 ;

        while (true) {
            const parentIdx = ArrayTreeRelatives.parent(newIdx);
            const parentData = this.flatData[parentIdx]

            // if (parent === -1)
            if (parentData === undefined || parentData === null)
                return;

            if (newElement < parentData) {
                // swap
                this.flatData[parentIdx] = newElement;
                this.flatData[newIdx] = parentData;
    
                newIdx = parentIdx;
            } else return;
        }
    }
}
