/* Composables used for focus */

/**
 * Checks if an HTML element is focusable.
 * @param element - The element to test.
 * @returns true if the element is focusable, false otherwise.
 */
const isFocusable = (element: HTMLElement): boolean => {
  const tagName = element.tagName.toLowerCase()

  // Natively focusable tags
  const focusableTags = [
    'input',
    'select',
    'textarea',
    'button',
    'object',
    'a',
    'audio',
    'video',
    'iframe',
  ]

  // Special case for links
  if (tagName === 'a') {
    const href = element.getAttribute('href')
    return !!href && href.trim() !== ''
  }

  // Native elements (check if disabled)
  if (focusableTags.includes(tagName)) {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLButtonElement
    ) {
      return !element.disabled
    }
    return true
  }

  // Editable elements
  if (element.hasAttribute('contenteditable')) {
    return element.getAttribute('contenteditable')?.toLowerCase() !== 'false'
  }

  // tabindex >= 0 allows focus via keyboard and script
  if (element.hasAttribute('tabindex')) {
    const tabindex = parseInt(element.getAttribute('tabindex') || '', 10)
    return !isNaN(tabindex) && tabindex >= 0
  }

  return false
}

/**
 * Returns the first focusable child of a given element.
 * @param element - The parent element to search within.
 * @returns The first focusable child element, or null if none is found.
 */
const getFirstFocusableChildElement = (element: HTMLElement): HTMLElement | null => {
  const childElements = element.querySelectorAll('*')

  for (let i = 0; i < childElements.length; i++) {
    const childElement = childElements[i]
    if (childElement instanceof HTMLElement && isFocusable(childElement)) {
      return childElement
    }
  }

  return null
}

/**
 * Returns focusable child elements.
 * @param element - The parent element to search within.
 * @returns An array of focusable child elements, or null if none is found.
 */
export const getFocusableChildElements = (element: HTMLElement): HTMLElement[] => {
  const childElements = element.querySelectorAll('*')

  const focusableChildElements = []

  for (let i = 0; i < childElements.length; i++) {
    const childElement = childElements[i]
    if (childElement instanceof HTMLElement && isFocusable(childElement)) {
      focusableChildElements.push(childElement)
    }
  }

  return focusableChildElements
}

/**
 * Focus the first child element focusable.
 * @param element - The element to test.
 */
export const useFocusFirstFocusableChildElement = (element: HTMLElement) => {
  // Get the child focusable element
  const focusableElement = getFirstFocusableChildElement(element)

  // Focus the element
  if (focusableElement) {
    focusableElement.focus()
  }
}

/**
 * Add a focus trap on an HTML element.
 *
 * Only Tab and Shift+Tab are handled to loop focus within the element.
 * Arrow keys are ignored for simplicity in the burger menu context.
 *
 * @param element - The element within which focus should be trapped.
 * @returns A function to remove the focus trap listener.
 */
export const useFocusTrap = (element: HTMLElement): (() => void) => {
  // Get child focusable elements
  const focusableElements = getFocusableChildElements(element)

  // Utilities
  const focusNextElement = (index: number) => {
    const nextIndex = index < focusableElements.length - 1 ? index + 1 : 0
    focusableElements[nextIndex].focus()
  }
  const focusPrevElement = (index: number) => {
    const prevIndex = index > 0 ? index - 1 : focusableElements.length - 1
    focusableElements[prevIndex].focus()
  }
  const getCurrentElementIndex = (): number => {
    const active = document.activeElement
    const currentIndex = active instanceof HTMLElement ? focusableElements.indexOf(active) : -1
    return currentIndex
  }

  // Event logic
  const callback = (event: KeyboardEvent) => {
    const currentIndex = getCurrentElementIndex()

    // Do nothing if there is no element focused
    if (currentIndex === -1) return

    if (event.key === 'Tab') {
      event.preventDefault()

      if (event.shiftKey) {
        focusPrevElement(currentIndex)
      } else {
        focusNextElement(currentIndex)
      }
    }
  }

  // Add event logic for focusable elements
  element.addEventListener('keydown', callback)

  // Return remove listener
  return () => {
    element.removeEventListener('keydown', callback)
  }
}
