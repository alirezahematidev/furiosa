import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

function assignRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (typeof ref === 'object' && ref !== null && 'current' in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

function mergeRefs<T>(...refs: PossibleRef<T>[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}

export function useMergedRef<T>(...refs: PossibleRef<T>[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(mergeRefs(...refs), refs);
}
