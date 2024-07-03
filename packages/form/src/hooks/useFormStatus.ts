import { Hook } from '../hook';
import type { Api, FormStatus, FormStatusType, TData } from '../types';
import { useSelector } from '@legendapp/state/react';

function useFormStatus<T extends TData>(api: Api<T>): FormStatus;
function useFormStatus<T extends TData>(api: Api<T>, state: FormStatusType): boolean;
function useFormStatus<T extends TData>(api: Api<T>, state?: FormStatusType) {
  return useSelector(() => new Hook<T>(api).status(state));
}

export { useFormStatus };
