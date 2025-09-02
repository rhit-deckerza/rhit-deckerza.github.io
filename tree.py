class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
    
    def create_sample_tree(self):
        # Creates the following tree:
        #       1
        #      / \
        #     2   3
        #    / \   \
        #   4   5   6
        self.root = Node(1)
        self.root.left = Node(2)
        self.root.right = Node(3)
        self.root.left.left = Node(4)
        self.root.left.right = Node(5)
        self.root.right.right = Node(6)
    
    # DFS: Pre-order (Root, Left, Right)
    def preorder(self, node):
        result = []
        result.append(node.data)
        left = self.preorder(node.left) if node.left is not None else []
        right = self.preorder(node.right) if node.right is not None else []
        return result + left + right
    
    # DFS: In-order (Left, Root, Right)
    def inorder(self, node):
        result = []
        # TODO: Implement in-order traversal
        # Steps: Traverse left, visit node, traverse right
        # Expected output for sample tree: [4, 2, 5, 1, 3, 6]
        return result
    
    # DFS: Post-order (Left, Right, Root)
    def postorder(self, node):
        result = []
        # TODO: Implement post-order traversal
        # Steps: Traverse left, traverse right, visit node
        # Expected output for sample tree: [4, 5, 2, 6, 3, 1]
        return result
    
    # BFS: Level-order
    def level_order(self):
        result = []
        # TODO: Implement level-order traversal
        # Steps: Use a queue to visit nodes level by level
        # Expected output for sample tree: [1, 2, 3, 4, 5, 6]
        return result

# Example usage
if __name__ == "__main__":
    tree = BinaryTree()
    tree.create_sample_tree()
    
    print("Pre-order traversal:", tree.preorder(tree.root))
    print("In-order traversal:", tree.inorder(tree.root))
    print("Post-order traversal:", tree.postorder(tree.root))
    print("Level-order traversal:", tree.level_order())