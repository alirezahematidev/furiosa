import { ErrorCallback, CurryFn, Replacer, TreeNode } from '$core/index';
import { assertion, clone, error, exception, findNode, findParent, modifyWith, nonUniqueTreeWarning } from '../helpers';

function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>): CurryFn<T[]>;
function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback: ErrorCallback<T>): CurryFn<void>;
function replace<T extends TreeNode>(tree: readonly T[], target: string, replacer: Replacer<T>, callback?: ErrorCallback<T>) {
  assertion(tree);

  nonUniqueTreeWarning(tree, 'replace');

  return (throwOnError?: boolean) => {
    const cloneTree = clone(tree);

    const targetNode = findNode(cloneTree, target);

    if (!targetNode) {
      if (throwOnError) throw exception('replace', 'Cannot found the target node with the given id');

      error('replace', 'Cannot found the target node with the given id.');

      if (callback) return void callback(tree, exception('replace', 'Cannot found the target node with the given id.'));

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
  };
}

export { replace };
