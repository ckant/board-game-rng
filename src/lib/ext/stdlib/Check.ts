/**
 * Extensions for function checks.
 */
export namespace Check {
  /**
   * Checks that {@link value} is in the range [{@link start}, {@link endExclusive}).
   */
  export function inRange(
    value: number,
    {
      start,
      endExclusive,
    }: {
      start: number
      endExclusive: number
    },
  ): boolean {
    if (start > endExclusive) throw new Error(`[${start},${endExclusive}) is an invalid range`)
    return value >= start && value < endExclusive
  }
}
