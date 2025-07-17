import { Check } from "$lib/ext/stdlib/Check"

/**
 * Extensions for function requirements / prerequisites.
 */
export namespace Require {
  /**
   * Asserts that {@link number} is an integer.
   */
  export function integer(number: number): void {
    if (!Number.isSafeInteger(number)) throw new Error(`${number} is not an integer`)
  }

  /**
   * Asserts that {@link number} is a non-negative integer.
   */
  export function nonNegativeInteger(number: number): void {
    if (!Number.isSafeInteger(number)) throw new Error(`${number} is not an integer`)
    if (number < 0) throw new Error(`${number} is negative`)
  }

  /**
   * Asserts that {@link value} is in the range [{@link start}, {@link endInclusive}].
   */
  export function inRange(value: number, range: { start: number; endInclusive: number }): void {
    const { start, endInclusive } = range
    if (!Check.inRange(value, range))
      throw new Error(`${value} is not in [${start},${endInclusive}]`)
  }

  /**
   * Asserts that {@link array} has exactly one element.
   */
  export function hasSingleElement<T>(array: readonly T[]): void {
    if (array.length === 0) {
      throw new Error(`${array.toString()} is empty`)
    }

    if (array.length > 1) {
      throw new Error(`${array.toString()} has ${array.length} elements`)
    }
  }

  /**
   * Asserts that {@link array} is not empty.
   */
  export function notEmpty<T>(array: readonly T[]): void {
    if (array.length === 0) {
      throw new Error(`${array.toString()} is empty`)
    }
  }
}
