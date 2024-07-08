import { Provider } from '../provider';
import type { Connect, DeepArrayPath, DeepArrayPathValue, TData } from '../types';
import { useSelector } from '@legendapp/state/react';

function useFormValues<T extends TData>(connect: Connect<T>): T;
function useFormValues<T extends TData, TPath extends DeepArrayPath<T>>(connect: Connect<T>, name: TPath): DeepArrayPathValue<T, TPath>;
function useFormValues<T extends TData, TPath extends DeepArrayPath<T>>(connect: Connect<T>, name?: TPath) {
  return useSelector(() => new Provider<T>(connect).get(name));
}

export { useFormValues };
