import type { AwaitedFn, TData, ValidatorCreator, ValidatorSchema } from './types';

class Validator {
  static create<T extends TData>(validatorCreator: AwaitedFn<ValidatorCreator<T>>): ValidatorCreator<T> {
    return (z) => new Promise<ValidatorSchema<T>>((res) => res(validatorCreator(z)));
  }
}

export { Validator };
