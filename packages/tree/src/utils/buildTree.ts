import { FlatNode } from '$core/index';

type BuildTreeReturn<T extends FlatNode> = Omit<T, 'parentId'> & {
  id: string;
  children: BuildTreeReturn<T>[];
};

export function buildTree<T extends FlatNode>(flatNodes: T[]): BuildTreeReturn<T>[] {
  const nodesMap = new Map<string, BuildTreeReturn<T>>();

  for (const flatNode of flatNodes) {
    const { id, parentId, ...rest } = flatNode;

    nodesMap.set(id, { id, children: [], ...rest } as BuildTreeReturn<T>);
  }

  for (const flatNode of flatNodes) {
    const { id, parentId } = flatNode;

    const node = nodesMap.get(id)!;

    if (parentId !== null) {
      const parent = nodesMap.get(parentId)!;
      parent.children!.push(node);
    }
  }

  const roots: BuildTreeReturn<T>[] = [];

  for (const node of nodesMap.values()) {
    if (!flatNodes.some((flatNode) => flatNode.id === node.id && flatNode.parentId !== null)) {
      roots.push(node);
    }
  }

  return roots;
}
