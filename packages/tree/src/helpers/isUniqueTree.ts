import { TreeNode } from '$core/index';

export function isUniqueTree<T extends TreeNode>(tree: readonly T[]): boolean {
  const nodeIds = new Set<string>();

  function traverse(node: T | undefined): boolean {
    if (!node) return true;

    if (nodeIds.has(node.id)) return false;

    nodeIds.add(node.id);

    if (node.children) {
      for (const child of node.children) {
        if (!traverse(child as T)) return false;
      }
    }

    return true;
  }

  for (const node of tree) {
    if (!traverse(node)) return false;
  }

  return true;
}
