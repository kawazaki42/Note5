// import BinaryTree


// typealias MaybeNode<Element> = Node<Element>?

struct BinarySearchTree<Element: Comparable> {
    var root: LinkedBinaryTreeNode<Element>?

    mutating public func insert(_ item: Element) {
        if var root {
            Self.insert(into: &root, item)
        } else {
            root = LinkedBinaryTreeNode(data: item)
        }
    }

    private static func insert(into root: inout LinkedBinaryTreeNode<Element>, _ item: Element) {
        let new = LinkedBinaryTreeNode(data: item)

        if item <= root.data {
            if var left = root.left {
                // left.insert(item)
                Self.insert(into: &left, item)
            } else {
                root.left = new
            }
            // left?.insertBinary(item) ?? left = Node(data: item)
        } else {
            if var right = root.right {
                // right.insert(item)
                Self.insert(into: &right, item)
            } else {
                root.right = new
            }
            // right?.insertBinary(item) ?? right = Node(data: item)
        }
    }
}

// public protocol BinarySearchTree {
//     associatedtype Element: Comparable

//     func insert(_ item: Element)
// }

// extension BinaryTree.Node: BinarySearchTree where Element: Comparable {
//     // public func search(item: Element) {
//     //     if 
//     // }

//     // internal func _forceEmitInsertBinary() {
//     //     _ = Node<Int>(data: 0).insertBinary
//     // }

//     // @inlinable
//     public func insert(_ item: Element) {
//         let new = Node(data: item)

//         if item <= self.data {
//             if let left {
//                 left.insert(item)
//             } else {
//                 left = new
//             }
//             // left?.insertBinary(item) ?? left = Node(data: item)
//         } else {
//             if let right {
//                 right.insert(item)
//             } else {
//                 right = new
//             }
//             // right?.insertBinary(item) ?? right = Node(data: item)
//         }
//     }
// }

// public struct BinarySearchTree<T: Comparable> {
//     public var root: Node<T>?

//     public init(root: Node<T>? = nil) {
//         self.root = root
//     }

//     public func search(_ item: T) -> Node<T>? {
//         guard let root else {
//             return nil
//         }

//         if root.data == item {
//             return root
//         }

//         let next = if root.data < item {
//             root.left
//         } else {
//             root.right
//         }

//         return BinarySearchTree(root: next).search(item)
//     }

//     public func forEach(_ action: (T) -> Void) {
//         guard let root else {
//             return
//         }

//         BinarySearchTree(root: root.left).forEach(action)

//         action(root.data)

//         BinarySearchTree(root: root.right).forEach(action)
//     }

//     public mutating func insert(_ item: T) {
//         // let new = Node(data: item)

//         // guard let root else {
//         //     root = new
//         //     return 
//         // }

//         // var cursor = root

//         // if item <= root.data {
//         //     if root.left == nil 
//         //     root.left = new
//         // } else {
//         //     root.right = new
//         // }

//         // // var wrapper = BinarySearchTree(root: child)

//         // wrapper.insert(item)
//         if let root {
//             root.insertBinary(item)
//         } else {
//             root = Node(data: item)
//         }
//     }
// }

// public class Node<Element>: BinaryTree.Node<Element> where Element: Comparable {
//     public var left, right: Self

//     // create
//     public func insert(_ element: Element) {
//         guard element != self.data else {
//             return
//         }

//         if element < self.data {
//             if let left {
//                 left.insert(element)
//             } else {
//                 left = Node(data: element)
//             }
//         } else {
//             if let right {
//                 right.insert(element)
//             } else {
//                 right = Node(data: element)
//             }
//         }
//     }

//     // read
//     // update
//     // delete
// }
