import * as React from 'react';
import { useObservable } from '@legendapp/state/react';
import { getEventValue, isFunction, NOOP } from '../../utils';
import { useMergedRef } from './useMergeRefs';
import type { DeepArrayPath, FieldProps, InternalFieldProps, TData } from '../../types';
import { Provider } from '../../provider';

function extractInternalProps<T extends TData, TPath extends DeepArrayPath<T>>(props: FieldProps<T, TPath>) {
  const { _bridge, disconnect } = props as InternalFieldProps<T, TPath>;

  return { _bridge, disconnect };
}

export function useField<T extends TData, TPath extends DeepArrayPath<T>>(props: FieldProps<T, TPath>) {
  const { connect, name, linkTo, shouldUnregister, render } = props;

  const { _bridge, disconnect } = extractInternalProps(props);

  const innerRef = React.useRef<HTMLInputElement>(null);

  const ref = useMergedRef(innerRef);

  const hook = React.useMemo(() => new Provider<T>(connect), [connect]);

  const isLinked = useObservable(() => {
    let linking = linkTo;

    if (_bridge) linking = (fields) => fields(name);

    return linking ? linking(hook.get) : false;
  }, [linkTo, name, _bridge]);

  React.useEffect(() => {
    const dispose = isLinked.onChange(({ value }) => {
      if (typeof value !== 'boolean') return;

      hook[value ? 'unregister' : 'register'](name, _bridge || shouldUnregister);
    });

    return dispose;
  }, [hook, name, _bridge, shouldUnregister, isLinked]);

  const onChange = React.useCallback((event: any) => React.startTransition(() => hook.set(name, getEventValue(event))), [hook, name]);

  // render

  if (isLinked.get(true)) return NOOP;

  return () => {
    const value = hook.get(name);

    if (_bridge && (isFunction(disconnect) ? disconnect(value) : value)) return undefined;

    const options = { value, name, ref, onChange };

    if (isFunction(render)) return render(options);

    return React.cloneElement(render, { ...options, ...render.props });
  };
}
