import { Callback, TreeNode } from '$core/index';
import { assertion, clone, exception, findNode, findParent, modifyWith, nonUniqueTreeWarning } from '../helpers';

function remove<T extends TreeNode>(tree: readonly T[], id: string): T[];
function remove<T extends TreeNode>(tree: readonly T[], id: string, callback: Callback<T>): void;
function remove<T extends TreeNode>(tree: readonly T[], id: string, callback?: Callback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'remove');

  const cloneTree = clone(tree);

  const node = findNode(cloneTree, id);

  if (!node) throw exception('remove', 'Cannot found the node with the given id');

  const parentNode = findParent(cloneTree, node);

  if (!parentNode) {
    modifyWith(cloneTree, node.id);

    if (callback) return void callback(cloneTree);

    return cloneTree;
  }

  if (!parentNode.children) parentNode.children = [];

  modifyWith(parentNode.children, node.id);

  if (callback) return void callback(cloneTree);

  return cloneTree;
}

export { remove };
