import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { containsNode } from '../../helpers';
import { TreeNode } from '$core/index';

describe('containsNode', async () => {
  const fn = vi.fn();

  beforeEach(() => {
    fn.mockImplementation(containsNode);
  });

  afterEach(() => {
    fn.mockReset();
  });

  const { TREE_DATA } = await vi.importActual<{ TREE_DATA: TreeNode[] }>('$core/__mocks__');

  it('returns false if tree is empty', () => {
    expect(fn([], '3', '1')).toBeFalsy();
  });

  it('returns false if destId is null', () => {
    expect(fn(TREE_DATA, '3', null)).toBeFalsy();
  });

  it('returns false if nodeId is equals to destId', () => {
    expect(fn(TREE_DATA, '1', '1')).toBeFalsy();
  });

  it('returns false if node appears in node 2', () => {
    expect(fn(TREE_DATA, '2', '3')).toBeFalsy();
  });

  it('returns true if node appears in node 1', () => {
    expect(fn(TREE_DATA, '1', '3')).toBeTruthy();
  });

  it('returns true if node appears in node 2', () => {
    expect(fn(TREE_DATA, '2', '4')).toBeTruthy();
  });
});
