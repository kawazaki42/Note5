
// typealias MaybeNode<Element> = Node<Element>?

extension Node where Element: Comparable {
    // public func search(item: Element) {
    //     if 
    // }

    fileprivate func insertBinary(_ item: Element) {
        let new = Node(data: item)

        if item <= self.data {
            if let left {
                left.insertBinary(item)
            } else {
                left = new
            }
            // left?.insertBinary(item) ?? left = Node(data: item)
        } else {
            if let right {
                right.insertBinary(item)
            } else {
                right = new
            }
            // right?.insertBinary(item) ?? right = Node(data: item)
        }
    }
}

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
        // let new = Node(data: item)

        // guard let root else {
        //     root = new
        //     return 
        // }

        // var cursor = root

        // if item <= root.data {
        //     if root.left == nil 
        //     root.left = new
        // } else {
        //     root.right = new
        // }

        // // var wrapper = BinarySearchTree(root: child)

        // wrapper.insert(item)
        if let root {
            root.insertBinary(item)
        } else {
            root = Node(data: item)
        }
    }
}
