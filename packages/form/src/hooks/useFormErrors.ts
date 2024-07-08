import { Provider } from '../provider';
import type { Connect, ErrorResult, FormError, Path, TData } from '../types';
import { useSelector } from '@legendapp/state/react';

function useFormErrors<T extends TData>(connect: Connect<T>): FormError<T>;
function useFormErrors<T extends TData, TPath extends Path<T>>(connect: Connect<T>, name: TPath): ErrorResult<T, TPath>;
function useFormErrors<T extends TData, TPath extends Path<T>>(connect: Connect<T>, name?: TPath) {
  return useSelector(() => new Provider<T>(connect).error(name), { suspense: true });
}

export { useFormErrors };
