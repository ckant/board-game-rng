/**
 * Ported to svelte from [https://github.com/ncdai/react-wheel-picker](React Wheel Picker)
 * Credit to [https://github.com/ncdai](ncdai)
 */

import type { ClassValue } from "svelte/elements"

/**
 * Props for the WheelPicker component
 */
export interface WheelPickerProps {
  /**
   * Current value of the picker
   */
  value: string

  /**
   * Array of options to display in the wheel
   */
  options: WheelPickerOption[]

  /**
   * Whether the wheel should loop infinitely
   */
  infinite?: boolean

  /**
   * The number of options visible on the circular ring, must be a multiple of 4
   */
  visibleCount?: number

  /**
   * Sensitivity of the drag interaction (higher = more sensitive)
   */
  dragSensitivity?: number

  /**
   * Height (in pixels) of each item in the picker list
   */
  optionItemHeight?: number

  /**
   * Custom class names for styling different parts of the wheel
   */
  classes?: WheelPickerClasses
}

/**
 * Represents a single option in the wheel picker
 */
export interface WheelPickerOption {
  /**
   * The value that will be returned when this option is selected
   */
  value: string

  /**
   * The content displayed for this option
   */
  label: string
}

/**
 * Custom classes for styling different parts of the wheel picker
 */
export interface WheelPickerClasses {
  /**
   * Class name for individual option items
   */
  optionItem?: ClassValue

  /**
   * Class name for the wrapper of the highlighted area
   */
  highlightWrapper?: ClassValue

  /**
   * Class name for the highlighted item
   */
  highlightItem?: ClassValue
}
