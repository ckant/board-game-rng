<script lang="ts">
  import logo from "$lib/assets/logo.svg"
  import { WheelPickerOptions } from "$lib/component-helpers/WheelPickerOptions"
  import type { WheelPickerOption } from "$lib/component-types/WheelPickerProps"
  import WheelPicker from "$lib/components/WheelPicker.svelte"
  import WheelPickerWrapper from "$lib/components/WheelPickerWrapper.svelte"
  import { Check } from "$lib/ext/stdlib/Check"
  import { def, nil } from "$lib/ext/stdlib/existence"
  import { Random } from "$lib/ext/stdlib/Random"
  import { Strings } from "$lib/ext/stdlib/Strings"
  import { QueryParams } from "$lib/page-helpers/QueryParams"

  const ranges = {
    quantity: {
      start: 1,
      endExclusive: 13,
    },
    from: {
      start: 1,
      endExclusive: 100,
    },
    to: {
      start: 1,
      endExclusive: 100,
    },
  } as const

  const defaults = {
    quantity: "2",
    from: "1",
    to: "6",
    duplicates: false,
  } as const

  function getInitialOrNil(key: keyof typeof ranges): string | undefined {
    const value = QueryParams.getIntOrNil(key)
    if (nil(value)) return undefined

    return Check.inRange(value, ranges[key]) ? `${value}` : undefined
  }

  let quantity = $state(getInitialOrNil("quantity") ?? defaults.quantity)
  let quantityOptions: WheelPickerOption[] = WheelPickerOptions.ofRange(ranges.quantity)

  let from = $state(getInitialOrNil("from") ?? defaults.from)
  let fromOptions: WheelPickerOption[] = WheelPickerOptions.ofRange(ranges.from)

  let to = $state(getInitialOrNil("to") ?? defaults.to)
  let toOptions: WheelPickerOption[] = WheelPickerOptions.ofRange(ranges.to)

  let duplicates = $state(QueryParams.getBoolOrNil("duplicates") ?? defaults.duplicates)

  let randomValues: readonly number[] | undefined = $derived.by(() => {
    const quantityInt = Strings.toInt(quantity)
    const first = Strings.toInt(from)
    const second = Strings.toInt(to)

    const [start, endExclusive] = first <= second ? [first, second + 1] : [second, first + 1]

    if (!duplicates && quantityInt > endExclusive - start) return undefined

    return Random.integers({
      quantity: quantityInt,
      start,
      endExclusive,
      withReplacement: duplicates,
    })
  })
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href={logo} />
</svelte:head>

<div class="container" style:--quantity-suffix={Strings.toInt(quantity) === 1 ? "'num'" : "'nums'"}>
  <div class="random-values-wrapper">
    <div class="random-values">
      {#if def(randomValues)}
        {#each randomValues as randomValue, index (index)}
          {#key `${quantity}-${from}-${to}-${duplicates}`}
            <div class="random-value">
              <span>{randomValue}</span>
            </div>
          {/key}
        {/each}
      {:else}
        <div class="invalid-value">
          <span>invalid</span>
        </div>
      {/if}
    </div>
  </div>

  <div class="generate-wrapper">
    <span class="generate-text">generate</span>
  </div>

  <WheelPickerWrapper class={["wheel-picker-wrapper", "quantity"]}>
    <WheelPicker
      classes={{
        optionItem: ["option-item", "quantity"],
        highlightItem: ["highlight-item", "quantity"],
        highlightWrapper: ["highlight-wrapper", "quantity"],
      }}
      options={quantityOptions}
      visibleCount={10}
      optionItemHeight={34}
      bind:value={quantity}
    />
  </WheelPickerWrapper>

  <div class="between-wrapper">
    <span class="between-text">between</span>
  </div>

  <WheelPickerWrapper class={["wheel-picker-wrapper", "from-to"]}>
    <WheelPicker
      classes={{
        optionItem: ["option-item", "from"],
        highlightItem: ["highlight-item", "from"],
        highlightWrapper: ["highlight-wrapper", "from"],
      }}
      options={fromOptions}
      visibleCount={10}
      optionItemHeight={34}
      bind:value={from}
    />
    <WheelPicker
      classes={{
        optionItem: ["option-item", "to"],
        highlightItem: ["highlight-item", "to"],
        highlightWrapper: ["highlight-wrapper", "to"],
      }}
      options={toOptions}
      visibleCount={10}
      optionItemHeight={34}
      bind:value={to}
    />
  </WheelPickerWrapper>

  <div class="duplicates-wrapper">
    <button onclick={() => (duplicates = !duplicates)} type="button" class="duplicates-toggle">
      <span>{duplicates ? "with" : "without"}</span>
    </button>
    <span class="duplicates-text">duplicates</span>
  </div>
</div>

<style>
  :root {
    --primary-font-size: 24px;
    --secondary-font-size: 18px;

    --text-color: #fefefe;
    --bg-color: #1c1c1f;

    --control-color: #c1c1c3;
    --control-color-faded: #6b6b6d;
    --control-color-selected: var(--control-bg-color);

    --control-bg-color: #2c2c30;
    --control-bg-color-selected: var(--control-color);

    --random-value-bg-color-one: #ff6e64;
    --random-value-bg-color-two: #ffb350;
    --random-value-bg-color-three: #68e073;
    --random-value-bg-color-four: #4e9dff;
    --random-value-bg-color-five: #cd7bf5;

    --random-value-color-one: color-mix(in srgb, black 85%, var(--random-value-bg-color-one));
    --random-value-color-two: color-mix(in srgb, black 85%, var(--random-value-bg-color-two));
    --random-value-color-three: color-mix(in srgb, black 85%, var(--random-value-bg-color-three));
    --random-value-color-four: color-mix(in srgb, black 85%, var(--random-value-bg-color-four));
    --random-value-color-five: color-mix(in srgb, black 85%, var(--random-value-bg-color-five));

    --invalid-value-bg-color: #ff4245;
    --invalid-value-color: color-mix(in srgb, black 85%, var(--invalid-value-bg-color));
  }

  :global {
    *,
    ::backdrop,
    :after,
    :before {
      box-sizing: border-box;
      margin: 0;
      border: 0 solid;
      padding: 0;
      font-family:
        system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
        "Segoe UI Emoji", "Segoe UI Symbol";
    }

    html,
    body {
      margin: 0;
      width: 100%;
      height: 100%;
      font-size: var(--primary-font-size);
      -webkit-touch-callout: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    body {
      background: var(--bg-color);
    }
  }

  .container :global {
    .wheel-picker-wrapper {
      margin-right: auto;
      margin-left: auto;
      padding-top: 1vh;
      padding-right: 4vw;
      padding-left: 4vw;

      &.quantity:before {
        position: absolute;
        left: calc(50% + 1.25em);
        align-self: center;
        z-index: 1;
        pointer-events: none;
        content: var(--quantity-suffix);
        color: var(--text-color);
        font-size: var(--secondary-font-size);
      }

      &.from-to:before {
        position: absolute;
        left: 50%;
        align-self: center;
        transform: translate(-50%, 0%);
        z-index: 1;
        pointer-events: none;
        content: "and";
        color: var(--text-color);
        font-size: var(--secondary-font-size);
        line-height: 32px;
      }
    }

    .highlight-wrapper {
      background-color: var(--control-bg-color);
      color: var(--control-color);

      &.quantity {
        border-radius: 8px;
      }

      &.from {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      &.to {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    .highlight-item,
    .option-item {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6),
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        &:before {
          visibility: hidden;
          content: "0";
        }
      }
    }

    .option-item {
      color: var(--control-color-faded);
    }
  }

  .random-values-wrapper {
    padding-top: 4vh;
    padding-right: 4vw;
    padding-left: 4vw;
  }

  .random-values {
    display: grid;
    grid-template-rows: 16vmin;
    grid-template-columns: repeat(auto-fit, 12vmin);
    grid-column-gap: 2vmin;
    grid-row-gap: 2vmin;
    align-content: center;
    justify-content: center;
    justify-items: center;
    height: 36vmin;
    user-select: none;
  }

  .random-value {
    --animation-duration: 0.15s;
    --animation-delay-unit: calc(var(--animation-duration) / 2);

    display: flex;
    justify-content: center;
    align-items: center;
    animation: flip-vertical-right var(--animation-duration) cubic-bezier(0.755, 0.05, 0.855, 0.06)
      both;
    border-radius: 6px;

    background-color: var(--random-value-bg-color);
    aspect-ratio: 3 / 4;
    width: 12vmin;
    color: var(--random-value-color);
    font-size: 7.7vmin;

    &:nth-child(1) {
      animation-delay: calc(var(--animation-delay-unit) * 0);
    }
    &:nth-child(2) {
      animation-delay: calc(var(--animation-delay-unit) * 1);
    }
    &:nth-child(3) {
      animation-delay: calc(var(--animation-delay-unit) * 2);
    }
    &:nth-child(4) {
      animation-delay: calc(var(--animation-delay-unit) * 3);
    }
    &:nth-child(5) {
      animation-delay: calc(var(--animation-delay-unit) * 4);
    }
    &:nth-child(6) {
      animation-delay: calc(var(--animation-delay-unit) * 5);
    }
    &:nth-child(7) {
      animation-delay: calc(var(--animation-delay-unit) * 6);
    }
    &:nth-child(8) {
      animation-delay: calc(var(--animation-delay-unit) * 7);
    }
    &:nth-child(9) {
      animation-delay: calc(var(--animation-delay-unit) * 8);
    }
    &:nth-child(10) {
      animation-delay: calc(var(--animation-delay-unit) * 9);
    }
    &:nth-child(11) {
      animation-delay: calc(var(--animation-delay-unit) * 10);
    }
    &:nth-child(12) {
      animation-delay: calc(var(--animation-delay-unit) * 11);
    }

    &:nth-child(5n + 1) {
      --random-value-color: var(--random-value-color-one);
      --random-value-bg-color: var(--random-value-bg-color-one);
    }

    &:nth-child(5n + 2) {
      --random-value-color: var(--random-value-color-two);
      --random-value-bg-color: var(--random-value-bg-color-two);
    }

    &:nth-child(5n + 3) {
      --random-value-color: var(--random-value-color-three);
      --random-value-bg-color: var(--random-value-bg-color-three);
    }

    &:nth-child(5n + 4) {
      --random-value-color: var(--random-value-color-four);
      --random-value-bg-color: var(--random-value-bg-color-four);
    }

    &:nth-child(5n + 5) {
      --random-value-color: var(--random-value-color-five);
      --random-value-bg-color: var(--random-value-bg-color-five);
    }
  }

  .invalid-value {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    background-color: var(--invalid-value-bg-color);
    width: 24vmin;
    color: var(--invalid-value-color);
    font-size: 7.7vmin;
  }

  .generate-wrapper,
  .between-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 1vh;
  }

  .generate-text,
  .between-text,
  .duplicates-text {
    color: var(--text-color);
    user-select: none;
  }

  .duplicates-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 2vh;
  }

  .duplicates-toggle {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    background-color: var(--control-bg-color);
    width: 5rem;
    height: 34px;
    color: var(--control-color);
    font-size: 1rem;

    @media (hover) {
      &:hover {
        cursor: pointer;
        background-color: var(--control-bg-color-selected);
        color: var(--control-color-selected);
      }
    }
  }

  .duplicates-text {
    align-content: center;
    margin-left: 0.5rem;
  }

  @keyframes flip-vertical-right {
    0% {
      transform: rotateY(180deg);
      background-color: color-mix(in srgb, white 10%, var(--random-value-bg-color));
      color: color-mix(in srgb, white 10%, var(--random-value-bg-color));
    }
    75% {
      background-color: color-mix(in srgb, white 10%, var(--random-value-bg-color));
      color: color-mix(in srgb, white 10%, var(--random-value-bg-color));
    }
    76% {
      background-color: var(--random-value-bg-color);
      color: var(--random-value-color);
    }
    100% {
      transform: rotateY(0deg);
    }
  }
</style>
