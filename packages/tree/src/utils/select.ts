import { clone, noChildren, safeError } from '../helpers';
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

export async function selectAsync<T extends TreeNode, R = NodeProperties>(tree: readonly T[], selector: (node: WithoutChildren<T>) => Promise<R>): Promise<R[]> {
  const cloneTree = clone(tree);

  async function traverse(nodes: T[]): Promise<R[]> {
    return Promise.all(
      nodes.map(async (node) => {
        try {
          const selected = await selector(node);

          if (!noChildren(node)) (selected as WithChildren<R | undefined>).children = await traverse(node.children as T[]);

          return selected;
        } catch (error) {
          safeError(error);

          return {} as R;
        }
      }),
    );
  }

  return traverse(cloneTree);
}
