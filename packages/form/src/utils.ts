import { Observable, isFunction, isObject, isPrimitive } from "@legendapp/state";
import type { TData } from "./types";

function structuredClonePolyfill(obj: any, hash = new WeakMap()) {
  if (isPrimitive(obj) || isFunction(obj)) return obj;

  if (hash.has(obj)) return hash.get(obj);

  if (obj instanceof Date) return new Date(obj);

  if (obj instanceof RegExp) return new RegExp(obj);

  const result = obj instanceof Array ? [] : obj.constructor ? new obj.constructor() : Object.create(null);

  hash.set(obj, result);

  for (const key in obj) {
    if (key in obj) result[key] = structuredClonePolyfill(obj[key], hash);
  }

  return result;
}

const clone = typeof structuredClone !== "undefined" ? structuredClone : structuredClonePolyfill;

function assert<T>(ins: T): asserts ins {
  if (!ins) throw new Error("Form is not instantiated.");
}

function separate<TPath extends string>(field: TPath) {
  const [key, ...nestedKeys] = field.split(".");

  return { key, nestedKeys };
}

function index<S extends Observable<unknown>>(obs: S, key: string | number) {
  return obs[key as keyof S] as S;
}

function getValidErrors<T extends object>(errors: T) {
  const validErrors = {} as T;

  for (const key in errors) {
    if (errors[key] === null) continue;

    validErrors[key] = errors[key];
  }

  if (Object.keys(validErrors).length === 0) return null;

  return validErrors;
}

function getSafeErrors<T extends object>(errors: T) {
  const validErrors = getValidErrors(errors);

  if (validErrors === null) return null;

  return new Proxy(validErrors, {
    get(target, prop, receiver) {
      if (!target[prop as keyof typeof target]) return null;

      return Reflect.get(target, prop, receiver);
    },
  });
}

function setPathValue<T extends TData, TPath extends string>(name: TPath, value: any): T {
  const keys = name.split(".");

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

function deepObserve<T extends TData, S>(obs: S, field: string): S;
function deepObserve(obs: any, field: string) {
  const { key, nestedKeys } = separate(field);

  return nestedKeys.reduce((prev, curr) => prev[curr], obs[key]);
}

type Event = { target: any };

const isBooleanInput = (element: any): element is HTMLInputElement => ["radio", "checkbox"].includes(element.type);

const getEventValue = (event: unknown) =>
  isObject(event) && (event as Event).target ? (isBooleanInput((event as Event).target) ? (event as Event).target.checked : (event as Event).target.value) : event;

export { assert, clone, getSafeErrors, separate, index, setPathValue, getEventValue, deepObserve, getValidErrors };
