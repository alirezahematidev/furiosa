import { TreeNode } from '$core/index';
import { size } from '$core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('size', async () => {
  const fn = vi.fn<(...args: Parameters<typeof size>) => number>();

  beforeEach(() => {
    fn.mockImplementation(size);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('should returns size 5', () => {
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

    expect(fn(data)).toBe(5);
  });

  it('should returns size 2', () => {
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

    expect(fn(data)).toBe(2);
  });

  it('should returns size 0', () => {
    const data: TreeNode[] = [];

    expect(fn(data)).toBe(0);
  });
});
