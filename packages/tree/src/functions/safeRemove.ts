import { CallbackWithError, TreeNode } from '$core/index';
import { clone, exception, findNode, findParent, modifyWith, error, nonUniqueTreeWarning, assertion } from '../helpers';

function safeRemove<T extends TreeNode>(tree: readonly T[], id: string): T[];
function safeRemove<T extends TreeNode>(tree: readonly T[], id: string, callback: CallbackWithError<T>): void;
function safeRemove<T extends TreeNode>(tree: readonly T[], id: string, callback?: CallbackWithError<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'safeRemove');

  const cloneTree = clone(tree);

  const targetNode = findNode(cloneTree, id);

  if (!targetNode) {
    error('safeRemove', 'Cannot found the node with the given id.');

    if (callback) return void callback(tree, exception('safeRemove', 'Cannot found the node with the given id.'));

    return [...tree];
  }

  const parentNode = findParent(cloneTree, targetNode);

  if (!parentNode) {
    modifyWith(cloneTree, targetNode.id);

    if (callback) return void callback(cloneTree, undefined);

    return cloneTree;
  }

  if (!parentNode.children) parentNode.children = [];

  modifyWith(parentNode.children, targetNode.id);

  if (callback) return void callback(cloneTree, undefined);

  return cloneTree;
}

export { safeRemove };
