import type { AwaitedFn, TData, ValidatorCreator, ValidatorSchema } from './types';

class Validator {
  static create<T extends TData>(validatorCreator: AwaitedFn<ValidatorCreator<T>>): ValidatorCreator<T> {
    return (v, getFields) => new Promise<ValidatorSchema<T>>((res) => res(validatorCreator(v, getFields)));
  }
}

export { Validator };
