import { ListenerParams, Observable, ObservableListenerDispose, ObservableObject, ObservableParam, batch, setInObservableAtPath } from '@legendapp/state'
import type {
  ArrayLikeValue,
  ArrayPathValue,
  FieldArrayParams,
  FieldValues,
  FormError,
  FormHistory,
  FormStatus,
  FormStatusType,
  RevalidateMode,
  TData,
  ValidatorCreator,
} from './types'
import { SyntheticEvent } from 'react'
import { deepObserve, getValidErrors, setPathValue } from './utils'
import { parseSchemaValidator } from './validator'
import { getArray } from './helpers'

export class _Internal<T extends TData> {
  private unregisteredFields: Set<string> = new Set()

  private history: FormHistory = new Map()

  private dispose: ObservableListenerDispose | null = null

  private fieldNodes: Map<string, HTMLElement> = new Map()

  private readonly EMPTY_STRING = ''

  constructor(
    private readonly table$: Observable<T>,
    private readonly error$: Observable<FormError<T>>,
    private readonly status$: ObservableObject<FormStatus>,
    private readonly validator: ValidatorCreator<T> | undefined,
    private readonly revalidateMode: RevalidateMode,
  ) {}

  private chunk(input: string) {
    return input.split('.').join('_')
  }

  private disabled<TPath extends string>(field: TPath) {
    return this.unregisteredFields.has(field) || this.status$.isLoading.get()
  }

  private get getFields() {
    return this.get.bind(this) as FieldValues<T>
  }

  private trigger<TPath extends string>(field: TPath, dispose: ObservableListenerDispose | null) {
    const keys = field.split('.')

    return async ({ changes, value }: ListenerParams) => {
      if (typeof value === 'undefined') return

      const data = setPathValue<T, TPath>(field, value)

      this.status$.isValidating.set(true)

      const errors = await parseSchemaValidator<T>({
        data,
        keys,
        validator: this.validator,
        getFields: this.getFields.bind(this),
      })

      this.status$.isValidating.set(false)

      batch(() => changes.forEach(({ path, pathTypes }) => setInObservableAtPath(this.error$[keys[0] as keyof Observable<FormError<T>>], path, pathTypes, errors, 'set')))

      if (dispose) dispose()
    }
  }

  public async revalidate(mode: RevalidateMode) {
    if (mode !== this.revalidateMode) return

    const data = this.table$.get()

    this.status$.isValidating.set(true)

    const errors = await parseSchemaValidator<T>({
      data,
      keys: [],
      validator: this.validator,
      getFields: this.getFields.bind(this),
    })

    this.status$.isValidating.set(false)

    setInObservableAtPath(this.error$ as ObservableParam<FormError<T>>, [], [], errors, 'set')
  }

  public submit(onResolve: (data: T) => void | Promise<void>, onReject?: (errors: FormError<T>) => void | Promise<void>) {
    return async (event?: SyntheticEvent<any>) => {
      if (event && 'preventDefault' in event) event.preventDefault()

      await this.revalidate('submit')

      const errors: FormError<T> = getValidErrors(this.error$.get())

      this.status$.isSubmitting.set(true)

      await (errors === null ? onResolve(this.table$.get()) : onReject?.(errors))

      this.status$.isSubmitting.set(false)
    }
  }

  public register<TPath extends string>(field: TPath, shouldUnregister?: boolean) {
    this.unregisteredFields.delete(field)

    if (shouldUnregister) return

    const keptValue = this.history.get(field)

    if (keptValue) deepObserve(this.table$, field).set(keptValue)
  }

  public unregister<TPath extends string>(field: TPath, shouldUnregister?: boolean) {
    this.unregisteredFields.add(field)

    this.fieldNodes.delete(field)

    const current = deepObserve(this.table$, field)

    if (shouldUnregister) this.history.delete(field)
    else this.history.set(field, current.peek())

    current.delete()
  }

  public get<TPath extends string>(field?: TPath | Array<TPath>, peekable = false) {
    const method = peekable ? 'peek' : 'get'

    if (!field) return this.table$[method]()

    if (Array.isArray(field))
      return [...new Set(field)].reduce(
        (p, q) => ({
          ...p,
          [this.chunk(q)]: deepObserve(this.table$, q)[method](),
        }),
        {},
      )

    return deepObserve(this.table$, field)[method]() ?? this.EMPTY_STRING
  }

  public peek<TPath extends string>(field?: TPath) {
    return this.get(field, true)
  }

  public set<TPath extends string>(field: TPath, value: any): void {
    if (this.disabled(field)) return

    if (this.dispose) this.dispose()

    const current = deepObserve(this.table$, field)

    current.set(value)

    if (this.revalidateMode === 'change') {
      this.dispose = current.onChange(this.trigger(field, this.dispose), {
        initial: true,
        immediate: true,
      })

      if (this.dispose) this.dispose()
    } else this.dispose = null
  }

  public error<TPath extends string>(field?: TPath) {
    if (!field) {
      const errors = this.error$.get()

      return getValidErrors(errors)
    }

    return deepObserve(this.error$, field).get()
  }

  public status(state?: FormStatusType) {
    if (!state) return this.status$.get()

    return this.status$[state].get()
  }

  public array(params: FieldArrayParams<T>) {
    const { disabled, name } = params

    const _select = () => deepObserve(this.table$, name).get() ?? []

    const append = (value: ArrayLikeValue<T>) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => table.concat(getArray(value)))
    }

    const prepend = (value: ArrayLikeValue<T>) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => getArray(value).concat(table))
    }

    const insert = (index: number, value: ArrayLikeValue<T>) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => {
        if (index < 0 || index >= table.length) throw new Error('[insert] index out of range')

        const before = table.slice(0, index)

        const after = table.slice(index)

        return before.concat(getArray(value), after)
      })
    }

    const replace = (index: number, value: ArrayPathValue<T>) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => {
        if (index < 0 || index >= table.length) throw new Error('[replace] index out of range')

        const clone = Array.from(table)

        clone[index] = value

        return clone
      })
    }

    const move = (from: number, to: number) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => {
        if (from < 0 || from >= table.length) throw new Error('[move] index (from) out of range')

        if (to < 0 || to >= table.length) throw new Error('[move] index (to) out of range')

        const clone = Array.from(table)

        if (from === to) return clone

        const [movedItem] = clone.splice(from, 1)

        clone.splice(to, 0, movedItem)

        return clone
      })
    }

    const swap = (from: number, to: number) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => {
        if (from < 0 || from >= table.length) throw new Error('[swap] index (from) out of range')

        if (to < 0 || to >= table.length) throw new Error('[swap] index (to) out of range')

        const clone = Array.from(table)

        if (from === to) return clone
        ;[clone[from], clone[to]] = [clone[to], clone[from]]

        return clone
      })
    }

    const remove = (index: number | number[]) => {
      deepObserve(this.table$, name).set((table: Array<unknown>) => {
        if (Array.isArray(index)) {
          const indices = index.filter((i) => i < 0 || i >= table.length)

          if (indices.length > 0) throw new Error(`[remove] invalid indices: ${indices.join(', ')}`)

          return table.filter((_, i) => !index.includes(i))
        }

        if (index < 0 || index >= table.length) throw new Error('[remove] index out of range')

        return table.filter((_, i) => i !== index)
      })
    }

    const update = (values: Array<unknown>) => {
      deepObserve(this.table$, name).set(values)
    }

    const methods = {
      append,
      prepend,
      replace,
      insert,
      move,
      remove,
      swap,
      update,
      _select,
    }

    const handler: ProxyHandler<typeof methods> = {
      get(target, prop: keyof typeof methods) {
        if (prop === '_select') return _select

        if (disabled) return () => {}

        return target[prop]
      },
    }

    return new Proxy(methods, handler)
  }
}
