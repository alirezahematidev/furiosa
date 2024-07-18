import { TreeNode } from '$core/index';
import { getPath } from '$core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getPath', async () => {
  const fn = vi.fn<(...args: Parameters<typeof getPath>) => string[]>();

  beforeEach(() => {
    fn.mockImplementation(getPath);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns path of node', () => {
    const data = [
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
        children: [
          {
            id: '4',
            name: 'sub-category-2',
            children: [],
          },
        ],
      },
    ];

    expect(fn(data, '5')).toStrictEqual(['1', '3', '5']);
  });

  it('should returns path of node at first level', () => {
    const data = [
      {
        id: '1',
        name: 'category-1',
        children: [
          {
            id: '3',
            name: 'sub-category-1',
            children: [],
          },
        ],
      },
    ];

    expect(fn(data, '1')).toStrictEqual(['1']);
  });

  it('should returns empty path', () => {
    const data: TreeNode[] = [];

    expect(fn(data, '1')).toStrictEqual([]);
    expect(fn(data, '10')).toStrictEqual([]);
  });
});
