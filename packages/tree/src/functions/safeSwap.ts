import { CallbackWithError, TreeNode } from '$core/index';
import { clone, containsNode, exception, findNode, findParent, error, nonUniqueTreeWarning, assertion } from '../helpers';

function safeSwap<T extends TreeNode>(tree: readonly T[], source: string, target: string): T[];
function safeSwap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback: CallbackWithError<T>): void;
function safeSwap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback?: CallbackWithError<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'safeSwap');

  const cloneTree = clone(tree);

  const fromNode = findNode(cloneTree, source);

  const toNode = findNode(cloneTree, target);

  if (!fromNode || !toNode) {
    error('safeSwap', 'Cannot found the from/to node with the given ids.');

    if (callback) return void callback(tree, exception('safeSwap', 'Cannot found the from/to node with the given ids.'));

    return [...tree];
  }

  if (fromNode.id === toNode.id) {
    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  }

  if (containsNode(cloneTree, source, target) || containsNode(cloneTree, target, source)) {
    error('safeSwap', 'Nodes cannot be swapped as one is a descendant of the other.');

    if (callback) return void callback(tree, exception('safeSwap', 'Nodes cannot be swapped as one is a descendant of the other.'));

    return [...tree];
  }

  const fromParent = findParent(cloneTree, fromNode) ?? { children: cloneTree as T[] };

  const toParent = findParent(cloneTree, toNode) ?? { children: cloneTree as T[] };

  const fromIndex = fromParent.children.findIndex((child) => child.id === fromNode.id);

  const toIndex = toParent.children.findIndex((child) => child.id === toNode.id);

  [fromParent.children[fromIndex], toParent.children[toIndex]] = [toParent.children[toIndex], fromParent.children[fromIndex]];

  if (callback) return void callback(cloneTree, undefined);

  return cloneTree;
}

export { safeSwap };
