import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { replace } from '../functions';
import { ActualParameters, TreeNode } from '$core/index';

describe('replace', async () => {
  let data: TreeNode[];
  const fn = vi.fn<ActualParameters<TreeNode, 'replace'>>();

  beforeAll(async () => {
    const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

    data = TREE_DATA;
  });

  beforeEach(() => {
    fn.mockImplementation(replace);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('throws an error when node is not found', () => {
    expect(() => fn([], '1', {})(true)).toThrow(new Error('[Treekit:replace] Cannot found the target node with the given id'));
    expect(fn([], '1', {})(false)).toStrictEqual([]);

    expect(() => fn(data, '10', {})(true)).toThrow(new Error('[Treekit:replace] Cannot found the target node with the given id'));
    expect(fn(data, '10', {})(false)).toStrictEqual(data);
  });

  it('returns updated tree within replaced node that has id', () => {
    expect(
      fn(data, '5', {
        id: '10',
        name: 'new node',
        children: [],
      })(true),
    ).toStrictEqual([
      {
        id: '1',
        name: 'category-1',
        children: [
          {
            id: '3',
            name: 'sub-category-1',
            children: [
              {
                id: '10',
                name: 'new node',
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
    ]);

    expect(
      fn(data, '5', {
        id: '10',
        name: 'new node',
        children: [],
      })(true),
    ).toMatchSnapshot();

    expect(
      fn(data, '5', {
        id: '10',
        name: 'new node',
        children: [],
      })(false),
    ).toMatchSnapshot();

    fn(
      data,
      '5',
      {
        id: '10',
        name: 'new node',
        children: [],
      },
      (newTree) => {
        expect(newTree).toMatchSnapshot();
      },
    )(true);
  });

  it('returns updated tree within replaced node that has not id', () => {
    expect(
      fn(data, '5', {
        name: 'new node',
        children: [],
      })(true),
    ).toStrictEqual([
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
                name: 'new node',
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
    ]);

    expect(
      fn(data, '5', {
        name: 'new node',
        children: [],
      })(true),
    ).toMatchSnapshot();

    expect(
      fn(data, '5', {
        name: 'new node',
        children: [],
      })(false),
    ).toMatchSnapshot();

    fn(
      data,
      '5',
      {
        name: 'new node',
        children: [],
      },
      (newTree) => {
        expect(newTree).toMatchSnapshot();
      },
    )(true);
  });

  it('returns updated tree within replaced node that placed in first depth', () => {
    expect(
      fn(data, '1', {
        id: '10',
        name: 'new node',
        children: [],
      })(true),
    ).toStrictEqual([
      {
        id: '10',
        name: 'new node',
        children: [],
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
    ]);

    expect(
      fn(data, '1', {
        id: '10',
        name: 'new node',
        children: [],
      })(true),
    ).toMatchSnapshot();

    expect(
      fn(data, '1', {
        id: '10',
        name: 'new node',
        children: [],
      })(false),
    ).toMatchSnapshot();

    fn(
      data,
      '1',
      {
        id: '10',
        name: 'new node',
        children: [],
      },
      (newTree) => {
        expect(newTree).toMatchSnapshot();
      },
    )(true);
  });
});
