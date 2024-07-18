import { TreeNode } from '$core/index';
import Tree from '$core/tree';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('tree', async () => {
  const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

  let tree: Tree<TreeNode>;

  beforeEach(() => {
    tree = new Tree(TREE_DATA);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should returns updated tree after insert', () => {
    const node = {
      id: '6',
      name: 'sub-category-root',
      children: [],
    };

    expect(tree.insert(null, node).getTree()).toStrictEqual([
      {
        id: '1',
        name: 'category-1',
        children: [
          {
            id: '3',
            name: 'sub-category-1',
            children: [
              {
                id: '5',
                name: 'sub-category-3',
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'category-2',
        children: [
          {
            id: '4',
            name: 'sub-category-2',
            children: [],
          },
        ],
      },
      {
        id: '6',
        name: 'sub-category-root',
        children: [],
      },
    ]);

    expect(tree.originalTree).toStrictEqual(TREE_DATA);
  });

  it('should returns updated tree after insert, remove and move', () => {
    const node = {
      id: '6',
      name: 'sub-category-root',
      children: [],
    };

    expect(tree.insert(null, node).remove('5').move('4', '6').getTree()).toStrictEqual([
      {
        id: '1',
        name: 'category-1',
        children: [
          {
            id: '3',
            name: 'sub-category-1',
            children: [],
          },
        ],
      },
      {
        id: '2',
        name: 'category-2',
        children: [],
      },
      {
        id: '6',
        name: 'sub-category-root',
        children: [
          {
            id: '4',
            name: 'sub-category-2',
            children: [],
          },
        ],
      },
    ]);

    expect(tree.originalTree).toStrictEqual(TREE_DATA);
  });
});
