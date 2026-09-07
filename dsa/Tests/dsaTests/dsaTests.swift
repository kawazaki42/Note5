import Testing
@testable import BinaryTree

// @Test func example() async throws {
//     // Write your test here and use APIs like `#expect(...)` to check expected conditions.
// }

@Test func example() async throws {
    var tree = BinarySearchTree<Int>()

    for item in [5, 7, 1, 3, 10, 4, 6, 9, 8, 2] {
        tree.insert(item)
    }

    tree.forEach { print($0) }
}
