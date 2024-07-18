import { clone, noChildren } from '../helpers';
import type { NodeProperties, TreeNode, WithChildren, WithoutChildren } from '..';

export function select<T extends TreeNode, R = NodeProperties>(tree: readonly T[], selector: (node: WithoutChildren<T>) => R): R[] {
  const cloneTree = clone(tree);

  function traverse(nodes: T[]): R[] {
    return nodes.map((node) => {
      const selected = selector(node);

      if (!noChildren(node)) (selected as WithChildren<R>).children = traverse(node.children as T[]);

      return selected;
    });
  }

  return traverse(cloneTree);
}
