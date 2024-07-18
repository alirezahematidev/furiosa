import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clone } from '../../helpers';

describe('clone', async () => {
  const fn = vi.fn();

  beforeEach(() => {
    fn.mockImplementation(clone);
  });

  afterEach(() => {
    fn.mockReset();
  });

  it('clone keeps the original data as array of primitives untouced', () => {
    const original = [1, 2, 3, 4];

    const cloned = fn(original);

    cloned[0] = 10;

    expect(original).toStrictEqual([1, 2, 3, 4]);
    expect(cloned).toStrictEqual([10, 2, 3, 4]);
  });

  it('clone keeps the original data as array of refs untouced', () => {
    const original = [{ count: 1 }, { count: 2 }];

    const cloned = fn(original);

    cloned[0].count = 10;

    expect(original).toStrictEqual([{ count: 1 }, { count: 2 }]);
    expect(cloned).toStrictEqual([{ count: 10 }, { count: 2 }]);
  });
});
