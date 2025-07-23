import { unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand"

import { Arrays } from "$lib/ext/stdlib/Arrays"
import { Iterables } from "$lib/ext/stdlib/Iterables"
import { Require } from "$lib/ext/stdlib/Require"

export namespace Random {
  const seed = Date.now() ^ (Math.random() * 0x100000000)
  const rng = xoroshiro128plus(seed)

  export function integer({
    start,
    endExclusive,
  }: {
    start: number
    endExclusive: number
  }): number {
    Require.integer(start)
    Require.integer(endExclusive)
    Require.validRange({ start, endExclusive })

    return unsafeUniformIntDistribution(start, endExclusive - 1, rng)
  }

  export function integers({
    quantity = 1,
    start,
    endExclusive,
    withReplacement = false,
  }: {
    quantity: number
    start: number
    endExclusive: number
    withReplacement?: boolean
  }): number[] {
    Require.integer(quantity)
    Require.integer(start)
    Require.integer(endExclusive)
    Require.validRange({ start, endExclusive })

    return withReplacement
      ? integersWithReplacement({ quantity, start, endExclusive })
      : integersWithoutReplacement({ quantity, start, endExclusive })
  }

  function integersWithReplacement({
    quantity = 1,
    start = 1,
    endExclusive,
  }: {
    quantity: number
    start: number
    endExclusive: number
  }): number[] {
    return Iterables.range({ start: 0, endExclusive: quantity })
      .map((_i) => integer({ start, endExclusive }))
      .toArray()
      .sort((a, b) => a - b)
  }

  function integersWithoutReplacement({
    quantity = 1,
    start,
    endExclusive,
  }: {
    quantity: number
    start: number
    endExclusive: number
  }): number[] {
    // Partial (regular) Fisher–Yates shuffle
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Choosing_k_out_of_n_elements
    const possibilities = Arrays.range({ start, endExclusive })
    for (const i of Iterables.range({ start: 0, endExclusive: quantity })) {
      const j = integer({ start: i, endExclusive: endExclusive - start })
      const temp = possibilities[i]!
      possibilities[i] = possibilities[j]!
      possibilities[j] = temp
    }

    return Arrays.take(possibilities, quantity).sort((a, b) => a - b)
  }
}
