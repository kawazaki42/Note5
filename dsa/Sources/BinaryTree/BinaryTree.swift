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
