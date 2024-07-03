import { isFunction } from '@legendapp/state';
import { Show } from '@legendapp/state/react';
import * as React from 'react';

type RenderWhen<T> = T | null | boolean | undefined;

interface RenderProps<T> {
  when: RenderWhen<T> | (() => RenderWhen<T>);
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

function Render<T>({ children, when, fallback = null }: RenderProps<T>) {
  return (
    <Show if={isFunction(when) ? when() : when} else={fallback}>
      {() => children}
    </Show>
  );
}

const MemoizedRender = React.memo(Render) as typeof Render;

export { MemoizedRender as Render };
