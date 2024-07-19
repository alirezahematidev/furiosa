import * as React from 'react';
import { useFormErrors } from '../../hooks';
import { Connect, Path, TData } from '../../types';
import { Render } from '../render';

interface ErrorMessageProps<T extends TData, TPath extends Path<T>> {
  name: TPath;
  connect: Connect<T>;
  /**
   * auto set height offset to avoid layout shift. set it to `null` to disable the offset
   * @default 20
   */
  space?: number | string | null;
  /**
   * if `space` set to null, `fallback` completely ignored
   */
  fallback?: React.ReactNode;
  className?: string;
}

function ErrorMessage<T extends TData, TPath extends Path<T>>({ connect, fallback = null, space = 20, className, name }: ErrorMessageProps<T, TPath>) {
  const error = useFormErrors<T, TPath>(connect, name);

  return (
    <React.Suspense key={name} fallback={space ? <div style={{ height: space }} /> : null}>
      <Render when={error} fallback={space ? fallback ?? <div style={{ height: space }} /> : null}>
        <span id={name} className={className} style={{ height: space ?? 'fit-content' }}>
          {error}
        </span>
      </Render>
    </React.Suspense>
  );
}

const MemoizedErrorMessage = React.memo(ErrorMessage) as typeof ErrorMessage;

export type { ErrorMessageProps };

export { MemoizedErrorMessage as ErrorMessage };
