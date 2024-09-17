import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { swap } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('swap', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'swap'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(swap);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('throws an error when the node is not found', () => {
    const emptyTree: TreeNode[] = [];

    expect(() => fn(emptyTree, '1', '2')(true)).toThrow(new Error('[Treekit:swap] Cannot found the from/to node with the given ids.'));
    expect(fn(emptyTree, '1', '2')(false)).toStrictEqual(emptyTree);

    expect(() => fn(data, '1', '10')(true)).toThrow(new Error('[Treekit:swap] Cannot found the from/to node with the given ids.'));
    expect(fn(data, '1', '10')(false)).toStrictEqual(data);
  });

  it('throws an error when the node is descendant of the other', () => {
    expect(() => fn(data, '3', '5')(true)).toThrow(new Error('[Treekit:swap] Nodes cannot be swapped as one is a descendant of the other.'));
    expect(fn(data, '5', '3')(false)).toStrictEqual(data);
  });

  it('returns updated tree data within the swapped nodes', () => {
    expect(fn(data, '3', '4')(true)).toStrictEqual([
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

    expect(fn(data, '3', '4')(true)).toMatchSnapshot();
    expect(fn(data, '3', '4')(false)).toMatchSnapshot();

    fn(data, '3', '4', (newTree) => {
      expect(newTree).toMatchSnapshot();
    })(true);
  });

  it('returns original tree data when swapped node with itself', () => {
    expect(fn(data, '3', '3')(true)).toStrictEqual(data);
    expect(fn(data, '3', '3')(false)).toStrictEqual(data);
  });

  it('returns original tree data when swapped nodes in same depth', () => {
    expect(fn(data, '1', '2')(true)).toStrictEqual([
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

    expect(fn(data, '1', '2')(true)).toMatchSnapshot();
    expect(fn(data, '1', '2')(false)).toMatchSnapshot();

    fn(data, '1', '2', (newTree) => {
      expect(newTree).toMatchSnapshot();
    })(true);
  });
});
