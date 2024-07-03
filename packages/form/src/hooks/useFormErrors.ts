import { Hook } from '../hook';
import type { Api, ErrorResult, FormError, Path, TData } from '../types';
import { useSelector } from '@legendapp/state/react';

function useFormErrors<T extends TData>(api: Api<T>): FormError<T>;
function useFormErrors<T extends TData, TPath extends Path<T>>(api: Api<T>, name: TPath): ErrorResult<T, TPath>;
function useFormErrors<T extends TData, TPath extends Path<T>>(api: Api<T>, name?: TPath) {
  return useSelector(() => new Hook<T>(api).error(name), { suspense: true });
}

export { useFormErrors };
