import { MaybeNode, TreeNode } from '$core/index';

export function findNode<T extends TreeNode>(tree: readonly T[], id: string): MaybeNode<T> {
  for (const node of tree) {
    if (node.id === id) return node;

    const foundNode = findNode<T>(node.children as T[], id);

    if (foundNode) return foundNode;
  }
  return undefined;
}
