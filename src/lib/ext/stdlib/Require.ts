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
   * Asserts that {@link start} is less than or equal to {@link endExclusive}.
   */
  export function validRange({
    start,
    endExclusive,
  }: {
    start: number
    endExclusive: number
  }): void {
    if (start > endExclusive) throw new Error(`[${start},${endExclusive}) is an invalid range`)
  }

  /**
   * Asserts that {@link value} is in the range [{@link start}, {@link endExclusive}).
   */
  export function inRange(
    value: number,
    { start, endExclusive }: { start: number; endExclusive: number },
  ): void {
    validRange({ start, endExclusive })

    if (value < start || value >= endExclusive)
      throw new Error(`${value} is not in [${start},${endExclusive})`)
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
