import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { TreeNode } from '$core/index';
import { find } from '$core/functions';

describe('find', async () => {
  let data: TreeNode[];
  const fn = vi.fn();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(find);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('returns undefined for empty tree', () => {
    const emptyTree: TreeNode[] = [];

    const nodeId = '1';

    expect(fn(emptyTree, nodeId)).toBeUndefined();
  });

  it('returns correct node for existing node in the tree', async () => {
    const fn = vi.fn(find);

    const nodeId = '4';

    const expectedNode = {
      id: '4',
      name: 'sub-category-2',
      children: [],
    };

    expect(fn(data, nodeId)).toStrictEqual(expectedNode);
    expect(fn(data, nodeId)).toMatchSnapshot();
  });

  it('returns correct node for existing node in the tree deeper', async () => {
    const nodeId = '5';

    const expectedNode = {
      id: '5',
      name: 'sub-category-3',
      children: [],
    };

    expect(fn(data, nodeId)).toStrictEqual(expectedNode);
    expect(fn(data, nodeId)).toMatchSnapshot();
  });
});
