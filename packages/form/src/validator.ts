import { type ZodRawShape, z } from 'zod';
import { isFunction, isObject } from '@legendapp/state';
import type { AwaitedFn, SchemaValidatorOptions, TData, ValidatorCreator, ValidatorSchema } from './types';
import { arraysEqual, setFieldErrorMessage } from './helpers';
import { getValidErrors } from './utils';

export async function parseSchemaValidator<T extends TData>({ data, keys, validator, getFields }: SchemaValidatorOptions<T>) {
  try {
    if (!validator || !isFunction(validator)) return null;

    const validators = await validator(z, getFields);

    const { success, error } = await z.object(validators as ZodRawShape).safeParseAsync(data);

    if (success) return null;

    if (keys.length === 0) {
      const fieldErrors = error.flatten().fieldErrors;

      if (isObject(fieldErrors)) return getValidErrors(error.flatten().fieldErrors);

      return fieldErrors;
    }

    const issue = error.issues.find(({ path }) => arraysEqual(path, keys));

    if (!issue) return null;

    const fieldErrorMessage = setFieldErrorMessage(issue)[keys[0]];

    if (isObject(fieldErrorMessage)) return getValidErrors(fieldErrorMessage);

    return fieldErrorMessage;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export class Validator {
  static create<T extends TData>(validatorCreator: AwaitedFn<ValidatorCreator<T>>): ValidatorCreator<T> {
    return (v, getFields) => new Promise<ValidatorSchema<T>>((res) => res(validatorCreator(v, getFields)));
  }
}
