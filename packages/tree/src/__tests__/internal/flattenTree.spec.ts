import { FlatNode, TreeNode } from '$core/index';
import { flattenTree } from '$core/utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('flattenTree', async () => {
  let treeData: TreeNode[];
  let flatData: FlatNode[];

  const fn = vi.fn<(...args: Parameters<typeof flattenTree>) => any[]>();

  beforeAll(async () => {
    const { TREE_DATA, FLAT_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[]; FLAT_DATA: FlatNode[] }>('$core/__mocks__');

    treeData = TREE_DATA;
    flatData = FLAT_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(flattenTree);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns flat version of given tree data', () => {
    expect(fn(treeData)).toStrictEqual(flatData);
    expect(fn(treeData)).toMatchSnapshot();
  });
});
