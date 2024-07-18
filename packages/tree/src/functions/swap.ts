import { Callback, TreeNode } from '$core/index';
import { assertion, clone, containsNode, exception, findNode, findParent, nonUniqueTreeWarning } from '../helpers';

function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string): T[];
function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback: Callback<T>): void;
function swap<T extends TreeNode>(tree: readonly T[], source: string, target: string, callback?: Callback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'swap');

  const cloneTree = clone(tree);

  const fromNode = findNode(cloneTree, source);

  const toNode = findNode(cloneTree, target);

  if (!fromNode || !toNode) throw exception('swap', 'Cannot found the from/to node with the given ids.');

  if (fromNode.id === toNode.id) {
    if (callback) return void callback(cloneTree);

    return cloneTree;
  }

  if (containsNode(cloneTree, source, target) || containsNode(cloneTree, target, source)) {
    throw exception('swap', 'Nodes cannot be swapped as one is a descendant of the other.');
  }

  const fromParent = findParent(cloneTree, fromNode) ?? { children: cloneTree as T[] };

  const toParent = findParent(cloneTree, toNode) ?? { children: cloneTree as T[] };

  const fromIndex = fromParent.children.findIndex((child) => child.id === fromNode.id);

  const toIndex = toParent.children.findIndex((child) => child.id === toNode.id);

  [fromParent.children[fromIndex], toParent.children[toIndex]] = [toParent.children[toIndex], fromParent.children[fromIndex]];

  if (callback) return void callback(cloneTree);

  return cloneTree;
}

export { swap };
