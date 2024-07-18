import { Callback, TreeLike, TreeNode } from '$core/index';
import { assertion, clone, exception, findNode, nonUniqueTreeWarning } from '../helpers';

function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>): T[];
function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>, callback: Callback<T>): void;
function insert<T extends TreeNode>(tree: readonly T[], destination: string | null, data: TreeLike<T>, callback?: Callback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'insert');

  const cloneTree = clone(tree);

  if (destination === null) {
    cloneTree.push(...(Array.isArray(data) ? data : [data]));

    if (callback) return void callback(cloneTree);

    return cloneTree;
  }

  const destNode = findNode(cloneTree, destination);

  if (!destNode) throw exception('insert', 'Cannot find the destination node with the given id.');

  if (!destNode.children) destNode.children = [];

  destNode.children.push(...(Array.isArray(data) ? data : [data]));

  if (callback) return void callback(cloneTree);

  return cloneTree;
}

export { insert };
