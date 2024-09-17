import { ErrorCallback, CurryFn, TreeNode } from '$core/index';
import { assertion, clone, containsNode, error, exception, findNode, findParent, nonUniqueTreeWarning } from '../helpers';

function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string): CurryFn<T[]>;
function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback: ErrorCallback<T>): CurryFn<void>;
function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback?: ErrorCallback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'swap');

  return (throwOnError?: boolean) => {
    const cloneTree = clone(tree);

    const fromNode = findNode(cloneTree, source);

    const toNode = findNode(cloneTree, target);

    if (!fromNode || !toNode) {
      if (throwOnError) throw exception('swap', 'Cannot found the from/to node with the given ids.');

      error('swap', 'Cannot found the from/to node with the given ids.');

      if (callback) return void callback(tree, exception('swap', 'Cannot found the from/to node with the given ids.'));

      return [...tree];
    }

    if (fromNode.id === toNode.id) {
      if (callback) return void callback(cloneTree, undefined);

      return cloneTree;
    }

    if (containsNode(cloneTree, source, target) || containsNode(cloneTree, target, source)) {
      if (throwOnError) throw exception('swap', 'Nodes cannot be swapped as one is a descendant of the other.');

      error('swap', 'Nodes cannot be swapped as one is a descendant of the other.');

      if (callback) return void callback(tree, exception('swap', 'Nodes cannot be swapped as one is a descendant of the other.'));

      return [...tree];
    }

    const fromParent = findParent(cloneTree, fromNode) ?? { children: cloneTree as T[] };

    const toParent = findParent(cloneTree, toNode) ?? { children: cloneTree as T[] };

    const fromIndex = fromParent.children.findIndex((child) => child.id === fromNode.id);

    const toIndex = toParent.children.findIndex((child) => child.id === toNode.id);

    [fromParent.children[fromIndex], toParent.children[toIndex]] = [toParent.children[toIndex], fromParent.children[fromIndex]];

    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  };
}

export { swap };
