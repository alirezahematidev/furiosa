import { NodeProperties } from '$core/index';
import { select } from '$core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockTree = {
  id: string;
  name: string;
  children: MockTree[];
};

describe('select', async () => {
  const fn = vi.fn<(...args: Parameters<typeof select<MockTree>>) => NodeProperties[]>();

  beforeEach(() => {
    fn.mockImplementation(select);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('select name property from tree data', () => {
    const data = [
      {
        id: '1',
        name: 'node 1',
        children: [
          {
            id: '2',
            name: 'node 2',
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'node 3',
        children: [],
      },
    ];

    expect(fn(data, ({ name }) => ({ name }))).toStrictEqual([
      {
        name: 'node 1',
        children: [
          {
            name: 'node 2',
          },
        ],
      },
      {
        name: 'node 3',
      },
    ]);
  });

  it('select name property from tree data and add a new property to the node', () => {
    const data = [
      {
        id: '1',
        name: 'node 1',
        children: [
          {
            id: '2',
            name: 'node 2',
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'node 3',
        children: [],
      },
    ];

    expect(fn(data, ({ name }) => ({ name, upper: name.toUpperCase() }))).toStrictEqual([
      {
        name: 'node 1',
        upper: 'NODE 1',
        children: [
          {
            name: 'node 2',
            upper: 'NODE 2',
          },
        ],
      },
      {
        name: 'node 3',
        upper: 'NODE 3',
      },
    ]);
  });
});
