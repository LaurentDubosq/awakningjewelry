# SlideshowAutorotationButton Feature

## NVDA reading problem

- To prevent NVDA from announcing the slide label when focus moves from the slick slider button to the auto-rotation button, we delay the custom focus emit to allow NVDA to understand that aria-live has been set to `off`, avoiding the announcement of any slide updates.

---
