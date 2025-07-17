/**
 * Extensions for function checks.
 */
export namespace Check {
  /**
   * Checks that {@link value} is in the range [{@link start}, {@link endInclusive}].
   */
  export function inRange(
    value: number,
    {
      start,
      endInclusive,
    }: {
      start: number
      endInclusive: number
    },
  ): boolean {
    const [from, to] = start <= endInclusive ? [start, endInclusive] : [endInclusive, start]

    return value >= from && value <= to
  }
}
