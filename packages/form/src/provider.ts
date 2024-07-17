import type { Connect, ErrorFunction, FieldArray, GetFunction, Registry, RevalidateFunction, SetFunction, StatusFunction, TData } from './types';
import { ConnectSymbol } from './types';
import { NOOP } from './utils';

export class Provider<T extends TData> {
  constructor(private readonly connect?: Connect<T>) {}

  private getConnectFunction<R>(c: ConnectSymbol) {
    return (this.connect ? this.connect[Symbol.for(c)] : NOOP) as R;
  }

  get get() {
    return this.getConnectFunction<GetFunction<T>>(ConnectSymbol.GET);
  }

  get peek() {
    return this.getConnectFunction<GetFunction<T>>(ConnectSymbol.PEEK);
  }

  get set() {
    return this.getConnectFunction<SetFunction<T>>(ConnectSymbol.SET);
  }

  get error() {
    return this.getConnectFunction<ErrorFunction<T>>(ConnectSymbol.ERROR);
  }

  get array() {
    return this.getConnectFunction<FieldArray<T>>(ConnectSymbol.ARRAY);
  }

  get register() {
    return this.getConnectFunction<Registry<T>>(ConnectSymbol.REGISTER);
  }

  get unregister() {
    return this.getConnectFunction<Registry<T>>(ConnectSymbol.UNREGISTER);
  }

  get revalidate() {
    return this.getConnectFunction<RevalidateFunction>(ConnectSymbol.REVALIDATE);
  }

  get status() {
    return this.getConnectFunction<StatusFunction>(ConnectSymbol.STATUS);
  }
}
