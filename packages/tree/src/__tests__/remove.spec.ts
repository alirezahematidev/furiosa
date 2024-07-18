import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { remove } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('remove', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'remove'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(remove);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('throws an error when parent node is not found', () => {
    expect(() => fn([], '1')).toThrow(new Error('[Treekit:remove] Cannot found the node with the given id'));
    expect(() => fn(data, '10')).toThrow(new Error('[Treekit:remove] Cannot found the node with the given id'));
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

    fn(data, '1', (newTree) => {
      expect(newTree).toStrictEqual([
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
    });

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

    fn(data, '1', (newTree) => {
      expect(newTree).toMatchSnapshot();
    });
  });
});
