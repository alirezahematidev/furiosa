import * as React from 'react'
import { isFunction } from '@legendapp/state'
import { useObservable } from '@legendapp/state/react'
import { NOOP } from '../../helpers'
import { getEventValue } from '../../utils'
import type { DeepArrayPath, FieldProps, FieldPropsWithConnector, TData } from '../../types'
import { useFieldRegistry, useMergedRef } from '../../hooks'
import { Hook } from '../../hook'

function extractConnectorProps<T extends TData, TPath extends DeepArrayPath<T>>(props: FieldProps<T, TPath>) {
  const { _connect, disconnect } = props as FieldPropsWithConnector<T, TPath>

  return { _connect, disconnect }
}

export function useField<T extends TData, TPath extends DeepArrayPath<T>>(props: FieldProps<T, TPath>) {
  const { api, name, bindTo, shouldUnregister, render } = props

  const { _connect, disconnect } = extractConnectorProps(props)

  const innerRef = React.useRef<HTMLInputElement>(null)

  const hook = React.useMemo(() => new Hook<T>(api), [api])

  const binding$ = useObservable(() => {
    let binding = bindTo

    if (_connect) binding = (fields) => !fields(name)

    return binding ? binding(hook.get) : false
  }, [bindTo, _connect])

  const callbackRef = React.useCallback((node: HTMLInputElement) => {
    if (!node) return
  }, [])

  const ref = useMergedRef(innerRef, callbackRef)

  useFieldRegistry({
    hook,
    name,
    binding$,
    shouldUnregister: _connect || shouldUnregister,
  })

  const onChange = React.useCallback((event: any) => React.startTransition(() => hook.set(name, getEventValue(event))), [hook, name])

  // render

  if (binding$.get(true)) return NOOP

  return () => {
    const value = hook.get(name)

    if (_connect && (isFunction(disconnect) ? disconnect(value) : value)) return undefined

    const options = { value, name, ref, onChange }

    if (isFunction(render)) return render(options, hook.get)

    return React.cloneElement(render, { ...options, ...render.props })
  }
}
