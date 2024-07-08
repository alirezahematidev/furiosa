import type { ArrayPath, ArrayPathValue, FieldArrayWithIdentifier, TData, UseFieldArrayOptions, UseFieldArrayReturn, WithIdentifier } from '../types';
import { useMountOnce, useSelector } from '@legendapp/state/react';
import * as React from 'react';
import { ulid } from 'ulidx';
import { Provider } from '../provider';

function useFieldArray<T extends TData, TPath extends ArrayPath<T>, const Key extends string = 'id'>(
  options: UseFieldArrayOptions<T, TPath, Key>,
): UseFieldArrayReturn<T, TPath, Key> {
  const { connect, name, key = 'id', initialValues, disabled } = options;

  const { _select, ...methods } = React.useMemo(() => new Provider<T>(connect).array({ name, disabled }), [connect, disabled, name]);

  useMountOnce(() => {
    if (initialValues) methods.append(initialValues);
  });

  const values = useSelector<ArrayPathValue<T, TPath>[]>(_select);

  const fields = React.useMemo<FieldArrayWithIdentifier<T, TPath, Key>[]>(
    () =>
      values.map((item) => ({
        item,
        ...({ [key]: ulid() } as WithIdentifier<Key>),
      })),
    [key, values],
  );

  return { fields, ...methods };
}

export { useFieldArray };
