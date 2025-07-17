import type { WheelPickerOption } from "$lib/component-types/WheelPickerProps"
import { Iterables } from "$lib/ext/stdlib/Iterables"
import { Require } from "$lib/ext/stdlib/Require"

export namespace WheelPickerOptions {
  export function ofRange({
    start = 1,
    endInclusive,
  }: {
    start?: number
    endInclusive: number
  }): WheelPickerOption[] {
    Require.integer(start)
    Require.integer(endInclusive)

    return Iterables.range({ start, endExclusive: endInclusive + 1 })
      .map((i) => ({ label: `${i}`, value: `${i}` }))
      .toArray()
  }
}
