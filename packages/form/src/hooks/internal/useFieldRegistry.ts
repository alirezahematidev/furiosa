import { Hook } from '../../hook'
import { DeepArrayPath, TData } from '../../types'
import { Observable } from '@legendapp/state'
import { useEffect } from 'react'

type UseFieldRegistryProps<T extends TData, TPath extends DeepArrayPath<T>> = {
  name: TPath
  hook: Hook<T>
  binding$: Observable<() => boolean | Promise<boolean>>
  shouldUnregister?: boolean
}

export const useFieldRegistry = <T extends TData, TPath extends DeepArrayPath<T>>({ hook, name, shouldUnregister, binding$ }: UseFieldRegistryProps<T, TPath>) => {
  useEffect(() => {
    const dispose = binding$.onChange(({ value }) => {
      console.log('hhhhiiii', value)
      if (typeof value !== 'boolean') return

      hook[value ? 'unregister' : 'register'](name, shouldUnregister)
    })

    return dispose
  }, [hook, name, shouldUnregister, binding$])
}
