import { insert } from './insert';
import { remove } from './remove';
import { Callback, TreeNode } from '$core/index';
import { assertion, containsNode, exception, findNode, findParent, nonUniqueTreeWarning } from '../helpers';

function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null): T[];
function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null, callback: Callback<T>): void;
function move<T extends TreeNode>(tree: readonly T[], source: string, to: string | null, callback?: Callback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'move');

  const node = findNode(tree, source);

  if (containsNode(tree, source, to)) throw exception('move', 'Cannot move the node into its own descendants.');

  if (!node) throw exception('move', 'Cannot found the source node with the given id');

  const parentNode = findParent(tree, node);

  if (parentNode && parentNode.id === to) {
    if (callback) return void callback(tree as T[]);

    return tree as T[];
  }

  const result = insert(remove(tree, source), to, node);

  if (callback) return void callback(result);

  return result;
}

export { move };
