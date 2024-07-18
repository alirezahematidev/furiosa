import { TreeNode } from '$core/index';

export function noChildren<T extends TreeNode>(node: T) {
  return !node.children || node.children.length === 0;
}
