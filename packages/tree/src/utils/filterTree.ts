import { TreeNode } from '$core/index';

function filterTree<T extends TreeNode>(tree: readonly T[], predicate: (node: T) => boolean): T[] {
  const filteredNodes: T[] = [];

  function traverse(node: T | undefined) {
    if (!node) return;

    if (predicate(node)) filteredNodes.push(node);

    if (node.children) {
      for (const child of node.children) {
        traverse(child as T);
      }
    }
  }

  for (const node of tree) {
    traverse(node);
  }

  return filteredNodes;
}

export { filterTree };
