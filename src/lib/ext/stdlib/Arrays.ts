import { A } from "@mobily/ts-belt"

type ArrayType<A> = ReturnType<typeof A.makeEmpty<A>>

import { Require } from "$lib/ext/stdlib/Require"

export namespace Arrays {
  export function first<A>(xs: ArrayType<A>): A {
    Require.notEmpty(xs)
    return xs[0]!
  }
  export const firstOrNil = A.head
  export const isEmpty = A.isEmpty
  export const isNotEmpty = A.isNotEmpty
  export function last<A>(xs: ArrayType<A>): A {
    Require.notEmpty(xs)
    return xs[xs.length - 1]!
  }
  export const lastOrNil = A.last
  export const range = A.range
  export const take = A.take
}
