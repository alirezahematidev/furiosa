import { TreeNode } from '$core/index';
import { filterTree } from '$core/utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('filterTree', async () => {
  let data: TreeNode[];

  const fn = vi.fn<(...args: Parameters<typeof filterTree>) => TreeNode[]>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(filterTree);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns empty array tree if predicate is false for all nodes', () => {
    expect(fn(data, (node) => node.id === '99')).toStrictEqual([]);
  });

  it('should returns filtered tree', () => {
    expect(fn(data, (node) => node.id === '3')).toStrictEqual([
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

    expect(fn(data, (node) => node.id === '3')).toMatchSnapshot();
  });

  it('should returns filtered tree', () => {
    expect(fn(data, (node) => ['4', '5'].includes(node.id))).toStrictEqual([
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
    ]);

    expect(fn(data, (node) => ['4', '5'].includes(node.id))).toMatchSnapshot();
  });
});
