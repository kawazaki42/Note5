public enum Direction {
    case root
    case leftChild
    case rightChild
}

// public enum ParentPosition {
//     case left
//     case right
//     case center
// }

public typealias TraverseOrder = (Direction, Direction, Direction)

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

    // public func add(element: Element, as dir: Direction) {
    //     switch dir {
    //     case .leftChild
    //     }
    // }
    
    // public func addLeft(_ element: Element) {
        
    // }

    // public func forEach(
    //     prefer direction: TraverseOrder,
    //     putParent: ParentPosition,
    //     action: (Element) -> Void,
    // ) {
    //     switch direction {
    //     case .left:
    //         self.left.forEach(
    //             prefer: direction,
    //             putParent: putParent,
    //             action: action,
    //         )
    //     }
    // }

    private func traverseBroadInner(
        _ order: TraverseOrder,
        // headAlreadyDone: Bool,
        action: (Element) -> Void,
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
            case .root: Void()
                // if !headAlreadyDone {
                //     action(data)
                // }
            }
        }

        [order.0, order.1, order.2].forEach {
            switch $0 {
            case .leftChild:
                left?.traverseBroadInner(
                    order,
                    // headAlreadyDone: true,
                    action: action,
                )
            case .rightChild:
                right?.traverseBroadInner(
                    order,
                    // headAlreadyDone: true,
                    action: action,
                )
            case .root: Void()
            }
        }
    }

    public func traverseBroad(
        _ order: TraverseOrder = (.root, .leftChild, .rightChild),
        // parentAfter: Bool = false,
        action: (Element) -> Void,
    ) {
        // if !parentAfter {
            action(data)
        // }

        traverseBroadInner(order, action: action)

        // if parentAfter {
        //     action(data)
        // }
    }

    public func traverseDeep(
        order: TraverseOrder,
        action: (Element) -> Void,
        // breadthFirst: Bool = false,
    ) {
        [order.0, order.1, order.2].forEach {
            switch $0 {
            case .leftChild:
                // if breadthFirst, let left {
                //     action(left.data)
                // }

                self.left?.traverseDeep(
                    order: order,
                    action: action,
                    // breadthFirst: breadthFirst,
                )
            case .rightChild:
                self.right?.traverseDeep(
                    order: order,
                    action: action,
                    // breadthFirst: breadthFirst,
                )
            case .root:
                action(self.data)
            }
        }
    }

    public func linearize(order: TraverseOrder) -> [Element] {
        var result: [Element] = []

        traverseDeep(order: order) {
            result.append($0)
        }

        return result
    }

    public func linearizeBroad() -> [Element] {
        var result: [Element] = []

        traverseBroad {
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
