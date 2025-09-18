# Slideshow Feature

## Explicit Play State Handling

- To manage cases where the user has explicitly given consent to pause or play the carousel, a variable `isPlayingExplicitly` was created. This variable has priority over the default state variable `isPlaying`.

## Unwanted events triggered

- To avoid phantom events and potential INP delays, we have decided to separate input events by device type by using prevent/stop modifiers and a touch flag (`isTouched`).

## Screen reader slideshow reading

- To prevent the carousel content from being read when the focus is on an external slideshow element, we use the `isSlideSRReadable` variable to toggle aria-live.

- To allow screen readers to announce the slide content when focusing on a new slick slider button, we defer the `activeIndex` variable by creating a `deferredActiveIndex` coupled with a setTimeout to prevent aria-selected announcement.

- To prevent JAWS from sometimes reading the same slide twice, we use the `isKeyboardNavigation` variable to disable slideshow transition.

---
