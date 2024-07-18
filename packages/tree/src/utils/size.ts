import { TreeNode } from '$core/index';

export function size<T extends TreeNode>(tree: readonly T[]): number {
  let count = tree ? tree.length : 0;

  if (count === 0) return count;

  function traverse(node: T | undefined) {
    if (!node) return;

    if (node.children) {
      count += node.children.length;

      for (const child of node.children) {
        traverse(child as T);
      }
    }
  }

  for (const node of tree) {
    traverse(node);
  }

  return count;
}
