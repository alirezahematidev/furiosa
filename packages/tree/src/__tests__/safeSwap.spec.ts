import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeSwap } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('safeSwap', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'safeSwap'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(safeSwap);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('throws an error when the node is not found', () => {
    const emptyTree: TreeNode[] = [];

    expect(fn(emptyTree, '1', '2')).toStrictEqual(emptyTree);
    expect(fn(data, '1', '10')).toStrictEqual(data);

    fn(data, '1', '10', (tree, error) => {
      expect(tree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeSwap] Cannot found the from/to node with the given ids.'));
    });
  });

  it('throws an error when the node is descendant of the other', () => {
    expect(fn(data, '3', '5')).toStrictEqual(data);
    expect(fn(data, '5', '3')).toStrictEqual(data);

    fn(data, '5', '3', (tree, error) => {
      expect(tree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeSwap] Nodes cannot be swapped as one is a descendant of the other.'));
    });
  });

  it('returns updated tree data within the swapped nodes', () => {
    expect(fn(data, '3', '4')).toStrictEqual([
      {
        id: '1',
        name: 'category-1',
        children: [
          {
            id: '4',
            name: 'sub-category-2',
            children: [],
          },
        ],
      },
      {
        id: '2',
        name: 'category-2',
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
    ]);

    expect(fn(data, '3', '4')).toMatchSnapshot();

    fn(data, '3', '4', (newTree, error) => {
      expect(error).toBeUndefined();
      expect(newTree).toMatchSnapshot();
    });
  });

  it('returns original tree data when swapped node with itself', () => {
    expect(fn(data, '3', '3')).toStrictEqual(data);
  });

  it('returns original tree data when swapped nodes in same depth', () => {
    expect(fn(data, '1', '2')).toStrictEqual([
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
    ]);

    expect(fn(data, '1', '2')).toMatchSnapshot();

    fn(data, '1', '2', (newTree, error) => {
      expect(error).toBeUndefined();
      expect(newTree).toMatchSnapshot();
    });
  });
});
