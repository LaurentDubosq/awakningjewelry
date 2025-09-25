# BurgerMenuToggle feature

## Events

- Because NVDA does not trigger keyboard events but mouse events when pressing enter or space, we need to base our logic on the click event instead of the keydown event for screen reader users.

- On touch devices, touch events also trigger click events. This should be taken into account when handling both touch and click. The `@touchend.prevent` modifier allows us to properly separate the two behaviors without generating side effects (such as the burger menu opening and closing at the same time by executing twice toggleBurgerMenu).

- Also, to prevent the burger menu from opening when the button is touched due to event propagation caught by the `touchend` listener on `document` in `BurgerMenu.vue`, we stop the event from propagating using the `@touchend.stop` modifier.
  Note: an element’s handler executes before its parent’s handler.

---
