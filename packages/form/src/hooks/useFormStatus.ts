import { Provider } from '../provider';
import type { Connect, FormStatus, FormStatusType, TData } from '../types';
import { useSelector } from '@legendapp/state/react';

function useFormStatus<T extends TData>(connect: Connect<T>): FormStatus;
function useFormStatus<T extends TData>(connect: Connect<T>, state: FormStatusType): boolean;
function useFormStatus<T extends TData>(connect: Connect<T>, state?: FormStatusType) {
  return useSelector(() => new Provider<T>(connect).status(state));
}

export { useFormStatus };
