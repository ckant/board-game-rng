import { Require } from "$lib/ext/stdlib/Require"

/**
 * Extensions of {@link Iterable}s.
 */
export namespace Iterables {
  /**
   * Returns an {@link IteratorObject} that yields the integers from
   * {@link start} to (but not including) {@link endExclusive}.
   *
   * Requires that {@link start} and {@link endExclusive} must be integers.
   */
  export function range({
    start,
    endExclusive,
  }: {
    start: number
    endExclusive: number
  }): IteratorObject<number> {
    Require.integer(start)
    Require.integer(endExclusive)

    if (start <= endExclusive) {
      return Iterator.from({
        *[Symbol.iterator](): Generator<number> {
          for (let value = start; value < endExclusive; value++) {
            yield value
          }
        },
      })
    } else {
      return Iterator.from({
        *[Symbol.iterator](): Generator<number> {
          for (let value = start; value > endExclusive; value--) {
            yield value
          }
        },
      })
    }
  }
}
