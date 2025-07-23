import { browser } from "$app/environment"
import { page } from "$app/state"
import { def, nil } from "$lib/ext/stdlib/existence"
import { Strings } from "$lib/ext/stdlib/Strings"

export namespace QueryParams {
  export function getOrNil(name: string): string | undefined {
    // Page can't be accessed during static site generation
    if (!browser) return undefined

    const paramValue = page.url.searchParams.get(name)
    return def(paramValue) ? paramValue : undefined
  }

  export function getIntOrNil(name: string): number | undefined {
    // Matches only "normal-looking" integers
    const paramValue = getOrNil(name)
    if (nil(paramValue)) return undefined

    return Strings.toIntOrNil(paramValue)
  }

  export function getBoolOrNil(name: string): boolean | undefined {
    // Matches only "normal-looking" booleans and treats empty-valued params as true
    const paramValue = getOrNil(name)
    if (nil(paramValue)) return undefined

    return Strings.isEmpty(paramValue) ? true : Strings.toBoolOrNil(paramValue)
  }
}
