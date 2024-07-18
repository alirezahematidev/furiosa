import { TreeNode } from '$core/index';

export function getPath<T extends TreeNode>(tree: readonly T[], id: string): string[] {
  const path: string[] = [];

  const findPath = (nodes: readonly T[], nodeId: string): boolean => {
    for (const node of nodes) {
      path.push(node.id);

      if (node.id === nodeId) return true;

      if (node.children && findPath(node.children as T[], nodeId)) return true;
    }

    return false;
  };

  findPath(tree, id);

  return path;
}
