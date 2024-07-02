import { NOOP } from "./helpers";
import { ApiSymbol } from "./types";
import type { Api, ErrorFunction, FieldArray, GetFunction, Registry, RevalidateFunction, SetFunction, StatusFunction, TData } from "./types";

export class Hook<T extends TData> {
  constructor(private readonly api?: Api<T>) {}

  private getApiFunction<R>(s: ApiSymbol) {
    return (this.api ? this.api[Symbol.for(s)] : NOOP) as R;
  }

  get get() {
    return this.getApiFunction<GetFunction<T>>(ApiSymbol.GET);
  }

  get peek() {
    return this.getApiFunction<GetFunction<T>>(ApiSymbol.PEEK);
  }

  get set() {
    return this.getApiFunction<SetFunction<T>>(ApiSymbol.SET);
  }

  get error() {
    return this.getApiFunction<ErrorFunction<T>>(ApiSymbol.ERROR);
  }

  get array() {
    return this.getApiFunction<FieldArray<T>>(ApiSymbol.ARRAY);
  }

  get register() {
    return this.getApiFunction<Registry<T>>(ApiSymbol.REGISTER);
  }

  get unregister() {
    return this.getApiFunction<Registry<T>>(ApiSymbol.UNREGISTER);
  }

  get revalidate() {
    return this.getApiFunction<RevalidateFunction>(ApiSymbol.REVALIDATE);
  }

  get status() {
    return this.getApiFunction<StatusFunction>(ApiSymbol.STATUS);
  }
}
