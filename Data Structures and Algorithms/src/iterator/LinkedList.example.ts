// import { describe, test } from 'bun:test';
import LinkedListNode, { LinkedListIterator } from "./LinkedList";

function sample() {
  const head = new LinkedListNode(1);
  head.next = new LinkedListNode(2);
  head.next.next = new LinkedListNode(3);
  return head;
}

// describe('linked list iterator', () => {
const iter = new LinkedListIterator(sample());

let cur;

while ((cur = iter.next())) {
  console.log(cur);

  if (cur === 2) break;
}

iter.reset();

while ((cur = iter.next())) {
  console.log(cur);
}

console.log(iter.nthAbsolute(1));
// })
