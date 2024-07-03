import * as React from 'react';
import { Observable, ObservableObject, isFunction, observable } from '@legendapp/state';
import type {
  DeepArrayPath,
  DeepArrayPathValue,
  FormStatus,
  Path,
  Api,
  FormError,
  RevalidateMode,
  TData,
  ValidatorCreator,
  SetupFieldComponentProps,
  GetValuesOptions,
} from './types';
import { ApiSymbol } from './types';
import { _Internal } from './internal';
import { Field } from './components';
import { observer } from '@legendapp/state/react';
import { clone, deepObserve } from './utils';

interface FormOptions<T extends TData> {
  defaultValues: T | (() => Promise<T>);
  validator?: ValidatorCreator<T>;
  /**
   * @todo `focus` and `blur` modes are not implemented yet
   */
  revalidateMode?: RevalidateMode;
  bridge?: () => (<T>(data: T) => void) | undefined;
}

export class FormApi<T extends TData> {
  private _internal: _Internal<T>;

  private table$: Observable<T>;

  private readonly error$: Observable<FormError<T>>;

  private readonly status$: ObservableObject<FormStatus>;

  private initialValues: T;

  private trace: (<T>(data: T) => void) | undefined;

  constructor(options: FormOptions<T>) {
    const { defaultValues, validator, bridge, revalidateMode = 'submit' } = options;

    this._bind();

    if (bridge) this.trace = bridge();

    const syncDefaultValues = isFunction(defaultValues) ? ({} as T) : defaultValues;

    this.initialValues = clone(syncDefaultValues);

    this.table$ = observable(syncDefaultValues);

    if (isFunction(defaultValues)) this.resolveAsyncDefaultValues(defaultValues);

    this.error$ = observable<FormError<T>>(null);

    this.status$ = observable<FormStatus>({
      isSubmitting: false,
      isValidating: false,
      isLoading: false,
    });

    this._internal = new _Internal<T>(this.table$, this.error$, this.status$, validator, this.trace, revalidateMode);
  }

  static createConnector<U extends TData>() {
    const fromApi = new FormApi<U>({
      defaultValues: {} as U,
      revalidateMode: 'change',
    });

    const Field = fromApi.setupField(true);

    return { Field, get: fromApi._connections };
  }

  private _bind() {
    this.getValues = this.getValues.bind(this);
    this.setValue = this.setValue.bind(this);
    this.hasError = this.hasError.bind(this);
    this.reset = this.reset.bind(this);
    this.resetField = this.resetField.bind(this);
    this.setupField = this.setupField.bind(this);
    this.submit = this.submit.bind(this);
    this._connections = this._connections.bind(this);
  }

  private async resolveAsyncDefaultValues(factory: () => Promise<T>) {
    this.status$.isLoading.toggle();
    try {
      const defaultValues = await factory();

      this.initialValues = clone(defaultValues);

      this.table$.set(defaultValues);
    } catch (error) {
      console.error(error);
    } finally {
      this.status$.isLoading.toggle();
    }
  }

  private _connections<TPath extends DeepArrayPath<T>>(field: TPath): DeepArrayPathValue<T, TPath> {
    return this.getValues(field, { tracking: true });
  }

  public get api() {
    const exposes: Api<T> = {};

    exposes[Symbol.for(ApiSymbol.GET)] = this._internal.get.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.PEEK)] = this._internal.peek.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.SET)] = this._internal.set.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.ERROR)] = this._internal.error.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.ARRAY)] = this._internal.array.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.REGISTER)] = this._internal.register.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.UNREGISTER)] = this._internal.unregister.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.REVALIDATE)] = this._internal.revalidate.bind(this._internal);

    exposes[Symbol.for(ApiSymbol.STATUS)] = this._internal.status.bind(this._internal);

    return Object.freeze(exposes) as Api<T>;
  }

  public getValues(options?: GetValuesOptions): T;
  public getValues<TPath extends DeepArrayPath<T>>(field: TPath, options?: GetValuesOptions): DeepArrayPathValue<T, TPath>;
  public getValues<TPath extends DeepArrayPath<T>>(field: Array<TPath>, options?: GetValuesOptions): Array<DeepArrayPathValue<T, TPath>>;
  public getValues<TPath extends DeepArrayPath<T>>(field?: TPath, options?: GetValuesOptions) {
    return this._internal[options?.tracking ? 'get' : 'peek'](field);
  }

  public setValue<TPath extends DeepArrayPath<T>>(field: TPath, value: DeepArrayPathValue<T, TPath>) {
    this._internal.set(field, value);
  }

  public submit(onResolve: (data: T) => void | Promise<void>, onReject?: (errors: FormError<T>) => void | Promise<void>) {
    return this._internal.submit(onResolve, onReject);
  }

  public hasError<TPath extends Path<T>>(field: TPath): boolean {
    const fieldError = this._internal.error(field);

    return Boolean(fieldError);
  }

  public reset() {
    this.table$.set(clone(this.initialValues));
  }

  public resetField<TPath extends DeepArrayPath<T>>(field: TPath) {
    deepObserve(this.table$, field).set(deepObserve(clone(this.initialValues), field));
  }

  public setupField<Connect extends boolean = false>(_connect?: Connect) {
    return observer(<TPath extends DeepArrayPath<T>, const C extends Connect>(props: SetupFieldComponentProps<T, TPath, C>) => {
      const propsWithApi = { ...props, api: this.api, _connect };

      if (isFunction(Field)) return Field(propsWithApi);

      return React.cloneElement(Field, { ...propsWithApi, ref: null });
    });
  }
}
