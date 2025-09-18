# SlideshowSlickSlider Feature

## NVDA reading problem

- To handle the case where NVDA interrupts the reading of a focused element that uses `aria-controls` to announce slide content — an issue caused by an NVDA bug involving `aria-selected` and focused elements using `aria-controls` — the `aria-selected` attribute is updated only when the slick slider is focused adding `isKeyboardNavigation` as condition.

## Mouse event focus

- To prevent the `focus-visible` CSS class from being activated by a mouse event while allowing keyboard events to activate it, we use `mousedown.prevent` on each button.

## Touch events

- This component should not allow direct slide display using touches, but it should support swipe gestures.
  To handle these cases, implementing `@touchend.prevent` will be sufficient to block touch events while still allowing the parent component to use this area for swipe interactions.

## Screen reader feature label

- When assistive technology users browse the slick slider, only the button label is announced, not the parent label explaining that the slideshow navigation has just received focus. To achieve this, we added a container with `role='group'` to allow its accessibility name to be announced

---
