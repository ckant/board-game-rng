import { nil } from "$lib/ext/stdlib/existence"

export namespace Strings {
  export function toIntOrNil(value: string): number | undefined {
    const isInteger = /^-?[1-9][0-9]*$/.test(value)
    if (!isInteger) return undefined
    const parsed = parseInt(value)
    if (!Number.isSafeInteger(parsed)) return undefined

    return parsed
  }

  export function toInt(value: string): number {
    const maybeInt = toIntOrNil(value)
    if (nil(maybeInt)) throw new Error(`${value} is not an integer`)

    return maybeInt
  }

  export function toBoolOrNil(value: string): boolean | undefined {
    if (value === "true") return true
    if (value === "false") return false
    return undefined
  }

  export function toBool(value: string): boolean {
    const maybeBool = toBoolOrNil(value)
    if (nil(maybeBool)) throw new Error(`${value} is not a boolean`)

    return maybeBool
  }
}
