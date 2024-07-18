import { assertion, findNode, nonUniqueTreeWarning } from '../helpers';
import { MaybeNode, TreeNode } from '$core/index';

export function find<T extends TreeNode>(tree: readonly T[], id: string): MaybeNode<T> {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'find');

  return findNode(tree, id);
}
