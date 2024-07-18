import { Replacer, TreeNode } from '$core/index';

export function modifyWith<T extends TreeNode>(tree: T[], id: string, replacer?: Replacer<T>) {
  const nodeIndex = tree.findIndex((treeNode) => treeNode.id === id);

  if (nodeIndex !== -1) {
    replacer ? tree.splice(nodeIndex, 1, replacer as T) : tree.splice(nodeIndex, 1);
  }
}
