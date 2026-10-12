import Testing
@testable import BinaryTree

@Test func example() {
    var tree = ArrayBinaryTree<Int>()

    tree[] = 7

    print(tree.flatData)
}
