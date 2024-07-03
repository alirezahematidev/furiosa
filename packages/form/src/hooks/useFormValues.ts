import { Hook } from '../hook'
import type { Api, DeepArrayPath, DeepArrayPathValue, TData } from '../types'
import { useSelector } from '@legendapp/state/react'

function useFormValues<T extends TData>(api: Api<T>): T
function useFormValues<T extends TData, TPath extends DeepArrayPath<T>>(api: Api<T>, name: TPath): DeepArrayPathValue<T, TPath>
function useFormValues<T extends TData, TPath extends DeepArrayPath<T>>(api: Api<T>, name?: TPath) {
  return useSelector(() => new Hook<T>(api).get(name))
}

export { useFormValues }
