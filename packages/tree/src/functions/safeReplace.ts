import { CallbackWithError, Replacer, TreeNode } from '$core/index';
import { clone, exception, findNode, findParent, modifyWith, error, nonUniqueTreeWarning, assertion } from '../helpers';

function safeReplace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>): T[];
function safeReplace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback: CallbackWithError<T>): void;
function safeReplace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback?: CallbackWithError<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'safeReplace');

  const cloneTree = clone(tree);

  const targetNode = findNode(cloneTree, target);

  if (!targetNode) {
    error('safeReplace', 'Cannot found the target node with the given id.');

    if (callback) return void callback(tree, exception('safeReplace', 'Cannot found the target node with the given id.'));

    return [...tree];
  }

  if (!replacer.id) replacer.id = target;

  const parentNode = findParent(cloneTree, targetNode);

  if (!parentNode) {
    modifyWith(cloneTree, targetNode.id, replacer);

    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  }

  if (!parentNode.children) parentNode.children = [];

  modifyWith(parentNode.children, targetNode.id, replacer);

  if (callback) return void callback(cloneTree, undefined);

  return cloneTree;
}

export { safeReplace };
