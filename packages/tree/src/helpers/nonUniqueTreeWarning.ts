import { TreeNode } from '$core/index';
import { error } from './asserts';
import { isUniqueTree } from './isUniqueTree';

export function nonUniqueTreeWarning<T extends TreeNode>(tree: readonly T[], method: string) {
  if (!isUniqueTree(tree)) error(method, `Each node in the tree should have a unique "id" prop.`);
}
