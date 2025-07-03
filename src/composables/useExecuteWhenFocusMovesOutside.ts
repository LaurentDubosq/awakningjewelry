// Composable to execute the callback when the next focused element will be out of the current
export default function useExecuteWhenFocusMovesOutside(event: FocusEvent, action: () => void) {
  // Get the current element (the one that has the @focusout directive)
  const element = event.currentTarget as HTMLElement

  // Get the element that is about to receive focus
  const nextFocusableElement = event.relatedTarget

  // Execute the expected action if the next focusable element is out of the current element
  if (element && !element.contains(nextFocusableElement as Node)) {
    action()
  }
}
