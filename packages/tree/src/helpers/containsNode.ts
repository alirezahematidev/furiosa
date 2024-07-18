import { TreeNode } from '$core/index';
import { findNode } from './findNode';
import { noChildren } from '.';

export function containsNode<T extends TreeNode>(tree: readonly T[], node: string, dest: string | null) {
  if (tree.length === 0 || dest === null || node === dest) return false;

  const destNode = findNode(tree, node);

  if (!destNode || noChildren(destNode)) return false;

  if (destNode.children.some((child) => child.id === dest)) return true;

  for (const branch of destNode.children) {
    if (noChildren(branch)) continue;

    if (containsNode([branch], branch.id, dest)) return true;
  }

  return false;
}
