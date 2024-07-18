import { NodeProperties } from '$core/index';
import { selectAsync } from '$core/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type MockTree = {
  id: string;
  name: string;
  children: MockTree[];
};

describe('selectAsync', async () => {
  const fn = vi.fn<(...args: Parameters<typeof selectAsync<MockTree>>) => Promise<NodeProperties[]>>();

  beforeEach(() => {
    fn.mockImplementation(selectAsync);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('select name property from tree data', async () => {
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

    const selectedNodes = await fn(data, ({ name }) => new Promise((resolve) => resolve({ name })));

    expect(selectedNodes).toStrictEqual([
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

  it('select name property from tree data and add a new property to the node', async () => {
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

    const selectedNodes = await fn(data, ({ name }) => new Promise((resolve) => resolve({ name, upper: name.toUpperCase() })));

    expect(selectedNodes).toStrictEqual([
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

  it('should catch the error and returns array of empty root nodes', async () => {
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

    const selectedNodes = await fn(data, () => new Promise((_, reject) => reject('a error')));

    expect(selectedNodes).toStrictEqual([{}, {}]);
  });
});
