import { Mutable } from '..';

export function clone<T extends object>(input: T, cache: WeakMap<T, any> = new WeakMap()): Mutable<T> {
  if (input === null || typeof input !== 'object') return input as Mutable<T>;

  if (cache.has(input)) return cache.get(input)!;

  if (Array.isArray(input)) {
    const clonedArr = new Array();

    for (let i = 0; i < input.length; i++) {
      clonedArr.push(clone(input[i], cache));
    }

    cache.set(input, clonedArr);

    return clonedArr as Mutable<T>;
  }

  const clonedObj = Object.create(Object.getPrototypeOf(input));

  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      clonedObj[key] = clone(input[key] as any, cache);
    }
  }

  cache.set(input, clonedObj);

  return clonedObj as Mutable<T>;
}
