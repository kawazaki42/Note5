struct ArrayBinaryTree<Element>: BinaryTree {
    var flatData = [Element?]()

    static private func indexFrom(path: [Direction]) -> Int {
        var index = 0

        for d in path {
            switch d {
                case .currentNode: Void()
                case .leftChild:
                    index *= 2
                    index += 1
                case .rightChild:
                    index *= 2
                    index += 2
            }
        }

        return index
    }

    subscript(path: Direction...) -> Element? {
        get {
            let index = Self.indexFrom(path: path)

            guard flatData.indices.contains(index) else {
                return nil
            }

            return flatData[index]
        }

        set {
            let index = Self.indexFrom(path: path)

            guard flatData.indices.contains(index) else {
                // flatData.append(addingCapacity: index) {
                //     // $0.
                // }
            }

            return flatData[index]
        }
    }


}
