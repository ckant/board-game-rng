<!--
@component
* Ported to svelte from [React Wheel Picker](https://github.com/ncdai/react-wheel-picker])
* Credit to [ncdai](https://github.com/ncdai)
-->
<script lang="ts">
  import type { WheelPickerWrapperProps } from "$lib/component-types/WheelPickerWrapperProps"

  let { class: classValue, children }: WheelPickerWrapperProps = $props()
</script>

<div class={classValue} data-rwp-wrapper>
  {@render children?.()}
</div>

<style>
  [data-rwp-wrapper] {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: stretch;
    perspective: 2000px;
    width: 100%;
    overflow: hidden;
    user-select: none;
  }
</style>
