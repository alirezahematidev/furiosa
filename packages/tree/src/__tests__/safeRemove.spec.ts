import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeRemove } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('safeRemove', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'safeRemove'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(safeRemove);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('returns original data error when parent node is not found', () => {
    const emptyTree: TreeNode[] = [];

    expect(fn(emptyTree, '1')).toStrictEqual(emptyTree);

    fn(emptyTree, '1', (tree, error) => {
      expect(tree).toStrictEqual(emptyTree);
      expect(error).toStrictEqual(new Error('[Treekit:safeRemove] Cannot found the node with the given id.'));
    });

    expect(fn(data, '10')).toStrictEqual(data);

    fn(data, '10', (tree, error) => {
      expect(tree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeRemove] Cannot found the node with the given id.'));
    });
  });

  it('removes the node from tree correctly', () => {
    const copy = [...data];

    expect(fn(data, '1')).toStrictEqual([
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

    expect(data).toStrictEqual(copy);

    expect(data).not.toStrictEqual([
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

    expect(fn(data, '4')).toStrictEqual([
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
        children: [],
      },
    ]);

    expect(data).toStrictEqual(copy);

    expect(data).not.toStrictEqual([
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
        children: [],
      },
    ]);

    expect(fn(data, '1')).toMatchSnapshot();

    fn(data, '1', (newTree, error) => {
      expect(error).toBeUndefined();
      expect(newTree).toMatchSnapshot();
    });
  });
});
