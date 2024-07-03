import { ZodIssue } from 'zod'
import { isArray, isEmpty, isObject } from '@legendapp/state'
import { DeepArrayPath, ErrorResult, FormError, Path, RenderOptions, TData } from '../types'

export const NOOP = () => void 0

export function getArray(value: any) {
  return Array.isArray(value) ? value : [value]
}

export function arraysEqual(arr1: (number | string)[], arr2: (number | string)[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => String(value) === String(arr2[index]))
}

export function setFieldErrorMessage(issue: ZodIssue) {
  const keys = issue.path.filter((key) => isNaN(Number(key)))

  const result: Record<string, any> = {}

  let current = result

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (i === keys.length - 1) {
      current[key] = issue.message
    } else {
      current[key] = current[key] || {}
      current = current[key]
    }
  }

  return result
}

function standardizeErrorsShape<T extends TData, R>(input: R, nullable = true) {
  if (input === null || !isObject(input)) return null

  const entries = Object.entries(input)

  const result = Object.fromEntries(entries.filter(([_, value]) => (nullable ? typeof value !== 'undefined' : Boolean(value))))

  if (isEmpty(result)) return null

  return result as FormError<T>
}

export const transform = <T extends TData, TPath extends Path<T>, R>(input: R): FormError<T> | ErrorResult<T, TPath> => {
  if (!input) return null

  if (isObject(input)) return standardizeErrorsShape(standardizeErrorsShape(input), false)

  if (isArray(input) && (input as Array<string>).length === 0) return null

  return input as ErrorResult<T, TPath>
}

export const booleanState = <T extends TData, TPath extends DeepArrayPath<T>>({
  value,
  ...rest
}: RenderOptions<T, TPath>): Omit<RenderOptions<T, TPath>, 'value'> & {
  checked: boolean
} => {
  return { ...rest, checked: Boolean(value) }
}
