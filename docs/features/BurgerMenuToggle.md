# BurgerMenuToggle feature

## Events

- Because NVDA does not trigger keyboard events but mouse events, we need to base our logic on the click event instead of the keydown event for screen reader users.
- On touch devices, the natural mouse click triggered first touch events. This should be taken into account when we need to handle touch and click separately on mobile and desktop (e.g., for screen reader behavior). The prevent modifier allows us to properly separate the two expected behaviors without generating side effects (such as the burger menu opening and closing too quickly).

---
