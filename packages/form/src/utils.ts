import { Observable } from '@legendapp/state';
import type { ErrorResult, Event, FormError, Path, TData } from './types';
import { ZodIssue } from 'zod';

export const NOOP = () => void null;

function isArray(obj: unknown): obj is Array<any> {
  return typeof obj === 'object' && Array.isArray(obj);
}

function isPrimitive(arg: unknown): arg is string | number | bigint | boolean | symbol {
  return typeof arg === 'string' || typeof arg === 'number' || typeof arg === 'bigint' || typeof arg === 'boolean' || typeof arg === 'symbol';
}

function isEmpty(obj: object): boolean {
  return Object.keys(obj ?? {}).length === 0;
}

export function isObject(obj: unknown): obj is Record<any, any> {
  return typeof obj === 'object';
}

export function isFunction(obj: unknown): obj is Function {
  return typeof obj === 'function';
}

export function getArray(value: any) {
  return Array.isArray(value) ? value : [value];
}

export function arraysEqual(arr1: (number | string)[], arr2: (number | string)[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => String(value) === String(arr2[index]));
}

export function setFieldErrorMessage(issue: ZodIssue) {
  const keys = issue.path.filter((key) => isNaN(Number(key)));

  const result: Record<string, any> = {};

  let current = result;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = issue.message;
    } else {
      current[key] = current[key] || {};
      current = current[key];
    }
  }

  return result;
}

function standardizeErrorsShape<T extends TData, R>(input: R, nullable = true) {
  if (input === null || !isObject(input)) return null;

  const entries = Object.entries(input);

  const result = Object.fromEntries(entries.filter(([_, value]) => (nullable ? typeof value !== 'undefined' : Boolean(value))));

  if (isEmpty(result)) return null;

  return result as FormError<T>;
}

export const transform = <T extends TData, TPath extends Path<T>, R>(input: R): FormError<T> | ErrorResult<T, TPath> => {
  if (!input) return null;

  if (isObject(input)) return standardizeErrorsShape(standardizeErrorsShape(input), false);

  if (isArray(input) && (input as Array<string>).length === 0) return null;

  return input as ErrorResult<T, TPath>;
};

export function clone(obj: any, hash = new WeakMap()) {
  if (typeof structuredClone !== 'undefined') return structuredClone(obj);

  if (isPrimitive(obj) || isFunction(obj)) return obj;

  if (hash.has(obj)) return hash.get(obj);

  if (obj instanceof Date) return new Date(obj);

  if (obj instanceof RegExp) return new RegExp(obj);

  const result = obj instanceof Array ? [] : obj.constructor ? new obj.constructor() : Object.create(null);

  hash.set(obj, result);

  for (const key in obj) {
    if (key in obj) result[key] = clone(obj[key], hash);
  }

  return result;
}

export function index<S extends Observable<unknown>>(obs: S, key: string | number) {
  return obs[key as keyof S] as S;
}

export function getValidErrors<T extends object>(errors: T) {
  const validErrors = {} as T;

  for (const key in errors) {
    if (errors[key] === null) continue;

    validErrors[key] = errors[key];
  }

  if (Object.keys(validErrors).length === 0) return null;

  return validErrors;
}

export function getSafeErrors<T extends object>(errors: T) {
  const validErrors = getValidErrors(errors);

  if (validErrors === null) return null;

  return new Proxy(validErrors, {
    get(target, prop, receiver) {
      if (!target[prop as keyof typeof target]) return null;

      return Reflect.get(target, prop, receiver);
    },
  });
}

export function setPathValue<T extends TData, TPath extends string>(name: TPath, value: any): T {
  const keys = name.split('.');

  const result = {} as T;

  let current: T | T[] = result;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (!isNaN(Number(key))) {
      const index = Number(key);

      if (!Array.isArray(current)) {
        current = [];
      }

      if (i === keys.length - 1) {
        (current as T[])[index] = value;
      } else {
        current[index] = (current[index] || (isNaN(Number(keys[i + 1])) ? {} : [])) as T;
        current = current[index];
      }
    } else {
      if (i === keys.length - 1) {
        (current as T)[key as keyof T] = value;
      } else {
        (current as T)[key as keyof T] = (current as T)[key] || (isNaN(Number(keys[i + 1])) ? {} : []);
        current = (current as T)[key];
      }
    }
  }

  return result;
}

export function deepObserve<T extends TData, S>(obs: S, field: string): S;
export function deepObserve(obs: any, field: string) {
  const [key, ...nestedKeys] = field.split('.');

  return nestedKeys.reduce((prev, curr) => prev[curr], obs[key]);
}

const isBooleanInput = (element: any): element is HTMLInputElement => ['radio', 'checkbox'].includes(element.type);

export const getEventValue = (event: unknown) =>
  isObject(event) && (event as Event).target ? (isBooleanInput((event as Event).target) ? (event as Event).target.checked : (event as Event).target.value) : event;
