# App

## SiteFooter and CLS

- To avoid a high CLS score at initial render caused by the footer, the SiteFooter should, by default, be positioned just below the fold. Each page that requires the footer to appear above the fold and fit the content should record its path in the `getRouteMinHeight` function.

## Burger menu / unclickable area

- Disable touch/click on page elements when the burger menu is open using `pointer-events: none`. This behavior is in line with good UX practices for touch devices.

---
