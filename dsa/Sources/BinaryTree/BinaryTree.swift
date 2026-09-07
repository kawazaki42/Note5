public class Node<Element> {
    public var data: Element

    public var left, right: Node<Element>?

    public init(
        data: Element,
        left: Node<Element>? = nil,
        right: Node<Element>? = nil,
    ) {
        self.data = data
        self.left = left
        self.right = right
    }
}

// extension Node where Element: Comparable {
//     public func search(item: Element) {
//         if 
//     }
// }

public struct BinarySearchTree<T: Comparable> {
    public var root: Node<T>?

    public init(root: Node<T>? = nil) {
        self.root = root
    }

    public func search(_ item: T) -> Node<T>? {
        guard let root else {
            return nil
        }

        if root.data == item {
            return root
        }

        let next = if root.data < item {
            root.left
        } else {
            root.right
        }

        return BinarySearchTree(root: next).search(item)
    }

    public func forEach(_ action: (T) -> Void) {
        guard let root else {
            return
        }

        BinarySearchTree(root: root.left).forEach(action)

        action(root.data)

        BinarySearchTree(root: root.right).forEach(action)
    }

    public mutating func insert(_ item: T) {
        let new = Node(data: item)

        guard let root else {
            root = new
            return 
        }

        let child = if item <= root.data {
            root.left
        } else {
            root.right
        }

        var wrapper = BinarySearchTree(root: child)

        wrapper.insert(item)
    }
}
