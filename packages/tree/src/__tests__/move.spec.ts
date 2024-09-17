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

    expect(() => fn(emptyTree, '1', null)(true)).toThrow(new Error('[Treekit:move] Cannot found the source node with the given id'));
    expect(fn(emptyTree, '1', null)(false)).toStrictEqual(emptyTree);

    expect(() => fn(data, '10', null)(true)).toThrow(new Error('[Treekit:move] Cannot found the source node with the given id'));
    expect(fn(data, '10', null)(false)).toStrictEqual(data);
  });

  it('throws an error when try move node to its own descendants', () => {
    const fn = vi.fn<ActualParameters<TreeNode, 'move'>>(move);

    expect(() => fn(data, '1', '3')(true)).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
    expect(fn(data, '1', '3')(false)).toStrictEqual(data);

    expect(() => fn(data, '1', '5')(true)).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
    expect(fn(data, '1', '5')(false)).toStrictEqual(data);

    expect(() => fn(data, '3', '5')(true)).toThrow(new Error('[Treekit:move] Cannot move the node into its own descendants.'));
    expect(fn(data, '3', '5')(false)).toStrictEqual(data);
  });

  it('moved nodeId:4 to nodeId:3 should', () => {
    expect(fn(data, '4', '3')(true)).toStrictEqual([
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

    expect(fn(data, '4', '3')(true)).toMatchSnapshot();
    expect(fn(data, '4', '3')(false)).toMatchSnapshot();

    fn(data, '4', '3', (newTree) => {
      expect(newTree).toMatchSnapshot();
    })(true);
  });

  it('moved nodeId:3 to nodeId:null (first level depth) should', () => {
    expect(fn(data, '3', null)(true)).toStrictEqual([
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

    expect(fn(data, '3', null)(true)).toMatchSnapshot();
    expect(fn(data, '3', null)(false)).toMatchSnapshot();

    fn(data, '3', null, (newTree) => {
      expect(newTree).toMatchSnapshot();
    })(true);
  });

  it('skip move processes if node moved to same dest', () => {
    expect(fn(data, '3', '1')(true)).toStrictEqual(data);
    expect(fn(data, '3', '1')(false)).toStrictEqual(data);
    expect(fn(data, '2', null)(true)).toStrictEqual(data);
    expect(fn(data, '2', null)(false)).toStrictEqual(data);
  });
});
