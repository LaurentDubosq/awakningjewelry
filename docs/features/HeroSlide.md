# HeroSlide Feature

## Screen readers reading problem

- As the aria-label of the root element is not read when the aria-live content changes, we need to hard-code a label for assistive technology users. This label should be read when the auto-rotation button is on and focused. When assistive technology users navigate with arrow keys or are coming from the slick slider, the label should not be read because they are already informed of the current slide when browsing the slick slider.

---
