import { browser } from "$app/environment"
import { page } from "$app/state"
import { def, nil } from "$lib/ext/stdlib/existence"
import { Strings } from "$lib/ext/stdlib/Strings"

export namespace QueryParams {
  export function getOrNil(name: string): string | undefined {
    if (!browser) return undefined

    const paramValue = page.url.searchParams.get(name)
    return def(paramValue) ? paramValue : undefined
  }

  export function getIntOrNil(name: string): number | undefined {
    const paramValue = getOrNil(name)
    if (nil(paramValue)) return undefined

    return Strings.toIntOrNil(paramValue)
  }

  export function getBoolOrNil(name: string): boolean | undefined {
    const paramValue = getOrNil(name)
    if (nil(paramValue)) return undefined

    return paramValue === "" ? true : Strings.toBoolOrNil(paramValue)
  }
}
