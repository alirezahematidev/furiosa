import type { TreeNode } from '$core/index';

type FlattenTreeReturn<T extends TreeNode> = Omit<T, 'children'> & { parentId: string | null };

export function flattenTree<T extends TreeNode>(tree: readonly T[]): FlattenTreeReturn<T>[] {
  const flatNodes: FlattenTreeReturn<T>[] = [];

  function traverse(node: T | undefined, parentId: string | null) {
    if (!node) return;

    const { children, ...rest } = node;

    flatNodes.push({ ...rest, parentId });

    if (node.children) {
      for (const child of node.children) {
        traverse(child as T, node.id);
      }
    }
  }

  for (const node of tree) {
    traverse(node, null);
  }

  return flatNodes;
}
