<!--
@component
* Ported to svelte from [React Wheel Picker](https://github.com/ncdai/react-wheel-picker])
* Credit to [ncdai](https://github.com/ncdai)
-->
<script lang="ts">
  import type { WheelPickerOption, WheelPickerProps } from "$lib/component-types/WheelPickerProps"
  import { Arrays } from "$lib/ext/stdlib/Arrays"
  import { def, nil } from "$lib/ext/stdlib/existence"

  const resistance = 0.3 // Resistance when scrolling above the top or below the bottom
  const maxVelocity = 30 // Maximum velocity for the scroll animation

  const easeOutCubic = (p: number): number => Math.pow(p - 1, 3) + 1

  // Clamp utility to constrain a value within bounds
  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max))
  }

  let {
    value = $bindable(),

    options: optionsProp,
    infinite: infiniteProp = false,
    visibleCount: countProp = 20,
    dragSensitivity: dragSensitivityProp = 3,
    optionItemHeight: optionHeightProp = 30,
    classes,
  }: WheelPickerProps = $props()

  let options: WheelPickerOption[] = (() => {
    if (!infiniteProp) {
      return optionsProp
    }

    const result: WheelPickerOption[] = []
    const halfCount = Math.ceil(countProp / 2)

    if (optionsProp.length === 0) {
      return result
    }

    while (result.length < halfCount) {
      result.push(...optionsProp)
    }

    return result
  })()

  let itemHeight = optionHeightProp
  let halfItemHeight = itemHeight * 0.5
  let itemAngle = 360 / countProp
  let radius = itemHeight / Math.tan((itemAngle * Math.PI) / 180)
  let containerHeight = Math.round(radius * 2 + itemHeight * 0.25)
  let quarterCount = countProp >> 2 // Divide by 4
  let baseDeceleration = dragSensitivityProp * 10
  const snapBackDeceleration = 10

  let containerRef: HTMLDivElement
  let wheelItemsRef: HTMLUListElement
  let highlightListRef: HTMLUListElement

  let scrollRef = 0
  let moveId = 0
  let dragingRef = false
  let lastWheelTimeRef = 0

  let touchDataRef: {
    startY: number
    yList: [number, number][]
    touchScroll?: number
    isClick?: boolean
  } = {
    startY: 0,
    yList: [],
    touchScroll: 0,
    isClick: true,
  }

  let dragControllerRef: AbortController | undefined = undefined

  interface RenderWheelItem {
    item: WheelPickerOption
    index: number
    angle: number
  }

  function generateRenderWheelItems(): RenderWheelItem[] {
    const items: RenderWheelItem[] = options.map((option, index) => ({
      item: option,
      index,
      angle: -itemAngle * index,
    }))

    if (infiniteProp) {
      for (let i = 0; i < quarterCount; ++i) {
        const prependIndex = -i - 1
        const appendIndex = i + options.length

        items.unshift({
          item: options[options.length - i - 1]!,
          index: prependIndex,
          angle: itemAngle * (i + 1),
        })
        items.push({
          item: options[i]!,
          index: appendIndex,
          angle: -itemAngle * appendIndex,
        })
      }
    }

    return items
  }

  const renderWheelItems = generateRenderWheelItems()

  interface RenderHighlightItem {
    item: WheelPickerOption
    key: string | number
  }

  function generateRenderHighlightItems(): RenderHighlightItem[] {
    const items: RenderHighlightItem[] = options.map((option, index) => ({
      item: option,
      key: index,
    }))

    if (infiniteProp) {
      const firstItem = Arrays.first(options)
      const lastItem = Arrays.last(options)

      items.unshift({ item: lastItem, key: "infinite-start" })
      items.push({ item: firstItem, key: "infinite-end" })
    }

    return items
  }

  const renderHighlightItems = generateRenderHighlightItems()

  function generateWheelSegmentPositions(): [number, number][] {
    let positionAlongWheel = 0
    const degToRad = Math.PI / 180

    const segmentRanges: [number, number][] = []

    for (let i = quarterCount - 1; i >= -quarterCount + 1; --i) {
      const angle = i * itemAngle
      const segmentLength = itemHeight * Math.cos(angle * degToRad)
      const start = positionAlongWheel
      positionAlongWheel += segmentLength
      segmentRanges.push([start, positionAlongWheel])
    }

    return segmentRanges
  }

  const wheelSegmentPositions = generateWheelSegmentPositions()

  function normalizeScroll(scroll: number): number {
    return ((scroll % options.length) + options.length) % options.length
  }

  function scrollTo(scroll: number): number {
    const normalizedScroll = infiniteProp ? normalizeScroll(scroll) : scroll

    if (def(wheelItemsRef)) {
      wheelItemsRef.style.transform = `translateZ(${-radius}px) rotateX(${itemAngle * normalizedScroll}deg)`

      wheelItemsRef.querySelectorAll("li").forEach((li) => {
        const distance = Math.abs(Number(li.dataset.index) - normalizedScroll)
        const epsilon = 0.5 // ckant: fix number pop-in
        li.style.visibility = distance > quarterCount + epsilon ? "hidden" : "visible"
      })
    }

    if (def(highlightListRef)) {
      highlightListRef.style.transform = `translateY(${-normalizedScroll * itemHeight}px)`
    }

    return normalizedScroll
  }

  function cancelAnimation(): void {
    cancelAnimationFrame(moveId)
  }

  function animateScroll(
    startScroll: number,
    endScroll: number,
    duration: number,
    onComplete?: () => void,
  ): void {
    if (startScroll === endScroll || duration === 0) {
      scrollTo(startScroll)
      return
    }

    const startTime = performance.now()
    const totalDistance = endScroll - startScroll

    function tick(currentTime: number): void {
      const elapsed = (currentTime - startTime) / 1000

      if (elapsed < duration) {
        const progress = easeOutCubic(elapsed / duration)
        scrollRef = scrollTo(startScroll + progress * totalDistance)
        moveId = requestAnimationFrame(tick)
      } else {
        cancelAnimation()
        scrollRef = scrollTo(endScroll)
        onComplete?.()
      }
    }

    requestAnimationFrame(tick)
  }

  function selectByScroll(scroll: number): void {
    const normalized = normalizeScroll(scroll) | 0

    const boundedScroll = infiniteProp
      ? normalized
      : Math.min(Math.max(normalized, 0), options.length - 1)

    if (!infiniteProp && boundedScroll !== scroll) return

    scrollRef = scrollTo(boundedScroll)
    const selected = options[scrollRef]!
    value = selected.value
  }

  function selectByValue(newValue: string): void {
    const index = options.findIndex((opt) => opt.value === newValue)

    if (index === -1) {
      console.error("Invalid value selected:", newValue)
      return
    }

    cancelAnimation()
    selectByScroll(index)
  }

  function scrollByStep(step: number): void {
    const startScroll = scrollRef
    let endScroll = startScroll + step

    if (infiniteProp) {
      endScroll = Math.round(endScroll)
    } else {
      endScroll = clamp(Math.round(endScroll), 0, options.length - 1)
    }

    const distance = Math.abs(endScroll - startScroll)
    if (distance === 0) return

    const duration = Math.sqrt(distance / 5)

    cancelAnimation()
    animateScroll(startScroll, endScroll, duration, () => {
      selectByScroll(scrollRef)
    })
  }

  function handleWheelItemClick(clientY: number): void {
    const container = containerRef
    if (nil(container)) {
      console.error("Container reference is not set.")
      return
    }

    const { top } = container.getBoundingClientRect()
    const clickOffsetY = clientY - top

    const clickedSegmentIndex = wheelSegmentPositions.findIndex(
      ([start, end]) => clickOffsetY >= start && clickOffsetY <= end,
    )

    if (clickedSegmentIndex === -1) {
      console.error("No item found for click position:", clickOffsetY)
      return
    }

    const stepsToScroll = (quarterCount - clickedSegmentIndex - 1) * -1
    scrollByStep(stepsToScroll)
  }

  function updateScrollDuringDrag(e: MouseEvent | TouchEvent): void {
    try {
      const currentY = e instanceof MouseEvent ? e.clientY : (e.touches?.[0]?.clientY ?? 0)

      const touchData = touchDataRef

      // If this is the first move after mousedown, check if it's a drag
      if (touchData.isClick === true) {
        const dragThreshold = 5 // pixels
        if (Math.abs(currentY - touchData.startY) > dragThreshold) {
          touchData.isClick = false
        }
      }

      // Record current Y position with timestamp
      touchData.yList.push([currentY, Date.now()])
      if (touchData.yList.length > 5) {
        touchData.yList.shift() // Keep latest 5 points for velocity calc
      }

      // Calculate delta in scroll position based on drag distance
      const dragDelta = (touchData.startY - currentY) / itemHeight
      let nextScroll = scrollRef + dragDelta

      if (infiniteProp) {
        // Wrap scroll for infinite lists
        nextScroll = normalizeScroll(nextScroll)
      } else {
        const maxIndex = options.length
        if (nextScroll < 0) {
          // Apply resistance when dragging above top
          nextScroll *= resistance
        } else if (nextScroll > maxIndex) {
          // Apply resistance when dragging below bottom
          nextScroll = maxIndex + (nextScroll - maxIndex) * resistance
        }
      }

      // Update visual scroll and store position
      touchData.touchScroll = scrollTo(nextScroll)
    } catch (error) {
      console.error("Error in updateScrollDuringDrag:", error)
    }
  }

  function handleDragMoveEvent(event: MouseEvent | TouchEvent): void {
    if (
      !dragingRef &&
      !containerRef!.contains(event.target as Node) &&
      event.target !== containerRef
    ) {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    if (Arrays.isNotEmpty(options)) {
      updateScrollDuringDrag(event)
    }
  }

  function initiateDragGesture(event: MouseEvent | TouchEvent): void {
    try {
      dragingRef = true

      const controller = new AbortController()
      const { signal } = controller

      dragControllerRef = controller

      // Listen to movement events
      const passiveOpts = { signal, passive: false }
      containerRef?.addEventListener("touchmove", handleDragMoveEvent, passiveOpts)
      document.addEventListener("mousemove", handleDragMoveEvent, passiveOpts)

      const startY =
        event instanceof MouseEvent ? event.clientY : (event.touches?.[0]?.clientY ?? 0)

      // Initialize touch tracking
      const touchData = touchDataRef
      touchData.startY = startY
      touchData.yList = [[startY, Date.now()]]
      touchData.touchScroll = scrollRef
      touchData.isClick = true

      // Stop any ongoing scroll animation
      cancelAnimation()
    } catch (error) {
      console.error("Error in initiateDragGesture:", error)
    }
  }

  function handleDragStartEvent(e: MouseEvent | TouchEvent): void {
    const isDragging = dragingRef
    const isTargetValid = containerRef.contains(e.target as Node) || e.target === containerRef

    if ((isDragging || isTargetValid) && e.cancelable) {
      e.preventDefault()
      if (Arrays.isNotEmpty(options)) {
        initiateDragGesture(e)
      }
    }
  }

  function decelerateAndAnimateScroll(initialVelocity: number): void {
    const currentScroll = scrollRef
    let targetScroll = currentScroll
    let deceleration = initialVelocity > 0 ? -baseDeceleration : baseDeceleration
    let duration = 0

    if (infiniteProp) {
      // Infinite mode: apply uniform deceleration to calculate scroll distance
      duration = Math.abs(initialVelocity / deceleration)
      const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration
      targetScroll = Math.round(currentScroll + scrollDistance)
    } else if (currentScroll < 0 || currentScroll > options.length - 1) {
      // Out-of-bounds: snap back to nearest valid scroll index
      const target = clamp(currentScroll, 0, options.length - 1)
      const scrollDistance = currentScroll - target
      deceleration = snapBackDeceleration
      duration = Math.sqrt(Math.abs(scrollDistance / deceleration))
      initialVelocity = deceleration * duration
      initialVelocity = currentScroll > 0 ? -initialVelocity : initialVelocity
      targetScroll = target
    } else {
      // Normal decelerated scroll within bounds
      duration = Math.abs(initialVelocity / deceleration)
      const scrollDistance = initialVelocity * duration + 0.5 * deceleration * duration * duration
      targetScroll = Math.round(currentScroll + scrollDistance)
      targetScroll = clamp(targetScroll, 0, options.length - 1)

      const adjustedDistance = targetScroll - currentScroll
      duration = Math.sqrt(Math.abs(adjustedDistance / deceleration))
    }

    // Start animation to target scroll position with calculated duration
    animateScroll(currentScroll, targetScroll, duration, () => {
      selectByScroll(scrollRef) // Ensure selected item updates at end
    })

    // Fallback selection update (in case animation callback fails)
    selectByScroll(scrollRef)
  }

  function finalizeDragAndStartInertiaScroll(): void {
    try {
      dragControllerRef?.abort()
      dragControllerRef = undefined

      const touchData = touchDataRef

      // If it was a click (no significant movement), handle it as a click
      if (touchData.isClick === true) {
        handleWheelItemClick(touchData.startY)
        return
      }

      const yList = touchData.yList
      let velocity = 0

      if (yList.length > 1) {
        const len = yList.length
        const [startY, startTime] = yList[len - 2] ?? [0, 0]
        const [endY, endTime] = yList[len - 1] ?? [0, 0]

        const timeDiff = endTime - startTime

        if (timeDiff > 0) {
          const distance = startY - endY
          const velocityPerSecond = ((distance / itemHeight) * 1000) / timeDiff

          const direction = velocityPerSecond > 0 ? 1 : -1
          const absVelocity = Math.min(Math.abs(velocityPerSecond), maxVelocity)
          velocity = absVelocity * direction
        }
      }

      scrollRef = touchData.touchScroll ?? scrollRef
      decelerateAndAnimateScroll(velocity)
    } catch (error) {
      console.error("Error in finalizeDragAndStartInertiaScroll:", error)
    } finally {
      dragingRef = false
    }
  }

  function handleDragEndEvent(event: MouseEvent | TouchEvent): void {
    if (Arrays.isEmpty(options)) return

    const isDragging = dragingRef
    const isTargetValid =
      containerRef!.contains(event.target as Node) || event.target === containerRef

    if ((isDragging || isTargetValid) && event.cancelable) {
      event.preventDefault()
      finalizeDragAndStartInertiaScroll()
    }
  }

  function scrollByWheel(event: WheelEvent): void {
    event.preventDefault()

    const now = Date.now()
    if (now - lastWheelTimeRef < 100) return

    const direction = Math.sign(event.deltaY)
    if (direction === 0) return

    lastWheelTimeRef = now

    scrollByStep(direction)
  }

  function handleWheelEvent(event: WheelEvent): void {
    if (Arrays.isEmpty(options) || nil(containerRef)) return

    const isDragging = dragingRef
    const isTargetValid =
      containerRef.contains(event.target as Node) || event.target === containerRef

    if ((isDragging || isTargetValid) && event.cancelable) {
      event.preventDefault()
      scrollByWheel(event)
    }
  }

  $effect(() => {
    const container = containerRef
    if (nil(container)) return

    const controller = new AbortController()
    const { signal } = controller

    const opts = { signal, passive: false }

    container.addEventListener("touchstart", handleDragStartEvent, opts)
    container.addEventListener("touchend", handleDragEndEvent, opts)
    container.addEventListener("wheel", handleWheelEvent, opts)
    document.addEventListener("mousedown", handleDragStartEvent, opts)
    document.addEventListener("mouseup", handleDragEndEvent, opts)

    return () => controller.abort()
  })

  $effect(() => {
    selectByValue(value)
  })
</script>

<div bind:this={containerRef} data-rwp style:height={`${containerHeight}px`}>
  <ul bind:this={wheelItemsRef} data-rwp-options>
    {#each renderWheelItems as renderWheelItem (renderWheelItem.index)}
      <li
        class={classes?.optionItem}
        data-slot="option-item"
        data-rwp-option
        data-index={renderWheelItem.index}
        style:top={`${-halfItemHeight}px`}
        style:height={`${itemHeight}px`}
        style:line-height={`${itemHeight}px`}
        style:transform={`rotateX(${renderWheelItem.angle}deg) translateZ(${radius}px)`}
        style:visibility="hidden"
      >
        {renderWheelItem.item.label}
      </li>
    {/each}
  </ul>

  <div
    class={classes?.highlightWrapper}
    data-rwp-highlight-wrapper
    data-slot="highlight-wrapper"
    style:height={`${itemHeight}px`}
    style:line-height={`${itemHeight}px`}
  >
    <ul
      bind:this={highlightListRef}
      data-rwp-highlight-list
      style:top={infiniteProp ? `${-itemHeight}px` : undefined}
    >
      {#each renderHighlightItems as renderHighlightItem (renderHighlightItem.key)}
        <li
          class={classes?.highlightItem}
          data-slot="highlight-item"
          data-rwp-highlight-item
          style:height={`${itemHeight}px`}
        >
          {renderHighlightItem.item.label}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  [data-rwp] {
    position: relative;
    flex: 1;
    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    cursor: default;
    overflow: hidden;
  }

  [data-rwp-highlight-wrapper] {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    overflow: hidden;
    font-weight: 500;
    font-size: 1rem;
  }

  [data-rwp-highlight-list] {
    position: absolute;
    width: 100%;
    list-style: none;
  }

  [data-rwp-options] {
    display: block;
    position: absolute;
    top: 50%;
    left: 0;
    margin: 0 auto;
    width: 100%;
    height: 0;
    -webkit-font-smoothing: subpixel-antialiased;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform;
    list-style: none;
  }

  [data-rwp-option] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    -webkit-font-smoothing: subpixel-antialiased;
    will-change: visibility;
    font-size: 0.875rem;
  }

  [data-rwp-option],
  [data-rwp-highlight-item] {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
