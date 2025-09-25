# Burger Menu Feature

## Behavior

- To prevent ghost/phantom clicks after touch when we click outside of the burger menu, we use `event.preventDefault()`. This complements the pointer-events handling in App.vue, ensuring that underlying elements cannot be clicked.

---
