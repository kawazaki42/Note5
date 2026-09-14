import Testing
@testable import BinaryTree

// @Test func example() async throws {
//     // Write your test here and use APIs like `#expect(...)` to check expected conditions.
// }

func sampleTree() -> Node<Int> {
    let root = Node(data: 1)

    root.left = Node(data: 2)
    root.right = Node(data: 3)

    root.left?.left = Node(data: 4)
    root.left?.right = Node(data: 5)

    root.right?.left = Node(data: 6)
    root.right?.right = Node(data: 7)

    return root
}

@Test func rootMiddle() async throws {
    // var tree = BinarySearchTree<Int>()

    // for item in [5, 7, 1, 3, 10, 4, 6, 9, 8, 2] {
    //     tree.insert(item)
    // }

    // tree.forEach { print($0) }

    let actual = sampleTree()
        .linearizeDeep(inOrder: (.leftChild, .currentNode, .rightChild))
    let expected = [4, 2, 5, 1, 6, 3, 7]

    #expect(expected == actual)
}

@Test func rootBefore() {
    let actual = sampleTree()
        .linearizeDeep(inOrder: (.currentNode, .leftChild, .rightChild))

    let expected = [1, 2, 4, 5, 3, 6, 7]

    #expect(actual == expected)
}

// @Test func rootAfter() {
//     let actual = sampleTree().linearize(order: (.leftChild, .rightChild, .root))

//     print(actual)
// }

@Test func broad() {
    let actual = sampleTree().linearizeBroad()
    let expected = [1, 2, 3, 4, 5, 6, 7]

    #expect(actual == expected)
    // print(actual)
}
