import * as React from 'react';
import { Show } from '@legendapp/state/react';
import { isFunction } from '../../utils';

type RenderWhen<T> = T | null | boolean | undefined;

interface RenderProps<T> {
  when: RenderWhen<T> | (() => RenderWhen<T>);
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function Render<T>(props: RenderProps<T>) {
  const { children, when, fallback = null } = props;

  return (
    <Show if={isFunction(when) ? when() : when} else={fallback}>
      {() => children}
    </Show>
  );
}

const MemoizedRender = React.memo(Render) as typeof Render;

export type { RenderProps };

export { MemoizedRender as Render };
