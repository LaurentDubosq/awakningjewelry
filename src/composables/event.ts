export function addResizeListener(
  callback: EventListenerOrEventListenerObject,
  element: Window | HTMLElement
) {
  element.addEventListener("resize", callback);
}

export function removeResizeListener(
  callback: EventListenerOrEventListenerObject,
  element: Window | HTMLElement
) {
  element.addEventListener("resize", callback);
}
