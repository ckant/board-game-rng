import { S } from "@mobily/ts-belt"

import { nil } from "$lib/ext/stdlib/existence"

export namespace Strings {
  export const isEmpty = S.isEmpty
  export const isNotEmpty = S.isNotEmpty

  export function toIntOrNil(value: string): number | undefined {
    // Matches only "normal-looking" integers
    // i.e. no spaces, leading 0s, -0, decimal points, exponents, binary, octal, hex, etc.
    // Javascript's parseInt() function is VERY permissive
    const isInteger = /^0|(-?[1-9][0-9]*)$/.test(value)
    if (!isInteger) return undefined
    const parsed = parseInt(value)
    if (!Number.isSafeInteger(parsed)) return undefined

    return parsed
  }

  export function toInt(value: string): number {
    // Matches only "normal-looking" integers
    // i.e. no spaces, leading 0s, -0, decimal points, exponents, binary, octal, hex, etc.
    // Javascript's parseInt() function is VERY permissive
    const maybeInt = toIntOrNil(value)
    if (nil(maybeInt)) throw new Error(`${value} is not an integer`)

    return maybeInt
  }

  export function toBoolOrNil(value: string): boolean | undefined {
    // Matches only "normal-looking" booleans
    // i.e. no spaces, integers, case-insensitivity, etc.
    if (value === "true") return true
    if (value === "false") return false
    return undefined
  }

  export function toBool(value: string): boolean {
    // Matches only "normal-looking" booleans
    // i.e. no spaces, integers, case-insensitivity, etc.
    const maybeBool = toBoolOrNil(value)
    if (nil(maybeBool)) throw new Error(`${value} is not a boolean`)

    return maybeBool
  }
}
