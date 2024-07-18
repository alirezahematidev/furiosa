import { FlatNode, TreeNode } from '$core/index';
import { buildTree } from '$core/utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('buildTree', async () => {
  let treeData: TreeNode[];
  let flatData: FlatNode[];

  const fn = vi.fn();

  beforeAll(async () => {
    const { TREE_DATA, FLAT_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[]; FLAT_DATA: FlatNode[] }>('$core/__mocks__');

    treeData = TREE_DATA;
    flatData = FLAT_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(buildTree);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns tree version of given flat data', () => {
    expect(fn(flatData)).toStrictEqual(treeData);

    expect(fn(flatData)).toMatchSnapshot();
  });
});
