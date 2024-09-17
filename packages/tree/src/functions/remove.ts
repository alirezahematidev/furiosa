import { ErrorCallback, CurryFn, TreeNode } from '$core/index';
import { assertion, clone, error, exception, findNode, findParent, modifyWith, nonUniqueTreeWarning } from '../helpers';

function remove<T extends TreeNode>(tree: readonly T[], id: string): CurryFn<T[]>;
function remove<T extends TreeNode>(tree: readonly T[], id: string, callback: ErrorCallback<T>): CurryFn<void>;
function remove<T extends TreeNode>(tree: readonly T[], id: string, callback?: ErrorCallback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'remove');

  return (throwOnError?: boolean) => {
    const cloneTree = clone(tree);

    const node = findNode(cloneTree, id);

    if (!node) {
      if (throwOnError) throw exception('remove', 'Cannot found the node with the given id');

      error('remove', 'Cannot found the node with the given id.');

      if (callback) return void callback(tree, exception('remove', 'Cannot found the node with the given id.'));

      return [...tree];
    }

    const parentNode = findParent(cloneTree, node);

    if (!parentNode) {
      modifyWith(cloneTree, node.id);

      if (callback) return void callback(cloneTree, undefined);

      return cloneTree;
    }

    if (!parentNode.children) parentNode.children = [];

    modifyWith(parentNode.children, node.id);

    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  };
}

export { remove };
