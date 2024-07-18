import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeMove } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('safeMove', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'safeMove'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(safeMove);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('returns original data when node is not found', () => {
    const emptyTree: TreeNode[] = [];

    expect(fn(emptyTree, '1', null)).toStrictEqual(emptyTree);
    expect(fn(data, '10', null)).toStrictEqual(data);

    fn(data, '10', null, (tree, error) => {
      expect(tree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeMove] Cannot found the source node with the given id.'));
    });
  });

  it('returns original data when try move node to its own descendants', () => {
    expect(fn(data, '1', '3')).toStrictEqual(data);
    expect(fn(data, '1', '5')).toStrictEqual(data);
    expect(fn(data, '3', '5')).toStrictEqual(data);

    fn(data, '1', '3', (tree, error) => {
      expect(tree).toStrictEqual(data);
      expect(error).toStrictEqual(new Error('[Treekit:safeMove] Cannot move the node into its own descendants.'));
    });
  });

  it('moved nodeId:4 to nodeId:3 should', () => {
    expect(fn(data, '4', '3')).toStrictEqual([
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
                id: '4',
                name: 'sub-category-2',
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

    expect(fn(data, '4', '3')).toMatchSnapshot();

    fn(data, '4', '3', (newTree) => {
      expect(newTree).toMatchSnapshot();
    });
  });

  it('moved nodeId:3 to nodeId:null (first level depth) should', () => {
    expect(fn(data, '3', null)).toStrictEqual([
      {
        id: '1',
        name: 'category-1',
        children: [],
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
    ]);

    expect(fn(data, '3', null)).toMatchSnapshot();

    fn(data, '3', null, (newTree, error) => {
      expect(error).toBeUndefined();
      expect(newTree).toMatchSnapshot();
    });
  });

  it('skip move processes if node moved to same dest', () => {
    expect(fn(data, '3', '1')).toStrictEqual(data);
    expect(fn(data, '2', null)).toStrictEqual(data);
  });
});
