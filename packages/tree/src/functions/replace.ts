import { Callback, Replacer, TreeNode } from '$core/index';
import { assertion, clone, exception, findNode, findParent, modifyWith, nonUniqueTreeWarning } from '../helpers';

function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>): T[];
function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback: Callback<T>): void;
function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback?: Callback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'replace');

  const cloneTree = clone(tree);

  const targetNode = findNode(cloneTree, target);

  if (!targetNode) throw exception('replace', 'Cannot found the target node with the given id');

  if (!replacer.id) replacer.id = target;

  const parentNode = findParent(cloneTree, targetNode);

  if (!parentNode) {
    modifyWith(cloneTree, targetNode.id, replacer);

    if (callback) return void callback(cloneTree);

    return cloneTree;
  }

  if (!parentNode.children) parentNode.children = [];

  modifyWith(parentNode.children, targetNode.id, replacer);

  if (callback) return void callback(cloneTree);

  return cloneTree;
}

export { replace };
