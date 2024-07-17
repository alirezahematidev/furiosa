import * as React from 'react';
import type { ZodArray, ZodObject, ZodRawShape, ZodType, z } from 'zod';

type Z = typeof z;

type OneOf<T extends any[]> = T extends [infer R, ...infer Rest] ? R | OneOf<Rest> : never;

type AllOf<T extends any[]> = T extends [infer R, ...infer Rest] ? R & AllOf<Rest> : unknown;

type Dot<Field extends string> = `.${Field}`;

type Underscore<S extends string> = S extends `${infer T}.${infer U}` ? `${T}_${Underscore<U>}` : S;

type Chain<S extends string> = S extends `${infer T}_${infer U}` ? `${T}.${Chain<U>}` : S;

type WithInferredArray<T> = T extends Array<infer U> ? T | U : T;

export type TransformFieldValues<T extends TData, TPaths extends Array<DeepArrayPath<T>>> = {
  readonly [K in Underscore<TPaths[number]>]: DeepArrayPathValue<T, Chain<K>>;
};

export enum ConnectSymbol {
  GET = 'GET',
  SET = 'SET',
  PEEK = 'PEEK',
  ERROR = 'ERROR',
  ARRAY = 'ARRAY',
  REGISTER = 'REGISTER',
  UNREGISTER = 'UNREGISTER',
  REVALIDATE = 'REVALIDATE',
  STATUS = 'STATUS',
}

export type TData = { [key: string]: any };

export type RevalidateMode = 'submit' | 'change' | 'blur' | 'focus';

export type FormStatusType = 'isLoading' | 'isSubmitting' | 'isValidating';

export type FormStatus = {
  [type in FormStatusType]: boolean;
};

export type Event = { target: any };

export type FormState = Map<string, { disabled: boolean }>;

export type FormHistory = Map<string, any>;

export type RefCallback = (instance: any) => void;

export type AwaitedFn<T> = T extends (...args: any[]) => Promise<infer R> ? (...args: Parameters<T>) => R : never;

export type ArrayLikeValue<T extends TData, TPath extends ArrayPath<T> = ArrayPath<T>> = WithInferredArray<ArrayPathValue<T, TPath>>;

export type GetValuesOptions = {
  tracking: boolean;
};

type IsTData<T> = T extends TData ? true : false;

type PathPart<T> = {
  [K in keyof T]: K extends string ? (IsTData<T[K]> extends true ? OneOf<[K, `${K}.${Path<T[K]>}`]> : K) : never;
}[keyof T];

export type Path<T> = IsTData<T> extends true ? PathPart<T> : never;

type SplitPath<P extends string> = P extends `${infer K}.${infer R}` ? [K, R] : P;

export type PathValue<T, P extends string, U = never> =
  SplitPath<P> extends [infer K, infer R]
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? SplitPath<R> extends [infer _R1, infer _R2]
          ? PathValue<T[K], R, U>
          : R extends keyof NonNullable<T[K]>
            ? NonNullable<T[K]>[R]
            : never
        : never
      : P extends keyof T
        ? U extends never
          ? T[P]
          : U
        : never
    : P extends keyof T
      ? T[P]
      : never;

export type ArrayPath<T> = T extends any
  ? {
      [K in keyof T]: T[K] extends Array<any> | undefined
        ? K | (T[K] extends Array<infer U> | undefined ? (U extends TData | undefined ? `${K & string}.${ArrayPath<NonNullable<U>>}` : never) : never)
        : T[K] extends TData | undefined
          ? `${K & string}.${ArrayPath<NonNullable<T[K]>>}`
          : never;
    }[keyof T]
  : never;

export type ArrayPathValue<T, P extends string = string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? T[K] extends Array<infer U> | undefined
      ? U extends TData | undefined
        ? ArrayPathValue<NonNullable<U>, AllOf<[R, ArrayPath<NonNullable<U>>]>>
        : never
      : T[K] extends TData | undefined
        ? R extends `${infer _}.${any}`
          ? ArrayPathValue<NonNullable<T[K]>, AllOf<[R, ArrayPath<NonNullable<T[K]>>]>>
          : R extends keyof NonNullable<T[K]>
            ? NonNullable<T[K]>[R]
            : never
        : never
    : never
  : P extends keyof T
    ? T[P] extends Array<infer U>
      ? U
      : T[P]
    : P extends keyof T
      ? T[P]
      : never;

export type DeepArrayPath<T extends TData, P extends string = ''> = T extends any
  ? {
      [K in keyof T & string]: T[K] extends Array<infer U> | undefined
        ? U extends TData | undefined
          ? OneOf<[`${P}${K}`, `${P}${K}.${number}`, `${P}${K}.${number}.${DeepArrayPath<NonNullable<U>>}`]>
          : OneOf<[`${P}${K}`, `${P}${K}.${number}`]>
        : T[K] extends TData | undefined
          ? OneOf<[`${P}${K}`, `${P}${K}.${DeepArrayPath<NonNullable<T[K]>, ''>}`]>
          : `${P}${K}`;
    }[keyof T & string]
  : never;

type SkipInteger<T> = T extends `${number}${infer U}` ? (U extends Dot<infer P> ? P : never) : T;

export type DeepArrayPathValue<T, P> = P extends `${infer APath}.${infer Rest}`
  ? T extends Array<infer A>
    ? SkipInteger<Rest> extends never
      ? A
      : DeepArrayPathValue<ArrayPathValue<A, APath>, SkipInteger<Rest>>
    : SkipInteger<Rest> extends never
      ? ArrayPathValue<T, APath> extends Array<any> | undefined
        ? NonNullable<ArrayPathValue<T, APath>>[number]
        : ArrayPathValue<T, APath>
      : DeepArrayPathValue<ArrayPathValue<T, APath>, SkipInteger<Rest>>
  : T extends Array<infer A>
    ? P extends keyof A
      ? A[P]
      : never
    : P extends keyof T
      ? T[P]
      : never;

export type ValidatorSchema<T extends TData> = {
  [K in keyof T]?: K extends string
    ? T[K] extends Array<infer U> | undefined
      ? U extends TData
        ? ZodArray<ZodObject<AllOf<[ValidatorSchema<NonNullable<U>>, ZodRawShape]>>>
        : ZodArray<ZodType<NonNullable<U>>>
      : T[K] extends TData
        ? ZodObject<ValidatorSchema<NonNullable<T[K]>> & ZodRawShape>
        : ZodType<T[K]>
    : never;
};

export type ZodValidator = {
  [K in keyof Z]: Z[K];
};

export type SchemaValidatorOptions<T extends TData> = {
  data: T;
  keys: Array<string>;
  validator?: ValidatorCreator<T>;
};

export type ValidatorCreator<T extends TData> = (z: ZodValidator) => Promise<ValidatorSchema<T>>;

export type FieldValues<T extends TData> = <TPath extends DeepArrayPath<T>>(field: TPath) => DeepArrayPathValue<T, TPath>;

export type FieldRecord<T extends TData, Key extends string = 'id'> = {
  item: ArrayPathValue<T, ArrayPath<T>>;
  index: number;
} & {
  [k in Key]: string;
};

export type Registry<T extends TData> = <TPath extends DeepArrayPath<T>>(field: TPath, keepValue?: boolean) => void;

export type RevalidateFunction = (mode: RevalidateMode) => Promise<void>;

export type ErrorResult<T extends TData, TPath extends Path<T>> = PathValue<T, TPath, string>;

export type FormError<T extends TData> = OneOf<[Record<keyof T, ErrorResult<T, never>>, null]>;

export type SetFunction<T extends TData> = <TPath extends DeepArrayPath<T>>(field: TPath, value: DeepArrayPathValue<T, TPath>) => void;

export type GetFunction<T extends TData> = <TPath extends DeepArrayPath<T>>(field?: OneOf<[TPath, Array<TPath>]>) => any;

export type StatusFunction = (state?: FormStatusType) => FormStatus | boolean;

export type ErrorFunction<T extends TData> = <TPath extends Path<T>>(field?: TPath) => TPath extends never ? FormError<T> : ErrorResult<T, TPath>;

type ConnectExpose<T extends TData> = OneOf<[GetFunction<T>, SetFunction<T>, ErrorFunction<T>, FieldArray<T>, Registry<T>, RevalidateFunction, StatusFunction]>;

export type Connect<T extends TData> = Record<symbol, ConnectExpose<T>>;

export type FieldArrayParams<T, TPath extends ArrayPath<T> = ArrayPath<T>> = {
  readonly name: TPath;
  disabled?: boolean;
};

export type FieldArray<T extends TData> = <TPath extends ArrayPath<T>>(params: FieldArrayParams<T, TPath>) => any;

type FieldArrayValues<T extends TData, TArrayPath extends ArrayPath<T>> = {
  item: ArrayPathValue<T, TArrayPath>;
};

export type WithIdentifier<Key extends string = 'id'> = {
  readonly [K in Key]: string | number;
};

export type FieldArrayWithIdentifier<T extends TData, TPath extends ArrayPath<T>, Key extends string = 'id'> = FieldArrayValues<T, TPath> & WithIdentifier<Key>;

export interface UseFormArrayOptions<T extends TData, TPath extends ArrayPath<T>, Key extends string = 'id'> {
  readonly name: TPath;
  readonly connect: Connect<T>;
  key?: Key;
  initialValues?: WithInferredArray<ArrayPathValue<T, TPath>>;
  disabled?: boolean;
}

export type UseFormArrayReturn<T extends TData, TPath extends ArrayPath<T>, Key extends string = 'id'> = {
  fields: FieldArrayWithIdentifier<T, TPath, Key>[];

  append: (value: ArrayLikeValue<T, TPath>) => void;

  prepend: (value: ArrayLikeValue<T, TPath>) => void;

  insert: (index: number, value: ArrayLikeValue<T, TPath>) => void;

  replace: (index: number, value: ArrayPathValue<T, TPath>) => void;

  update: (values: Array<ArrayPathValue<T, TPath>>) => void;

  move: (from: number, to: number) => void;

  swap: (from: number, to: number) => void;

  remove: (index: number | number[]) => void;
};

export type RenderOptions<T extends TData, TPath extends DeepArrayPath<T>> = {
  name: TPath;
  ref: RefCallback;
  value: DeepArrayPathValue<T, TPath>;
  onChange(event: any): void;
};

type NullishElement = React.JSX.Element | null | undefined;

export type BindFunction<T extends TData> = (fields: FieldValues<T>) => boolean | Promise<boolean>;

interface BaseFieldProps<T extends TData, TPath extends DeepArrayPath<T>> {
  name: TPath;
  render: ((options: RenderOptions<T, TPath>) => NullishElement) | React.ReactElement<Partial<RenderOptions<T, TPath>>>;
  ref?: RefCallback;
}

export interface FieldProps<T extends TData, TPath extends DeepArrayPath<T>> extends BaseFieldProps<T, TPath> {
  readonly connect: Connect<T>;
  bindTo?: BindFunction<T>;
  shouldUnregister?: boolean;
}

type BridgeProps<T extends TData, TPath extends DeepArrayPath<T>> = {
  readonly _bridge?: boolean;
  disconnect?: DisconnectFunction<T, TPath>;
};

type DisconnectFunction<T extends TData, TPath extends DeepArrayPath<T>> = (value: DeepArrayPathValue<T, TPath>) => boolean;

type FieldPropsWithDisconnect<T extends TData, TPath extends DeepArrayPath<T>, Bridge> = true extends Bridge ? Pick<BridgeProps<T, TPath>, 'disconnect'> : object;

type FieldOmittedProps<T extends TData, TPath extends DeepArrayPath<T>, Bridge> = true extends Bridge ? BaseFieldProps<T, TPath> : Omit<FieldProps<T, TPath>, 'connect'>;

export type InternalFieldProps<T extends TData, TPath extends DeepArrayPath<T>> = FieldProps<T, TPath> & BridgeProps<T, TPath>;

export type SetupFieldComponentProps<T extends TData, TPath extends DeepArrayPath<T>, Bridge> = FieldOmittedProps<T, TPath, Bridge> & FieldPropsWithDisconnect<T, TPath, Bridge>;
