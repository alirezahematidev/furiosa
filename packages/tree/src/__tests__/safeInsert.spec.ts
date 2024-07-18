import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeInsert } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('safeInsert', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'safeInsert'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(safeInsert);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('returns original data when parent node is not found', () => {
    const emptyTree: TreeNode[] = [];

    const node = {
      id: '10',
      name: 'category-3',
      children: [],
    };

    expect(fn(emptyTree, '3', node)).toStrictEqual(emptyTree);

    fn(emptyTree, '3', node, (tree, error) => {
      expect(tree).toStrictEqual(emptyTree);
      expect(error).toStrictEqual(new Error('[Treekit:safeInsert] Cannot found the destination node with the given id.'));
    });
  });

  it('returns updated tree including the inserted node at first level of tree within null destId', () => {
    const node = {
      id: '6',
      name: 'sub-category-root',
      children: [],
    };

    expect(fn(data, null, node)).toStrictEqual([
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

    expect(fn(data, null, node)).toMatchSnapshot();
  });

  it('returns updated tree including the inserted array of nodes', () => {
    const node = [
      {
        id: '6',
        name: 'sub-category-3',
        children: [],
      },
      {
        id: '7',
        name: 'sub-category-3',
        children: [],
      },
    ];

    expect(safeInsert(data, '3', node)).toStrictEqual([
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
              {
                id: '6',
                name: 'sub-category-3',
                children: [],
              },
              {
                id: '7',
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
    ]);

    expect(safeInsert(data, null, node)).toMatchSnapshot();
  });

  it('returns updated tree including the inserted node', () => {
    const node1 = {
      id: '10',
      name: 'sub-category-3',
      children: [],
    };

    const node2 = {
      id: '20',
      name: 'sub-category-10',
      children: [],
    };

    expect(fn(data, '3', node1)).toMatchSnapshot();

    expect(fn(data, '10', node2)).toStrictEqual(data);

    fn(data, '3', node2, (newTree, error) => {
      expect(error).toBeUndefined();
      expect(newTree).toMatchSnapshot();
    });

    fn(data, '10', node2, (newTree, error) => {
      expect(newTree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeInsert] Cannot found the destination node with the given id.'));
    });
  });
});
