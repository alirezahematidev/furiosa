import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { move } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('move', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'move'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(move);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('throws an error when node is not found', () => {
    const emptyTree: TreeNode[] = [];

    expect(() => fn(emptyTree, '1', null)).toThrow(new Error('[Treekit:move] Cannot found the source node with the given id'));
    expect(() => fn(data, '10', null)).toThrow(new Error('[Treekit:move] Cannot found the source node with the given id'));
  });

  it('throws an error when try move node to its own descendants', () => {
    const fn = vi.fn<ActualParameters<TreeNode, 'move'>>(move);

    expect(() => fn(data, '1', '3')).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
    expect(() => fn(data, '1', '5')).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
    expect(() => fn(data, '3', '5')).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
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

    fn(data, '3', null, (newTree) => {
      expect(newTree).toMatchSnapshot();
    });
  });

  it('skip move processes if node moved to same dest', () => {
    expect(fn(data, '3', '1')).toStrictEqual(data);
    expect(fn(data, '2', null)).toStrictEqual(data);
  });
});
