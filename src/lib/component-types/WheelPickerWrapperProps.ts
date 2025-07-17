/**
 * Ported to svelte from [https://github.com/ncdai/react-wheel-picker](React Wheel Picker)
 * Credit to [https://github.com/ncdai](ncdai)
 */

import type { Snippet } from "svelte"
import type { ClassValue } from "svelte/elements"

/**
 * Props for the WheelPicker wrapper component
 */
export interface WheelPickerWrapperProps {
  /**
   * Additional CSS class name for the wrapper
   */
  class?: ClassValue

  /**
   * Child elements to be rendered inside the wrapper
   */
  children: Snippet
}
