public enum Direction {
    case currentNode
    case leftChild
    case rightChild
}

public typealias TraverseOrder = (Direction, Direction, Direction)

// public struct TraverseOrder {
//     public let first, second, third: Direction

//     public init(
//         _ first: Direction,
//         _ second: Direction,
//         _ third: Direction,
//     ) {
//         self.first = first
//         self.second = second
//         self.third = third
//     }
// }

public final class Node<Element> {
    public var data: Element

    public var
        left: Node<Element>? = nil,
        right: Node<Element>? = nil

    public init(
        data: Element,
        left: Node<Element>? = nil,
        right: Node<Element>? = nil,
    ) {
        self.data = data
        self.left = left
        self.right = right
    }

    private func traverseBroadInner(
        inOrder order: TraverseOrder,
        do action: (Element) -> Void,
    ) {
        [order.0, order.1, order.2].forEach {
            switch $0 {
            case .leftChild:
                if let left {
                    action(left.data)
                }
            case .rightChild:
                if let right {
                    action(right.data)
                }
            case .currentNode: Void()
            }
        }

        [order.0, order.1, order.2].forEach {
            switch $0 {
            case .leftChild:
                left?.traverseBroadInner(
                    inOrder: order,
                    do: action,
                )
            case .rightChild:
                right?.traverseBroadInner(
                    inOrder: order,
                    do: action,
                )
            case .currentNode: Void()
            }
        }
    }

    public func traverseBroad(
        inOrder order: TraverseOrder =
            TraverseOrder(.currentNode, .leftChild, .rightChild),
        do action: (Element) -> Void,
    ) {
        action(data)

        traverseBroadInner(inOrder: order, do: action)
    }

    public func traverseDeep(
        inOrder order: TraverseOrder,
        do action: (Element) -> Void,
    ) {
        [order.0, order.1, order.2].forEach {
            switch $0 {
            case .leftChild:
                left?.traverseDeep(
                    inOrder: order,
                    do: action,
                )
            case .rightChild:
                self.right?.traverseDeep(
                    inOrder: order,
                    do: action,
                )
            case .currentNode:
                action(self.data)
            }
        }
    }

    public func linearizeDeep(inOrder order: TraverseOrder) -> [Element] {
        var result: [Element] = []

        traverseDeep(inOrder: order) {
            result.append($0)
        }

        return result
    }

    public func linearizeBroad(
        inOrder order: TraverseOrder = (.currentNode, .leftChild, .rightChild),
    ) -> [Element] {
        var result: [Element] = []

        traverseBroad(inOrder: order) {
            result.append($0)
        }

        return result
    }
}

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
