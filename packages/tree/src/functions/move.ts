import { insert } from './insert';
import { remove } from './remove';
import { ErrorCallback, CurryFn, TreeNode } from '$core/index';
import { assertion, containsNode, error, exception, findNode, findParent, nonUniqueTreeWarning } from '../helpers';

function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null): CurryFn<T[]>;
function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null, callback: ErrorCallback<T>): CurryFn<void>;
function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null, callback?: ErrorCallback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'move');

  return (throwOnError?: boolean) => {
    const node = findNode(tree, source);

    if (containsNode(tree, source, to)) {
      if (throwOnError) throw exception('move', 'Cannot move the node into its own descendants.');

      error('move', 'Cannot move the node into its own descendants.');

      if (callback) return void callback(tree, exception('move', 'Cannot move the node into its own descendants.'));

      return [...tree];
    }

    if (!node) {
      if (throwOnError) throw exception('move', 'Cannot found the source node with the given id');

      error('move', 'Cannot found the source node with the given id.');

      if (callback) return void callback(tree, exception('move', 'Cannot found the source node with the given id.'));

      return [...tree];
    }

    const parentNode = findParent(tree, node);

    if (parentNode && parentNode.id === to) {
      if (callback) return void callback(tree, undefined);

      return tree;
    }

    const result = insert(remove(tree, source)(throwOnError), to, node)(throwOnError);

    if (callback) return void callback(result, undefined);

    return result;
  };
}

export { move };
