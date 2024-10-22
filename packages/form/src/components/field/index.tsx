import * as React from 'react';
import { Computed } from '@legendapp/state/react';
import { useField } from './useField';
import { DeepArrayPath, FieldProps, TData } from '../../types';

function Field<T extends TData, TPath extends DeepArrayPath<T>>(props: FieldProps<T, TPath>) {
  const render = useField<T, TPath>(props);

  return <Computed>{render}</Computed>;
}

const MemoizedField = React.memo(Field) as typeof Field;

export type { FieldProps };

export { MemoizedField as Field };
