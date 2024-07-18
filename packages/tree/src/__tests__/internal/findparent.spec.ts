import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { TreeNode } from '$core/index';
import { findParent } from '../../helpers';

describe('findParent', async () => {
  let data: TreeNode[];

  const fn = vi.fn();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(findParent);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('returns undefined for empty tree', () => {
    const emptyTree: TreeNode[] = [];

    const node = {
      id: '1',
      name: 'category-1',
      children: [],
    };

    expect(fn(emptyTree, node)).toBeUndefined();
  });

  it('returns undefined when node is not found', async () => {
    const node = {
      id: '100',
      name: 'non-existent-node',
      children: [],
    };

    expect(fn(data, node)).toBeUndefined();
  });

  it('returns correct parent node for node with children', async () => {
    const node = {
      id: '3',
      name: 'sub-category-1',
      children: [
        {
          id: '5',
          name: 'sub-category-3',
          children: [],
        },
      ],
    };

    expect(fn(data, node)).toMatchSnapshot();
  });

  it('returns correct parent node for node with children', async () => {
    const node = {
      id: '4',
      name: 'sub-category-1',
      children: [],
    };

    expect(fn(data, node)).toMatchSnapshot();
  });
});
