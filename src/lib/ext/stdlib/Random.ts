import { unsafeUniformIntDistribution, xoroshiro128plus } from "pure-rand"

import { Arrays } from "$lib/ext/stdlib/Arrays"
import { Iterables } from "$lib/ext/stdlib/Iterables"

export namespace Random {
  const seed = Date.now() ^ (Math.random() * 0x100000000)
  const rng = xoroshiro128plus(seed)

  export function integer({
    start,
    endInclusive,
  }: {
    start: number
    endInclusive: number
  }): number {
    return unsafeUniformIntDistribution(start, endInclusive, rng)
  }

  export function integers({
    quantity = 1,
    start,
    endInclusive,
    withReplacement = false,
  }: {
    quantity: number
    start: number
    endInclusive: number
    withReplacement?: boolean
  }): number[] {
    return withReplacement
      ? integersWithReplacement({ quantity, start, endInclusive })
      : integersWithoutReplacement({ quantity, start, endInclusive })
  }

  function integersWithReplacement({
    quantity = 1,
    start = 1,
    endInclusive,
  }: {
    quantity: number
    start: number
    endInclusive: number
  }): number[] {
    return Iterables.range({ start: 0, endExclusive: quantity })
      .map((_i) => integer({ start, endInclusive }))
      .toArray()
      .sort((a, b) => a - b)
  }

  function integersWithoutReplacement({
    quantity = 1,
    start,
    endInclusive,
  }: {
    quantity: number
    start: number
    endInclusive: number
  }): number[] {
    const possibilities = Arrays.range(start, endInclusive)
    for (const i of Iterables.range({ start: 0, endExclusive: quantity })) {
      const j = integer({ start: i, endInclusive: endInclusive - start })
      const temp = possibilities[i]!
      possibilities[i] = possibilities[j]!
      possibilities[j] = temp
    }

    return Arrays.take(possibilities, quantity).sort((a, b) => a - b)
  }
}
