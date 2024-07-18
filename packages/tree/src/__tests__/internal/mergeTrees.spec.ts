import { TreeNode } from '$core/index';
import { mergeTrees } from '$core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('mergeTrees', async () => {
  const fn = vi.fn<(...args: Parameters<typeof mergeTrees>) => TreeNode[]>();

  beforeEach(() => {
    fn.mockImplementation(mergeTrees);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns the merged trees', () => {
    const tree1: TreeNode[] = [
      {
        id: '1',
        children: [
          { id: '2', children: [] },
          { id: '3', children: [] },
        ],
      },
      { id: '4', children: [{ id: '5', children: [] }] },
    ];

    const tree2: TreeNode[] = [
      { id: '1', children: [{ id: '6', children: [] }] },
      { id: '7', children: [{ id: '8', children: [] }] },
    ];

    const mergedTrees = fn(tree1, tree2);

    expect(mergedTrees).toStrictEqual([
      {
        id: '1',
        children: [
          { id: '2', children: [] },
          { id: '3', children: [] },
          { id: '6', children: [] },
        ],
      },
      { id: '4', children: [{ id: '5', children: [] }] },
      { id: '7', children: [{ id: '8', children: [] }] },
    ]);

    expect(mergedTrees).toMatchSnapshot();
  });

  it('should returns the merged complex trees', () => {
    const tree1: TreeNode[] = [
      {
        id: '1',
        children: [
          {
            id: '2',
            children: [
              { id: '3', children: [] },
              { id: '4', children: [] },
            ],
          },
          { id: '5', children: [] },
        ],
      },
      { id: '6', children: [{ id: '7', children: [{ id: '8', children: [] }] }] },
    ];

    const tree2: TreeNode[] = [
      {
        id: '1',
        children: [
          { id: '2', children: [{ id: '9', children: [] }] },
          { id: '10', children: [] },
        ],
      },
      { id: '6', children: [{ id: '11', children: [{ id: '12', children: [] }] }] },
    ];

    const tree3: TreeNode[] = [{ id: '13', children: [{ id: '14', children: [] }] }];

    const mergedTrees = fn(tree1, tree2, tree3);

    expect(mergedTrees).toStrictEqual([
      {
        id: '1',
        children: [
          {
            id: '2',
            children: [
              { id: '3', children: [] },
              { id: '4', children: [] },
              { id: '9', children: [] },
            ],
          },
          { id: '5', children: [] },
          { id: '10', children: [] },
        ],
      },
      {
        id: '6',
        children: [
          { id: '7', children: [{ id: '8', children: [] }] },
          { id: '11', children: [{ id: '12', children: [] }] },
        ],
      },
      { id: '13', children: [{ id: '14', children: [] }] },
    ]);

    expect(mergedTrees).toMatchSnapshot();
  });
});
