import { Hook } from '../hook'
import type { ArrayPath, ArrayPathValue, FieldArrayWithIdentifier, TData, UseFieldArrayOptions, UseFieldArrayReturn, WithIdentifier } from '../types'
import { useMountOnce, useSelector } from '@legendapp/state/react'
import { useMemo } from 'react'
import { ulid } from 'ulidx'

function useFieldArray<T extends TData, TPath extends ArrayPath<T>, const Key extends string = 'id'>(
  options: UseFieldArrayOptions<T, TPath, Key>,
): UseFieldArrayReturn<T, TPath, Key> {
  const { api, name, key = 'id', initialValues, disabled } = options

  const { _select, ...methods } = useMemo(() => new Hook<T>(api).array({ name, disabled }), [api, disabled, name])

  useMountOnce(() => {
    if (initialValues) methods.append(initialValues)
  })

  const values = useSelector<ArrayPathValue<T, TPath>[]>(_select)

  const fields = useMemo<FieldArrayWithIdentifier<T, TPath, Key>[]>(
    () =>
      values.map((item) => ({
        item,
        ...({ [key]: ulid() } as WithIdentifier<Key>),
      })),
    [key, values],
  )

  return { fields, ...methods }
}

export { useFieldArray }
