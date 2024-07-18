import { TreeNode } from '$core/index';

export function mergeTrees<T extends TreeNode>(...trees: T[][]): T[] {
  const mergedMap = new Map<string, T>();

  function mergeNode(node: T) {
    if (!mergedMap.has(node.id)) {
      mergedMap.set(node.id, { ...node });
    } else {
      const existingNode = mergedMap.get(node.id)!;
      mergedMap.set(node.id, {
        ...existingNode,
        ...node,
        children: mergeChildNodes(existingNode.children, node.children),
      });
    }
  }

  function mergeChildNodes<T extends TreeNode>(children: T[] = [], newChildren: T[] = []) {
    const childMap = new Map<string, T>();

    children.forEach((child) => {
      childMap.set(child.id, { ...child });
    });

    newChildren.forEach((child) => {
      if (!childMap.has(child.id)) {
        childMap.set(child.id, { ...child });
      } else {
        const existingChild = childMap.get(child.id)!;
        childMap.set(child.id, {
          ...existingChild,
          ...child,
          children: mergeChildNodes(existingChild.children, child.children),
        });
      }
    });

    return Array.from(childMap.values());
  }

  trees.forEach((tree) => {
    tree.forEach((node) => {
      mergeNode(node);
    });
  });

  return Array.from(mergedMap.values());
}
