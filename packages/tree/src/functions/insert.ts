import { ErrorCallback, CurryFn, TreeLike, TreeNode } from '$core/index';
import { assertion, clone, error, exception, findNode, nonUniqueTreeWarning } from '../helpers';

function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>): CurryFn<T[]>;
function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>, callback: ErrorCallback<T>): CurryFn<void>;
function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>, callback?: ErrorCallback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'insert');

  return (throwOnError?: boolean) => {
    const cloneTree = clone(tree);

    if (destination === null) {
      cloneTree.push(...(Array.isArray(data) ? data : [data]));

      if (callback) return void callback(cloneTree, undefined);

      return cloneTree;
    }

    const destNode = findNode(cloneTree, destination);

    if (!destNode) {
      if (throwOnError) throw exception('insert', 'Cannot find the destination node with the given id.');

      error('insert', 'Cannot found the destination node with the given id.');

      if (callback) return void callback(tree, exception('insert', 'Cannot found the destination node with the given id.'));

      return [...tree];
    }

    if (!destNode.children) destNode.children = [];

    destNode.children.push(...(Array.isArray(data) ? data : [data]));

    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  };
}

export { insert };
