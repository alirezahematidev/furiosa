import { MaybeNode, TreeNode } from '$core/index';
import { noChildren } from '.';

export function findParent<T extends TreeNode>(tree: readonly T[], node: T): MaybeNode<T> {
  for (const branch of tree) {
    if (noChildren(branch)) continue;

    if (branch.children.some((child) => child.id === node.id)) return branch;

    const parent = findParent<T>(branch.children as T[], node);

    if (parent) return parent;
  }

  return undefined;
}
