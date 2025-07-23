import type { WheelPickerOption } from "$lib/component-types/WheelPickerProps"
import { Arrays } from "$lib/ext/stdlib/Arrays"
import { Require } from "$lib/ext/stdlib/Require"

export namespace WheelPickerOptions {
  export function ofRange(range: { start: number; endExclusive: number }): WheelPickerOption[] {
    Require.integer(range.start)
    Require.integer(range.endExclusive)
    Require.validRange(range)

    return Arrays.range(range).map((i) => ({ label: `${i}`, value: `${i}` }))
  }
}
