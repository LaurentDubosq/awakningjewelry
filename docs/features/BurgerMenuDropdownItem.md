# BurgerMenuDropdownItem component

## Event

- To prevent Vue Test Utils from failing when testing that the link click properly closes the burger menu, we need to add `.stop` to stop the event propagation toward `document.addEventListener('click', handleClickOutside)` in BurgerMenu.vue.

---
