import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { MaybeNode, TreeNode } from '$core/index';
import { findNode } from '../../helpers';

describe('findNode', async () => {
  let data: TreeNode[];

  const fn = vi.fn<(...args: Parameters<typeof findNode>) => MaybeNode<TreeNode>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(findNode);
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
    const nodeId = '4';

    const expectedNode = {
      id: '4',
      name: 'sub-category-2',
      children: [],
    };

    expect(fn(data, nodeId)).toStrictEqual(expectedNode);
    expect(fn(data, nodeId)).toMatchSnapshot();
  });
});
